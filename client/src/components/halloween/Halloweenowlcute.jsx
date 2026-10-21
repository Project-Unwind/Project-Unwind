import { useCallback, useEffect, useRef, useState } from "react";
import "./HalloweenOwlCute.css";

const HOP_MS = 1300;

function HalloweenOwlCute({ className = "", size = 85 }) {
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const timer = useRef(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const trigger = useCallback(() => {
    // Lock synchronously so hover + click cannot start overlapping animations.
    if (activeRef.current) return;
    activeRef.current = true;
    setActive(true);
    timer.current = setTimeout(() => {
      activeRef.current = false;
      timer.current = null;
      setActive(false);
    }, HOP_MS);
  }, []);

const handlePointerEnter = useCallback(
  (event) => {
    if (
      event.pointerType === "mouse" ||
      event.pointerType === "pen"
    ) {
      trigger();
    }
  },
  [trigger]
);

  return (
    <div
      className={[
        "halloween-owl-cute",
        active ? "halloween-owl-cute--active" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ "--cute-owl-size": `${size}px` }}
      onPointerEnter={handlePointerEnter}
      onClick={trigger}
      aria-hidden="true"
    >
      <svg
        className="halloween-owl-cute__svg"
        viewBox="0 0 120 130"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        focusable="false"
      >
        {/* Feet */}
        <path
          d="M46 119q-2 6-7 6M46 119q1 6 6 6M74 119q-2 6-7 6M74 119q1 6 6 6"
          stroke="#FF953A"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Left wing */}
        <g className="halloween-owl-cute__wing halloween-owl-cute__wing--left">
          <path
            d="M30 60C12 66 8 92 18 108C32 106 38 92 38 76Z"
            fill="#F2E4C9"
            stroke="#D9C3A0"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>

        {/* Right wing */}
        <g className="halloween-owl-cute__wing halloween-owl-cute__wing--right">
          <path
            d="M90 60C108 66 112 92 102 108C88 106 82 92 82 76Z"
            fill="#F2E4C9"
            stroke="#D9C3A0"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>

        {/* Body + head */}
        <path
          d="M60 18
             C86 18 98 36 98 58
             C98 76 102 88 96 102
             C90 118 76 121 60 121
             C44 121 30 118 24 102
             C18 88 22 76 22 58
             C22 36 34 18 60 18Z"
          fill="#FFF6E3"
          stroke="#D9C3A0"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Ear tufts */}
        <path
          className="halloween-owl-cute__ear halloween-owl-cute__ear--left"
          d="M30 30L26 8L48 22"
          fill="#FFF6E3"
          stroke="#D9C3A0"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          className="halloween-owl-cute__ear halloween-owl-cute__ear--right"
          d="M90 30L94 8L72 22"
          fill="#FFF6E3"
          stroke="#D9C3A0"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Belly */}
        <ellipse cx="60" cy="96" rx="22" ry="21" fill="#FFFDF6" />
        <path
          d="M50 88q4 4 8 0M62 88q4 4 8 0M56 98q4 4 8 0M46 100q4 4 8 0M66 100q4 4 8 0"
          stroke="#D9C3A0"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Left eye */}
        <g className="halloween-owl-cute__eye">
          <circle cx="44" cy="55" r="16" fill="#FFFFFF" stroke="#D9C3A0" strokeWidth="2" />
          <g className="halloween-owl-cute__iris">
            <circle cx="45" cy="56" r="11" fill="#7A4A22" />
            <circle cx="45" cy="57" r="8.5" fill="#B07A3F" />
            <circle cx="45" cy="56" r="5.5" fill="#2B1608" />
            <circle className="halloween-owl-cute__shine" cx="48.5" cy="52.5" r="3" fill="#FFFFFF" />
            <circle cx="41.5" cy="60" r="1.5" fill="#FFFFFF" opacity="0.9" />
          </g>
        </g>

        {/* Right eye */}
        <g className="halloween-owl-cute__eye">
          <circle cx="76" cy="55" r="16" fill="#FFFFFF" stroke="#D9C3A0" strokeWidth="2" />
          <g className="halloween-owl-cute__iris">
            <circle cx="75" cy="56" r="11" fill="#7A4A22" />
            <circle cx="75" cy="57" r="8.5" fill="#B07A3F" />
            <circle cx="75" cy="56" r="5.5" fill="#2B1608" />
            <circle className="halloween-owl-cute__shine" cx="78.5" cy="52.5" r="3" fill="#FFFFFF" />
            <circle cx="71.5" cy="60" r="1.5" fill="#FFFFFF" opacity="0.9" />
          </g>
        </g>

        {/* Rosy cheeks (drawn after the eyes so the blush is visible) */}
        <ellipse
          className="halloween-owl-cute__cheek"
          cx="31" cy="69" rx="6" ry="3.5" fill="#FF6F8E"
        />
        <ellipse
          className="halloween-owl-cute__cheek"
          cx="89" cy="69" rx="6" ry="3.5" fill="#FF6F8E"
        />

        {/* Beak */}
        <path
          d="M55 69L65 69L60 78Z"
          fill="#FF953A"
          stroke="#E07A1F"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* "Hoot!" speech bubble */}
        <g className="halloween-owl-cute__hoot">
          <path
            d="M70 -4 L78 4 L84 -4Z"
            fill="#FFFFFF"
            stroke="#D9C3A0"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect
            x="62" y="-30" width="56" height="28" rx="14"
            fill="#FFFFFF" stroke="#D9C3A0" strokeWidth="2"
          />
          <path d="M72 -3.5 L82 -3.5" stroke="#FFFFFF" strokeWidth="3" />
          <text
            x="90" y="-11"
            textAnchor="middle"
            fontSize="15"
            fontWeight="800"
            fontFamily="'Nunito', 'Comic Sans MS', system-ui, sans-serif"
            fill="#E07A1F"
          >
            Hoot!
          </text>
        </g>
      </svg>
    </div>
  );
}

export default HalloweenOwlCute;