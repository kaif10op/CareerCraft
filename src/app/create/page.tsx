import ResumeForm from "@/components/ResumeForm";

export const metadata = {
  title: "Create Resume | CarrierCraft",
  description: "Enter your details and let AI create a professional resume for you.",
};

export default function CreatePage() {
  return (
    <main
      className="h-screen pt-20 pb-0 overflow-hidden flex flex-col"
      style={{ backgroundColor: "#030712" }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-8 flex-1 flex flex-col min-h-0 bg-gray-950">
        <ResumeForm />
      </div>
    </main>
  );
}
