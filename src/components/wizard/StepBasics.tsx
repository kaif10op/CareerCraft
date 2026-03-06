import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { ResumeFormValues } from "@/lib/schema";

export function StepBasics() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResumeFormValues>();

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
        <p className="text-gray-400 text-sm mb-6">Let's start with your contact details and professional links.</p>
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
          placeholder="e.g. Senior Frontend Engineer"
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
          label="Phone Number *"
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
          label="LinkedIn URL *"
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
