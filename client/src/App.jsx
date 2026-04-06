import { useEffect, useState } from "react";
import { usePortfolio } from "./hooks/usePortfolio";
import profileImage from "./assets/prabanjan-profile.jpeg";

const fallbackPortfolio = {
  hero: {
    name: "Prabanjan A",
    role: "Frontend & MERN Developer",
    tagline:
      "I build responsive React interfaces and MERN applications with clean APIs, practical backend thinking, and user-focused frontend execution.",
    location: "Chennai, Tamil Nadu, India",
    availability: "Open to frontend and full-stack developer roles",
    intro:
      "From blog platforms and attendance systems to event websites and API-powered apps, I enjoy turning ideas into web experiences that feel clear, fast, and dependable.",
    highlights: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    ctaPrimary: "View Projects",
    ctaSecondary: "Get In Touch"
  },
  socials: [
    { label: "GitHub", url: "https://github.com/PRABANJAN-A182005" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/prabanjan-a-1008b6346/" },
    { label: "LeetCode", url: "https://leetcode.com/u/Prabanjan_A/" },
    { label: "Email", url: "mailto:prabanjan.offical@gmail.com" }
  ],
  stats: [
    { value: "4", label: "Projects Featured" },
    { value: "8.44", label: "Current CGPA" },
    { value: "2026", label: "Graduation Year" }
  ],
  about: {
    title: "React-first interfaces, practical MERN foundations, and steady hands-on learning.",
    paragraphs: [
      "I am an Electronics and Communication Engineering student building web applications with React.js, Node.js, Express.js, and MongoDB. My work focuses on responsive interfaces, REST APIs, and backend fundamentals that keep products usable and maintainable.",
      "Through academic projects, certifications, and my internship at Sona Comstar, I have been strengthening both frontend execution and full-stack problem solving. I enjoy shipping features that solve real needs, from content platforms and attendance systems to event sites and search experiences."
    ],
    focus: [
      "Responsive React.js interfaces with clean structure and mobile-first thinking",
      "RESTful API development with Express.js and MongoDB-backed workflows",
      "Consistent self-learning through projects, certifications, and industry exposure"
    ]
  },
  skills: [
    {
      category: "Frontend",
      summary: "Responsive interfaces built with modern React workflows and clean styling foundations.",
      items: ["HTML", "CSS", "React.js", "Tailwind CSS", "Vite", "Responsive UI"]
    },
    {
      category: "Backend",
      summary: "Practical backend fundamentals for APIs, authentication, and database-backed applications.",
      items: ["Node.js", "Express.js", "REST APIs", "JWT", "MongoDB", "MySQL"]
    },
    {
      category: "Languages & Tools",
      summary: "Day-to-day tools and foundations that support development, debugging, and delivery.",
      items: ["JavaScript", "Java", "Git", "GitHub", "Postman", "Material UI"]
    }
  ],
  projects: [
    {
      title: "Blog",
      type: "MERN App",
      year: "2025",
      summary: "Full-stack MERN blog platform with dynamic routing, category-based post discovery, and CRUD workflows powered by REST APIs.",
      stack: ["MongoDB", "Express.js", "React.js", "Node.js", "JavaScript", "HTML", "CSS"],
      metrics: ["Dynamic routing", "Category-based posts", "RESTful CRUD APIs"],
      links: [],
      featured: true
    },
    {
      title: "Employee Attendance Web Application",
      type: "Web App",
      year: "2025",
      summary:
        "Attendance management system with secure authentication, role-based access, and dashboard tracking for employees and managers.",
      stack: ["MongoDB", "Express.js", "React.js", "Node.js", "JWT", "Material UI"],
      metrics: ["Secure authentication", "Role-based access", "Dashboard tracking"],
      links: [],
      featured: true
    },
    {
      title: "Electrothrive Symposium Website",
      type: "Website",
      year: "2024",
      summary:
        "Official college symposium website built to showcase events, schedules, and registration information through a responsive interface.",
      stack: ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
      metrics: ["Responsive event pages", "Schedule visibility", "Registration flow"],
      links: [],
      featured: false
    },
    {
      title: "Movie Search & Favorites App",
      type: "React App",
      year: "2024",
      summary: "React + Vite movie explorer that uses the OMDb API for search and detail views while saving favorite titles locally.",
      stack: ["React.js", "JavaScript", "Vite", "HTML", "CSS", "OMDb API"],
      metrics: ["OMDb API integration", "Local favorites storage", "Fast Vite workflow"],
      links: [],
      featured: false
    }
  ],
  experience: [
    {
      company: "Sona Comstar",
      role: "Manufacturing Intern",
      period: "December 2024",
      summary:
        "Completed an internship in the Manufacturing Department with exposure to EV traction systems, hub motors, and drive motors in a real industrial environment.",
      achievements: [
        "Observed how embedded systems and software controls contribute to motor performance and efficiency.",
        "Built practical understanding of EV manufacturing workflows and traction system components.",
        "Strengthened teamwork and professional communication in a workplace setting."
      ]
    },
    {
      company: "Vel Tech High Tech Dr. Rangarajan Dr. Sakunthala Engineering College",
      role: "B.E. Electronics & Communication Engineering",
      period: "2022 - 2026",
      summary:
        "Pursuing undergraduate studies while building full-stack web projects and expanding frontend and backend development skills.",
      achievements: [
        "Current CGPA: 8.44.",
        "Developed portfolio-ready projects across MERN, React, and JavaScript workflows.",
        "Balanced engineering coursework with continuous software self-learning."
      ]
    },
    {
      company: "Udemy & NPTEL",
      role: "Continuous Learning",
      period: "Completed",
      summary: "Used structured coursework and competitions to strengthen software foundations beyond classroom work.",
      achievements: [
        "Completed a Full-Stack Web Development course on Udemy.",
        "Completed Programming in Java through NPTEL.",
        "Secured 3rd place in paper presentation at Euphoria 2024 (J.N.N Institutions)."
      ]
    }
  ],
  contact: {
    email: "prabanjan.offical@gmail.com",
    phone: "+91 8072140893",
    location: "Chennai, Tamil Nadu, India",
    note:
      "I am currently looking for frontend or full-stack developer opportunities, internships, and collaborative web projects. Reach out by email, phone, or LinkedIn.",
    calendly: "https://www.linkedin.com/in/prabanjan-a-1008b6346/"
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

function normalizeDisplayArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    return trimmedValue ? [trimmedValue] : [];
  }

  return [];
}

function normalizeProjectLinks(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(Boolean)
    .map((link) => ({
      label: String(link.label || "").trim(),
      url: String(link.url || "").trim()
    }))
    .filter((link) => link.label && link.url);
}

function App() {
  const { data, source, message, isLoading, error } = usePortfolio();
  const portfolio = data || fallbackPortfolio;
  const projectList = Array.isArray(portfolio.projects)
    ? portfolio.projects
        .filter(Boolean)
        .map((project) => ({
          ...project,
          type: String(project.type || "").trim(),
          stack: normalizeDisplayArray(project.stack),
          metrics: normalizeDisplayArray(project.metrics),
          links: normalizeProjectLinks(project.links)
        }))
    : [];
  const contactLinkLabel = portfolio.contact?.calendly?.includes("linkedin.com")
    ? "Connect on LinkedIn"
    : "Book a quick intro";
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

  const filters = ["All", ...new Set(projectList.map((project) => project.type).filter(Boolean))];
  const filteredProjects =
    activeFilter === "All"
      ? projectList
      : projectList.filter((project) => project.type === activeFilter);

  return (
    <div className="app-shell">
      <BackgroundDecor />

      <header className="site-header">
        <div className="container header-row">
          <a className="brand-mark" href="#home">
            <span className="brand-mark__pulse" />
            <span>
              {portfolio.hero?.name?.split(" ")[0] || "Portfolio"}
              <small>Developer Portfolio</small>
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
              <div className="profile-photo-frame">
                <img
                  className="profile-photo"
                  src={profileImage}
                  alt={`Portrait of ${portfolio.hero?.name || "Prabanjan A"}`}
                />
              </div>
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
                <strong>{source === "database" ? "MongoDB connected" : "Local portfolio mode"}</strong>{" "}
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
            title={portfolio.about?.title || "React-first interfaces, practical MERN foundations, and steady hands-on learning."}
            description="A concise look at my background, technical focus, and the kind of work I am preparing to contribute to."
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
            title="Core tools I use across frontend, backend, and project delivery."
            description="Grouped to make it easy to scan the technologies I rely on most in academic and personal builds."
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
            title="Selected academic and personal work built with React, MERN, and API integrations."
            description="Each project highlights hands-on implementation work from real builds rather than template case studies."
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
            {filteredProjects.length ? (
              filteredProjects.map((project, index) => (
                <article
                  className="panel project-card"
                  key={`${project.title || "project"}-${project.year || index}`}
                  data-reveal
                >
                  <div className="project-card__header">
                    <div>
                      <p className="project-card__meta">
                        {project.type || "Project"} <span>{project.year || "Recent"}</span>
                      </p>
                      <h3>{project.title || "Untitled Project"}</h3>
                    </div>
                    {project.featured ? <span className="pill">Featured</span> : null}
                  </div>

                  <p>{project.summary || "Project details will appear here after the content is updated."}</p>

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

                  {project.links?.length ? (
                    <div className="project-links">
                      {project.links.map((link) => (
                        <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))
            ) : (
              <article className="panel project-card" data-reveal>
                <div className="project-card__header">
                  <div>
                    <p className="project-card__meta">
                      Projects <span>Pending</span>
                    </p>
                    <h3>No projects available</h3>
                  </div>
                </div>
                <p>Add or restore project entries and they will appear here automatically.</p>
              </article>
            )}
          </div>
        </section>

        <section className="section container" id="experience">
          <SectionHeading
            eyebrow="Experience"
            title="Internship experience, education, and continuous learning."
            description="This timeline focuses on the practical milestones shaping my early software journey."
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
            title="Open to frontend and full-stack opportunities."
            description="If you would like to discuss a role, internship, or collaboration, feel free to reach out directly."
          />

          <div className="contact-grid">
            <article className="panel contact-card" data-reveal>
              <h3>Let&apos;s connect.</h3>
              <p>{portfolio.contact?.note}</p>

              <div className="contact-stack">
                <a href={`mailto:${portfolio.contact?.email}`}>{portfolio.contact?.email}</a>
                <a href={`tel:${portfolio.contact?.phone}`}>{portfolio.contact?.phone}</a>
                <span>{portfolio.contact?.location}</span>
                <a href={portfolio.contact?.calendly} target="_blank" rel="noreferrer">
                  {contactLinkLabel}
                </a>
              </div>
            </article>

            <ContactForm source={source} contactEmail={portfolio.contact?.email} />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__row">
          <p>Built with React, Express, MongoDB, and personalized with details from my resume.</p>
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

function ContactForm({ source, contactEmail }) {
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
          : "Hosted without MongoDB? The direct contact email below will still work while you finish setup."}
      </p>

      {contactEmail ? (
        <p className="form-helper">
          Prefer direct contact? <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      ) : null}

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
