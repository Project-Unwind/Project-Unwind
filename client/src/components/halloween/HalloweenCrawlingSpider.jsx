import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import "./HalloweenCrawlingSpider.css";

/*
  Leg geometry for the RIGHT side: [attach, knee, foot].
  The left side is mirrored around x = 60.
*/
const LEGS = [
  { attach: [67, 36], knee: [89, 12], foot: [110, 32] },
  { attach: [69, 40], knee: [97, 26], foot: [115, 48] },
  { attach: [69, 45], knee: [98, 50], foot: [113, 74] },
  { attach: [66, 49], knee: [88, 68], foot: [95, 95] },
];

function Leg({ leg, index, side }) {
  const [ax, ay] = leg.attach;
  const [kx, ky] = leg.knee;
  const [fx, fy] = leg.foot;

  // Alternating gait: legs on opposite sides / alternate indexes move out of phase
  const phase = (index + (side === "left" ? 1 : 0)) % 2 === 0 ? "a" : "b";

  return (
    <g
      className={`hcs__leg hcs__leg--${phase}`}
      style={{ transformOrigin: `${ax}px ${ay}px` }}
    >
      <path d={`M${ax} ${ay} L${kx} ${ky}`} className="hcs__femur" />
      <path d={`M${kx} ${ky} L${fx} ${fy}`} className="hcs__tibia" />
      <circle cx={kx} cy={ky} r="3.4" className="hcs__fill" />
      <circle cx={fx} cy={fy} r="1.4" className="hcs__fill" />
    </g>
  );
}

function HalloweenCrawlingSpider({
  className = "",
  size = 48,
  direction = "right",
}) {
  const reduceMotion = useReducedMotion();
  const id = useId().replace(/:/g, "");

  return (
    <div
      className={[
        "halloween-crawling-spider",
        direction === "left"
          ? "halloween-crawling-spider--left"
          : "halloween-crawling-spider--right",
        reduceMotion ? "halloween-crawling-spider--static" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ "--spider-size": `${size}px` }}
      aria-hidden="true"
    >
      <div className="halloween-crawling-spider__motion">
        <svg
          className="halloween-crawling-spider__svg"
          viewBox="0 0 120 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <defs>
            {/* Rough, hairy edge so the silhouette reads as a real spider */}
            <filter
              id={`${id}-fur`}
              x="-15%"
              y="-15%"
              width="130%"
              height="130%"
            >
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
                scale="2.6"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            <filter
              id={`${id}-bristle`}
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="1.4"
                numOctaves="1"
                seed="3"
                result="n"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="n"
                scale="1.8"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          {/* Legs */}
          <g className="hcs__legs" filter={`url(#${id}-bristle)`}>
            <g className="hcs__side">
              {LEGS.map((leg, i) => (
                <Leg key={`r${i}`} leg={leg} index={i} side="right" />
              ))}
            </g>
            <g
              className="hcs__side"
              transform="translate(120 0) scale(-1 1)"
            >
              {LEGS.map((leg, i) => (
                <Leg key={`l${i}`} leg={leg} index={i} side="left" />
              ))}
            </g>
          </g>

          {/* Body */}
          <g className="hcs__body" filter={`url(#${id}-fur)`}>
            {/* Spinnerets */}
            <path d="M55 89 Q60 98 65 89Z" className="hcs__fill" />

            {/* Abdomen */}
            <ellipse cx="60" cy="66" rx="20" ry="25" className="hcs__fill" />

            {/* Waist */}
            <ellipse cx="60" cy="52" rx="6" ry="4" className="hcs__fill" />

            {/* Cephalothorax */}
            <ellipse cx="60" cy="40" rx="14" ry="13" className="hcs__fill" />

            {/* Pedipalps */}
            <g className="hcs__palps">
              <path d="M54 29 Q48 24 46 30" className="hcs__palp" />
              <path d="M66 29 Q72 24 74 30" className="hcs__palp" />
              <circle cx="46" cy="30" r="2" className="hcs__fill" />
              <circle cx="74" cy="30" r="2" className="hcs__fill" />
            </g>

            {/* Jaws + fangs */}
            <g className="hcs__jaws">
              <ellipse cx="56" cy="30" rx="3.2" ry="4.4" className="hcs__fill" />
              <ellipse cx="64" cy="30" rx="3.2" ry="4.4" className="hcs__fill" />
              <path d="M55 33 Q53.5 38 56 41" className="hcs__fang" />
              <path d="M65 33 Q66.5 38 64 41" className="hcs__fang" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default HalloweenCrawlingSpider;