import Hero from "@/components/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import TemplateShowcase from "@/components/landing/TemplateShowcase";
import FaqSection from "@/components/landing/FaqSection";

export default function Home() {
  return (
    <main className="bg-gray-950 overflow-hidden">
      <Hero />
      <HowItWorks />
      <TemplateShowcase />
      <FaqSection />
    </main>
  );
}
