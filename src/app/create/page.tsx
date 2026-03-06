import ResumeForm from "@/components/ResumeForm";

export const metadata = {
  title: "Create Resume | AI Resume Builder",
  description: "Enter your details and let AI create a professional resume for you.",
};

export default function CreatePage() {
  return (
    <main
      className="min-h-screen pt-28 pb-16"
      style={{ backgroundColor: "#030712" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#ffffff" }}>
            Create Your{" "}
            <span
              style={{
                background: "linear-gradient(to right, #a78bfa, #22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI Resume
            </span>
          </h1>
          <p className="text-lg" style={{ color: "#9ca3af" }}>
            Fill in your details below and our AI will craft a professional,
            ATS-optimized resume for you.
          </p>
        </div>
        <ResumeForm />
      </div>
    </main>
  );
}
