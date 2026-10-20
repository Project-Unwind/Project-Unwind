import { useId } from "react";

export default function HalloweenSpider() {
  // Unique ids so multiple spiders on a page don't clash
  const uid = useId().replace(/:/g, "");
  const id = (name) => `${name}-${uid}`;
  const ref = (name) => `url(#${id(name)})`;

  return (
    <span className="halloween-spider" aria-hidden="true">
      {/* Silk thread */}
      <span className="halloween-spider__thread" />

      {/* Spider */}
      <svg
        className="halloween-spider__body"
        viewBox="0 0 100 110"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          {/* Glossy chitin for the abdomen */}
          <radialGradient id={id("abdomen")} cx="34%" cy="26%" r="80%">
            <stop offset="0%" stopColor="#5a4a63" />
            <stop offset="22%" stopColor="#2a1f33" />
            <stop offset="65%" stopColor="#0f0a15" />
            <stop offset="100%" stopColor="#020104" />
          </radialGradient>

          {/* Cephalothorax */}
          <radialGradient id={id("thorax")} cx="38%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#4a3b52" />
            <stop offset="45%" stopColor="#1a1222" />
            <stop offset="100%" stopColor="#040307" />
          </radialGradient>

          {/* Eye glow */}
          <radialGradient id={id("eye")} cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ffd0a0" />
            <stop offset="25%" stopColor="#ff5a1a" />
            <stop offset="70%" stopColor="#b01000" />
            <stop offset="100%" stopColor="#400000" />
          </radialGradient>

          {/* Fang / chelicerae gloss */}
          <linearGradient id={id("fang")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2b1d1a" />
            <stop offset="55%" stopColor="#d8cfc0" />
            <stop offset="100%" stopColor="#fff6e6" />
          </linearGradient>

          {/* Venom drop */}
          <radialGradient id={id("venom")} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#e8ffb0" />
            <stop offset="60%" stopColor="#7cc21a" />
            <stop offset="100%" stopColor="#2f5a00" />
          </radialGradient>

          {/* Hourglass */}
          <linearGradient id={id("glass")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff2a2a" />
            <stop offset="100%" stopColor="#7a0010" />
          </linearGradient>

          {/* Fuzzy bristles: roughens the edges of legs and body */}
          <filter id={id("bristle")} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.1"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Skin texture overlay for the abdomen */}
          <filter id={id("hair")} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="2.4 0.9"
              numOctaves="3"
              seed="3"
              result="n"
            />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 0.55
                      0 0 0 0 0.45
                      0 0 0 0 0.6
                      0 0 0 1.4 -0.55"
            />
          </filter>

          {/* Red eye bloom */}
          <filter id={id("glow")} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft drop shadow */}
          <filter id={id("shadow")} x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" floodColor="#000" floodOpacity="0.55" />
          </filter>

          <clipPath id={id("abdomenClip")}>
            <ellipse cx="50" cy="72" rx="23" ry="28" />
          </clipPath>

          {/* One side of legs: each leg has 3 tapering segments, plus knee joints */}
          <g id={id("legs")}>
            {/* Leg 1 */}
            <path d="M40 46 L24 26" stroke="#0b0710" strokeWidth="4.6" strokeLinecap="round" />
            <path d="M24 26 L8 20" stroke="#0b0710" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M8 20 L2 34" stroke="#0b0710" strokeWidth="1.8" strokeLinecap="round" />
            {/* Leg 2 */}
            <path d="M39 52 L20 40" stroke="#0b0710" strokeWidth="4.6" strokeLinecap="round" />
            <path d="M20 40 L5 46" stroke="#0b0710" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M5 46 L2 62" stroke="#0b0710" strokeWidth="1.8" strokeLinecap="round" />
            {/* Leg 3 */}
            <path d="M39 62 L20 66" stroke="#0b0710" strokeWidth="4.6" strokeLinecap="round" />
            <path d="M20 66 L8 82" stroke="#0b0710" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M8 82 L12 98" stroke="#0b0710" strokeWidth="1.8" strokeLinecap="round" />
            {/* Leg 4 */}
            <path d="M42 70 L30 86" stroke="#0b0710" strokeWidth="4.6" strokeLinecap="round" />
            <path d="M30 86 L26 106" stroke="#0b0710" strokeWidth="2.4" strokeLinecap="round" />

            {/* Wet highlights along the top of each segment */}
            <g stroke="#8b6f93" strokeOpacity="0.55" strokeWidth="0.7" strokeLinecap="round">
              <path d="M39 44.5 L24.5 25" />
              <path d="M23.5 24.8 L8.5 19" />
              <path d="M38 50.5 L20.5 39" />
              <path d="M19.5 38.8 L5.5 44.8" />
              <path d="M38 60.5 L20.5 64.8" />
              <path d="M19.5 65 L8.5 80.5" />
              <path d="M41 68.8 L30.5 84.5" />
            </g>

            {/* Knee joints */}
            <g fill="#1d1426" stroke="#05030a" strokeWidth="0.6">
              <circle cx="24" cy="26" r="2.7" />
              <circle cx="20" cy="40" r="2.7" />
              <circle cx="20" cy="66" r="2.7" />
              <circle cx="30" cy="86" r="2.5" />
              <circle cx="8" cy="20" r="1.9" />
              <circle cx="5" cy="46" r="1.9" />
              <circle cx="8" cy="82" r="1.9" />
            </g>
          </g>
        </defs>

        <g filter={ref("shadow")}>
          {/* Legs, left and mirrored right, with fuzzy edges */}
          <g filter={ref("bristle")}>
            <use href={`#${id("legs")}`} />
            <use href={`#${id("legs")}`} transform="translate(100 0) scale(-1 1)" />
          </g>

          {/* Abdomen */}
          <ellipse
            cx="50"
            cy="72"
            rx="23"
            ry="28"
            fill={ref("abdomen")}
            filter={ref("bristle")}
          />
          <g clipPath={ref("abdomenClip")}>
            <rect x="20" y="40" width="60" height="64" filter={ref("hair")} opacity="0.55" />
            {/* Rim light */}
            <ellipse
              cx="50"
              cy="72"
              rx="22.2"
              ry="27.2"
              stroke="#6d4c78"
              strokeOpacity="0.55"
              strokeWidth="1.2"
            />
          </g>

          {/* Red hourglass marking */}
          <path
            d="M43 68 Q50 66 57 68 Q52 74 50 76 Q52 78 57 84 Q50 87 43 84 Q48 78 50 76 Q48 74 43 68 Z"
            fill={ref("glass")}
            opacity="0.92"
          />
          <path d="M45 69 Q50 68 55 69" stroke="#ff9a8a" strokeOpacity="0.5" strokeWidth="0.6" />

          {/* Abdomen specular highlights */}
          <ellipse cx="41" cy="60" rx="5.5" ry="9" fill="#d9c4e6" opacity="0.14" transform="rotate(-18 41 60)" />
          <ellipse cx="39.5" cy="56" rx="1.8" ry="3.6" fill="#fff" opacity="0.28" transform="rotate(-18 39.5 56)" />

          {/* Cephalothorax (head/chest) */}
          <ellipse
            cx="50"
            cy="43"
            rx="15.5"
            ry="14"
            fill={ref("thorax")}
            stroke="#3a2a45"
            strokeWidth="1"
            filter={ref("bristle")}
          />
          <ellipse cx="45" cy="36" rx="5" ry="3" fill="#cdb7dd" opacity="0.16" />

          {/* Pedipalps */}
          <g stroke="#0b0710" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M41 52 L37 59 L41 64" strokeWidth="3" />
            <path d="M59 52 L63 59 L59 64" strokeWidth="3" />
          </g>

          {/* Chelicerae (jaw bases) */}
          <path d="M42 50 Q43 58 46.5 58 Q49 55 49 50 Z" fill="#150e1c" stroke="#3a2a45" strokeWidth="0.6" />
          <path d="M58 50 Q57 58 53.5 58 Q51 55 51 50 Z" fill="#150e1c" stroke="#3a2a45" strokeWidth="0.6" />

          {/* Curved fangs */}
          <path d="M44.5 56 Q43.5 63 47.8 67.5 Q47.8 62 47.8 56 Z" fill={ref("fang")} stroke="#3a2f2a" strokeWidth="0.35" />
          <path d="M55.5 56 Q56.5 63 52.2 67.5 Q52.2 62 52.2 56 Z" fill={ref("fang")} stroke="#3a2f2a" strokeWidth="0.35" />

          {/* Venom drip */}
          <g>
            <path d="M47.8 67.3 Q47.6 70 47.8 71.5" stroke="#8fd02a" strokeWidth="0.7" strokeLinecap="round">
              <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" />
            </path>
            <ellipse cx="47.8" cy="73" rx="1.1" ry="1.6" fill={ref("venom")}>
              <animate attributeName="cy" values="69;76;76" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </ellipse>
          </g>

          {/* Eight eyes: two big forward, two mid, four small on the dome */}
          <g filter={ref("glow")}>
            <ellipse cx="44" cy="42" rx="3.6" ry="3" fill={ref("eye")} />
            <ellipse cx="56" cy="42" rx="3.6" ry="3" fill={ref("eye")} />
            <ellipse cx="40.5" cy="38.5" rx="2.2" ry="1.9" fill={ref("eye")} />
            <ellipse cx="59.5" cy="38.5" rx="2.2" ry="1.9" fill={ref("eye")} />
            <circle cx="47.6" cy="36.3" r="1.5" fill={ref("eye")} />
            <circle cx="52.4" cy="36.3" r="1.5" fill={ref("eye")} />
            <circle cx="45" cy="34.5" r="1.1" fill={ref("eye")} />
            <circle cx="55" cy="34.5" r="1.1" fill={ref("eye")} />
            <animate attributeName="opacity" values="1;0.72;1;0.9;1" dur="2.6s" repeatCount="indefinite" />
          </g>
          {/* Pupils and wet specular glints */}
          <g fill="#1a0000">
            <ellipse cx="44.3" cy="42.2" rx="1.2" ry="1.6" />
            <ellipse cx="55.7" cy="42.2" rx="1.2" ry="1.6" />
          </g>
          <g fill="#fff" opacity="0.9">
            <circle cx="42.9" cy="40.9" r="0.8" />
            <circle cx="54.9" cy="40.9" r="0.8" />
            <circle cx="39.9" cy="37.7" r="0.45" />
            <circle cx="58.9" cy="37.7" r="0.45" />
          </g>
        </g>
      </svg>
    </span>
  );
}