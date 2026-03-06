import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gray-950">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Powered by AI — 100% Free
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-white">Build Your </span>
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Perfect Resume
          </span>
          <br />
          <span className="text-white">in Seconds</span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Enter your details and let our AI craft a professional, ATS-optimized
          resume that stands out. No templates, no hassle — just results.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/create"
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-lg hover:from-violet-500 hover:to-cyan-500 transition-all shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105"
          >
            Create Your Resume
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
          <Link
            href="/resumes"
            className="px-8 py-4 rounded-xl border border-gray-700 text-gray-300 font-semibold text-lg hover:border-gray-500 hover:text-white transition-all hover:scale-105"
          >
            View Saved Resumes
          </Link>
        </div>

        {/* Feature badges */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm hover:border-violet-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-400 text-sm">
              Advanced AI generates tailored, professional content
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm hover:border-cyan-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">ATS-Optimized</h3>
            <p className="text-gray-400 text-sm">
              Resumes that pass Applicant Tracking Systems
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">100% Free</h3>
            <p className="text-gray-400 text-sm">
              No hidden fees, no subscriptions. Completely free
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
