import { useId, useMemo } from "react";
import "./DiwaliToran.css";

/* ------------------------------------------------------------------ */
/*  Deterministic random (same toran on every render / SSR-safe)       */
/* ------------------------------------------------------------------ */
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Catenary-ish curve the cord follows (matches the quadratic cord path) */
const W = 710;
const cordY = (x) => {
  const t = x / W;
  return 14 + 70 * t * (1 - t);
};

/* Marigold colour ramps: base (dark) -> middle -> tip (bright) */
const VARIANTS = {
  orange: ["#8f3606", "#e2701a", "#ffb340"],
  deep: ["#6f2204", "#c24f0b", "#f68a24"],
  yellow: ["#ad6107", "#f0a117", "#ffd95c"],
};

/* A scalloped, slightly ruffled marigold petal, base at origin */
const PETAL =
  "M0 0 C-4.5 -3 -7 -9 -4.6 -13.5 Q-3 -16.5 -1.2 -15.2 Q0 -17.6 1.2 -15.2 Q3 -16.5 4.6 -13.5 C7 -9 4.5 -3 0 0Z";

const RINGS = [
  { n: 11, s: 1, off: 0 },
  { n: 8, s: 0.76, off: 16 },
  { n: 5, s: 0.5, off: 31 },
];

/* Leaf geometry (length 60, base at origin, tip points to +y) */
const LEAF_L =
  "M0 0 C-8 6 -13 22 -9.5 38 C-7.5 47 -3.5 54 0 60Z";
const LEAF_R =
  "M0 0 C8 6 13 22 9.5 38 C7.5 47 3.5 54 0 60Z";
