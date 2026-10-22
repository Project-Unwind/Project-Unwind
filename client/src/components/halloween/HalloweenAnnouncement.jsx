
import { useState } from "react";
import { Ghost, X } from "lucide-react";

import "./HalloweenAnnouncement.css";

const STORAGE_KEY = "unwind_halloween_announcement_2026";

function HalloweenAnnouncement({ onTryNow }) {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "dismissed";
    } catch {
      return true;
    }
  });

  // Cross: hide temporarily (no localStorage update).
  const closeTemporarily = () => {
    setVisible(false);
  };

  // Got it: permanent dismissal on this browser.
  const dismissPermanently = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // Storage may be unavailable.
    }

    setVisible(false);
  };

  // Try Now: dismiss and open landing settings.
  const handleTryNow = () => {
    dismissPermanently();
    onTryNow?.();
  };

  if (!visible) return null;

  return (
    <aside
      className="halloween-announcement"
      aria-label="Halloween announcement"
    >
      <div className="halloween-announcement__header">
        <Ghost size={20} aria-hidden="true" />

        <strong>Halloween is here! 🎃</strong>

        <button
          type="button"
          className="halloween-announcement__close"
          onClick={closeTemporarily}
          aria-label="Close Halloween announcement"
        >
          <X size={16} />
        </button>
      </div>

      <p>
        A spooky new look has arrived at UNWIND.
        Try our Halloween theme!
      </p>

      <div className="halloween-announcement__actions">
        <button
          type="button"
          className="halloween-announcement__dismiss"
          onClick={dismissPermanently}
        >
          Got it
        </button>

        <button
          type="button"
          className="halloween-announcement__try"
          onClick={handleTryNow}
        >
          🎃 Try Now
        </button>
      </div>
    </aside>
  );
}

export default HalloweenAnnouncement;
