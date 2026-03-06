import ResumeForm from "@/components/ResumeForm";

export const metadata = {
  title: "Create Resume | AI Resume Builder",
  description: "Enter your details and let AI create a professional resume for you.",
};

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gray-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create Your{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              AI Resume
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Fill in your details below and our AI will craft a professional,
            ATS-optimized resume for you.
          </p>
        </div>
        <ResumeForm />
      </div>
    </main>
  );
}