const VEINS = [10, 18, 26, 34, 42, 49].map((y, i) => {
  const w = 9 - i * 1.2;
  return `M0 ${y} Q${-w * 0.6} ${y + 2.5} ${-w} ${y + 8}`;
});
const VEINS_R = [10, 18, 26, 34, 42, 49].map((y, i) => {
  const w = 9 - i * 1.2;
  return `M0 ${y} Q${w * 0.6} ${y + 2.5} ${w} ${y + 8}`;
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function DiwaliToran({ className = "" }) {
  const uid = useId().replace(/:/g, "");
  const id = (n) => `${n}-${uid}`;
  const url = (n) => `url(#${id(n)})`;
  const ref = (n) => `#${id(n)}`;

  const data = useMemo(() => {
    const rnd = mulberry32(20261108);
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

    /* Back row: darker, a little larger, offset */
    const back = Array.from({ length: 36 }, (_, i) => {
      const x = 18 + i * 19.5;
      return {
        x,
        y: cordY(x) + 6 + (rnd() - 0.5) * 4,
        rot: rnd() * 360,
        s: 0.74 + rnd() * 0.12,
        v: pick(["deep", "deep", "orange"]),
      };
    });

    /* Front row */
    const front = Array.from({ length: 37 }, (_, i) => {
      const x = 8 + i * 19.5;
      return {
        x,
        y: cordY(x) + 9 + (rnd() - 0.5) * 5,
        rot: rnd() * 360,
        s: 0.62 + rnd() * 0.14,
        v: pick(["orange", "orange", "yellow", "deep", "yellow"]),
      };
    });

    /* Mango leaves hanging from the cord */
    const leaves = Array.from({ length: 14 }, (_, i) => {
      const x = 26 + i * 50.5;
      return {
        x,
        y: cordY(x) + 6,
        rot: (i % 2 === 0 ? -1 : 1) * (6 + rnd() * 14),
        s: 0.78 + rnd() * 0.3,
        delay: rnd() * 3,
        dur: 4 + rnd() * 2.5,
        light: rnd() > 0.5,
      };
    });

    /* Hanging marigold strands */
    const spec = [
      { x: 55, len: 86, bell: false },
      { x: 155, len: 118, bell: true },
      { x: 255, len: 94, bell: false },
      { x: 355, len: 128, bell: true },
      { x: 455, len: 94, bell: false },
      { x: 555, len: 118, bell: true },
      { x: 655, len: 86, bell: false },
    ];
    const delays = [0, 0.5, 1.1, 0.3, 1.5, 0.8, 1.8];
    const strands = spec.map((s, i) => {
      const n = Math.floor((s.len - 8) / 10);
      const flowers = Array.from({ length: n }, (_, j) => ({
        y: 9 + (j * (s.len - 16)) / (n - 1),
        dx: (rnd() - 0.5) * 2.4,
        rot: rnd() * 360,
        sc: 0.56 + rnd() * 0.1,
        v: pick(["orange", "yellow", "deep", "yellow", "orange"]),
      }));
      const tassel = Array.from({ length: 11 }, (_, k) => ({
        x2: (k - 5) * 1.5 + (rnd() - 0.5),
        c: (k - 5) * 0.9,
        gold: k % 3 !== 0,
      }));
      return {
        ...s,
        top: cordY(s.x) + 12,
        delay: delays[i],
        dur: 5 + rnd() * 1.5,
        flowers,
        tassel,
      };
    });

    return { back, front, leaves, strands };
  }, []);

  /* --- reusable pieces ---------------------------------------------- */
  const flower = (key, f) => (
    <use
      key={key}
      href={ref(`mg-${f.v}`)}
      transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.rot.toFixed(0)}) scale(${f.s.toFixed(2)})`}
    />
  );

  return (
    <div className={`diwali-toran ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 710 215"
        preserveAspectRatio="xMidYMin meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ---------- Marigold petal gradients + flower symbols ---------- */}
          {Object.entries(VARIANTS).map(([name, [a, b, c]]) => (
            <linearGradient key={name} id={id(`pg-${name}`)} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={a} />
              <stop offset="45%" stopColor={b} />
              <stop offset="100%" stopColor={c} />
            </linearGradient>
          ))}

          <radialGradient id={id("mgCenter")}>
            <stop offset="0%" stopColor="#3b1303" stopOpacity=".95" />
            <stop offset="60%" stopColor="#6e2a06" stopOpacity=".7" />
            <stop offset="100%" stopColor="#8f3606" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id("mgShadow")}>
            <stop offset="0%" stopColor="#1a0702" stopOpacity=".55" />
            <stop offset="70%" stopColor="#1a0702" stopOpacity=".3" />
            <stop offset="100%" stopColor="#1a0702" stopOpacity="0" />
          </radialGradient>

          {Object.keys(VARIANTS).map((name) => (
            <g key={name} id={id(`mg-${name}`)}>
              <circle r="15" cy="1.5" fill={url("mgShadow")} />
              {RINGS.map((ring, ri) =>
                Array.from({ length: ring.n }, (_, i) => (
                  <path
                    key={`${ri}-${i}`}
                    d={PETAL}
                    transform={`rotate(${((360 / ring.n) * i + ring.off).toFixed(1)}) scale(${ring.s})`}
                    fill={url(`pg-${name}`)}
                    stroke="#4a1a03"
                    strokeWidth="0.45"
                    strokeOpacity=".55"
                  />
                ))
              )}
              <circle r="4.6" fill={url("mgCenter")} />
              <ellipse cx="-3" cy="-4" rx="3" ry="1.5" transform="rotate(-30 -3 -4)" fill="#fff2b8" opacity=".22" />
            </g>
          ))}

          {/* ---------- Mango leaf ---------- */}
          <linearGradient id={id("leafDark")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#173f25" />
            <stop offset="55%" stopColor="#25643a" />
            <stop offset="100%" stopColor="#3f8a4d" />
          </linearGradient>
          <linearGradient id={id("leafLight")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#235a35" />
            <stop offset="50%" stopColor="#3d8349" />
            <stop offset="100%" stopColor="#7db35e" />
          </linearGradient>
          <linearGradient id={id("leafRightA")} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c6e3f" />
            <stop offset="60%" stopColor="#4a9552" />
            <stop offset="100%" stopColor="#8bbf66" />
          </linearGradient>

          {[false, true].map((light) => (
            <g key={String(light)} id={id(light ? "leaf-l" : "leaf-d")}>
              <path d="M0 -7 L0 2" stroke="#4d6b2a" strokeWidth="2.2" strokeLinecap="round" />
              <path d={LEAF_L} fill={url(light ? "leafLight" : "leafDark")} />
              <path d={LEAF_R} fill={url("leafRightA")} />
              <g fill="none" stroke="#173f25" strokeWidth=".6" opacity=".5">
                {VEINS.map((d, i) => <path key={i} d={d} />)}
              </g>
              <g fill="none" stroke="#c6e08e" strokeWidth=".55" opacity=".55">
                {VEINS_R.map((d, i) => <path key={i} d={d} />)}
              </g>
              <path d="M0 0 L0 59" stroke="#d3e79b" strokeWidth="1.1" opacity=".85" />
              <path d="M.9 0 L.9 58" stroke="#173f25" strokeWidth=".5" opacity=".35" />
              <path d={LEAF_R} fill="none" stroke="#c6e08e" strokeWidth=".6" opacity=".5" />
              <path d={LEAF_L} fill="none" stroke="#0f2c19" strokeWidth=".6" opacity=".55" />
              <path d="M3 12 C8 22 8 34 4 46" fill="none" stroke="#fff" strokeWidth="3" opacity=".08" strokeLinecap="round" />
            </g>
          ))}

          {/* ---------- Cord + brass ---------- */}
          <linearGradient id={id("cord")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a4c1b" />
            <stop offset="30%" stopColor="#e9b866" />
            <stop offset="55%" stopColor="#fbe1a0" />
            <stop offset="100%" stopColor="#8a4c1b" />
          </linearGradient>
          <linearGradient id={id("brassH")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6b3a10" />
            <stop offset="30%" stopColor="#d79a38" />
            <stop offset="50%" stopColor="#ffeaa6" />
            <stop offset="75%" stopColor="#b2701d" />
            <stop offset="100%" stopColor="#5a2f0b" />
          </linearGradient>
          <radialGradient id={id("bead")} cx=".35" cy=".3" r=".8">
            <stop offset="0%" stopColor="#fff2c0" />
            <stop offset="45%" stopColor="#e2a93f" />
            <stop offset="100%" stopColor="#6b3a10" />
          </radialGradient>

          <filter id={id("blur")} x="-10%" y="-60%" width="120%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Soft shadow the toran casts on the wall */}
        <path
          d="M0 30 Q355 100 710 30"
          fill="none"
          stroke="#1a0716"
          strokeWidth="26"
          opacity=".26"
          filter={url("blur")}
        />

        {/* Support cord: dark core, twisted gold wrap, highlight */}
        <path d="M0 14 Q355 84 710 14" fill="none" stroke="#4a2a0e" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M0 14 Q355 84 710 14" fill="none" stroke={url("cord")} strokeWidth="5" strokeLinecap="butt" strokeDasharray="4.5 2" />
        <path d="M0 12.6 Q355 82.6 710 12.6" fill="none" stroke="#fff2c8" strokeWidth=".9" opacity=".55" />

        {/* Mango leaves hanging from the cord (behind the flowers) */}
        {data.leaves.map((l, i) => (
          <g key={`leaf-${i}`} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(1)}) scale(${l.s.toFixed(2)})`}>
            <g
              className="diwali-toran__leaf"
              style={{ "--leaf-delay": `${l.delay.toFixed(2)}s`, "--leaf-dur": `${l.dur.toFixed(2)}s` }}
            >
              <use href={ref(l.light ? "leaf-l" : "leaf-d")} />
            </g>
          </g>
        ))}

        {/* Back row of marigolds */}
        {data.back.map((f, i) => flower(`b-${i}`, f))}

        {/* Hanging marigold strands */}
        {data.strands.map((s, si) => (
          <g key={`strand-${si}`} transform={`translate(${s.x} ${s.top.toFixed(1)})`}>
            <g
              className="diwali-toran__strand"
              style={{ "--sway-delay": `${s.delay}s`, "--sway-dur": `${s.dur.toFixed(2)}s` }}
            >
              {/* thread */}
              <path d={`M0 -4 Q1.5 ${s.len / 2} 0 ${s.len}`} stroke="#9c6a2a" strokeWidth="1.8" fill="none" />

              {/* small leaves peeking at the end of the garland */}
              <g transform={`translate(0 ${s.len - 12})`}>
                <use href={ref("leaf-d")} transform="rotate(32) scale(.5)" />
                <use href={ref("leaf-l")} transform="rotate(-34) scale(.5)" />
              </g>

              {/* dense flower garland */}
              {s.flowers.map((f, j) =>
                flower(`sf-${si}-${j}`, { x: f.dx, y: f.y, rot: f.rot, s: f.sc, v: f.v })
              )}

              {/* gold bead */}
              <circle cx="0" cy={s.len + 5} r="4.6" fill={url("bead")} stroke="#6b3a10" strokeWidth=".6" />

              {/* bell or tassel */}
              <g transform={`translate(0 ${s.len + 9})`}>
                <g className="diwali-toran__tail" style={{ "--sway-delay": `${s.delay}s` }}>
                  {s.bell ? (
                    <g transform="scale(1.1)">
                      <circle cx="0" cy="1" r="2.4" fill="none" stroke="#c48a2f" strokeWidth="1.2" />
                      <path d="M-2.8 3 C-5.5 5 -7.5 10 -8 16.5 L8 16.5 C7.5 10 5.5 5 2.8 3Z" fill={url("brassH")} stroke="#5a2f0b" strokeWidth=".6" />
                      <path d="M-8 16.5 L8 16.5" stroke="#3a1c06" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M-3.2 6 C-4.6 9 -5.2 12.5 -5.4 15" fill="none" stroke="#fff4c8" strokeWidth="1" opacity=".6" strokeLinecap="round" />
                      <circle cx="0" cy="18.6" r="2.5" fill={url("bead")} stroke="#5a2f0b" strokeWidth=".5" />
                    </g>
                  ) : (
                    <g>
                      <circle cx="0" cy="3" r="3.8" fill={url("bead")} stroke="#6b3a10" strokeWidth=".5" />
                      {s.tassel.map((t, k) => (
                        <path
                          key={k}
                          d={`M${(t.x2 * 0.15).toFixed(1)} 8 Q${t.c.toFixed(1)} 17 ${t.x2.toFixed(1)} 27`}
                          fill="none"
                          stroke={t.gold ? "#e0a93e" : "#b3262a"}
                          strokeWidth="1.1"
                          strokeLinecap="round"
                        />
                      ))}
                      <rect x="-3.4" y="6" width="6.8" height="3.4" rx="1.2" fill={url("brassH")} stroke="#5a2f0b" strokeWidth=".4" />
                    </g>
                  )}
                </g>
              </g>
            </g>
          </g>
        ))}

        {/* Front row of marigolds covers the tops of leaves and strands */}
        {data.front.map((f, i) => flower(`f-${i}`, f))}

        {/* Brass hooks at both ends */}
        {[0, W].map((x) => (
          <g key={`hook-${x}`}>
            <circle cx={x} cy="14" r="6" fill={url("bead")} stroke="#4a2a0e" strokeWidth=".8" />
            <circle cx={x} cy="14" r="2" fill="#3a1c06" opacity=".7" />
          </g>
        ))}
      </svg>
    </div>
  );
}