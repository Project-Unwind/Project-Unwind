
import { useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./DiwaliRocket.css";

const SPARK_COUNT = 48;
const EMBER_COUNT = 24;

const sparkColors = [
  "#FFFFFF",
  "#FFF4C5",
  "#F0BB73",
  "#FFAA45",
  "#FFD879",
];

function RocketArtwork({ id }) {
  return (
    <svg
      viewBox="0 0 48 105"
      className="diwali-rocket-artwork"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`rocket-metal-${id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#78233B" />
          <stop offset="30%" stopColor="#BD455B" />
          <stop offset="58%" stopColor="#EF8291" />
          <stop offset="100%" stopColor="#86253F" />
        </linearGradient>
      </defs>

      {/* Traditional bamboo stick */}
      <path
        d="M24 49 V99"
        stroke="#9C642E"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M23 50 V96"
        stroke="#FFE0A1"
        strokeWidth=".8"
        opacity=".65"
      />

      {/* Main rocket cone and body */}
      <path
        d="M24 3
           C36 17 39 33 36 52
           Q24 58 12 52
           C9 33 12 17 24 3Z"
        fill={`url(#rocket-metal-${id})`}
        stroke="#F8C878"
        strokeWidth="1.8"
      />

      {/* Golden bands */}
      <path
        d="M12 41 Q24 46 36 41"
        fill="none"
        stroke="#FFE1A0"
        strokeWidth="3"
      />

      <path
        d="M12 49 Q24 55 36 49"
        fill="none"
        stroke="#F0BB73"
        strokeWidth="2.5"
      />

      {/* Gold star emblem */}
      <path
        d="M24 20 L27 27 L34 28
           L29 33 L30 40
           L24 36 L18 40
           L19 33 L14 28
           L21 27Z"
        fill="#FFE1A0"
      />

      {/* Side paper fins */}
      <path
        d="M13 44 L4 61 L16 54Z
           M35 44 L44 61 L32 54Z"
        fill="#DFA34D"
        stroke="#FFE2A1"
        strokeWidth="1"
      />
    </svg>
  );
}

function RocketFlame() {
  return (
    <span className="diwali-rocket-flame">
      <span className="diwali-rocket-flame__outer" />
      <span className="diwali-rocket-flame__inner" />

      {Array.from({ length: 7 }, (_, index) => (
        <i
          key={index}
          style={{
            "--i": index,
            "--drift": `${(index - 3) * 5}px`,
          }}
        />
      ))}
    </span>
  );
}

function FireworkBurst() {
  return (
    <div className="diwali-firework">
      <span className="diwali-firework__flash" />
      <span className="diwali-firework__ring" />
      <span className="diwali-firework__ring diwali-firework__ring--second" />

      {Array.from({ length: SPARK_COUNT }, (_, index) => {
        const angle = (index * 360) / SPARK_COUNT;
        const distance = 115 + (index % 6) * 20;

        return (
          <span
            key={`spark-${index}`}
            className="diwali-firework__spark"
            style={{
              "--angle": `${angle}deg`,
              "--distance": `${-distance}px`,
              "--color": sparkColors[index % sparkColors.length],
              "--delay": `${(index % 5) * 18}ms`,
            }}
          />
        );
      })}

      {Array.from({ length: EMBER_COUNT }, (_, index) => (
        <span
          key={`ember-${index}`}
          className="diwali-firework__ember"
          style={{
            "--angle": `${index * (360 / EMBER_COUNT)}deg`,
            "--distance": `${-(75 + (index % 5) * 16)}px`,
            "--color": sparkColors[index % sparkColors.length],
          }}
        />
      ))}
    </div>
  );
}

function FullscreenLaunch({ flight }) {
  const style = {
    "--start-x": `${flight.startX}px`,
    "--start-y": `${flight.startY}px`,
    "--dx": `${flight.endX - flight.startX}px`,
    "--dy": `${flight.endY - flight.startY}px`,
    "--end-x": `${flight.endX}px`,
    "--end-y": `${flight.endY}px`,
  };

  return createPortal(
    <div
      className="diwali-rocket-screen"
      style={style}
      aria-hidden="true"
    >
      <div className="diwali-rocket-screen__glow" />

      <div className="diwali-rocket-flight">
        <div className="diwali-rocket-flight__body">
          <RocketArtwork id={flight.id} />
          <RocketFlame />

          <span className="diwali-rocket-flight__trail" />
        </div>
      </div>

      <div className="diwali-rocket-explosion">
        <FireworkBurst />
      </div>
    </div>,
    document.body
  );
}

export default function DiwaliRocket({ launching = false }) {
  const id = useId().replace(/:/g, "");
  const rocketRef = useRef(null);

  const [flight, setFlight] = useState(null);

  useLayoutEffect(() => {
    if (!launching) {
      setFlight(null);
      return;
    }

    if (!rocketRef.current) return;

    const rect = rocketRef.current.getBoundingClientRect();

    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 3;

    // Burst in the upper part of the visible screen.
    const endX = Math.min(
      window.innerWidth - 110,
      Math.max(110, window.innerWidth * 0.58)
    );

    const endY = Math.min(
      window.innerHeight * 0.28,
      240
    );

    setFlight({
      id,
      startX,
      startY,
      endX,
      endY,
    });
  }, [launching, id]);

  return (
    <>
      {/* Static rocket attached to the original CTA */}
      <span
        ref={rocketRef}
        className={`diwali-cta-rocket-anchor ${
          launching ? "diwali-cta-rocket-anchor--hidden" : ""
        }`}
        aria-hidden="true"
      >
        <span className="diwali-cta-rocket-anchor__body">
          <RocketArtwork id={`${id}-idle`} />
          <RocketFlame />
        </span>
      </span>

      {/* Independent fullscreen flight and explosion */}
      {flight && <FullscreenLaunch flight={flight} />}
    </>
  );
}
