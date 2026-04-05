import { useEffect, useState } from "react";
import { usePortfolio } from "./hooks/usePortfolio";

const fallbackPortfolio = {
  hero: {
    name: "Aarav Mehta",
    role: "Full-Stack MERN Developer",
    tagline: "Designing thoughtful digital products with responsive UI and dependable backend architecture.",
    location: "Bengaluru, India",
    availability: "Available for freelance and full-time roles",
    intro:
      "I build fast, human-centered web experiences that blend product thinking, elegant interfaces, and practical engineering.",
    highlights: ["React", "Node.js", "MongoDB", "UI Systems"],
    ctaPrimary: "Explore Projects",
    ctaSecondary: "Start a Conversation"
  },
  socials: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://linkedin.com/" },
    { label: "Email", url: "mailto:hello@example.com" }
  ],
  stats: [
    { value: "4+", label: "Years Building Products" },
    { value: "15", label: "Launches Delivered" },
    { value: "99%", label: "Responsive Coverage" }
  ],
  about: {
    title: "Building products that feel sharp, calm, and ready for real users.",
    paragraphs: [
      "I focus on the overlap between engineering reliability and interface craft. That means production-grade APIs, clean data models, and frontends that feel deliberate on every screen size.",
      "My favorite projects are the ones where strategy, UI, and code all matter at once. I enjoy owning that full journey."
    ],
    focus: [
      "Responsive React frontends with strong visual hierarchy",
      "Express APIs and clean service boundaries",
      "MongoDB schemas that stay practical as products grow"
    ]
  },
  skills: [
    {
      category: "Frontend",
      summary: "Responsive interfaces with layered visuals, strong hierarchy, and clean React structure.",
      items: ["React", "Vite", "JavaScript", "CSS", "Responsive UI", "Accessibility"]
    },
    {
      category: "Backend",
      summary: "Practical APIs and data models designed to stay simple as the product grows.",
      items: ["Node.js", "Express", "MongoDB", "Mongoose", "REST APIs", "Validation"]
    },
    {
      category: "Product UI",
      summary: "Intentional visual systems that make web products feel more polished and more useful.",
      items: ["Design Systems", "Wireframing", "Motion", "UX Copy", "Prototyping", "Mobile-first Design"]
    }
  ],
  projects: [
    {
      title: "StudioPulse Portfolio CMS",
      type: "Portfolio",
      year: "2026",
      summary: "A portfolio platform with editable content, category filters, and lead capture built on a MERN foundation.",
      stack: ["React", "Express", "MongoDB", "Vite"],
      metrics: ["42% faster content edits", "API-driven sections", "Mobile-first redesign"],
      links: [
        { label: "Live Demo", url: "https://example.com" },
        { label: "Source Code", url: "https://github.com/" }
      ],
      featured: true
    },
    {
      title: "Northstar Commerce Dashboard",
      type: "Dashboard",
      year: "2025",
      summary: "An operations dashboard with responsive KPI views, reusable interface modules, and cleaner reporting workflows.",
      stack: ["React", "Node.js", "MongoDB", "REST API"],
      metrics: ["26% faster reporting", "Shared UI patterns", "Responsive analytics layout"],
      links: [
        { label: "Case Study", url: "https://example.com" },
        { label: "GitHub", url: "https://github.com/" }
      ],
      featured: true
    },
    {
      title: "Campus Connect Platform",
      type: "Web App",
      year: "2024",
      summary: "A student community app focused on discoverability, event communication, and a lighter mobile navigation model.",
      stack: ["MERN", "Responsive UI", "REST API"],
      metrics: ["2.1x repeat engagement", "Accessible card layout", "Single-query feed strategy"],
      links: [
        { label: "Overview", url: "https://example.com" },
        { label: "Repository", url: "https://github.com/" }
      ],
      featured: false
    }
  ],
  experience: [
    {
      company: "Brightlayer Studio",
      role: "Senior MERN Developer",
      period: "2024 - Present",
      summary: "Leading full-stack delivery for product sites and internal tools with an emphasis on maintainable UI systems.",
      achievements: [
        "Created reusable section patterns that cut new page build time nearly in half.",
        "Introduced MongoDB-backed content structures for easier updates.",
        "Improved mobile UX scores through layout and interaction refinements."
      ]
    },
    {
      company: "Craftloop Digital",
      role: "Frontend Engineer",
      period: "2022 - 2024",
      summary: "Built responsive interfaces for startups and early-stage SaaS products with strong design collaboration.",
      achievements: [
        "Translated design concepts into consistent React components.",
        "Added interaction patterns that improved scanability without adding clutter.",
        "Worked closely with backend teams to simplify API state handling."
      ]
    }
  ],
  contact: {
    email: "hello@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    note: "Tell me about the product, timeline, and what success looks like for your team.",
    calendly: "https://calendly.com/"
  }
};

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];

