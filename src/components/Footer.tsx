export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#030712",
        borderTop: "1px solid #1f2937",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
              }}
            >
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="text-sm" style={{ color: "#9ca3af" }}>
              AI Resume Builder — Built with Next.js, Supabase & AI
            </span>
          </div>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
