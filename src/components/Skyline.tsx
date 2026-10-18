// A park skyline: coaster hills, a ferris wheel, a drop tower and flags, as one inline SVG.
export default function Skyline({ variant }: { variant: "hero" | "midway" }) {
  const cabins = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
    const r = (deg * Math.PI) / 180;
    return { x: (Math.sin(r) * 62).toFixed(1), y: (-Math.cos(r) * 62).toFixed(1) };
  });
  return (
    <svg className={`skyline skyline--${variant}`} viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g className="skyline__lines" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 170 C 80 170, 110 60, 180 60 S 260 170, 320 170 S 390 40, 470 40 S 560 170, 640 170 S 700 90, 760 90 S 840 170, 920 170 S 980 70, 1050 70 S 1140 170, 1200 170" />
        <path d="M180 60V170M470 40V170M760 90V170M1050 70V170M110 118V170M250 118V170M400 104V170M540 104V170M700 134V170M820 134V170M985 122V170M1115 122V170" strokeWidth="1.5" />
        <g transform="translate(600 100)">
          <circle r="62" />
          <path d="M0-62V62M-62 0H62M-44-44 44 44M44-44-44 44" strokeWidth="1.5" />
          <path d="M-34 70 0 0 34 70M-44 70H44" />
          {cabins.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r="5" fill="currentColor" stroke="none" />
          ))}
          <circle r="6" fill="currentColor" stroke="none" />
        </g>
        <path d="M1003 170V22" strokeWidth="5" />
        <rect x="986" y="56" width="34" height="11" rx="3" fill="currentColor" stroke="none" />
        <path d="M0 170H1200" />
      </g>
      <g className="skyline__flags" fill="currentColor">
        <path d="M180 60l16-7-16-7zM470 40l16-7-16-7zM760 90l16-7-16-7zM1050 70l16-7-16-7zM1003 22l16-7-16-7z" />
      </g>
      <g className="skyline__lights" fill="currentColor">
        <circle cx="180" cy="60" r="3" />
        <circle cx="470" cy="40" r="3" />
        <circle cx="760" cy="90" r="3" />
        <circle cx="1050" cy="70" r="3" />
        <circle cx="1003" cy="22" r="3" />
        <circle cx="320" cy="170" r="2.5" />
        <circle cx="640" cy="170" r="2.5" />
        <circle cx="920" cy="170" r="2.5" />
      </g>
    </svg>
  );
}
