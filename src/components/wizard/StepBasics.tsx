import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { ResumeFormValues, ROLE_OPTIONS } from "@/lib/schema";

export function StepBasics() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ResumeFormValues>();

  const selectedRole = watch("role") || "professional";

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 fade-in">
      <div>
        <h2 className="text-3xl font-extrabold mb-3 text-white tracking-tight">
          Basic Information
        </h2>
        <p className="text-base text-gray-400 font-medium pb-2 border-b border-gray-800">
          Let&apos;s start with your contact details and professional links.
        </p>
      </div>

      {/* Role Selector */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-4 text-gray-300">
          I am a...
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLE_OPTIONS.map((option) => {
            const isSelected = selectedRole === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue("role", option.value, { shouldValidate: true })}
                className={`text-left p-5 rounded-2xl transition-all duration-200 border-2 ${
                  isSelected
                    ? "border-violet-500 bg-violet-500/10 shadow-[0_10px_20px_-5px_rgba(139,92,246,0.15)]"
                    : "border-gray-800 bg-gray-900/40 hover:border-gray-700 hover:bg-gray-800/50"
                }`}
              >
                <div className={`text-base font-bold mb-1 ${isSelected ? 'text-violet-300' : 'text-white'}`}>
                  {option.label}
                </div>
                <div className="text-sm text-gray-400 leading-relaxed font-medium">
                  {option.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name *"
          placeholder="e.g. John Doe"
          {...register("fullName")}
          error={errors.fullName?.message}
        />
        <Input
          label="Professional Title"
          placeholder={
            selectedRole === "student" ? "e.g. CS Student at MIT"
            : selectedRole === "fresher" ? "e.g. Aspiring Data Scientist"
            : selectedRole === "freelancer" ? "e.g. Freelance UI/UX Designer"
            : "e.g. Senior Frontend Engineer"
          }
          {...register("jobTitle")}
          error={errors.jobTitle?.message}
        />
        <Input
          label="Email Address *"
          type="email"
          placeholder="john@example.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Phone Number"
          placeholder="+1 (555) 123-4567"
          {...register("phone")}
          error={errors.phone?.message}
        />
        <Input
          label="Location"
          placeholder="e.g. San Francisco, CA"
          {...register("location")}
          error={errors.location?.message}
        />
        <Input
          label="LinkedIn URL"
          placeholder="https://linkedin.com/in/johndoe"
          {...register("linkedin")}
          error={errors.linkedin?.message}
        />
        <Input
          label="GitHub URL"
          placeholder="https://github.com/johndoe"
          {...register("github")}
          error={errors.github?.message}
        />
        <Input
          label="Portfolio URL"
          placeholder="https://johndoe.dev"
          {...register("portfolio")}
          error={errors.portfolio?.message}
        />
      </div>
    </div>
  );
}
