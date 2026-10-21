import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import "./HalloweenGhost.css";

// Keep in sync with --boo-duration in HalloweenGhost.css (2.6s)
const BOO_DURATION_MS = 2600;

function HalloweenGhost({
  className = "",
  size = 72,
  bubbleSide = "left", // "right" | "left": which side the BOO! bubble appears on
}) {
  const reduceMotion = useReducedMotion();
  const [booing, setBooing] = useState(false);
  const timerRef = useRef(null);

  // Works for mouse hover, mouse click and touch taps.
  // Ignored while a "boo" is already playing so it never restarts mid-way.
  const triggerBoo = useCallback(() => {
    if (timerRef.current) return;

    setBooing(true);
    timerRef.current = setTimeout(() => {
      setBooing(false);
      timerRef.current = null;
    }, BOO_DURATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className={[
        "halloween-ghost",
        reduceMotion ? "halloween-ghost--static" : "",
        booing ? "halloween-ghost--boo" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--ghost-size": `${size}px`,
      }}
      onPointerEnter={triggerBoo}
      onPointerDown={triggerBoo}
      aria-hidden="true"
    >
      <div className="halloween-ghost__float">
        <svg
          viewBox="0 0 120 145"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          className="halloween-ghost__svg"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="ghost-body-gradient"
              x1="25"
              y1="12"
              x2="98"
              y2="130"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="48%" stopColor="#E9DEFF" />
              <stop offset="100%" stopColor="#A58BD9" />
            </linearGradient>

            <radialGradient id="ghost-cheek-gradient">
              <stop offset="0%" stopColor="#FF9DBB" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FF9DBB" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Waving arms (drawn behind the body, hidden until "boo") */}
          <g className="halloween-ghost__arm halloween-ghost__arm--left">
            <g className="halloween-ghost__arm-wave">
              <path
                d="M24 90L8 70"
                stroke="#CBB8FF"
                strokeWidth="13"
                strokeLinecap="round"
              />
              <path
                d="M24 90L8 70"
                stroke="#F1E9FF"
                strokeWidth="9"
                strokeLinecap="round"
              />
            </g>
          </g>

          <g className="halloween-ghost__arm halloween-ghost__arm--right">
            <g className="halloween-ghost__arm-wave">
              <path
                d="M95 90L111 70"
                stroke="#CBB8FF"
                strokeWidth="13"
                strokeLinecap="round"
              />
              <path
                d="M95 90L111 70"
                stroke="#F1E9FF"
                strokeWidth="9"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* Ghost body */}
          <path
            d="
              M60 12
              C34 12 18 32 18 61
              V122
              C18 127 21 129 26 126
              L39 116
              L51 128
              C54 131 58 131 61 127
              L72 116
              L88 128
              C93 132 99 129 99 123
              V61
              C99 32 85 12 60 12
              Z
            "
            fill="url(#ghost-body-gradient)"
            stroke="#CBB8FF"
            strokeWidth="2"
          />

          {/* Soft body highlight */}
          <path
            d="M33 57C34 37 43 26 56 23"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Cheeks */}
          <circle
            cx="35"
            cy="78"
            r="13"
            fill="url(#ghost-cheek-gradient)"
          />

          <circle
            cx="84"
            cy="78"
            r="13"
            fill="url(#ghost-cheek-gradient)"
          />

          {/* Blinking eyes */}
          <g className="halloween-ghost__eyes">
            <ellipse
              cx="45"
              cy="65"
              rx="5"
              ry="7"
              fill="#211035"
            />
            <ellipse
              cx="76"
              cy="65"
              rx="5"
              ry="7"
              fill="#211035"
            />
          </g>

          {/* Friendly smile (default) */}
          <path
            className="halloween-ghost__smile"
            d="M53 85Q60 93 68 85"
            stroke="#211035"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Big open smile (first part of the greeting) */}
          <g className="halloween-ghost__big-smile">
            <path
              d="M49 82Q60 102 71 82Z"
              fill="#211035"
              stroke="#211035"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <ellipse cx="60" cy="89" rx="4" ry="2.5" fill="#FF7FA3" />
          </g>

          {/* "BOO" mouth */}
          <g className="halloween-ghost__boo-mouth">
            <ellipse cx="60" cy="90" rx="7" ry="9" fill="#211035" />
            <ellipse cx="60" cy="95" rx="4" ry="3" fill="#FF7FA3" />
          </g>

          {/* Tiny glowing star */}
          <path
            d="M95 18L98 26L106 29L98 32L95 40L92 32L84 29L92 26Z"
            fill="#5AFF00"
            className="halloween-ghost__sparkle"
          />

          {/* Second sparkle */}
          <circle
            cx="14"
            cy="40"
            r="3"
            fill="#FF953A"
            className="halloween-ghost__sparkle"
          />

          {/* Speech bubble */}
          {/* Sits beside the ghost (never above), so it can't be cut off by the top of the screen */}
          <g
            className={`halloween-ghost__bubble halloween-ghost__bubble--${
              bubbleSide === "left" ? "left" : "right"
            }`}
          >
            <path
              d={
                bubbleSide === "left"
                  ? "M4 12H-32Q-44 12 -44 24V34Q-44 44 -32 44H4Q16 44 16 34L26 28L16 22Q16 12 4 12Z"
                  : "M116 12H152Q164 12 164 24V34Q164 44 152 44H116Q104 44 104 34L94 28L104 22Q104 12 116 12Z"
              }
              fill="#FF953A"
              stroke="#211035"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <text
              x={bubbleSide === "left" ? -14 : 134}
              y="35"
              textAnchor="middle"
              fontSize="20"
              fontWeight="800"
              fontFamily="system-ui, sans-serif"
              fill="#211035"
            >
              BOO!
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default HalloweenGhost;