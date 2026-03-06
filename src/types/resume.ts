export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  link?: string;
  techStack?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface ResumeInput {
  role?: string;
  fullName: string;
  jobTitle?: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  certifications?: Certification[];
  skills: string[];
}

export interface ResumeRecord {
  id: string;
  full_name: string;
  job_title?: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  certifications?: Certification[];
  skills: string[];
  generated_resume: string;
  created_at: string;
}
