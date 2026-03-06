import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#030712" }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0" style={{ backgroundColor: "#030712" }}>
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            top: "25%",
            left: "25%",
            width: "24rem",
            height: "24rem",
            background: "rgba(124, 58, 237, 0.15)",
            filter: "blur(64px)",
          }}
        />
        <div
          className="absolute rounded-full animate-pulse delay-1000"
          style={{
            bottom: "25%",
            right: "25%",
            width: "24rem",
            height: "24rem",
            background: "rgba(6, 182, 212, 0.15)",
            filter: "blur(64px)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "37.5rem",
            height: "37.5rem",
            background: "rgba(147, 51, 234, 0.08)",
            borderRadius: "50%",
            filter: "blur(64px)",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
          style={{
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            color: "#c4b5fd",
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "#4ade80" }}
          />
          Powered by AI — 100% Free
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span style={{ color: "#ffffff" }}>Build Your </span>
          <span
            style={{
              background: "linear-gradient(to right, #a78bfa, #c084fc, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Perfect Resume
          </span>
          <br />
          <span style={{ color: "#ffffff" }}>in Seconds</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "#9ca3af" }}
        >
          Enter your details and let our AI craft a professional, ATS-optimized
          resume that stands out. No templates, no hassle — just results.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/create"
            className="group px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #0891b2)",
              boxShadow: "0 8px 32px rgba(139, 92, 246, 0.25)",
            }}
          >
            Create Your Resume
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
          <Link
            href="/resumes"
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105"
            style={{
              border: "1px solid #374151",
              color: "#d1d5db",
            }}
          >
            View Saved Resumes
          </Link>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Card 1 */}
          <div
            className="p-6 rounded-2xl transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "rgba(17, 24, 39, 0.5)",
              border: "1px solid #1f2937",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto"
              style={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
            >
              <svg className="w-6 h-6" style={{ color: "#a78bfa" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: "#ffffff" }}>AI-Powered</h3>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              Advanced AI generates tailored, professional content
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="p-6 rounded-2xl transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "rgba(17, 24, 39, 0.5)",
              border: "1px solid #1f2937",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto"
              style={{ backgroundColor: "rgba(6, 182, 212, 0.1)" }}
            >
              <svg className="w-6 h-6" style={{ color: "#22d3ee" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: "#ffffff" }}>ATS-Optimized</h3>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              Resumes that pass Applicant Tracking Systems
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="p-6 rounded-2xl transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "rgba(17, 24, 39, 0.5)",
              border: "1px solid #1f2937",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto"
              style={{ backgroundColor: "rgba(147, 51, 234, 0.1)" }}
            >
              <svg className="w-6 h-6" style={{ color: "#c084fc" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: "#ffffff" }}>100% Free</h3>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              No hidden fees, no subscriptions. Completely free
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
