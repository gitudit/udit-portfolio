import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect is a no-op on the server; avoid the SSR warning.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Lottie animation box.
 *
 * Renders the same markup and inline styles react-lottie 1.2.3 produced, so layout is identical, but:
 *  - the player (lottie-web SVG renderer, with expressions) and the animation JSON are downloaded
 *    only once the box comes within 300px of the viewport;
 *  - until then an empty inline <svg> with the same sizing occupies the box, so the wrapper has
 *    exactly the height the real animation will have (SVG width + inline descender gap) and nothing
 *    shifts when the player mounts;
 *  - the animation is paused while it is off-screen.
 *
 * `animationPath` is the URL of the Lottie JSON (import the file with `?url`).
 */
export default function DisplayLottie({ animationPath }) {
  const boxRef = useRef(null);
  const [ready, setReady] = useState(null); // { lottie, data } once both have loaded

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    let cancelled = false;

    const load = () =>
      Promise.all([import("lottie-web/build/player/lottie_svg"), fetch(animationPath).then((r) => r.json())])
        .then(([mod, data]) => {
          if (!cancelled) setReady({ lottie: mod.default || mod, data });
        })
        .catch((error) => console.error("Lottie failed to load", error));

    if (typeof IntersectionObserver === "undefined") {
      load();
      return () => {
        cancelled = true;
      };
    }
    const proximity = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          proximity.disconnect();
          load();
        }
      },
      { rootMargin: "300px 0px" }
    );
    proximity.observe(el);
    return () => {
      cancelled = true;
      proximity.disconnect();
    };
  }, [animationPath]);

  // Runs synchronously after React has removed the placeholder, so the real SVG is in place
  // before the browser paints.
  useIsomorphicLayoutEffect(() => {
    if (!ready || !boxRef.current) return undefined;
    const el = boxRef.current;
    const anim = ready.lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: ready.data,
    });
    let visibility = null;
    if (typeof IntersectionObserver !== "undefined") {
      visibility = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) anim.play();
          else anim.pause();
        },
        { threshold: 0 }
      );
      visibility.observe(el);
    }
    return () => {
      if (visibility) visibility.disconnect();
      anim.destroy();
    };
  }, [ready]);

  return (
    <div>
      <div
        ref={boxRef}
        style={{ width: "100%", height: "100%", overflow: "hidden", margin: "0 auto", outline: "none" }}
        role="button"
        aria-label="animation"
        tabIndex="0"
        title=""
      >
        {!ready && <svg viewBox="0 0 1 1" style={{ width: "100%", height: "100%" }} aria-hidden="true" />}
      </div>
    </div>
  );
}
