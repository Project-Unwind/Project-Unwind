
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./DiwaliRocketButton.css";

const SPARK_COUNT = 20;

function RocketIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 60"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="diwali-rocket-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#802C43" />
          <stop offset="45%" stopColor="#EB7682" />
          <stop offset="100%" stopColor="#A8394F" />
        </linearGradient>
      </defs>

      {/* Bamboo launch stick */}
      <path
        d="M20 35 V58"
        stroke="#D5A462"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Rocket body */}
      <path
        d="M20 3 Q34 16 30 39 H10 Q6 16 20 3Z"
        fill="url(#diwali-rocket-body)"
        stroke="#F0BB73"
        strokeWidth="1.7"
      />

      {/* Golden decorative bands */}
      <path
        d="M11 28 H29 M10 35 H30"
        stroke="#FFE2A0"
        strokeWidth="2"
      />

      {/* Rocket emblem */}
      <path
        d="M20 15 L22 20 L27 21 L23 24 L24 29
           L20 26 L16 29 L17 24 L13 21 L18 20Z"
        fill="#FFE3A1"
      />

      {/* Side fins */}
      <path
        d="M11 31 L4 43 L14 39Z"
        fill="#F0BB73"
      />
      <path
        d="M29 31 L36 43 L26 39Z"
        fill="#F0BB73"
      />
    </svg>
  );
}

function RocketAnimation({ launch }) {
  return createPortal(
    <div className="diwali-rocket-overlay" aria-hidden="true">
      {/* Flying rocket */}
      <div
        className="diwali-rocket-flight"
        style={{
          "--rocket-x": `${launch.x}px`,
          "--rocket-y": `${launch.y}px`,
          "--rocket-dx": `${launch.targetX - launch.x}px`,
          "--rocket-dy": `${launch.targetY - launch.y}px`,
        }}
      >
        <div className="diwali-rocket-flight__trail" />
        <RocketIcon className="diwali-rocket-flight__icon" />
      </div>

      {/* Firework burst at rocket destination */}
      <div
        className="diwali-rocket-burst"
        style={{
          left: `${launch.targetX}px`,
          top: `${launch.targetY}px`,
        }}
      >
        <div className="diwali-rocket-burst__flash" />

        {Array.from({ length: SPARK_COUNT }, (_, i) => (
          <span
            key={i}
            className="diwali-rocket-burst__spark"
            style={{
              "--angle": `${(i * 360) / SPARK_COUNT}deg`,
              "--distance": `${45 + (i % 4) * 13}px`,
              "--spark-color":
                i % 3 === 0
                  ? "#FFFFFF"
                  : i % 2 === 0
                    ? "#F8D9B6"
                    : "#F0BB73",
            }}
          />
        ))}

        <div className="diwali-rocket-burst__ring" />
      </div>
    </div>,
    document.body
  );
}

export default function DiwaliRocketButton({
  children = "Begin Your Journey",
  enabled = false,
  onComplete,
  className = "",
  disabled = false,
}) {
  const buttonRef = useRef(null);
  const timerRef = useRef(null);

  const [launch, setLaunch] = useState(null);

  useEffect(() => {
    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, []);

  function handleClick() {
    if (disabled || launch) return;

    // Normal themes retain immediate navigation/action.
    if (!enabled) {
      onComplete?.();
      return;
    }

    // Respect reduced-motion accessibility preference.
    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      onComplete?.();
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();

    const x = rect.right - 22;
    const y = rect.top + rect.height / 2;

    const targetX = window.innerWidth * 0.55;
    const targetY = Math.max(
      65,
      Math.min(145, window.innerHeight * 0.18)
    );

    setLaunch({
      x,
      y,
      targetX,
      targetY,
    });

    // Let the rocket reach the sky and burst
    // before activating the existing CTA action.
    timerRef.current = window.setTimeout(() => {
      setLaunch(null);
      onComplete?.();
    }, 1600);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`diwali-rocket-button ${className}`}
        onClick={handleClick}
        disabled={disabled || Boolean(launch)}
        aria-busy={Boolean(launch)}
      >
        <span>{children}</span>

        {enabled && (
          <RocketIcon className="diwali-rocket-button__icon" />
        )}
      </button>

      {launch && <RocketAnimation launch={launch} />}
    </>
  );
}
