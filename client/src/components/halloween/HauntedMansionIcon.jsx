
export default function HauntedMansionIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Moon */}
      <circle cx="48" cy="14" r="9" fill="#F6D88A" />

      {/* Mansion roof */}
      <path
        d="M7 30L32 9L57 30H51V55H13V30H7Z"
        fill="#30203F"
        stroke="#A576CC"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Chimney */}
      <path d="M42 12H49V25H42Z" fill="#30203F" />

      {/* Left window */}
      <rect
        x="19"
        y="32"
        width="9"
        height="12"
        rx="2"
        fill="#FFAC47"
      />

      {/* Right window */}
      <rect
        x="36"
        y="32"
        width="9"
        height="12"
        rx="2"
        fill="#FFAC47"
      />

      {/* Haunted door */}
      <path
        d="M28 55V47C28 41 36 41 36 47V55"
        fill="#120C1C"
      />

      {/* Pumpkin */}
      <ellipse cx="52" cy="52" rx="9" ry="7" fill="#F48430" />
      <path d="M52 45V42" stroke="#66A850" strokeWidth="3" />

      {/* Pumpkin eyes */}
      <path
        d="M47 50L49 47L51 50ZM53 50L55 47L57 50Z"
        fill="#251528"
      />
    </svg>
  );
}
