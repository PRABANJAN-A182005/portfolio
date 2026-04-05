const portfolioSeed = {
  hero: {
    name: "Aarav Mehta",
    role: "Full-Stack MERN Developer",
    tagline:
      "I craft responsive portfolio experiences, scalable APIs, and product-ready interfaces that feel clean on every device.",
    location: "Bengaluru, India",
    availability: "Open to freelance builds and product teams",
    intro:
      "With a balance of frontend polish and backend discipline, I help teams ship websites and apps that look premium without losing maintainability.",
    highlights: ["React", "Node.js", "Express", "MongoDB", "Responsive UI"],
    ctaPrimary: "Explore Projects",
    ctaSecondary: "Book a Call"
  },
  socials: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://linkedin.com/" },
    { label: "Behance", url: "https://behance.net/" },
    { label: "Email", url: "mailto:hello@example.com" }
  ],
  stats: [
    { value: "18+", label: "Projects Launched" },
    { value: "4+", label: "Years of Experience" },
    { value: "30%", label: "Average UX Lift on Redesigns" }
  ],
  about: {
    title: "Product thinking, expressive UI, and backend reliability in one workflow.",
    paragraphs: [
      "I enjoy building portfolios and business websites that do more than look attractive. They should tell a story quickly, feel effortless on mobile, and still give you a backend that is easy to grow later.",
      "On the engineering side, I keep the API and database model straightforward so future changes stay manageable. On the design side, I focus on rhythm, motion, and visual hierarchy that makes the work memorable."
    ],
    focus: [
      "Responsive interfaces with deliberate typography and layered depth",
      "Express and MongoDB foundations that are easy to extend",
      "Portfolio storytelling that helps recruiters and clients scan quickly"
    ]
  },
  skills: [
    {
      category: "Frontend",
      summary: "Modern interfaces with strong responsiveness, smooth states, and performance-minded structure.",
      items: ["React", "Vite", "JavaScript", "CSS", "Responsive Design", "REST Integration"]
    },
    {
      category: "Backend",
      summary: "APIs and services built with clarity, predictable routes, and practical validation.",
      items: ["Node.js", "Express", "Mongoose", "MongoDB", "Authentication", "API Design"]
    },
    {
      category: "Product UI",
      summary: "Interface systems that help products look more intentional and easier to use.",
      items: ["Wireframing", "Design Systems", "Motion", "Accessibility", "UX Writing", "Prototyping"]
    }
  ],
  projects: [
    {
      title: "StudioPulse Portfolio CMS",
      type: "Portfolio",
      year: "2026",
      summary:
        "A multi-section creator portfolio with an editable MongoDB content model, project filters, and lead capture.",
      stack: ["React", "Express", "MongoDB", "Vite"],
      metrics: ["42% faster content updates", "Mobile-first redesign", "API-backed contact form"],
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
      summary:
        "Admin dashboard for catalog and campaign tracking with responsive charts, role-based modules, and KPI summaries.",
      stack: ["React", "Node.js", "MongoDB", "Chart UI"],
      metrics: ["26% quicker campaign setup", "Unified analytics view", "Reusable component system"],
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
      summary:
        "Community platform for student events, onboarding, and messaging with a streamlined mobile navigation pattern.",
      stack: ["MERN", "Socket-ready API", "Responsive UI"],
      metrics: ["2.1x repeat engagement", "Single-query event feed", "Accessible card layouts"],
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
      summary:
        "Leading full-stack delivery for marketing sites, internal platforms, and product landing pages with a focus on maintainable UI systems.",
      achievements: [
        "Built reusable React sections that cut new page build time by nearly half.",
        "Introduced MongoDB-backed content structures for lightweight admin tooling.",
        "Raised Lighthouse mobile scores across client projects with layout and asset improvements."
      ]
    },
    {
      company: "Craftloop Digital",
      role: "Frontend Engineer",
      period: "2022 - 2024",
      summary:
        "Delivered responsive experiences for startup websites and early-stage SaaS products in close collaboration with design teams.",
      achievements: [
        "Translated visual concepts into component-driven interfaces with stronger consistency.",
        "Created animation and interaction patterns that improved scanability without harming usability.",
        "Partnered with backend developers to simplify API states and error handling in the UI."
      ]
    },
    {
      company: "Freelance",
      role: "Web Developer",
      period: "2020 - 2022",
      summary:
        "Built branding sites, portfolio websites, and small business dashboards with an emphasis on speed and clarity.",
      achievements: [
        "Delivered end-to-end projects from discovery to deployment.",
        "Helped clients modernize dated layouts into mobile-friendly experiences.",
        "Set up lightweight Express services and MongoDB storage for lead management."
      ]
    }
  ],
  contact: {
    email: "hello@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    note:
      "If you want this portfolio adapted to your own profile, the content lives in a single API shape so it is easy to personalize.",
    calendly: "https://calendly.com/"
  }
};

export default portfolioSeed;

