export type TemplateLayout = "linear" | "sidebar-left" | "sidebar-right" | "two-column" | "executive" | "split-header";

export interface TemplateStyles {
  h1: string;
  h2: string;
  h3: string;
  hr: string;
  body: string;
  color: {
    text: string;
    heading: string;
    muted: string;
    border: string;
  };
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  layout: TemplateLayout;
  styles: TemplateStyles;
}

export const templates: ResumeTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean sans-serif design with bold headings.",
    thumbnail: "/templates/modern.png",
    layout: "linear",
    styles: {
      h1: "text-4xl font-extrabold mb-4 font-sans tracking-tight",
      h2: "text-2xl font-bold mt-8 mb-4 pb-2 border-b-2 font-sans",
      h3: "text-xl font-bold mt-5 mb-2 font-sans",
      hr: "my-6 border-t-2",
      body: "font-sans text-sm",
      color: { text: "#374151", heading: "#111827", muted: "#4b5563", border: "#e5e7eb" }
    }
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional serif formatting for conservative fields.",
    thumbnail: "/templates/classic.png",
    layout: "linear",
    styles: {
      h1: "text-3xl font-serif text-center font-bold mb-2 uppercase tracking-wide",
      h2: "text-xl font-serif font-bold mt-6 mb-3 pb-1 border-b-[1.5px] border-black uppercase tracking-wider text-center",
      h3: "text-lg font-serif font-bold mt-4 mb-1",
      hr: "my-4 border-t border-black",
      body: "font-serif text-sm",
      color: { text: "#000000", heading: "#000000", muted: "#333333", border: "#000000" }
    }
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Lots of whitespace and extremely subtle borders.",
    thumbnail: "/templates/minimal.png",
    layout: "linear",
    styles: {
      h1: "text-4xl font-light mb-1 tracking-tight font-sans text-right",
      h2: "text-lg font-medium mt-8 mb-4 border-b border-gray-200 pb-2 font-sans text-right",
      h3: "text-base font-semibold mt-4 mb-2 font-sans text-right",
      hr: "my-8 border-t border-dashed border-gray-200",
      body: "font-sans text-sm font-light text-right",
      color: { text: "#6b7280", heading: "#374151", muted: "#9ca3af", border: "#f3f4f6" }
    }
  },
  {
    id: "executive",
    name: "Executive",
    description: "Authoritative design for senior leadership.",
    thumbnail: "/templates/executive.png",
    layout: "executive",
    styles: {
      h1: "text-5xl font-serif font-bold mb-3 tracking-tighter text-center",
      h2: "text-xl font-serif font-bold mt-7 mb-3 border-b-4 border-gray-900 pb-1 uppercase",
      h3: "text-lg font-serif font-bold mt-4 mb-1",
      hr: "my-5 border-t-4 border-gray-900",
      body: "font-serif text-[15px] leading-relaxed",
      color: { text: "#111827", heading: "#030712", muted: "#374151", border: "#111827" }
    }
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stylish layout pushing ATS limits safely.",
    thumbnail: "/templates/creative.png",
    layout: "two-column",
    styles: {
      h1: "text-5xl font-black mb-2 font-sans lowercase tracking-tighter text-gray-800",
      h2: "text-2xl font-extrabold mt-8 mb-3 pb-2 border-b-[3px] border-gray-300 font-sans lowercase text-gray-700",
      h3: "text-xl font-bold mt-4 mb-1 font-sans text-gray-600",
      hr: "my-6 border-t-[3px] border-gray-300",
      body: "font-sans text-sm font-medium",
      color: { text: "#374151", heading: "#1f2937", muted: "#6b7280", border: "#d1d5db" }
    }
  },
  {
    id: "tech",
    name: "Tech",
    description: "Monospace accents suitable for developers.",
    thumbnail: "/templates/tech.png",
    layout: "sidebar-left",
    styles: {
      h1: "text-3xl font-mono font-bold mb-4 tracking-tight text-gray-900 bg-gray-100 inline-block px-4 py-2",
      h2: "text-xl font-mono font-bold mt-6 mb-3 border-b-2 border-gray-800 pb-2 uppercase",
      h3: "text-lg font-bold mt-4 mb-1 font-sans text-gray-800",
      hr: "my-5 border-t-2 border-dashed border-gray-400",
      body: "font-sans text-sm",
      color: { text: "#374151", heading: "#111827", muted: "#6b7280", border: "#374151" }
    }
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Standard business formatting with shaded headers.",
    thumbnail: "/templates/corporate.png",
    layout: "linear",
    styles: {
      h1: "text-3xl font-sans font-bold mb-2 uppercase tracking-wider",
      h2: "text-lg font-sans font-bold mt-7 mb-2 pb-1.5 pt-1.5 bg-gray-200 px-3 rounded-sm uppercase tracking-wide",
      h3: "text-base font-bold mt-3 mb-1 font-sans px-3",
      hr: "my-5 border-t border-gray-300",
      body: "font-sans text-[13px] px-3",
      color: { text: "#333333", heading: "#111111", muted: "#555555", border: "#dddddd" }
    }
  },
  {
    id: "academic",
    name: "Academic CV",
    description: "Dense, highly structured layout for academia.",
    thumbnail: "/templates/academic.png",
    layout: "sidebar-right",
    styles: {
      h1: "text-2xl font-serif font-bold mb-2 border-b-2 border-black pb-4 text-center",
      h2: "text-lg font-serif font-bold mt-5 mb-2 border-b border-black pb-1",
      h3: "text-base font-serif font-semibold mt-3 mb-1 italic",
      hr: "my-4 border-t border-black",
      body: "font-serif text-[12px] leading-tight",
      color: { text: "#000000", heading: "#000000", muted: "#333333", border: "#000000" }
    }
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated serif typography with generous line height.",
    thumbnail: "/templates/elegant.png",
    layout: "executive",
    styles: {
      h1: "text-4xl font-serif font-normal mb-3 text-center tracking-widest uppercase",
      h2: "text-xl font-serif font-normal mt-8 mb-4 border-b border-gray-300 pb-2 text-center tracking-wider",
      h3: "text-lg font-serif font-medium mt-4 mb-2 text-center",
      hr: "my-7 border-t border-double border-[3px] border-gray-300",
      body: "font-serif text-[14px] leading-loose text-justify",
      color: { text: "#374151", heading: "#1f2937", muted: "#6b7280", border: "#d1d5db" }
    }
  },
  {
    id: "simple",
    name: "Simple",
    description: "No frills, straight to the point content.",
    thumbnail: "/templates/simple.png",
    layout: "linear",
    styles: {
      h1: "text-3xl font-sans font-semibold mb-2",
      h2: "text-xl font-sans font-medium mt-6 mb-2 border-b border-gray-200 pb-1",
      h3: "text-base font-sans font-semibold mt-3 mb-1",
      hr: "my-5 border-t border-gray-200",
      body: "font-sans text-[14px]",
      color: { text: "#1f2937", heading: "#111827", muted: "#4b5563", border: "#e5e7eb" }
    }
  },
  {
    id: "clean",
    name: "Clean Style",
    description: "Focus on readability and flow with soft grays.",
    thumbnail: "/templates/clean.png",
    layout: "linear",
    styles: {
      h1: "text-4xl font-sans font-bold mb-4 tracking-tight text-gray-700",
      h2: "text-2xl font-sans font-semibold mt-8 mb-3 text-gray-600",
      h3: "text-lg font-sans font-medium mt-4 mb-2 text-gray-500",
      hr: "my-6 border-t border-gray-100",
      body: "font-sans text-sm text-gray-600",
      color: { text: "#4b5563", heading: "#374151", muted: "#9ca3af", border: "#f3f4f6" }
    }
  },
  {
    id: "chronological",
    name: "Chronological",
    description: "Highlights progression with distinct left borders.",
    thumbnail: "/templates/chronological.png",
    layout: "split-header",
    styles: {
      h1: "text-3xl font-serif font-bold mb-3 border-l-8 border-gray-900 pl-4",
      h2: "text-lg font-serif font-bold mt-6 mb-3 border-l-4 pl-3 border-gray-700 bg-gray-50 py-1",
      h3: "text-base font-serif font-bold mt-4 mb-1 pl-3",
      hr: "my-5 border-t-2 border-gray-200",
      body: "font-serif text-sm pl-3",
      color: { text: "#1f2937", heading: "#111827", muted: "#6b7280", border: "#e5e7eb" }
    }
  },
  {
    id: "functional",
    name: "Functional",
    description: "Focuses on skills with thick dotted borders.",
    thumbnail: "/templates/functional.png",
    layout: "two-column",
    styles: {
      h1: "text-4xl font-sans font-black mb-3 uppercase text-center bg-gray-900 text-white py-3 rounded-t-lg",
      h2: "text-xl font-sans font-bold mt-6 mb-3 pb-2 border-b-4 border-dotted border-gray-400 text-center",
      h3: "text-lg font-sans font-semibold mt-4 mb-1",
      hr: "my-6 border-t-4 border-dotted border-gray-300",
      body: "font-sans text-sm",
      color: { text: "#374151", heading: "#111827", muted: "#4b5563", border: "#9ca3af" }
    }
  },
  {
    id: "hybrid",
    name: "Hybrid",
    description: "Combines serif headers with sans-serif body.",
    thumbnail: "/templates/hybrid.png",
    layout: "sidebar-right",
    styles: {
      h1: "text-4xl font-serif font-bold mb-3 border-b border-gray-400 pb-4",
      h2: "text-2xl font-serif font-bold mt-7 mb-3 border-b-2 border-gray-300 pb-1",
      h3: "text-lg font-serif font-bold mt-4 mb-1",
      hr: "my-5 border-t border-gray-200",
      body: "font-sans text-sm",
      color: { text: "#1f2937", heading: "#111827", muted: "#4b5563", border: "#d1d5db" }
    }
  },
  {
    id: "sleek",
    name: "Sleek",
    description: "Ultra-modern slim headings and typography.",
    thumbnail: "/templates/sleek.png",
    layout: "sidebar-left",
    styles: {
      h1: "text-5xl font-sans font-thin mb-4 tracking-tighter text-right",
      h2: "text-xl font-sans font-light mt-8 mb-3 pb-2 border-b border-gray-200 text-right uppercase tracking-[0.2em]",
      h3: "text-base font-sans font-medium mt-4 mb-2 tracking-wide uppercase text-right",
      hr: "my-6 border-t border-gray-100",
      body: "font-sans text-sm font-light text-right",
      color: { text: "#4b5563", heading: "#1f2937", muted: "#9ca3af", border: "#e5e7eb" }
    }
  },
  {
    id: "professional",
    name: "Professional",
    description: "Standard, reliable ATS-tested layout.",
    thumbnail: "/templates/professional.png",
    layout: "executive",
    styles: {
      h1: "text-4xl font-sans font-bold mb-2 text-center",
      h2: "text-xl font-sans font-bold mt-6 mb-2 border-y-2 border-black py-1 uppercase text-center tracking-widest bg-gray-50",
      h3: "text-lg font-sans font-bold mt-3 mb-1",
      hr: "my-5 border-none",
      body: "font-sans text-sm",
      color: { text: "#000000", heading: "#000000", muted: "#333333", border: "#000000" }
    }
  }
];
