
import { useId } from "react";
import "./DiwaliRangoli.css";

const OUTER_PETALS = 16;
const INNER_PETALS = 12;

const petalColors = [
  "#E87C26",
  "#F2A42D",
  "#DB5B78",
  "#B94C7A",
  "#E8A32B",
  "#EF873D",
  "#C94B6A",
  "#E3A429",
];

const dust = [
  [30, 94, 2.1, 0.3],
  [58, 40, 1.7, 1.1],
  [110, 19, 1.5, 0.8],
  [196, 25, 2.1, 1.5],
  [251, 56, 1.8, 2.1],
  [280, 127, 1.4, 0.7],
  [260, 229, 1.7, 2.5],
  [203, 274, 2.3, 1.8],
  [92, 279, 1.6, 1.3],
  [24, 204, 1.9, 2.8],
  [12, 144, 1.4, 1.9],
  [148, 290, 1.6, 0.5],
];

export default function DiwaliRangoli({
  className = "",
  size = 260,
}) {
  const uid = useId().replace(/:/g, "");
  const id = (name) => `${name}-${uid}`;

  return (
    <div
      className={`diwali-rangoli ${className}`}
      style={{ "--rangoli-size": `${size}px` }}
      aria-hidden="true"
    >
      <div className="diwali-rangoli__ambient" />

      <svg
        className="diwali-rangoli__svg"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={id("base")}>
            <stop offset="0%" stopColor="#7C324E" />
            <stop offset="65%" stopColor="#5B2949" />
            <stop offset="100%" stopColor="#281829" />
          </radialGradient>

          <radialGradient id={id("center")}>
            <stop offset="0%" stopColor="#FFE8A4" />
            <stop offset="42%" stopColor="#F5B843" />
            <stop offset="100%" stopColor="#D57A29" />
          </radialGradient>

          <linearGradient
            id={id("petal")}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#FFD080" />
            <stop offset="100%" stopColor="#DC663D" />
          </linearGradient>
        </defs>

        {/* Fine outer ring */}
        <circle
          cx="150"
          cy="150"
          r="116"
          fill={`url(#${id("base")})`}
          stroke="#E9B768"
          strokeWidth="1.7"
          strokeDasharray="2 4"
          className="diwali-rangoli__base"
        />

        <circle
          cx="150"
          cy="150"
          r="107"
          fill="none"
          stroke="#F7CD7B"
          strokeWidth="1.4"
          opacity=".7"
          className="diwali-rangoli__outline"
        />

        {/* Outer lotus flower */}
        <g transform="translate(150 150)">
          {Array.from(
            { length: OUTER_PETALS },
            (_, i) => {
              const angle = i * (360 / OUTER_PETALS);

              return (
                <g
                  key={`outer-${i}`}
                  transform={`rotate(${angle})`}
                >
                  <path
                    className="diwali-rangoli__petal"
                    style={{
                      "--petal-delay": `${0.18 + i * 0.085}s`,
                    }}
                    d="
                      M0 -37
                      C-17 -56 -23 -84 0 -104
                      C23 -84 17 -56 0 -37 Z
                    "
                    fill={petalColors[i % petalColors.length]}
                    stroke="#FFD58A"
                    strokeWidth="1.5"
                  />

                  <path
                    className="diwali-rangoli__petal-detail"
                    d="M0 -42 Q-8 -71 0 -97 Q8 -71 0 -42"
                    fill="none"
                    stroke="#FFE0A0"
                    strokeWidth=".9"
                    opacity=".7"
                  />

                  <circle
                    cx="0"
                    cy="-98"
                    r="2.5"
                    fill="#FFE9B1"
                    className="diwali-rangoli__sparkle"
                    style={{
                      "--sparkle-delay": `${i * 0.23}s`,
                    }}
                  />
                </g>
              );
            }
          )}
        </g>

        {/* Fine concentric ornamental rings */}
        <circle
          cx="150"
          cy="150"
          r="70"
          fill="none"
          stroke="#F7D18C"
          strokeWidth="2"
          className="diwali-rangoli__outline"
        />

        <circle
          cx="150"
          cy="150"
          r="65"
          fill="#71334D"
          stroke="#F1B65B"
          strokeWidth="1.2"
          className="diwali-rangoli__base"
        />

        {/* Inner lotus petals */}
        <g transform="translate(150 150)">
          {Array.from(
            { length: INNER_PETALS },
            (_, i) => {
              const angle = i * (360 / INNER_PETALS);

              return (
                <g
                  key={`inner-${i}`}
                  transform={`rotate(${angle})`}
                >
                  <path
                    d="
                      M0 -10
                      C-12 -24 -18 -45 0 -62
                      C18 -45 12 -24 0 -10Z
                    "
                    fill={
                      i % 2 === 0
                        ? "#F7A54D"
                        : "#E46A83"
                    }
                    stroke="#FFDDA0"
                    strokeWidth="1.2"
                    className="diwali-rangoli__inner-petal"
                    style={{
                      "--petal-delay": `${0.9 + i * 0.08}s`,
                    }}
                  />

                  <path
                    d="M0 -18 L0 -53"
                    stroke="#FFE0AB"
                    strokeWidth=".8"
                    opacity=".65"
                  />
                </g>
              );
            }
          )}
        </g>

        {/* Centre medallion */}
        <circle
          cx="150"
          cy="150"
          r="26"
          fill={`url(#${id("center")})`}
          stroke="#FFE6AB"
          strokeWidth="2"
          className="diwali-rangoli__center"
        />

        {/* Centre flower */}
        <g transform="translate(150 150)">
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse
              key={`middle-${i}`}
              cx="0"
              cy="-10"
              rx="5"
              ry="11"
              transform={`rotate(${i * 45})`}
              fill="#A8435A"
              stroke="#FBE4A3"
              strokeWidth=".6"
            />
          ))}

          <circle
            r="7"
            fill="#FFF2B8"
            stroke="#A65F2D"
            strokeWidth="1"
          />

          <circle r="2.5" fill="#9B4B27" />
        </g>

        {/* Traditional circular dot work */}
        {Array.from({ length: 32 }, (_, i) => {
          const a = (i / 32) * Math.PI * 2;
          const r = 123;

          return (
            <circle
              key={`dot-${i}`}
              cx={150 + Math.cos(a) * r}
              cy={150 + Math.sin(a) * r}
              r={i % 2 === 0 ? 2.7 : 1.8}
              fill={i % 2 === 0 ? "#F2C36F" : "#F7E7B9"}
              className="diwali-rangoli__dot"
              style={{
                "--petal-delay": `${1.3 + i * 0.025}s`,
              }}
            />
          );
        })}

        {/* Floating golden particles */}
        {dust.map(([x, y, radius, delay], index) => (
          <circle
            key={`dust-${index}`}
            cx={x}
            cy={y}
            r={radius}
            fill="#FFD989"
            className="diwali-rangoli__dust"
            style={{
              "--dust-delay": `${delay}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
