import { useId } from "react";

export default function HalloweenBat() {
  // Unique ids so multiple bats on one page don't share gradients/filters
  const uid = useId().replace(/:/g, "");
  const id = (name) => `${name}-${uid}`;

  return (
    <span className="halloween-bat" aria-hidden="true">
      <svg
        viewBox="0 0 100 85"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          {/* Wing membrane: dark near the bones, thin + purplish at the edge */}
          <linearGradient id={id("wingL")} x1="1" y1="0.3" x2="0" y2="0.8">
            <stop offset="0" stopColor="#05030a" />
            <stop offset="0.55" stopColor="#140b1c" />
            <stop offset="1" stopColor="#3a1d3f" />
          </linearGradient>
          <linearGradient id={id("wingR")} x1="0" y1="0.3" x2="1" y2="0.8">
            <stop offset="0" stopColor="#05030a" />
            <stop offset="0.55" stopColor="#140b1c" />
            <stop offset="1" stopColor="#3a1d3f" />
          </linearGradient>

          {/* Fur */}
          <radialGradient id={id("fur")} cx="0.5" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#2b2433" />
            <stop offset="0.6" stopColor="#15111c" />
            <stop offset="1" stopColor="#07050b" />
          </radialGradient>

          {/* Eye glow halo */}
          <radialGradient id={id("halo")}>
            <stop offset="0" stopColor="#ff2a00" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="#ff1100" stopOpacity="0.28" />
            <stop offset="1" stopColor="#ff0000" stopOpacity="0" />
          </radialGradient>

          {/* Eye iris */}
          <radialGradient id={id("iris")}>
            <stop offset="0" stopColor="#ffd24a" />
            <stop offset="0.45" stopColor="#ff4a00" />
            <stop offset="1" stopColor="#b00000" />
          </radialGradient>

          {/* Fang */}
          <linearGradient id={id("fang")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e9e2c8" />
            <stop offset="1" stopColor="#fffdf2" />
          </linearGradient>

          <filter id={id("glow")} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="0.9" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ───────────── LEFT WING ───────────── */}
        <g className="halloween-bat__left-wing">
          <path
            d="M46 30 L22 16 L2 24
               Q10 33 6 44
               Q14 49 20 58
               Q27 50 36 52
               Q41 46 47 48 Z"
            fill={`url(#${id("wingL")})`}
            stroke="#5b4670"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          {/* blood vessels */}
          <g stroke="#7a1830" strokeWidth="0.35" opacity="0.55" strokeLinecap="round">
            <path d="M34 26 Q22 30 13 33" />
            <path d="M36 34 Q24 40 15 48" />
            <path d="M40 40 Q32 46 25 55" />
            <path d="M30 22 Q18 24 8 28" />
          </g>
          {/* arm + finger bones */}
          <g stroke="#3b2f48" strokeWidth="1" strokeLinecap="round">
            <path d="M46 30 L22 16" strokeWidth="1.6" />
            <path d="M22 16 L2 24" />
            <path d="M22 16 L6 44" />
            <path d="M22 16 L20 58" />
            <path d="M22 16 L36 52" />
          </g>
          {/* wrist joint + hooked thumb claw */}
          <circle cx="22" cy="16" r="1.5" fill="#241b2e" />
          <path
            d="M22 16 Q17 9 12 12 Q17 11 20 16"
            fill="#d8d0b8"
            stroke="#8a8270"
            strokeWidth="0.3"
          />
        </g>

        {/* ───────────── RIGHT WING ───────────── */}
        <g className="halloween-bat__right-wing">
          <path
            d="M54 30 L78 16 L98 24
               Q90 33 94 44
               Q86 49 80 58
               Q73 50 64 52
               Q59 46 53 48 Z"
            fill={`url(#${id("wingR")})`}
            stroke="#5b4670"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <g stroke="#7a1830" strokeWidth="0.35" opacity="0.55" strokeLinecap="round">
            <path d="M66 26 Q78 30 87 33" />
            <path d="M64 34 Q76 40 85 48" />
            <path d="M60 40 Q68 46 75 55" />
            <path d="M70 22 Q82 24 92 28" />
          </g>
          <g stroke="#3b2f48" strokeWidth="1" strokeLinecap="round">
            <path d="M54 30 L78 16" strokeWidth="1.6" />
            <path d="M78 16 L98 24" />
            <path d="M78 16 L94 44" />
            <path d="M78 16 L80 58" />
            <path d="M78 16 L64 52" />
          </g>
          <circle cx="78" cy="16" r="1.5" fill="#241b2e" />
          <path
            d="M78 16 Q83 9 88 12 Q83 11 80 16"
            fill="#d8d0b8"
            stroke="#8a8270"
            strokeWidth="0.3"
          />
        </g>

        {/* ───────────── TAIL MEMBRANE + LEGS + FEET ───────────── */}
        <path
          d="M44 58 L39 72 Q50 67 61 72 L56 58 Z"
          fill="#0f0a16"
          stroke="#4a3a5c"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <g stroke="#1b1523" strokeLinecap="round" fill="none">
          <path d="M45 58 L41 71" strokeWidth="2" />
          <path d="M55 58 L59 71" strokeWidth="2" />
        </g>
        <g stroke="#d8d0b8" strokeWidth="0.9" strokeLinecap="round" fill="none">
          {/* left claws */}
          <path d="M41 71 Q38 76 40 79" />
          <path d="M41 71 Q41 77 44 79" />
          <path d="M41 71 Q44 75 46 76" />
          {/* right claws */}
          <path d="M59 71 Q62 76 60 79" />
          <path d="M59 71 Q59 77 56 79" />
          <path d="M59 71 Q56 75 54 76" />
        </g>

        {/* ───────────── BODY ───────────── */}
        <path
          d="M41 30 Q50 26 59 30
             Q64 44 58 58
             Q50 64 42 58
             Q36 44 41 30 Z"
          fill={`url(#${id("fur")})`}
          stroke="#463a55"
          strokeWidth="0.5"
        />
        {/* fur strokes */}
        <g stroke="#4a3f59" strokeWidth="0.45" opacity="0.8" strokeLinecap="round">
          <path d="M45 37 L44 43" />
          <path d="M48 35 L47 42" />
          <path d="M52 35 L53 42" />
          <path d="M55 37 L56 43" />
          <path d="M43 43 L42 49" />
          <path d="M46 46 L45 53" />
          <path d="M50 44 L50 52" />
          <path d="M54 46 L55 53" />
          <path d="M57 43 L58 49" />
          <path d="M47 54 L46 59" />
          <path d="M53 54 L54 59" />
        </g>
        {/* ribcage hint */}
        <g stroke="#0a070f" strokeWidth="0.5" opacity="0.7" fill="none">
          <path d="M44 40 Q50 43 56 40" />
          <path d="M43 46 Q50 50 57 46" />
          <path d="M44 52 Q50 56 56 52" />
        </g>

        {/* ───────────── EARS (pointing up) ───────────── */}
        <path
          d="M40 17 Q32 8 34 0 Q42 4 47 11 Z"
          fill="#120d18"
          stroke="#4a3558"
          strokeWidth="0.6"
        />
        <path
          d="M60 17 Q68 8 66 0 Q58 4 53 11 Z"
          fill="#120d18"
          stroke="#4a3558"
          strokeWidth="0.6"
        />
        {/* inner ear ridges */}
        <g stroke="#7a2f4c" strokeWidth="0.4" opacity="0.8" strokeLinecap="round">
          <path d="M37 11 Q40 9 43 11" />
          <path d="M36 7 Q40 6 44 9" />
          <path d="M63 11 Q60 9 57 11" />
          <path d="M64 7 Q60 6 56 9" />
        </g>

        {/* ───────────── HEAD ───────────── */}
        <path
          d="M38 20 Q38 9 50 8 Q62 9 62 20
             Q62 30 50 32 Q38 30 38 20 Z"
          fill={`url(#${id("fur")})`}
          stroke="#463a55"
          strokeWidth="0.5"
        />
        {/* head fur flicks */}
        <g stroke="#4a3f59" strokeWidth="0.4" opacity="0.7" strokeLinecap="round">
          <path d="M40 22 L42 25" />
          <path d="M60 22 L58 25" />
          <path d="M39 17 L42 19" />
          <path d="M61 17 L58 19" />
          <path d="M46 10 L47 13" />
          <path d="M54 10 L53 13" />
        </g>

        {/* nose leaf */}
        <path
          d="M46.5 20 Q50 18 53.5 20 Q53.9 23 50 23.5 Q46.1 23 46.5 20 Z"
          fill="#0a070f"
          stroke="#2a2133"
          strokeWidth="0.3"
        />
        <ellipse cx="48.4" cy="20.9" rx="0.7" ry="0.9" fill="#000" />
        <ellipse cx="51.6" cy="20.9" rx="0.7" ry="0.9" fill="#000" />

        {/* ── Mouth: closed by default, snarls open on hover (see CSS) ── */}
        <g className="halloween-bat__mouth-closed">
          <path
            d="M44 26.5 Q50 29 56 26.5"
            stroke="#04020a"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>

        <g className="halloween-bat__mouth-open">
          {/* dark open mouth */}
          <path
            d="M43 26 Q50 24 57 26 Q50 33 43 26 Z"
            fill="#4a0410"
            stroke="#0a0206"
            strokeWidth="0.5"
          />
          {/* tongue */}
          <path d="M47 29 Q50 31.3 53 29 Q50 30.1 47 29 Z" fill="#8a1428" />
          {/* lower teeth */}
          <path d="M46.3 29.3 L47.3 27 L48.5 29.8 Z" fill="#efe8cf" />
          <path d="M51.5 29.8 L52.7 27 L53.7 29.3 Z" fill="#efe8cf" />
          {/* upper fangs */}
          <path
            className="halloween-bat__fang"
            d="M44.2 25.4 L45.6 31 L47 25 Z"
            fill={`url(#${id("fang")})`}
            stroke="#8a8270"
            strokeWidth="0.2"
          />
          <path
            className="halloween-bat__fang"
            d="M53 25 L54.4 31 L55.8 25.4 Z"
            fill={`url(#${id("fang")})`}
            stroke="#8a8270"
            strokeWidth="0.2"
          />
          {/* blood */}
          <path d="M45.6 30.8 Q45.2 33 45.8 34 Q46.5 32.8 45.6 30.8 Z" fill="#c4001f" />
          <path d="M54.4 30.8 Q54.2 32.2 54.6 32.8 Q55.1 32 54.4 30.8 Z" fill="#a30019" />
        </g>

        {/* eye glow halos */}
        <g className="halloween-bat__halo">
          <circle cx="43.5" cy="16" r="6" fill={`url(#${id("halo")})`} />
          <circle cx="56.5" cy="16" r="6" fill={`url(#${id("halo")})`} />
        </g>

        {/* angry eyes (inner corners tilt down toward the nose) */}
        <g filter={`url(#${id("glow")})`}>
          <g transform="rotate(20 43.5 16)">
            <ellipse cx="43.5" cy="16" rx="3.3" ry="2" fill={`url(#${id("iris")})`} />
            <ellipse cx="43.5" cy="16" rx="0.55" ry="1.8" fill="#120000" />
          </g>
          <g transform="rotate(-20 56.5 16)">
            <ellipse cx="56.5" cy="16" rx="3.3" ry="2" fill={`url(#${id("iris")})`} />
            <ellipse cx="56.5" cy="16" rx="0.55" ry="1.8" fill="#120000" />
          </g>
        </g>
        {/* eye glints */}
        <circle cx="42.6" cy="15.2" r="0.45" fill="#fff" opacity="0.9" />
        <circle cx="55.6" cy="15.2" r="0.45" fill="#fff" opacity="0.9" />

        {/* heavy brow ridges */}
        <g stroke="#04020a" strokeWidth="1.5" strokeLinecap="round">
          <path d="M39 11.6 L47.5 14" />
          <path d="M61 11.6 L52.5 14" />
        </g>
      </svg>
    </span>
  );
}