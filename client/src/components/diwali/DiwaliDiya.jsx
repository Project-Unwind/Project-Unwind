import { useEffect, useId, useState } from "react";
import "./DiwaliDiya.css";

/* true when the user prefers reduced motion (also stops the SMIL flame turbulence) */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

/* Lotus petals that cradle the bowl */
const BACK_ANGLES = [-84, -63, -42, -21, 0, 21, 42, 63, 84];
const FRONT_ANGLES = [-60, -30, 0, 30, 60];

/* Embers drifting up from the flame: x offset, drift, duration, delay, radius */
const SPARKS = [
  { x: -10, dx: -18, t: 5.2, d: 0.0, r: 1.5 },
  { x: 8, dx: 22, t: 6.1, d: 1.1, r: 1.2 },
  { x: -3, dx: -34, t: 7.0, d: 2.3, r: 1.8 },
  { x: 12, dx: 12, t: 5.6, d: 3.0, r: 1.1 },
  { x: -14, dx: 30, t: 6.6, d: 3.9, r: 1.4 },
  { x: 2, dx: -8, t: 7.4, d: 4.8, r: 1.0 },
  { x: 6, dx: 40, t: 6.3, d: 5.5, r: 1.6 }
];

export default function DiwaliDiya({ className = "", size = 160, smoke = true }) {
  const uid = useId().replace(/:/g, "");
  const id = (name) => `${name}-${uid}`;
  const url = (name) => `url(#${id(name)})`;
  const reduced = useReducedMotion();

  const BODY = "M52 148 C54 198 92 216 130 216 C168 216 206 198 208 148Z";

  return (
    <div
      className={`diwali-diya ${className}`}
      style={{ "--diya-size": `${size}px` }}
      aria-hidden="true"
    >
      <div className="diwali-diya__ambient" />

      <svg
        viewBox="0 -20 260 280"
        xmlns="http://www.w3.org/2000/svg"
        className="diwali-diya__svg"
      >
        <defs>
          {/* Lotus */}
          <g id={id("petal")}>
            <path d="M0 0 C-20 -14 -28 -48 0 -74 C28 -48 20 -14 0 0Z" />
            <path d="M0 -6 L0 -54" fill="none" stroke="#ffe3b5" strokeWidth=".9" opacity=".45" strokeLinecap="round" />
          </g>
          <linearGradient id={id("petalBack")} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3a0b2e" />
            <stop offset="55%" stopColor="#8e2458" />
            <stop offset="100%" stopColor="#e8755f" />
          </linearGradient>
          <linearGradient id={id("petalFront")} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#7a1a4c" />
            <stop offset="60%" stopColor="#e0527a" />
            <stop offset="100%" stopColor="#ffc98a" />
          </linearGradient>

          {/* Clay bowl: lit from the centre flame, falling to dark at the edges */}
          <linearGradient id={id("clay")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2f1009" />
            <stop offset="30%" stopColor="#7a3418" />
            <stop offset="50%" stopColor="#b5602d" />
            <stop offset="70%" stopColor="#7a3418" />
            <stop offset="100%" stopColor="#2f1009" />
          </linearGradient>
          <linearGradient id={id("bodyShade")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#14050a" stopOpacity=".6" />
          </linearGradient>
          <linearGradient id={id("gold")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a5a1c" />
            <stop offset="50%" stopColor="#ffd98a" />
            <stop offset="100%" stopColor="#8a5a1c" />
          </linearGradient>
          <linearGradient id={id("wall")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#170509" />
            <stop offset="100%" stopColor="#4d1d12" />
          </linearGradient>
          <radialGradient id={id("oil")} cx=".5" cy=".3" r=".75">
            <stop offset="0%" stopColor="#ffd07a" />
            <stop offset="45%" stopColor="#c8741f" />
            <stop offset="100%" stopColor="#4a1e0a" />
          </radialGradient>
          <radialGradient id={id("jewel")} cx=".35" cy=".3" r=".8">
            <stop offset="0%" stopColor="#ffd2d8" />
            <stop offset="40%" stopColor="#e0294f" />
            <stop offset="100%" stopColor="#5a0a1e" />
          </radialGradient>

          {/* Light */}
          <radialGradient id={id("halo")}>
            <stop offset="0%" stopColor="#fff0b8" stopOpacity=".6" />
            <stop offset="35%" stopColor="#ffa930" stopOpacity=".24" />
            <stop offset="100%" stopColor="#ff7a14" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id("cast")} gradientUnits="userSpaceOnUse" cx="130" cy="140" r="110">
            <stop offset="0%" stopColor="#ffd88a" stopOpacity=".8" />
            <stop offset="45%" stopColor="#ff9a3a" stopOpacity=".26" />
            <stop offset="100%" stopColor="#ff7a14" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id("pool")}>
            <stop offset="0%" stopColor="#ffb457" stopOpacity=".55" />
            <stop offset="100%" stopColor="#ffb457" stopOpacity="0" />
          </radialGradient>

          {/* Flame */}
          <linearGradient id={id("flameOuter")} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ff4a05" />
            <stop offset="40%" stopColor="#ff8a1c" />
            <stop offset="85%" stopColor="#ffc247" stopOpacity=".85" />
            <stop offset="100%" stopColor="#ffd86b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={id("flameMid")} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffb02a" />
            <stop offset="60%" stopColor="#ffd96a" />
            <stop offset="100%" stopColor="#fff0b0" stopOpacity=".7" />
          </linearGradient>
          <linearGradient id={id("flameCore")} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#fff6d0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity=".9" />
          </linearGradient>
          <radialGradient id={id("blue")}>
            <stop offset="0%" stopColor="#6a8dff" stopOpacity=".85" />
            <stop offset="100%" stopColor="#3a52ff" stopOpacity="0" />
          </radialGradient>

          {/* Filters */}
          <filter id={id("blur")} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id={id("soft")} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
          <filter id={id("softer")} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* Organic flame edge */}
          <filter id={id("flicker")} x="-40%" y="-20%" width="180%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves="2" seed="4" result="noise">
              {!reduced && (
                <animate
                  attributeName="baseFrequency"
                  dur="5.3s"
                  values="0.018 0.045;0.026 0.06;0.015 0.04;0.022 0.052;0.018 0.045"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation=".7" />
          </filter>

          {/* Fired-clay grain */}
          <filter id={id("grain")} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="7" result="n" />
            <feColorMatrix in="n" type="matrix"
              values="0 0 0 0 0.18  0 0 0 0 0.07  0 0 0 0 0.03  0 0 0 -1.6 1.05" result="speck" />
            <feComposite in="speck" in2="SourceGraphic" operator="in" result="speckIn" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="speckIn" />
            </feMerge>
          </filter>

          <clipPath id={id("bodyClip")}>
            <path d={BODY} />
            <ellipse cx="130" cy="148" rx="78" ry="20" />
          </clipPath>
        </defs>

        {/* Ground: shadow, light pool, rangoli ring of gold dots */}
        <ellipse cx="130" cy="240" rx="104" ry="12" fill="#000" opacity=".45" filter={url("blur")} />
        <ellipse className="diwali-diya__pool" cx="130" cy="240" rx="108" ry="14" fill={url("pool")} />
        <ellipse
          className="diwali-diya__rangoli"
          cx="130" cy="240" rx="112" ry="15"
          fill="none" stroke="#ffd98a" strokeWidth="2.2" strokeLinecap="round"
          strokeDasharray="0 9" opacity=".55"
        />
        <ellipse
          cx="130" cy="240" rx="98" ry="12"
          fill="none" stroke="#e0527a" strokeWidth="1.6" strokeLinecap="round"
          strokeDasharray="0 7" opacity=".4"
        />

        {/* Slowly turning sunburst + halo behind the flame */}
        <g className="diwali-diya__rays" opacity=".09" filter={url("softer")}>
          <circle cx="130" cy="96" r="82" fill="none" stroke="#ffd98a" strokeWidth="64" strokeDasharray="5 15" />
        </g>
        <ellipse className="diwali-diya__halo" cx="130" cy="96" rx="96" ry="110" fill={url("halo")} />

        {/* Back lotus row */}
        <g>
          {BACK_ANGLES.map((a) => {
            const s = 0.85 + (Math.abs(a) / 84) * 0.35;
            return (
              <use
                key={a}
                href={`#${id("petal")}`}
                fill={url("petalBack")}
                stroke="#2a0620"
                strokeWidth=".8"
                transform={`translate(130 200) rotate(${a}) scale(${s})`}
              />
            );
          })}
        </g>

        {/* Bowl */}
        <path d={BODY} fill={url("clay")} filter={url("grain")} />
        <path d={BODY} fill={url("bodyShade")} />

        {/* Gold filigree band with a scalloped edge */}
        <path d="M55 170 C80 192 180 192 205 170" fill="none" stroke={url("gold")} strokeWidth="2" />
        <path
          d="M56 176 C82 198 178 198 204 176"
          fill="none" stroke="#ffd98a" strokeWidth="2.6" strokeLinecap="round"
          strokeDasharray="0 7" opacity=".85"
        />
        <path d="M58 182 C84 203 176 203 202 182" fill="none" stroke={url("gold")} strokeWidth="1" opacity=".7" />

        {/* Jewels */}
        <circle cx="130" cy="200" r="4.2" fill={url("jewel")} stroke="#ffd98a" strokeWidth="1.1" />
        <circle cx="92" cy="192" r="2.8" fill={url("jewel")} stroke="#ffd98a" strokeWidth=".9" />
        <circle cx="168" cy="192" r="2.8" fill={url("jewel")} stroke="#ffd98a" strokeWidth=".9" />

        {/* Rim */}
        <ellipse cx="130" cy="148" rx="78" ry="20" fill={url("clay")} filter={url("grain")} />
        <ellipse cx="130" cy="148" rx="78" ry="20" fill="none" stroke={url("gold")} strokeWidth="2.2" />
        <ellipse
          cx="130" cy="148" rx="74" ry="18"
          fill="none" stroke="#ffe9b8" strokeWidth="1.6" strokeLinecap="round"
          strokeDasharray="0 6" opacity=".6"
        />

        {/* Inner basin and oil */}
        <ellipse cx="130" cy="149" rx="67" ry="14.5" fill={url("wall")} />
        <ellipse cx="130" cy="151" rx="59" ry="11" fill={url("oil")} />

        {/* Ripples spreading from the flame's reflection */}
        <g fill="none" stroke="#ffe9b0" strokeWidth=".9">
          <ellipse className="diwali-diya__ripple" cx="130" cy="152" rx="14" ry="3.4" />
          <ellipse className="diwali-diya__ripple diwali-diya__ripple--late" cx="130" cy="152" rx="14" ry="3.4" />
        </g>
        <g className="diwali-diya__reflection" filter={url("soft")}>
          <ellipse cx="130" cy="152" rx="10" ry="2.6" fill="#ffe08a" opacity=".9" />
        </g>

        {/* Wick */}
        <path d="M130 152 L130 138" stroke="#150906" strokeWidth="4.2" strokeLinecap="round" />
        <path d="M130 138 L130 134" stroke="#ff6a14" strokeWidth="3" strokeLinecap="round" className="diwali-diya__ember" />

        {/* Warm light thrown onto the clay and lotus */}
        <g clipPath={url("bodyClip")}>
          <rect className="diwali-diya__cast" x="-40" y="60" width="340" height="220" fill={url("cast")} style={{ mixBlendMode: "screen" }} />
        </g>

        {/* Front lotus row cradling the base */}
        <g>
          {FRONT_ANGLES.map((a) => (
            <use
              key={a}
              href={`#${id("petal")}`}
              fill={url("petalFront")}
              stroke="#4a0f33"
              strokeWidth=".9"
              transform={`translate(130 238) rotate(${a}) scale(${a === 0 ? 0.56 : 0.5})`}
            />
          ))}
        </g>

        {/* Embers */}
        <g>
          {SPARKS.map((s, i) => (
            <circle
              key={i}
              className="diwali-diya__spark"
              cx={130 + s.x}
              cy="104"
              r={s.r}
              fill="#ffd27a"
              style={{ "--dx": `${s.dx}px`, "--t": `${s.t}s`, "--d": `${s.d}s` }}
            />
          ))}
        </g>

        {/* Smoke */}
        {smoke && (
          <path
            className="diwali-diya__smoke"
            d="M130 34 C121 20 139 12 130 -2 C124 -10 131 -16 129 -20"
            fill="none"
            stroke="#d9c9bd"
            strokeWidth="2"
            strokeLinecap="round"
            filter={url("softer")}
            pathLength="1"
          />
        )}

        {/* Flame */}
        <g className="diwali-diya__flame">
          <g className="diwali-diya__flame-inner" filter={url("flicker")}>
            <path
              d="M130 140 C112 134 108 112 117 92 C123 79 129 68 130 46 C135 66 149 78 150 102 C151 124 145 135 130 140Z"
              fill={url("flameOuter")}
            />
            <path
              d="M130 138 C119 133 117 115 123 100 C127 90 130 82 130 70 C136 84 143 94 143 109 C143 126 138 135 130 138Z"
              fill={url("flameMid")}
            />
            <path
              d="M130 136 C124 131 124 120 128 110 C129 106 130 102 130 98 C134 106 137 116 135 126 C134 132 132 135 130 136Z"
              fill={url("flameCore")}
            />
          </g>
          <ellipse cx="130" cy="134" rx="9" ry="9" fill={url("blue")} filter={url("soft")} />
        </g>
      </svg>
    </div>
  );
}