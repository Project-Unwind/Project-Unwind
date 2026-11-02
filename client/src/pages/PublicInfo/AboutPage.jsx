
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Code2,
  Palette,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  BookHeart,
  Activity,
  MessageCircleHeart,
  LockKeyhole,
  Compass,
  CheckCircle2,
  CalendarDays,
  Rocket,
  Users,
  Heart,
  Mail
} from "lucide-react";

import UnwindLogo from "../../components/common/UnwindLogo";
import "./AboutPage.css";

const founders = [
  {
    id: "harshita",
    name: "Harshita",
    role: "Founder",
    education: "M.Sc. Clinical Psychology",
    institution: "Nanavati Maniben College",
    category: "PSYCHOLOGY & WELLNESS",
    description:
      "Bringing a psychology-informed perspective to the way Unwind approaches emotional wellbeing, supportive experiences, and responsible mental wellness.",
    responsibilities: [
      "Wellness direction",
      "Psychology-informed insights",
      "Human-centred support",
      "Responsible wellness practices"
    ],
    photo: null,
    icon: Brain
  },
  {
    id: "atharva",
    name: "Atharva Padwal",
    role: "Co-Founder & Full-Stack Developer",
    education: "B.E. Information Technology",
    institution: "Atharva College of Engineering, Mumbai",
    category: "ENGINEERING & TECHNOLOGY",
    description:
      "Building the technical foundation of Unwind, from frontend experiences and backend architecture to secure authentication, databases, deployment, and system reliability.",
    responsibilities: [
      "Full-stack development",
      "System architecture",
      "Security and authentication",
      "Cloud infrastructure"
    ],
    photo: null,
    icon: Code2
  },
  {
    id: "parth",
    name: "Parth",
    role: "Co-Founder, Designer & Analyst",
    education: "B.E. Information Technology",
    institution: "Atharva College of Engineering, Mumbai",
    category: "DESIGN & ANALYSIS",
    description:
      "Shaping Unwind's digital experience through user-centred design, product analysis, frontend contributions, and experimentation with AI-assisted wellness support.",
    responsibilities: [
      "UI/UX design",
      "Product analysis",
      "Frontend design",
      "AI Companion development"
    ],
    photo: null,
    icon: Palette
  }
];

const timeline = [
  {
    phase: "01",
    date: "THE BEGINNING",
    title: "A shared vision takes shape",
    description:
      "Unwind began with a shared interest in building a calmer digital space where emotional expression, self-reflection, and supportive connections could coexist.",
    icon: Sparkles
  },
  {
    phase: "02",
    date: "DESIGN & DEVELOPMENT",
    title: "Three perspectives become one platform",
    description:
      "Psychology-informed thinking, software engineering, and design were brought together to shape the platform's foundations and its user experience.",
    icon: Code2
  },
  {
    phase: "03",
    date: "BUILDING THE FOUNDATION",
    title: "From ideas to working features",
    description:
      "The team developed private journaling, wellness tracking, DASS-21 self-assessment, AI-assisted conversations, community features, and account protection.",
    icon: ShieldCheck
  },
  {
    phase: "04",
    date: "SEPTEMBER 2026",
    title: "Unwind goes live",
    description:
      "The working web platform was launched, turning the team's collaborative development into an accessible digital experience.",
    icon: Rocket
  },
  {
    phase: "05",
    date: "EARLY TESTING",
    title: "Listening, learning, improving",
    description:
      "More than 30 early testers, including technical and general users, helped identify improvements in usability, functionality, and reliability.",
    icon: Users
  },
  {
    phase: "06",
    date: "OCTOBER 2026",
    title: "An early milestone",
    description:
      "Project Unwind placed third among approximately 20 teams at a college hackathon, marking an encouraging milestone in its journey.",
    icon: Heart
  },
  {
    phase: "07",
    date: "THE JOURNEY CONTINUES",
    title: "Building what comes next",
    description:
      "The team continues exploring stronger AI capabilities, accessible wellness experiences, future mobile applications, and institutional collaboration.",
    icon: Compass
  }
];

