export const landing_content = {
  hero: {
    badge: "Welcome",
    title: "One Platform Every College Event",
    description:
      "Effortlessly create, manage, and promote college events. From registration to attendance tracking, Digievent simplifies the entire process.",
    primaryButton: "Get started",
    secondaryButton: "See how it works",
  },
  features: {
    badge: "Built for organizers, colleges and students",
    title: "Our product has these powerful features",
    subtitle:
      "Everything you need to create and manage successful college events",
    items: [
      {
        title: "Category-wise Sorting",
        description:
          "Organize events by categories, making it easy for students to find what interests them.",
        icon: "Tag",
      },
      {
        title: "Ticket Management",
        description:
          "Sell tickets, manage free registrations, and control capacity for your events.",
        icon: "Users",
      },
      {
        title: "Mobile Responsive",
        description:
          "Perfect experience on all devices, ensuring students can register from anywhere.",
        icon: "CheckCircle",
      },
    ],
  },
  benefits: {
    badge: "Streamlined workflow",
    title: "Manage your events with ease",
    description:
      "DigiEvent streamlines the entire event management process, saving you time and reducing stress.",
    items: [
      "Create events in minutes with intuitive forms",
      "Automate attendee communications and reminders",
      "Generate detailed reports on attendance and engagement",
      "Collect feedback with built-in survey tools",
    ],
    imageAlt: "Event Management",
  },
  cta: {
    badge: "Limited time offer",
    title: "Ready to simplify your event management?",
    description:
      "Try DigiEvent today and see the difference it makes for your college events.",
    primaryButton: "Get Started Free",
    secondaryButton: "Watch Demo",
  },
  footer: {
    description: "The all-in-one platform for college event management.",
    links: {
      product: [
        { name: "Features", href: "/features" },
        { name: "Integrations", href: "/integrations" },
        { name: "FAQ", href: "/faq" },
      ],
      company: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "/contact" },
      ],
      legal: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Cookie Policy", href: "/cookie-policy" },
      ],
    },
    copyright: `© ${new Date().getFullYear()} DigiEvent. All rights reserved.`,
  },
  navigation: {
    logo: "Digievent",
    links: [
      { href: "#hero", text: "Home" },
      { href: "#about", text: "About" },
      { href: "#terms", text: "T&C" },
      { href: "#contact", text: "Contact" },
    ],
    loginButton: "Login",
    statusBar: "DigiEvent",
    notifications: {
      eventCreated: {
        title: "Event Created",
        time: "Just now",
      },
      registrations: {
        title: "50+ Registrations",
        time: "Today",
      },
    },
  },
};
