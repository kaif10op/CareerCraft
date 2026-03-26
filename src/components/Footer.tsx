import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative bg-gray-950 pt-20 pb-10 overflow-hidden print:hidden border-t border-white/5 isolate">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[20rem] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)] z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Logo />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Build stunning, ATS-optimized resumes in seconds using AI. Designed for modern professionals who want to stand out.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-white/10 hover:border-cyan-500/30 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-white/10 hover:border-cyan-500/30 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-white/10 hover:border-cyan-500/30 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              <li><Link href="/create" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">Resume Builder</Link></li>
              <li><Link href="/resumes" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">My Resumes</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">Templates</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">Examples</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Career Blog</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">ATS Guide</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Interview Prep</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-pink-400 transition-colors">Cookie Policy</Link></li>
              <li>
                <a href="mailto:support@carriercraft.com" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mt-2 p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20">
                  <Mail className="w-4 h-4 text-violet-400" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CarrierCraft. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Built with</span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/5 border border-white/10">Next.js</span>
            <span>&amp;</span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
