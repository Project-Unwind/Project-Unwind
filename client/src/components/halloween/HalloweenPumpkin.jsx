
import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import "./HalloweenPumpkin.css";

function HalloweenPumpkin({
  className = "",
  size = 75,
}) {
  const reduceMotion = useReducedMotion();
  const id = useId().replace(/:/g, "");

  return (
    <div
      className={`halloween-pumpkin ${
        reduceMotion ? "halloween-pumpkin--static" : ""
      } ${className}`}
      style={{ "--pumpkin-size": `${size}px` }}
      aria-hidden="true"
    >
      <div className="halloween-pumpkin__float">
        <svg
          viewBox="0 0 160 160"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          className="halloween-pumpkin__svg"
          focusable="false"
        >
          <defs>
            <linearGradient
              id={`${id}-body`}
              x1="35"
              y1="50"
              x2="132"
              y2="136"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFAC32" />
              <stop offset="48%" stopColor="#FF6600" />
              <stop offset="100%" stopColor="#B83C06" />
            </linearGradient>

            <radialGradient id={`${id}-light`}>
              <stop offset="0%" stopColor="#FFF8A1" />
              <stop offset="65%" stopColor="#FFE45C" />
              <stop offset="100%" stopColor="#FF9900" />
            </radialGradient>
          </defs>

          {/* Stem */}
          <path
            d="M73 53C70 40 74 27 81 19L95 24C86 33 86 45 89 55Z"
            fill="#0F2C20"
            stroke="#5AFF00"
            strokeWidth="2"
          />

          {/* Curled vine */}
          <path
            d="M86 30C101 17 117 27 108 37C101 45 91 39 99 32"
            stroke="#5AFF00"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Pumpkin silhouette */}
          <path
            d="M80 48C48 38 21 59 18 93C15 127 42 146 80 144C118 146 145 127 142 93C139 59 112 38 80 48Z"
            fill={`url(#${id}-body)`}
            stroke="#FF953A"
            strokeWidth="2.5"
          />

          {/* Pumpkin grooves */}
          <path
            d="M56 49C37 68 33 125 59 142"
            stroke="#B83C06"
            strokeWidth="4"
            opacity="0.42"
          />
          <path
            d="M104 49C123 68 127 125 101 142"
            stroke="#B83C06"
            strokeWidth="4"
            opacity="0.42"
          />
          <path
            d="M80 48C69 77 69 118 80 144"
            stroke="#FFD078"
            strokeWidth="2"
            opacity="0.28"
          />

          {/* Face */}
          <g className="halloween-pumpkin__face">
            {/* Eyes */}
            <g className="halloween-pumpkin__eyes">
              <path
                d="M42 85L60 68L65 91Z"
                fill={`url(#${id}-light)`}
              />
              <path
                d="M118 85L100 68L95 91Z"
                fill={`url(#${id}-light)`}
              />
            </g>

            {/* Nose */}
            <path
              d="M80 92L72 105H88Z"
              fill="#FFE45C"
            />

            {/* Animated grin */}
            <path
              className="halloween-pumpkin__grin"
              d="M39 109C56 132 104 132 121 109L108 113L100 106L91 118L80 111L69 118L60 106L52 113Z"
              fill={`url(#${id}-light)`}
            />
          </g>

          {/* Pumpkin highlight */}
          <path
            d="M36 78C42 65 50 59 59 57"
            stroke="#FFD078"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </div>
    </div>
  );
}

export default HalloweenPumpkin;
