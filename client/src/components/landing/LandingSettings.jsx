import {
  Check,
  Moon,
  Settings,
  Sun,
  X
} from "lucide-react";
import HauntedMansionIcon from "../halloween/HauntedMansionIcon";

import {
  useState
} from "react";

import {
  AnimatePresence,
  motion
} from "framer-motion";

import {
  useTheme
} from "../../context/ThemeContext";

function LandingSettings() {
  const [
    open,
    setOpen
  ] = useState(false);

  const {
  theme,
  setTheme,
  halloweenMode,
  setHalloweenMode
} = useTheme();

  return (
    <div className="landing-settings">
      <button
        type="button"
        className="landing-settings__trigger"
        aria-label="Open appearance settings"
        title="Settings"
        onClick={() =>
          setOpen(true)
        }
      >
        <Settings
          size={18}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close settings"
              className="landing-settings__backdrop"
              onClick={() =>
                setOpen(false)
              }
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
            />

            <motion.aside
              className="landing-settings__panel"
              initial={{
                opacity: 0,
                x: 30,
                scale: 0.97
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1
              }}
              exit={{
                opacity: 0,
                x: 25,
                scale: 0.97
              }}
              transition={{
                duration: 0.22
              }}
            >
              <div className="landing-settings__header">
                <div>
                  <span>
                    Appearance
                  </span>

                  <h2>
                    Settings
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setOpen(false)
                  }
                  aria-label="Close settings"
                >
                  <X
                    size={18}
                  />
                </button>
              </div>

              <p className="landing-settings__description">
                Choose how UNWIND
                looks on this device.
                Your preference is
                remembered when you
                return.
              </p>

              <div className="landing-settings__themes">
                <button
                  type="button"
                  className={
                    theme === "light"
                      ? "landing-theme-option landing-theme-option--active"
                      : "landing-theme-option"
                  }
                  onClick={() => {
  setTheme("light");
  setHalloweenMode(false);
}}
                >
                  <span className="landing-theme-option__icon">
                    <Sun
                      size={19}
                    />
                  </span>

                  <div>
                    <strong>
                      Light
                    </strong>

                    <small>
                      Bright and calm
                    </small>
                  </div>

                  {theme === "light" && !halloweenMode && (
                    <Check
                      size={17}
                    />
                  )}
                </button>

                <button
                  type="button"
                  className={
                    theme === "dark"
                      ? "landing-theme-option landing-theme-option--active"
                      : "landing-theme-option"
                  }
                  onClick={() => {
  setTheme("dark");
  setHalloweenMode(false);
}}
                >
                  <span className="landing-theme-option__icon">
                    <Moon
                      size={19}
                    />
                  </span>

                  <div>
                    <strong>
                      Dark
                    </strong>

                    <small>
                      Lower-light appearance
                    </small>
                  </div>

                  {theme === "dark" && !halloweenMode && (
                    <Check
                      size={17}
                    />
                  )}
                </button>
                <button
  type="button"
  className={
    halloweenMode
      ? "landing-theme-option landing-theme-option--active"
      : "landing-theme-option"
  }
  onClick={() => setHalloweenMode(true)}
>
  <span className="landing-theme-option__icon">
    <HauntedMansionIcon size={28} />
  </span>

  <div>
    <strong>Halloween 🎃</strong>
    <small>Enter the haunted mansion</small>
  </div>

  {halloweenMode && <Check size={17} />}
</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandingSettings;