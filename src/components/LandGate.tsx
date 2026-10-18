import type { Land } from "../content/ride";

// The entrance arch to a land: pennants on a string, the sign, the height requirement, and string lights.
export default function LandGate({ land }: { land: Land }) {
  return (
    <div className={`gate gate--${land.id}`} role="group" aria-label={`Now entering ${land.name}`}>
      <div className="gate__pennants" aria-hidden="true">
        {Array.from({ length: 11 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <div className="gate__arch">
        <p className="gate__eyebrow mono">
          Land {land.numeral} · now entering
        </p>
        <h3 className="display gate__name">{land.name}</h3>
        <p className="gate__tag">{land.tagline}</p>
        <p className="gate__height mono">
          <span>Height requirement · {land.height}</span>
          <span>{land.years}</span>
        </p>
      </div>
      <div className="gate__lights" aria-hidden="true" />
    </div>
  );
}
