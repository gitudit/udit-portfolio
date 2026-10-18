import { lazy, Suspense, useEffect, useRef, useState, type ComponentType, type LazyExoticComponent } from "react";
import { kindLabel, type AttractionName, type Station as StationData, type Thrill } from "../content/ride";
import { useNear } from "../lib/hooks";
import { useStore, openDrawer } from "../lib/store";
import { play } from "../lib/sound";
import { ArrowRight, Bolt } from "./Icons";
import ErrorBoundary from "./ErrorBoundary";
import type { AttractionProps } from "./attractions/types";

const attractions: Record<AttractionName, LazyExoticComponent<ComponentType<AttractionProps>>> = {
  TrophyShelf: lazy(() => import("./attractions/TrophyShelf")),
  SlideDeck: lazy(() => import("./attractions/SlideDeck")),
  CacheSwitch: lazy(() => import("./attractions/CacheSwitch")),
  LatencyGauge: lazy(() => import("./attractions/LatencyGauge")),
  CaptionStrip: lazy(() => import("./attractions/CaptionStrip")),
  BundleScene: lazy(() => import("./attractions/BundleScene")),
  PlatformPanel: lazy(() => import("./attractions/PlatformPanel")),
};

interface Props {
  station: StationData;
  index: number;
  total: number;
  side: "left" | "right";
}

function ThrillMeter({ level }: { level: Thrill }) {
  return (
    <span className="thrill" role="img" aria-label={`Thrill level ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Bolt key={i} className={i <= level ? "is-on" : undefined} />
      ))}
    </span>
  );
}

export default function Station({ station, index, total, side }: Props) {
  const ref = useRef<HTMLLIElement>(null);
  const near = useNear(ref, "400px 0px");
  const { current, stamps } = useStore((s) => ({ current: s.current, stamps: s.stamps }));
  const isCurrent = current === index;
  const isPassed = current > index;
  const isStamped = stamps.includes(station.id);
  const Attraction = attractions[station.attraction];
  const [seen, setSeen] = useState(false);

  // Fallback reveal class for browsers without scroll-driven animations.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = ["station", `station--${station.kind}`, `station--${side}`, isCurrent ? "is-current" : "", isPassed ? "is-passed" : "", isStamped ? "is-stamped" : "", seen ? "is-seen" : ""]
    .filter(Boolean)
    .join(" ");
  const skeleton = <div className="attraction__skeleton" aria-hidden="true" />;

  return (
    <li ref={ref} className={cls} id={`stop-${station.id}`} data-station={station.id} data-year={station.year} aria-current={isCurrent ? "step" : undefined}>
      <span className="station__dot" aria-hidden="true">
        <i />
      </span>
      <div className="station__card">
        <div className="station__sign">
          <span className="station__stop mono">
            {index === 0 ? "Origin" : `Stop ${String(index).padStart(2, "0")}`}
            {index === total - 1 ? " · You are here" : ""}
          </span>
          <span className="station__years mono">{station.years}</span>
        </div>
        <div className="station__badges">
          <span className={`badge badge--${station.kind}`}>{kindLabel[station.kind]}</span>
          <span className="badge badge--ride">{station.ride}</span>
          <ThrillMeter level={station.thrill} />
        </div>
        <h3 className="display station__title">{station.title}</h3>
        <p className="station__role">
          <b>{station.role}</b> · {station.org}
        </p>
        <p className="station__story">{station.story}</p>
        <ul className="facts" aria-label="Highlights">
          {station.facts.map((f) => (
            <li key={f.t} className="fact">
              <b className="display">{f.n}</b>
              <span>{f.t}</span>
            </li>
          ))}
        </ul>
        <div className="attraction">
          <div className="attraction__head">
            <span className="eyebrow">Attraction</span>
            <span className="attraction__sign muted">{station.sign}</span>
          </div>
          <div className="attraction__stage">
            {near ? (
              <ErrorBoundary label={station.attraction} fallback={skeleton}>
                <Suspense fallback={skeleton}>
                  <Attraction active={isCurrent} />
                </Suspense>
              </ErrorBoundary>
            ) : (
              skeleton
            )}
          </div>
        </div>
        {station.caseStudy && (
          <button
            type="button"
            className="btn station__case"
            onClick={() => {
              openDrawer(station.caseStudy ?? null);
              play("pop");
            }}
          >
            Read the case study <ArrowRight />
          </button>
        )}
      </div>
    </li>
  );
}