const disciplines = [
  {
    number: "01",
    icon: Brain,
    title: "Psychology",
    description:
      "Understanding emotional wellbeing and guiding responsible, human-centred experiences.",
    person: "Harshita"
  },
  {
    number: "02",
    icon: Code2,
    title: "Engineering",
    description:
      "Turning ideas into secure, functional, maintainable, and accessible technology.",
    person: "Atharva"
  },
  {
    number: "03",
    icon: Palette,
    title: "Design & Analysis",
    description:
      "Making the platform intuitive, visually thoughtful, and grounded in user needs.",
    person: "Parth"
  }
];

const features = [
  {
    icon: BookHeart,
    title: "Private Journaling",
    description: "A personal space for reflection and expression."
  },
  {
    icon: Activity,
    title: "Wellness Trackers",
    description: "Tools to understand everyday wellness patterns."
  },
  {
    icon: Brain,
    title: "DASS-21",
    description: "A self-assessment tool for personal awareness."
  },
  {
    icon: Sparkles,
    title: "AI Companion",
    description: "AI-assisted conversations for supportive reflection."
  },
  {
    icon: MessageCircleHeart,
    title: "Community",
    description: "Spaces for respectful and supportive connection."
  },
  {
    icon: LockKeyhole,
    title: "Privacy Controls",
    description: "Features designed to protect personal information."
  }
];

const values = [
  {
    icon: ShieldCheck,
    title: "Privacy",
    description: "Personal information deserves meaningful protection."
  },
  {
    icon: HeartHandshake,
    title: "Empathy",
    description: "Support should begin with understanding, not judgement."
  },
  {
    icon: Compass,
    title: "Accessibility",
    description: "Wellness tools should be approachable and understandable."
  },
  {
    icon: Sparkles,
    title: "Responsible AI",
    description: "Technology should support people without replacing professional care."
  }
];

const future = [
  "Expanded AI-assisted experiences",
  "Professional session-booking options",
  "Mobile applications",
  "Institutional and community collaborations"
];

function FounderSilhouette({ variant = "atharva" }) {
  return (
    <svg
      className={`about-silhouette about-silhouette--${variant}`}
      viewBox="0 0 320 350"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`figure-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--portrait-highlight)" />
          <stop offset="100%" stopColor="var(--portrait-shadow)" />
        </linearGradient>
        <linearGradient id={`fade-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </linearGradient>
      </defs>

      <circle
        cx="160"
        cy="158"
        r="128"
        className="about-silhouette__halo"
      />
      <circle
        cx="160"
        cy="158"
        r="106"
        className="about-silhouette__halo about-silhouette__halo--inner"
      />

      {variant === "harshita" ? (
        <>
          <path
            d="M116 134 C100 76 121 40 164 40 C210 40 226 84 210 141 L222 241 L103 241 Z"
            fill={`url(#figure-${variant})`}
          />
          <ellipse cx="160" cy="128" rx="46" ry="62" fill="var(--portrait-highlight)" />
          <path
            d="M115 122 C112 61 138 47 163 47 C197 47 214 72 208 124 C194 109 184 91 179 77 C165 101 144 110 115 122 Z"
            fill="var(--portrait-shadow)"
          />
          <path
            d="M143 176 L143 215 L176 215 L177 176"
            fill="var(--portrait-highlight)"
          />
          <path
            d="M63 350 C65 264 96 214 140 202 L160 224 L183 202 C228 216 257 267 261 350 Z"
            fill={`url(#figure-${variant})`}
          />
          <path
            d="M140 202 L160 226 L183 202"
            fill="none"
            stroke="var(--portrait-outline)"
            strokeWidth="3"
          />
        </>
      ) : (
        <>
          <path
            d={
              variant === "atharva"
                ? "M116 117 C106 72 126 51 162 48 C202 45 219 77 208 120 L196 94 L166 85 L129 98 Z"
                : "M113 115 C110 70 138 50 172 53 C207 56 218 85 205 121 L191 95 C168 104 142 96 124 109 Z"
            }
            fill="var(--portrait-shadow)"
          />
          <ellipse
            cx="160"
            cy="134"
            rx="45"
            ry="59"
            fill={`url(#figure-${variant})`}
          />
          <path
            d="M138 178 L138 213 L183 213 L183 177"
            fill="var(--portrait-highlight)"
          />
          <path
            d="M50 350 C55 269 89 222 137 208 L160 232 L184 208 C231 222 268 273 272 350 Z"
            fill={`url(#figure-${variant})`}
          />
          <path
            d="M137 208 L160 233 L184 208"
            stroke="var(--portrait-outline)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M150 229 L160 248 L170 229 L180 350 L140 350 Z"
            fill="var(--portrait-shadow)"
            opacity="0.4"
          />
        </>
      )}
    </svg>
  );
}

