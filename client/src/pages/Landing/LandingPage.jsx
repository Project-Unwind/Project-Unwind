import Navbar from "../../components/landing/Navbar";
import HeroSection from "../../components/landing/HeroSection";
import StatsSection from "../../components/landing/StatsSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import ExperienceSection from "../../components/landing/ExperienceSection";
import HowItWorksSection from "../../components/landing/HowItWorksSection";
import TestimonialsSection from "../../components/landing/TestimonialsSection";
import CtaSection from "../../components/landing/CtaSection";
import Footer from "../../components/landing/Footer";
import { useTheme } from "../../context/ThemeContext";
import HalloweenAnnouncement from "../../components/halloween/HalloweenAnnouncement";

import "./LandingPage.css";
import "./Halloween/HalloweenTheme.css";

function LandingPage() {
  const { halloweenMode } = useTheme();

  return (
    <div
  className={`landing-page ${
    halloweenMode ? "landing-halloween" : ""
  }`}
>
     <Navbar />

<HalloweenAnnouncement
  onTryNow={() => {
    window.dispatchEvent(
      new Event("unwind:open-appearance")
    );
  }}
/>

<main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ExperienceSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;