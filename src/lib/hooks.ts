import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

const noSubscribe = () => () => {};

/**
 * A browser-only value (capabilities, media queries) read through useSyncExternalStore so the
 * server and the hydrating render agree on `server`, then the client snapshot takes over.
 */
export function useBrowserValue<T>(get: () => T, server: T): T {
  return useSyncExternalStore(noSubscribe, get, () => server);
}

export const reducedMotion = (): boolean => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True once the element is within `rootMargin` of the viewport (sticky true). */
export function useNear(ref: RefObject<Element | null>, rootMargin = "300px 0px"): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setNear(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, near]);
  return near;
}

export interface InViewOptions {
  rootMargin?: string;
  threshold?: number;
}

/** Live visibility of an element (true while intersecting). */
export function useInView(ref: RefObject<Element | null>, { rootMargin = "0px", threshold = 0 }: InViewOptions = {}): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(([e]) => setInView(!!e && e.isIntersecting), { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold]);
  return inView;
}

/** Whether the OS asks for reduced motion or the visitor chose the calm ride. Imperative; for render use the store + useBrowserValue. */
export function prefersCalm(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.calm === "1" || reducedMotion();
}

/**
 * Dialog ergonomics: focus the element in `initialRef` on open and hand focus back to whatever had
 * it when the dialog closes, so keyboard users never lose their place.
 */
export function useDialogFocus(initialRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    initialRef.current?.focus({ preventScroll: true });
    return () => {
      if (previous && previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, [initialRef]);
}

export function isTypingTarget(e: KeyboardEvent): boolean {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return false;
  const tag = t.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || t.isContentEditable;
}