function Portrait({ founder }) {
  return (
    <div className={`about-portrait about-portrait--${founder.id}`}>
      <div className="about-portrait__aura" />
      <div className="about-portrait__frame">
        {founder.photo ? (
          <img src={founder.photo} alt={founder.name} loading="lazy" />
        ) : (
          <FounderSilhouette variant={founder.id} />
        )}
      </div>
      <span className="about-portrait__number">
        {founders.findIndex((f) => f.id === founder.id) + 1 < 10
          ? `0${founders.findIndex((f) => f.id === founder.id) + 1}`
          : founders.findIndex((f) => f.id === founder.id) + 1}
      </span>
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <Reveal
      className={`about-section-heading ${
        centered ? "about-section-heading--center" : ""
      }`}
    >
      <span className="about-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </Reveal>
  );
}

export default function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const previousTitle = document.title;
    const title = "About Us | Project Unwind";
    const description =
      "Meet Harshita, Atharva Padwal and Parth, the founding team behind Project Unwind. Discover our story, mission, and privacy-first mental wellness platform.";

    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    const createdMeta = !meta;

    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }

    const previousDescription = meta.getAttribute("content");
    meta.setAttribute("content", description);

    let canonical = document.querySelector('link[rel="canonical"]');
    const createdCanonical = !canonical;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    const previousCanonical = canonical.getAttribute("href");
    canonical.setAttribute(
      "href",
      "https://project-unwind-mu.vercel.app/info/about"
    );

    return () => {
      document.title = previousTitle;

      if (createdMeta) {
        meta.remove();
      } else if (previousDescription !== null) {
        meta.setAttribute("content", previousDescription);
      } else {
        meta.removeAttribute("content");
      }

      if (createdCanonical) {
        canonical.remove();
      } else if (previousCanonical !== null) {
        canonical.setAttribute("href", previousCanonical);
      } else {
        canonical.removeAttribute("href");
      }
    };
  }, []);

  return (
    <main className="unwind-about">
      {/* NAVIGATION */}
      <nav className="about-nav" aria-label="About page navigation">
        <button
          className="about-nav__back"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <Link to="/" className="about-nav__brand">
          <UnwindLogo variant="symbol" theme="dark" />
          <span>Unwind</span>
        </Link>

        <Link to="/info/contact" className="about-nav__contact">
          Contact <ArrowRight size={16} />
        </Link>
      </nav>

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero__orb about-hero__orb--one" />
        <div className="about-hero__orb about-hero__orb--two" />

        <div className="about-container about-hero__inner">
          <Reveal className="about-hero__copy">
            <span className="about-eyebrow">
              <Sparkles size={15} /> THE STORY BEHIND UNWIND
            </span>

            <h1>
              Three perspectives.
              <span> One shared purpose.</span>
            </h1>

            <p>
              Psychology, engineering, and thoughtful design coming together
              to create a calmer, more human digital space.
            </p>

            <div className="about-hero__actions">
              <a href="#our-team" className="about-btn about-btn--primary">
                Meet our team <ArrowRight size={18} />
              </a>

              <a href="#our-story" className="about-btn about-btn--outline">
                Discover our story
              </a>
            </div>

            <div className="about-hero__footnote">
              <span />
              Built with purpose. Designed for people.
            </div>
          </Reveal>

          <Reveal className="about-hero__art" delay={0.15}>
            <div className="about-hero__art-label">THE PEOPLE BEHIND THE PLATFORM</div>
            <div className="about-hero__portraits">
              {founders.map((founder, index) => (
                <div
                  className={`about-hero__mini-portrait about-hero__mini-portrait--${index}`}
                  key={founder.id}
                >
                  <FounderSilhouette variant={founder.id} />
                  <span>{founder.name}</span>
                </div>
              ))}
            </div>
            <div className="about-hero__art-bottom">
              <span>PSYCHOLOGY</span>
              <span>+</span>
              <span>TECHNOLOGY</span>
              <span>+</span>
              <span>DESIGN</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* OUR BEGINNING */}
      <section className="about-section about-story" id="our-story">
        <div className="about-container about-story__grid">
          <div>
            <SectionHeading
              eyebrow="01 / OUR BEGINNING"
              title="A different kind of digital space."
            />
          </div>

          <Reveal className="about-story__content">
            <p className="about-story__lead">
              The internet connects billions of people. Yet finding a place
              to slow down, reflect, and feel genuinely supported can still
              be difficult.
            </p>

            <p>
              Project Unwind was developed around a simple belief:
              technology should do more than capture attention. It can
              also give people room to understand themselves, express
              their thoughts, and connect through empathy.
            </p>

            <p>
              Three collaborators brought different strengths to that
              vision. Harshita contributed a psychology-informed
              perspective, Atharva developed the platform's technical
              foundation, and Parth shaped its design, analysis, and
              AI-related experiences.
            </p>

            <p>
              Together, these perspectives helped transform an idea
              into a working mental wellness platform.
            </p>

            <div className="about-story__quote">
              <span className="about-story__quote-mark">“</span>
              <p>
                Technology should create room for people,
                not take that room away.
              </p>
              <small>OUR DESIGN PHILOSOPHY</small>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="about-section about-team" id="our-team">
        <div className="about-container">
          <SectionHeading
            eyebrow="02 / THE FOUNDING TEAM"
            title="Meet the people behind Unwind."
            description="Different disciplines, complementary strengths, and a shared commitment to building thoughtfully."
            centered
          />

          <div className="about-team__grid">
            {founders.map((founder, index) => {
              const Icon = founder.icon;

              return (
                <Reveal key={founder.id} delay={index * 0.1}>
                  <article className={`about-founder about-founder--${founder.id}`}>
                    <Portrait founder={founder} />

                    <div className="about-founder__content">
                      <span className="about-founder__category">
                        <Icon size={15} />
                        {founder.category}
                      </span>

                      <h3>{founder.name}</h3>
                      <strong className="about-founder__role">
                        {founder.role}
                      </strong>

                      <div className="about-founder__education">
                        <span>{founder.education}</span>
                        <small>{founder.institution}</small>
                      </div>

                      <p>{founder.description}</p>

                      <div className="about-founder__skills">
                        {founder.responsibilities.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="about-section about-journey" id="our-journey">
        <div className="about-container">
          <SectionHeading
            eyebrow="03 / OUR JOURNEY"
            title="Every meaningful idea has a beginning."
            description="From early conversations to a functioning platform, Unwind continues to grow through collaboration, testing, and learning."
            centered
          />

          <div className="about-timeline">
            {timeline.map((step, index) => {
              const Icon = step.icon;

              return (
                <Reveal
                  key={step.phase}
                  className={`about-timeline__item ${
                    index % 2 ? "about-timeline__item--right" : ""
                  }`}
                >
                  <span className="about-timeline__marker">
                    <Icon size={19} />
                  </span>

                  <article className="about-timeline__card">
                    <div className="about-timeline__meta">
                      <span>{step.date}</span>
                      <span>{step.phase}</span>
                    </div>

                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* THREE DISCIPLINES */}
      <section className="about-section about-disciplines">
        <div className="about-container">
          <SectionHeading
            eyebrow="04 / OUR FOUNDATION"
            title="Three disciplines. One mission."
            description="Every part of Unwind is shaped by the intersection of people, design, and technology."
            centered
          />

          <div className="about-disciplines__grid">
            {disciplines.map((discipline, index) => {
              const Icon = discipline.icon;

              return (
                <Reveal key={discipline.title} delay={index * 0.1}>
                  <article className="about-discipline">
                    <span className="about-discipline__number">
                      {discipline.number}
                    </span>

                    <div className="about-discipline__icon">
                      <Icon size={28} />
                    </div>

                    <h3>{discipline.title}</h3>
                    <p>{discipline.description}</p>

                    <span className="about-discipline__person">
                      {discipline.person}
                    </span>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="about-disciplines__result">
            <span className="about-disciplines__line" />
            <div>
              <Heart size={23} />
              <strong>UNWIND</strong>
              <small>Human-centred mental wellness technology</small>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT WE BUILT */}
      <section className="about-section about-built">
        <div className="about-container">
          <SectionHeading
            eyebrow="05 / THE PLATFORM"
            title="From a shared idea to something real."
            description="A collection of connected tools built around reflection, self-awareness, and supportive interactions."
            centered
          />

          <div className="about-built__grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Reveal key={feature.title} delay={(index % 3) * 0.08}>
                  <article className="about-feature">
                    <span className="about-feature__icon">
                      <Icon size={23} />
                    </span>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="about-built__note">
            <ShieldCheck size={20} />
            <p>
              Unwind supports general wellbeing and self-reflection.
              It does not provide clinical diagnosis or replace
              qualified professional care.
            </p>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-section about-beliefs">
        <div className="about-container">
          <SectionHeading
            eyebrow="06 / WHAT GUIDES US"
            title="The principles we build around."
            centered
          />

          <div className="about-beliefs__grid">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <Reveal key={value.title} delay={index * 0.08}>
                  <article className="about-belief">
                    <Icon size={27} />
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FUTURE */}
      <section className="about-section about-future">
        <div className="about-container about-future__grid">
          <SectionHeading
            eyebrow="07 / THE ROAD AHEAD"
            title="We're only getting started."
            description="Our aim is to keep improving Unwind while exploring new ways to make supportive technology more accessible."
          />

          <Reveal className="about-future__card">
            <div className="about-future__label">
              <CalendarDays size={17} />
              FUTURE DIRECTIONS
            </div>

            {future.map((item) => (
              <div className="about-future__item" key={item}>
                <CheckCircle2 size={19} />
                <span>{item}</span>
              </div>
            ))}

            <small>
              These are planned directions, not promises of
              currently available services.
            </small>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="about-ending">
        <div className="about-container">
          <Reveal className="about-ending__content">
            <div className="about-ending__icon">
              <HeartHandshake size={32} />
            </div>

            <span className="about-eyebrow">THE JOURNEY CONTINUES</span>

            <h2>
              A calmer digital world begins
              <span> with people who care.</span>
            </h2>

            <p>
              Discover what we're building, explore the platform,
              or get in touch with the team behind Unwind.
            </p>

            <div className="about-ending__actions">
              <Link to="/" className="about-btn about-btn--primary">
                Explore Unwind <ArrowRight size={18} />
              </Link>

              <Link
                to="/info/contact"
                className="about-btn about-btn--outline"
              >
                <Mail size={17} /> Contact Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="about-footer">
        <span>© {new Date().getFullYear()} Project Unwind</span>
        <div>
          <Link to="/info/values">Our Values</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>
    </main>
  );
}
