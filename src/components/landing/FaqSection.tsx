"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is CarrierCraft truly 100% free?",
      answer: "Yes! There are no hidden fees, paywalls, or subscriptions. You can create, edit, and download your ATS-optimized resume in PDF format completely free of charge."
    },
    {
      question: "What does ATS-optimized mean?",
      answer: "ATS stands for Applicant Tracking System. Most companies use software to scan and rank resumes before a human sees them. Our templates and AI are rigorously designed to pass these scans, ensuring your resume gets read by actual recruiters."
    },
    {
      question: "How does the AI Resume Generator work?",
      answer: "You simply input your basic information and raw experience details. Our advanced AI model then restructures, enhances, and formats your content into professional, action-driven bullet points that highlight your impact."
    },
    {
      question: "Can I switch templates after generating my resume?",
      answer: "Absolutely. Our engine separates content from design. Once your resume is generated, you can seamlessly preview it across all 15+ premium templates with a single click."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we prioritize your privacy. We do not sell your personal data to third parties, and your generated resumes are stored securely inside your personal dashboard."
    }
  ];

  return (
    <section className="relative py-32 bg-gray-950 overflow-hidden isolate shadow-[inset_0_20px_40px_-20px_rgba(0,0,0,0.8)] border-t border-white/5 pb-40">
       {/* Background Ambience */}
       <div className="absolute -bottom-[20rem] left-1/2 -translate-x-1/2 w-[60rem] h-[40rem] bg-cyan-600/10 rounded-[100%] blur-[120px] pointer-events-none -z-10 mix-blend-screen" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
            <MessageCircleQuestion className="w-4 h-4" />
            Support
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Questions</span>
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about building your perfect resume.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`group relative rounded-3xl border transition-all duration-300 overflow-hidden backdrop-blur-md ${
                  isOpen 
                    ? "bg-white/10 border-cyan-500/50 shadow-[0_10px_40px_-10px_rgba(6,182,212,0.2)]" 
                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                >
                  <span className={`text-lg md:text-xl font-bold transition-colors ${isOpen ? "text-cyan-300" : "text-white group-hover:text-cyan-100"}`}>
                    {faq.question}
                  </span>
                  <div className={`w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? "bg-cyan-500/20 border-cyan-500/30 rotate-180" : "bg-white/5 border-white/10 group-hover:bg-white/10"}`}>
                    <ChevronDown className={`w-5 h-5 ${isOpen ? "text-cyan-300" : "text-gray-400 group-hover:text-white"}`} />
                  </div>
                </button>
                
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="p-6 md:p-8 pt-0 text-gray-400 leading-relaxed font-medium text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