function App() {
  const { data, source, message, isLoading, error } = usePortfolio();
  const portfolio = data || fallbackPortfolio;
  const [theme, setTheme] = useState("sunlit");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme");

    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.14
      }
    );

    const targets = document.querySelectorAll("[data-reveal]");
    targets.forEach((target) => observer.observe(target));

    return () => {
      targets.forEach((target) => observer.unobserve(target));
      observer.disconnect();
    };
  }, [portfolio]);

  useEffect(() => {
    setActiveFilter("All");
  }, [portfolio.projects]);

  const filters = ["All", ...new Set((portfolio.projects || []).map((project) => project.type))];
  const filteredProjects =
    activeFilter === "All"
      ? portfolio.projects || []
      : (portfolio.projects || []).filter((project) => project.type === activeFilter);

  return (
    <div className="app-shell">
      <BackgroundDecor />

      <header className="site-header">
        <div className="container header-row">
          <a className="brand-mark" href="#home">
            <span className="brand-mark__pulse" />
            <span>
              {portfolio.hero?.name?.split(" ")[0] || "Portfolio"}
              <small>MERN Portfolio</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setTheme(theme === "sunlit" ? "midnight" : "sunlit")}
            >
              {theme === "sunlit" ? "Midnight Mode" : "Sunlit Mode"}
            </button>

            <button
              className="menu-toggle"
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((current) => !current)}
            >
              Menu
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="mobile-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </header>

      <main>
        <section className="hero-section container" id="home">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">{portfolio.hero?.availability}</p>
            <h1>{portfolio.hero?.role}</h1>
            <p className="hero-tagline">{portfolio.hero?.tagline}</p>
            <p className="hero-intro">{portfolio.hero?.intro}</p>

            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                {portfolio.hero?.ctaPrimary || "View Projects"}
              </a>
              <a className="button button-secondary" href="#contact">
                {portfolio.hero?.ctaSecondary || "Contact Me"}
              </a>
            </div>

            <div className="highlight-row">
              {(portfolio.hero?.highlights || []).map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-panel panel" data-reveal>
            <div className="profile-card">
              <div>
                <p className="profile-card__label">Based in</p>
                <strong>{portfolio.hero?.location}</strong>
              </div>
              <div className="profile-spotlight" />
            </div>

            <div className="stats-grid">
              {(portfolio.stats || []).map((stat) => (
                <article className="stat-card" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>

            <div className="social-list">
              {(portfolio.socials || []).map((social) => (
                <a key={social.label} href={social.url} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="container">
          {source ? (
            <div className="status-banner panel" data-reveal>
              <p>
                <strong>{source === "database" ? "MongoDB connected" : "Seed content mode"}</strong>{" "}
                {message ||
                  (source === "database"
                    ? "Portfolio data is loading from MongoDB."
                    : "Add a MONGO_URI and run the seed script when you are ready for persistence.")}
              </p>
            </div>
          ) : null}

          {error ? (
            <div className="status-banner panel status-banner--error" data-reveal>
              <p>
                <strong>API unavailable.</strong> {error}
              </p>
            </div>
          ) : null}
        </div>

        <section className="section container" id="about">
          <SectionHeading
            eyebrow="About"
            title={portfolio.about?.title || "A portfolio built for product-minded engineering."}
            description="This layout is tuned for clarity on mobile, visual depth on desktop, and easy future content updates through the API."
          />

          <div className="about-grid">
            <article className="panel prose-card" data-reveal>
              {(portfolio.about?.paragraphs || []).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>

            <aside className="panel focus-card" data-reveal>
              <h3>What I bring to teams</h3>
              <ul className="feature-list">
                {(portfolio.about?.focus || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="section container" id="skills">
          <SectionHeading
            eyebrow="Skills"
            title="Stack depth across product, backend, and interface work."
            description="The portfolio content is grouped to make scanning easier for recruiters, clients, and collaborators."
          />

          <div className="skill-grid">
            {(portfolio.skills || []).map((skillGroup) => (
              <article className="panel skill-card" key={skillGroup.category} data-reveal>
                <div className="skill-card__top">
                  <h3>{skillGroup.category}</h3>
                  <p>{skillGroup.summary}</p>
                </div>
                <div className="tag-cloud">
                  {skillGroup.items.map((item) => (
                    <span className="tag-cloud__item" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section container" id="projects">
          <SectionHeading
            eyebrow="Projects"
            title="Selected work with strong UX, API thinking, and measurable outcomes."
            description="The filter buttons are an extra UI touch that makes it easier to explore your work by category."
          />

          <div className="filter-row" data-reveal>
            {filters.map((filter) => (
              <button
                key={filter}
                className={filter === activeFilter ? "filter-chip is-active" : "filter-chip"}
                type="button"
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="project-grid">
            {filteredProjects.map((project) => (
              <article className="panel project-card" key={project.title} data-reveal>
                <div className="project-card__header">
                  <div>
                    <p className="project-card__meta">
                      {project.type} <span>{project.year}</span>
                    </p>
                    <h3>{project.title}</h3>
                  </div>
                  {project.featured ? <span className="pill">Featured</span> : null}
                </div>

                <p>{project.summary}</p>

                <div className="metric-row">
                  {(project.metrics || []).map((metric) => (
                    <div className="metric-pill" key={metric}>
                      {metric}
                    </div>
                  ))}
                </div>

                <div className="tag-cloud">
                  {(project.stack || []).map((item) => (
                    <span className="tag-cloud__item" key={item}>
                      {item}
                    </span>
                  ))}
                </div>

                <div className="project-links">
                  {(project.links || []).map((link) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section container" id="experience">
          <SectionHeading
            eyebrow="Experience"
            title="Product-focused delivery across startups and agency teams."
            description="The vertical timeline keeps longer career stories readable on both narrow and wide screens."
          />

          <div className="timeline">
            {(portfolio.experience || []).map((item) => (
              <article className="timeline-item panel" key={`${item.company}-${item.role}`} data-reveal>
                <div className="timeline-item__top">
                  <div>
                    <p className="eyebrow eyebrow-muted">{item.period}</p>
                    <h3>{item.role}</h3>
                    <strong>{item.company}</strong>
                  </div>
                </div>
                <p>{item.summary}</p>
                <ul className="feature-list">
                  {(item.achievements || []).map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section container" id="contact">
          <SectionHeading
            eyebrow="Contact"
            title="Ready to turn the portfolio into your own story."
            description="The form posts to the backend so you can extend it later with email integrations, admin tools, or analytics."
          />

          <div className="contact-grid">
            <article className="panel contact-card" data-reveal>
              <h3>Let&apos;s build something with momentum.</h3>
              <p>{portfolio.contact?.note}</p>

              <div className="contact-stack">
                <a href={`mailto:${portfolio.contact?.email}`}>{portfolio.contact?.email}</a>
                <a href={`tel:${portfolio.contact?.phone}`}>{portfolio.contact?.phone}</a>
                <span>{portfolio.contact?.location}</span>
                <a href={portfolio.contact?.calendly} target="_blank" rel="noreferrer">
                  Book a quick intro
                </a>
              </div>
            </article>

            <ContactForm source={source} />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__row">
          <p>Built with React, Express, MongoDB, and thoughtful CSS for a polished first impression.</p>
          <a href="#home">Back to top</a>
        </div>
      </footer>

      {isLoading ? <LoadingOverlay /> : null}
    </div>
  );
}

function BackgroundDecor() {
  return (
    <div className="background-decor" aria-hidden="true">
      <span className="glow glow-one" />
      <span className="glow glow-two" />
      <span className="glow glow-three" />
      <span className="grid-fade" />
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function ContactForm({ source }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: ""
  });
  const [status, setStatus] = useState({
    type: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to send your message right now.");
      }

      setStatus({
        type: "success",
        message: payload.message || "Your message has been sent successfully."
      });
      setFormData({
        name: "",
        email: "",
        company: "",
        budget: "",
        message: ""
      });
    } catch (submitError) {
      setStatus({
        type: "error",
        message: submitError.message || "Something went wrong."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="panel contact-form" onSubmit={handleSubmit} data-reveal>
      <div className="form-row">
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            placeholder="Your name"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            placeholder="name@example.com"
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Company
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={(event) => setFormData({ ...formData, company: event.target.value })}
            placeholder="Your company or brand"
          />
        </label>

        <label>
          Budget
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={(event) => setFormData({ ...formData, budget: event.target.value })}
            placeholder="Optional budget range"
          />
        </label>
      </div>

      <label>
        Project brief
        <textarea
          name="message"
          value={formData.message}
          onChange={(event) => setFormData({ ...formData, message: event.target.value })}
          placeholder="Tell me what you want to build."
          rows="6"
          required
        />
      </label>

      <button className="button button-primary button-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      <p className="form-helper">
        {source === "database"
          ? "Messages will be saved to MongoDB."
          : "Connect MongoDB to persist incoming messages."}
      </p>

      {status.message ? (
        <p className={status.type === "success" ? "form-status success" : "form-status error"}>
          {status.message}
        </p>
      ) : null}
    </form>
  );
}

function LoadingOverlay() {
  return (
    <div className="loading-overlay" aria-live="polite" aria-busy="true">
      <div className="loading-card panel">
        <span className="loading-dot" />
        <p>Loading portfolio experience...</p>
      </div>
    </div>
  );
}

export default App;
