import * as z from "zod";

export const ROLE_OPTIONS = [
  { value: "professional", label: "💼 Professional", description: "I have work experience" },
  { value: "fresher", label: "🎓 Fresher / New Graduate", description: "Just starting my career" },
  { value: "student", label: "📚 Student", description: "Currently studying" },
  { value: "freelancer", label: "🚀 Freelancer", description: "Independent contractor" },
  { value: "career_changer", label: "🔄 Career Changer", description: "Switching industries" },
] as const;

export type UserRole = typeof ROLE_OPTIONS[number]["value"];

export const resumeSchema = z.object({
  role: z.string().default("professional"),

  fullName: z.string().min(2, "Full name is required"),
  jobTitle: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  portfolio: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),

  summary: z.string().min(10, "Summary should be at least 10 characters").max(2000, "Summary is too long"),

  education: z.array(
    z.object({
      institution: z.string().min(2, "Institution is required"),
      degree: z.string().min(2, "Degree is required"),
      field: z.string().min(2, "Field of study is required"),
      startYear: z.string().min(4, "Start year is required"),
      endYear: z.string().min(4, "End year is required"),
    })
  ).optional().default([]),

  experience: z.array(
    z.object({
      company: z.string().min(2, "Company is required"),
      position: z.string().min(2, "Position is required"),
      startDate: z.string().min(2, "Start date is required"),
      endDate: z.string().min(2, "End date is required"),
      description: z.string().min(10, "Description is required"),
    })
  ).optional().default([]),

  projects: z.array(
    z.object({
      name: z.string().min(2, "Project name is required"),
      description: z.string().min(10, "Description is required"),
      link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
      techStack: z.string().optional(),
    })
  ).optional().default([]),

  certifications: z.array(
    z.object({
      name: z.string().min(2, "Certification name is required"),
      issuer: z.string().min(2, "Issuer is required"),
      date: z.string().min(2, "Date is required"),
      link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    })
  ).optional().default([]),

  skills: z.array(z.string()).min(1, "At least one skill is required"),
  templateId: z.string().default("modern"),
});

export type ResumeFormValues = z.infer<typeof resumeSchema>;

export const defaultValues: Partial<ResumeFormValues> = {
  role: "professional",
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  skills: [],
  templateId: "modern",
};
