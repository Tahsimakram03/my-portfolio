import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Download,
  ArrowUpRight,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import {
  SiSelenium,
  SiCucumber,
  SiJira,
  SiOpenjdk,
  SiPython,
  SiJavascript,
  SiReact,
  SiVite,
  SiTailwindcss,
  SiGit,
  SiGithubactions,
  SiApachemaven,
  SiMysql,
  SiHtml5,
  SiHuggingface,
} from "react-icons/si";

/**
 * Drop-in replacement for App.jsx.
 * Requires: react, lucide-react, react-icons, Tailwind CSS (JIT / v3+, so
 * arbitrary values like bg-[#0F1417] resolve at build time).
 * Run: npm install react-icons
 *
 * Fonts: this file self-loads Space Grotesk / Inter / JetBrains Mono via
 * @import. For best performance, move that import into your index.html
 * <head> as a <link> instead — see the GLOBAL_STYLES block below.
 */

// Maps a skill / tech label to its brand logo. Falls back to a plain
// checkmark for things that don't have one (STLC, REST APIs, OOP —
// practices and concepts rather than named tools/products).
const TECH_ICONS = [
  [/selenium/i, SiSelenium],
  [/cucumber|gherkin|bdd/i, SiCucumber],
  [/jira/i, SiJira],
  [/^java$/i, SiOpenjdk],
  [/python/i, SiPython],
  [/javascript/i, SiJavascript],
  [/react/i, SiReact],
  [/vite/i, SiVite],
  [/tailwind/i, SiTailwindcss],
  [/git(?!hub)/i, SiGit],
  [/github actions/i, SiGithubactions],
  [/maven/i, SiApachemaven],
  [/mysql|sql/i, SiMysql],
  [/html/i, SiHtml5],
  [/hugging ?face/i, SiHuggingface],
];

