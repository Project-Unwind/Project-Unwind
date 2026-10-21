
import { useTheme } from "../../context/ThemeContext";
import HalloweenGhost from "./HalloweenGhost";
import HalloweenPumpkin from "./HalloweenPumpkin";
import HalloweenBatCute from "./Halloweenowlcute";

import spiderwebCorner from "../../pages/Landing/Halloween/assets/spiderweb-corner.svg";

import "./HalloweenDashboardCorners.css";

function HalloweenDashboardCorners() {
  const { halloweenMode } = useTheme();

  if (!halloweenMode) return null;

  return (
    <div
      className="halloween-dashboard-corners"
      aria-hidden="true"
    >
      {/* TOP LEFT — GREY COBWEB */}
      <div className="hw-corner hw-corner--top-left">
        <img
          src={spiderwebCorner}
          alt=""
          className="hw-corner__web"
          draggable="false"
        />
      </div>

      {/* TOP RIGHT — FLOATING WHITE GHOST */}
      <div className="hw-corner hw-corner--top-right">
        <HalloweenGhost
          className="hw-corner__ghost"
          size={72}
        />
      </div>

      {/* BOTTOM LEFT — ANIMATED PUMPKIN */}
      <div className="hw-corner hw-corner--bottom-left">
        <HalloweenPumpkin
          className="hw-corner__pumpkin"
          size={72}
        />
      </div>

      {/* BOTTOM RIGHT — CUTE BAT */}
<div className="hw-corner hw-corner--bottom-right">
  <HalloweenBatCute
    className="hw-corner__bat"
    size={85}
  />
</div>
</div>
  );
}

export default HalloweenDashboardCorners;
