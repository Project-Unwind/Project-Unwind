
import { Link } from "react-router-dom";
import LandingSettings from "../../../components/landing/LandingSettings";

import "../LandingPage.css";
import "./HalloweenLandingPage.css";

function HalloweenLandingPage() {
  return (
    <div className="halloween-page">
      <header className="halloween-navbar">
        <Link to="/" className="halloween-logo">
          🎃 Unwind
        </Link>

        <nav aria-label="Halloween navigation">
          <a href="#haunted-features">Explore</a>
          <a href="#haunted-about">Our Story</a>
        </nav>

        <div className="halloween-navbar-actions">
  <LandingSettings />

  <Link to="/login" className="halloween-login">
    Enter Unwind
  </Link>
</div>
      </header>

      <main>
        <section className="halloween-hero">
          <div className="halloween-scene" aria-hidden="true">
            {/* Moon, mansion, bats, pumpkins and fog
                will be added here as SVG components. */}
          </div>

          <div className="halloween-hero-content">
            <p className="halloween-eyebrow">
              UNWIND PRESENTS
            </p>

            <h1>
              Welcome to the
              <span> Haunted Side of Unwind</span>
            </h1>

            <p>
              Where shadows dance, pumpkins glow,
              and even ghosts find a little peace.
            </p>

            <a href="#haunted-features">
              Explore the Mansion
            </a>
          </div>
        </section>

        <section
          id="haunted-features"
          className="halloween-features"
        >
          <h2>Every Room Has a Story</h2>
          {/* Haunted feature cards will go here. */}
        </section>

        <section
          id="haunted-about"
          className="halloween-about"
        >
          <h2>A Little Spooky. A Little Soothing.</h2>
          {/* Halloween experience section. */}
        </section>
      </main>

      <footer className="halloween-footer">
        <p>Even ghosts need a little peace. 🎃</p>
      </footer>
    </div>
  );
}

export default HalloweenLandingPage;