const resolveIcon = (label) => {
  const match = TECH_ICONS.find(([pattern]) => pattern.test(label));
  return match ? match[1] : null;
};

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
// Color   bg canvas #0F1417 · bg raised #12181C · hairline #212A2F
//         ink primary #E9EEEF · ink muted #8B9AA1 · accent (pass) #4FD1A5
//         accent (in-progress) #E8B24C
// Type    display/body: "Space Grotesk" — headlines & UI
//         body copy: "Inter"
//         data / status / meta: "JetBrains Mono"
// Motif   Everything reads like a test result: a name, a status, evidence.
//         Motion follows the same idea — a single hero entrance "run",
//         section reveals that feel like results resolving into view, and
//         a rotating status line in the hero, rather than scattered
//         hover bounces on every element.
// ---------------------------------------------------------------------------

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

  .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
  .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
  .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

  html { scroll-behavior: smooth; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseRing {
    0% { box-shadow: 0 0 0 0 rgba(79, 209, 165, 0.45); }
    100% { box-shadow: 0 0 0 8px rgba(79, 209, 165, 0); }
  }
  @keyframes blinkCursor {
    0%, 45% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  .hero-in { opacity: 0; animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

  .reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
  .reveal.is-visible { opacity: 1; transform: translateY(0); }

  .status-dot { animation: pulseRing 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .type-cursor { animation: blinkCursor 1s steps(1) infinite; }

  .nav-link { position: relative; }
  .nav-link::after {
    content: ""; position: absolute; left: 0; right: 0; bottom: -4px; height: 1px;
    background: #4FD1A5; transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .nav-link:hover::after, .nav-link.is-active::after { transform: scaleX(1); }

  .spot-card { position: relative; overflow: hidden; }
  .spot-card::before {
    content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0;
    background: radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(79, 209, 165, 0.10), transparent 65%);
    transition: opacity 0.4s ease;
  }
  .spot-card:hover::before { opacity: 1; }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .hero-in, .reveal { opacity: 1 !important; transform: none !important; animation: none !important; }
    .status-dot, .type-cursor { animation: none !important; }
    * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
  }

  ::selection { background-color: #4FD1A5; color: #0F1417; }

  .focus-ring:focus-visible {
    outline: 2px solid #4FD1A5;
    outline-offset: 3px;
    border-radius: 2px;
  }
`;

// ---------------------------------------------------------------------------
// Motion helpers
// ---------------------------------------------------------------------------

/** Wraps children and adds `.is-visible` once scrolled into view. */
const Reveal = ({ children, delay = 0, className = "", as: Tag = "div" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
};

/** Counts a number up from 0 once scrolled into view. */
const CountUp = ({ to, duration = 1100, suffix = "" }) => {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(eased * to));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
};

/** Typewriter-style rotating status line for the hero. */
const RotatingLine = ({ words, typeSpeed = 55, deleteSpeed = 30, pause = 1400 }) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    let timeout;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setWordIndex((i) => i + 1);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, typeSpeed, deleteSpeed, pause]);

  return (
    <span className="font-mono text-[13px] text-[#4FD1A5]">
      {text}
      <span className="type-cursor">|</span>
    </span>
  );
};

// ---------------------------------------------------------------------------
// Small shared pieces
// ---------------------------------------------------------------------------

const StatusChip = ({ label = "PASS", tone = "pass" }) => {
  const color = tone === "pass" ? "#4FD1A5" : "#E8B24C";
  return (
    <span className="font-mono inline-flex items-center gap-2 text-[11px] tracking-wide" style={{ color }}>
      <span className="status-dot inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
};

const SectionHeading = ({ suite, title }) => (
  <Reveal className="mb-10">
    <p className="font-mono text-[11px] text-[#8B9AA1] mb-2">{suite}</p>
    <h2 className="font-display text-3xl md:text-[2.5rem] font-medium text-[#E9EEEF]">{title}</h2>
  </Reveal>
);

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const sectionIds = ["home", "about", "experience", "projects", "achievements", "contact"];

  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + window.innerHeight * 0.35;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { id: "home", name: "Home" },
    { id: "about", name: "About" },
    { id: "experience", name: "Experience" },
    { id: "projects", name: "Projects" },
    { id: "achievements", name: "Achievements" },
    { id: "contact", name: "Contact" },
  ];

  return (
    <div className="bg-[#0F1417] text-[#E9EEEF] font-body min-h-screen">
      <style>{GLOBAL_STYLES}</style>
      <Header navLinks={navLinks} activeSection={activeSection} />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <AchievementsSection />
        <ContactSection />
      </main>
      <Footer navLinks={navLinks} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

const Header = ({ navLinks, activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F1417]/90 backdrop-blur-sm border-b border-[#212A2F]">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => scrollToSection("home")} className="font-mono text-sm text-[#E9EEEF] focus-ring">
          tahsim<span className="text-[#4FD1A5]">.</span>akram
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`nav-link font-body text-sm pb-1 transition-colors focus-ring ${
                activeSection === link.id ? "text-[#E9EEEF] is-active" : "text-[#8B9AA1] hover:text-[#E9EEEF]"
              }`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        <button className="md:hidden text-[#E9EEEF] focus-ring" onClick={() => setIsMenuOpen((v) => !v)} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden border-t border-[#212A2F] bg-[#0F1417] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`text-left font-body text-base focus-ring ${activeSection === link.id ? "text-[#4FD1A5]" : "text-[#8B9AA1]"}`}
            >
              {link.name}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

const HeroSection = () => {
  const heroRef = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 30 });

  const handleMouseMove = useCallback((e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const tags = ["Quality Engineer", "Full-Stack Builder", "Dubai, UAE"];

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 hidden md:block transition-[background] duration-300"
        style={{
          background: `radial-gradient(480px circle at ${pos.x}% ${pos.y}%, rgba(79, 209, 165, 0.06), transparent 60%)`,
        }}
      />

      <div className="hero-in" style={{ animationDelay: "0ms" }}>
        <StatusChip label="AVAILABLE IMMEDIATELY" tone="pass" />
      </div>

      <h1
        className="hero-in font-display text-[2.5rem] leading-[1.1] md:text-6xl md:leading-[1.08] font-medium mt-6 mb-6 max-w-3xl"
        style={{ animationDelay: "80ms" }}
      >
        I build software, then I make sure it actually works.
      </h1>

      <div className="hero-in mb-6 h-5" style={{ animationDelay: "160ms" }}>
        <RotatingLine words={["Quality Engineer.", "Automation Enthusiast.", "Full-Stack Builder."]} />
      </div>

      <p className="hero-in font-body text-lg text-[#8B9AA1] max-w-xl mb-8 leading-relaxed" style={{ animationDelay: "220ms" }}>
        Quality Engineer with hands-on experience across STLC, Selenium/TestNG automation and BDD test design — with a builder's habit of shipping full-stack React projects on the side.
      </p>

      <div className="hero-in flex flex-wrap gap-2 mb-10" style={{ animationDelay: "300ms" }}>
        {tags.map((t) => (
          <span key={t} className="font-mono text-[11px] text-[#8B9AA1] border border-[#212A2F] rounded px-2.5 py-1">
            {t}
          </span>
        ))}
      </div>

      <div className="hero-in flex flex-wrap items-center gap-4 mb-12" style={{ animationDelay: "380ms" }}>
        <button
          onClick={() => scrollToSection("projects")}
          className="bg-[#4FD1A5] text-[#0F1417] font-body font-medium text-sm px-6 py-3 rounded hover:bg-[#3fc394] hover:-translate-y-0.5 transition-all focus-ring"
        >
          View projects
        </button>
        <a
          href="https://drive.google.com/uc?export=download&id=176VLT5FGoe1JLzRF-CPLEaFD89hvHpZ3"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[#212A2F] text-[#E9EEEF] font-body text-sm px-6 py-3 rounded hover:border-[#4FD1A5] hover:-translate-y-0.5 transition-all focus-ring"
        >
          <Download size={16} /> Resume
        </a>
      </div>

      <div className="hero-in flex flex-wrap gap-x-6 gap-y-2 font-mono text-[13px] text-[#8B9AA1]" style={{ animationDelay: "460ms" }}>
        <a href="mailto:tahsimakram03@gmail.com" className="inline-flex items-center gap-2 hover:text-[#E9EEEF] transition-colors focus-ring">
          <Mail size={14} /> tahsimakram03@gmail.com
        </a>
        <a href="tel:+971541884927" className="inline-flex items-center gap-2 hover:text-[#E9EEEF] transition-colors focus-ring">
          <Phone size={14} /> +971 54 188 4927
        </a>
        <span className="inline-flex items-center gap-2">
          <MapPin size={14} /> Dubai, UAE
        </span>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// About + skill matrix
// ---------------------------------------------------------------------------

const AboutSection = () => {
  const skillGroups = [
    { label: "QA & Testing", items: ["Selenium WebDriver", "TestNG", "BDD Cucumber / Gherkin", "STLC", "JIRA"] },
    { label: "Languages", items: ["Java", "Python", "JavaScript (ES6+)", "SQL", "HTML5 / CSS3"] },
    { label: "Frontend", items: ["React", "Vite", "Tailwind CSS", "REST APIs"] },
    { label: "DevOps & Tools", items: ["Git", "GitHub Actions", "Maven", "MySQL"] },
  ];

  return (
    <section id="about" className="border-t border-[#212A2F] bg-[#12181C]">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <SectionHeading suite="about.spec" title="About" />

        <div className="grid md:grid-cols-5 gap-12">
          <Reveal className="md:col-span-2 font-body text-[#C4CCCF] leading-relaxed space-y-4">
            <p>
              I'm a B.Tech Information Technology graduate from Haldia Institute of Technology (2022–2026, CGPA 7.55). Earlier this year I worked as a Quality Engineer at Cognizant, where test case design and Selenium automation became second nature.
            </p>
            <p>
              That experience sits alongside a builder's habit: shipping small full-stack products in my own time. I like the two halves — one keeps me precise, the other keeps me building — and I'm now looking for a role that uses both.
            </p>
          </Reveal>

          <Reveal delay={120} className="md:col-span-3">
            <p className="font-mono text-[11px] text-[#8B9AA1] mb-4">coverage report</p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {skillGroups.map((group, i) => (
                <Reveal as="div" delay={140 + i * 60} key={group.label}>
                  <h3 className="font-display text-sm font-medium text-[#E9EEEF] mb-3">{group.label}</h3>
                  <ul className="space-y-2">
                    {group.items.map((item) => {
                      const Icon = resolveIcon(item);
                      return (
                        <li key={item} className="group flex items-center gap-2.5 font-body text-sm text-[#8B9AA1]">
                          {Icon ? (
                            <Icon size={14} className="text-[#8B9AA1] group-hover:text-[#4FD1A5] transition-colors shrink-0" />
                          ) : (
                            <CheckCircle2 size={14} className="text-[#4FD1A5] shrink-0" />
                          )}
                          <span className="group-hover:text-[#C4CCCF] transition-colors">{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

const ExperienceSection = () => (
  <section id="experience" className="border-t border-[#212A2F]">
    <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
      <SectionHeading suite="experience.spec" title="Experience" />

      <Reveal className="border-l border-[#212A2F] pl-6 md:pl-8">
        <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-xl font-medium text-[#E9EEEF]">Quality Engineer & Assurance</h3>
          <span className="font-mono text-[12px] text-[#8B9AA1]">Programmer Analyst Trainee</span>
        </div>
        <p className="font-mono text-[12px] text-[#8B9AA1] mb-5">Cognizant · Chennai, India · Jan 2026 – May 2026</p>
        <ul className="space-y-3 font-body text-[#C4CCCF] text-[15px] leading-relaxed">
          <li className="flex gap-3">
            <span className="text-[#4FD1A5] mt-1.5">–</span>
            Practiced enterprise STLC: requirements gathering (BRD/FRS), test case design, defect management and Agile regression testing.
          </li>
          <li className="flex gap-3">
            <span className="text-[#4FD1A5] mt-1.5">–</span>
            Built scalable Selenium WebDriver scripts with TestNG and Maven, applying Page Object Model and BDD Cucumber.
          </li>
          <li className="flex gap-3">
            <span className="text-[#4FD1A5] mt-1.5">–</span>
            Collaborated with cross-functional teams to debug complex defects, contributing to root-cause analysis and UAT sign-off.
          </li>
        </ul>
      </Reveal>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

const ProjectsSection = () => {
  const featured = [
    {
      title: "Chef Claude — AI Recipe Generator",
      description:
        "AI-powered recipe app integrating the Hugging Face API with targeted prompt engineering for personalized output, built on a responsive React frontend with automated CI/CD via GitHub Actions and resilient async error handling.",
      technologies: ["React", "Vite", "Hugging Face API", "GitHub Actions"],
      repoLink: "https://github.com/Tahsimakram03/AI-Recipe-Generator",
      liveLink: "https://tahsimakram03.github.io/Chef-Claude/",
      year: "2024",
    },
    {
      title: "Searching & Sorting Visualizer",
      description:
        "Interactive visualizer animating 10+ core algorithms in real time, mapping each execution step to its corresponding time and space complexity so the underlying behavior is visible, not just the result.",
      technologies: ["JavaScript", "OOP", "HTML/CSS"],
      repoLink: "https://github.com/Tahsimakram03/Sorting-visualizer",
      liveLink: "https://tahsimakram03.github.io/searching-sorting-visualizer/",
      year: "2023",
    },
  ];

  const other = [
    { title: "Currency Converter", stack: ["HTML", "CSS", "JavaScript"], link: "https://github.com/Tahsimakram03/Currency-Converter" },
    { title: "Car Rental System", stack: ["Java", "OOP"], link: "https://github.com/Tahsimakram03/Car-Rental-System" },
    { title: "This Portfolio", stack: ["React", "Tailwind CSS"], link: "https://github.com/Tahsimakram03" },
  ];

  return (
    <section id="projects" className="border-t border-[#212A2F] bg-[#12181C]">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <SectionHeading suite="projects.spec" title="Projects" />

        <div className="grid md:grid-cols-2 gap-6 mb-14">
          {featured.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <ProjectCard {...p} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="font-mono text-[11px] text-[#8B9AA1] mb-4">other builds</p>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-4">
          {other.map((p, i) => (
            <Reveal key={p.title} delay={240 + i * 80}>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="spot-card group block border border-[#212A2F] rounded p-4 hover:border-[#4FD1A5] transition-colors focus-ring"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
                  e.currentTarget.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-display text-sm font-medium text-[#E9EEEF]">{p.title}</h4>
                  <ArrowUpRight size={14} className="text-[#8B9AA1] group-hover:text-[#4FD1A5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
                <div className="flex items-center gap-2.5">
                  {p.stack.map((tech) => {
                    const Icon = resolveIcon(tech);
                    return Icon ? (
                      <Icon key={tech} size={13} className="text-[#8B9AA1] group-hover:text-[#4FD1A5] transition-colors" title={tech} />
                    ) : (
                      <span key={tech} className="font-mono text-[10px] text-[#8B9AA1]">
                        {tech}
                      </span>
                    );
                  })}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ title, description, technologies, repoLink, liveLink, year }) => (
  <div
    className="spot-card border border-[#212A2F] rounded p-6 flex flex-col h-full hover:border-[#4FD1A5]/60 hover:-translate-y-1 transition-all duration-300"
    onMouseMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      e.currentTarget.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    }}
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <h3 className="font-display text-xl font-medium text-[#E9EEEF]">{title}</h3>
      <span className="font-mono text-[11px] text-[#8B9AA1] shrink-0 mt-1">{year}</span>
    </div>
    <p className="font-body text-sm text-[#8B9AA1] leading-relaxed mb-5 flex-grow">{description}</p>
    <div className="flex flex-wrap gap-2 mb-5">
      {technologies.map((tech) => {
        const Icon = resolveIcon(tech);
        return (
          <span key={tech} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#8B9AA1] border border-[#212A2F] rounded px-2 py-0.5">
            {Icon && <Icon size={11} />}
            {tech}
          </span>
        );
      })}
    </div>
    <div className="flex gap-5 pt-4 border-t border-[#212A2F] font-body text-sm">
      {liveLink && (
        <a href={liveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#E9EEEF] hover:text-[#4FD1A5] transition-colors focus-ring">
          <ExternalLink size={15} /> Live demo
        </a>
      )}
      <a href={repoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#8B9AA1] hover:text-[#4FD1A5] transition-colors focus-ring">
        <Github size={15} /> Source
      </a>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

const AchievementsSection = () => (
  <section id="achievements" className="border-t border-[#212A2F]">
    <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
      <SectionHeading suite="achievements.spec" title="Competitive programming" />

      <div className="grid sm:grid-cols-[auto,1fr] gap-x-12 gap-y-8 items-start">
        <Reveal>
          <p className="font-display text-6xl font-medium text-[#4FD1A5]">
            <CountUp to={300} suffix="+" />
          </p>
          <p className="font-mono text-[11px] text-[#8B9AA1] mt-2">problems solved</p>
        </Reveal>
        <Reveal delay={120} className="font-body text-[#C4CCCF] leading-relaxed space-y-3 max-w-xl">
          <p>
            Modeled and solved 300+ algorithmic problems across{" "}
            <a
              href="https://tinyurl.com/TahsimLeetcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E9EEEF] underline decoration-[#212A2F] underline-offset-4 hover:decoration-[#4FD1A5] transition-colors focus-ring"
            >
              LeetCode
            </a>{" "}
            and GeeksforGeeks since 2023, consistently optimizing for both time and space complexity.
          </p>
          <p className="text-sm text-[#8B9AA1]">2023 — Present</p>
        </Reveal>
      </div>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

const ContactSection = () => (
  <section id="contact" className="border-t border-[#212A2F] bg-[#12181C]">
    <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
      <SectionHeading suite="contact.spec" title="Get in touch" />

      <Reveal className="font-body text-[#8B9AA1] max-w-xl mb-10 leading-relaxed">
        <p>
          I'm looking for Quality Engineering and full-stack roles in the UAE and open to remote opportunities elsewhere. Immediate joiner — my inbox is always open.
        </p>
      </Reveal>

      <Reveal delay={100} className="flex flex-col gap-4">
        <a href="mailto:tahsimakram03@gmail.com" className="group inline-flex items-center gap-3 font-body text-lg text-[#E9EEEF] hover:text-[#4FD1A5] transition-colors focus-ring w-fit">
          <Mail size={20} className="text-[#4FD1A5] group-hover:scale-110 transition-transform" /> tahsimakram03@gmail.com
        </a>
        <a href="https://linkedin.com/in/tahsim-akram-03/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 font-body text-lg text-[#E9EEEF] hover:text-[#4FD1A5] transition-colors focus-ring w-fit">
          <Linkedin size={20} className="text-[#4FD1A5] group-hover:scale-110 transition-transform" /> linkedin.com/in/tahsim-akram-03
        </a>
        <a href="https://github.com/Tahsimakram03" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 font-body text-lg text-[#E9EEEF] hover:text-[#4FD1A5] transition-colors focus-ring w-fit">
          <Github size={20} className="text-[#4FD1A5] group-hover:scale-110 transition-transform" /> github.com/Tahsimakram03
        </a>
      </Reveal>
    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

const Footer = ({ navLinks }) => {
  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="border-t border-[#212A2F]">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-mono text-[11px] text-[#8B9AA1]">© 2026 Tahsim Akram</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {navLinks.map((link) => (
            <button key={link.id} onClick={() => scrollToSection(link.id)} className="font-body text-sm text-[#8B9AA1] hover:text-[#E9EEEF] transition-colors focus-ring">
              {link.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <a href="https://linkedin.com/in/tahsim-akram03/" target="_blank" rel="noopener noreferrer" className="text-[#8B9AA1] hover:text-[#4FD1A5] transition-colors focus-ring">
            <Linkedin size={18} />
          </a>
          <a href="https://github.com/Tahsimakram03" target="_blank" rel="noopener noreferrer" className="text-[#8B9AA1] hover:text-[#4FD1A5] transition-colors focus-ring">
            <Github size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};