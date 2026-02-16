export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  interviewProbability: number;
  salary: string;
  postedDate: string;
  source: string;
  logo?: string;
  skills: string[];
  missingSkills: string[];
}

export interface ResumeInsight {
  id: string;
  category: "critical" | "important" | "suggestion";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

export interface JobSite {
  id: string;
  name: string;
  enabled: boolean;
  url: string;
  logo?: string;
}

export const mockJobMatches: JobMatch[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    matchScore: 94,
    interviewProbability: 87,
    salary: "$140k - $180k",
    postedDate: "2024-02-14",
    source: "LinkedIn",
    skills: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
    missingSkills: ["GraphQL"],
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    matchScore: 89,
    interviewProbability: 78,
    salary: "$120k - $160k",
    postedDate: "2024-02-13",
    source: "Indeed",
    skills: ["React", "Python", "AWS", "Docker"],
    missingSkills: ["Kubernetes", "PostgreSQL"],
  },
  {
    id: "3",
    title: "React Developer",
    company: "Digital Solutions",
    location: "New York, NY",
    matchScore: 86,
    interviewProbability: 72,
    salary: "$110k - $145k",
    postedDate: "2024-02-12",
    source: "Glassdoor",
    skills: ["React", "JavaScript", "CSS", "Git"],
    missingSkills: ["Testing frameworks", "CI/CD"],
  },
  {
    id: "4",
    title: "Frontend Architect",
    company: "Enterprise Corp",
    location: "Austin, TX",
    matchScore: 81,
    interviewProbability: 65,
    salary: "$150k - $200k",
    postedDate: "2024-02-11",
    source: "LinkedIn",
    skills: ["React", "Architecture", "Mentoring"],
    missingSkills: ["Micro-frontends", "Webpack"],
  },
  {
    id: "5",
    title: "UI Engineer",
    company: "Design Studio",
    location: "Los Angeles, CA",
    matchScore: 77,
    interviewProbability: 58,
    salary: "$100k - $135k",
    postedDate: "2024-02-10",
    source: "ZipRecruiter",
    skills: ["React", "CSS", "Figma"],
    missingSkills: ["Animation libraries", "Accessibility"],
  },
];

export const mockInsights: ResumeInsight[] = [
  {
    id: "1",
    category: "critical",
    title: "Add quantifiable achievements",
    description: "Include specific metrics and numbers in your experience section. For example, 'Improved page load time by 40%' or 'Led a team of 5 developers'.",
    impact: "high",
  },
  {
    id: "2",
    category: "critical",
    title: "Missing key technical skills",
    description: "Add GraphQL, Kubernetes, and Testing frameworks to your skills section. These appear in 65% of matching job descriptions.",
    impact: "high",
  },
  {
    id: "3",
    category: "important",
    title: "Optimize for ATS keywords",
    description: "Your resume is missing important keywords like 'agile', 'scrum', and 'cloud infrastructure' that are common in your target roles.",
    impact: "medium",
  },
  {
    id: "4",
    category: "important",
    title: "Add a professional summary",
    description: "Include a 2-3 sentence summary at the top highlighting your expertise and career goals. This improves match scores by 12%.",
    impact: "medium",
  },
  {
    id: "5",
    category: "suggestion",
    title: "Update job titles formatting",
    description: "Use consistent formatting for job titles across all positions. Consider using title case for better readability.",
    impact: "low",
  },
  {
    id: "6",
    category: "suggestion",
    title: "Include relevant certifications",
    description: "If you have certifications (AWS, Azure, etc.), create a dedicated section to highlight them.",
    impact: "low",
  },
];

export const mockJobSites: JobSite[] = [
  {
    id: "1",
    name: "LinkedIn",
    enabled: true,
    url: "https://linkedin.com/jobs",
  },
  {
    id: "2",
    name: "Indeed",
    enabled: true,
    url: "https://indeed.com",
  },
  {
    id: "3",
    name: "Glassdoor",
    enabled: true,
    url: "https://glassdoor.com",
  },
  {
    id: "4",
    name: "ZipRecruiter",
    enabled: false,
    url: "https://ziprecruiter.com",
  },
  {
    id: "5",
    name: "Monster",
    enabled: false,
    url: "https://monster.com",
  },
];

export const mockStats = {
  totalMatches: 47,
  averageMatchScore: 82,
  highProbabilityJobs: 12,
  resumeScore: 76,
};
