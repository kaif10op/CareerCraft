"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "rgba(17, 24, 39, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(55, 65, 81, 0.5)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
              }}
            >
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-white font-bold text-xl">
              Resume<span style={{ color: "#a78bfa" }}>Builder</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors"
              style={{ color: "#d1d5db" }}
            >
              Home
            </Link>
            <Link
              href="/create"
              className="text-sm font-medium transition-colors"
              style={{ color: "#d1d5db" }}
            >
              Create
            </Link>
            <Link
              href="/resumes"
              className="text-sm font-medium transition-colors"
              style={{ color: "#d1d5db" }}
            >
              My Resumes
            </Link>
            <Link
              href="/create"
              className="px-4 py-2 rounded-lg text-white font-medium transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #0891b2)",
                boxShadow: "0 4px 14px rgba(139, 92, 246, 0.25)",
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            style={{ color: "#d1d5db" }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-sm transition-colors"
              style={{ color: "#d1d5db" }}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/create"
              className="block px-3 py-2 rounded-lg text-sm transition-colors"
              style={{ color: "#d1d5db" }}
              onClick={() => setIsOpen(false)}
            >
              Create
            </Link>
            <Link
              href="/resumes"
              className="block px-3 py-2 rounded-lg text-sm transition-colors"
              style={{ color: "#d1d5db" }}
              onClick={() => setIsOpen(false)}
            >
              My Resumes
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
