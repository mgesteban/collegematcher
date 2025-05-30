export interface College {
  id: string
  name: string
  location: string
  programs: string[]
  tuition: number // Annual
  financialAid: boolean
  scheduleOptions: ("full-time" | "part-time" | "evening")[]
  transferAgreements: string[] // Names of 4-year universities
  studentServices: string[]
  description: string
  website: string
}

export const mockColleges: College[] = [
  {
    id: "valley-view",
    name: "Valley View Community College",
    location: "Pleasantville, CA",
    programs: ["Computer Science", "Nursing", "Business Administration", "Graphic Design", "Welding"],
    tuition: 3500,
    financialAid: true,
    scheduleOptions: ["full-time", "part-time", "evening"],
    transferAgreements: ["State University", "Tech Institute"],
    studentServices: ["Tutoring", "Career Counseling", "Library", "Disability Support"],
    description:
      "Valley View offers a wide range of programs with strong transfer pathways and excellent student support.",
    website: "https://example.com/valleyview",
  },
  {
    id: "city-central",
    name: "City Central College",
    location: "Metropolis, NY",
    programs: ["Data Analytics", "Cybersecurity", "Liberal Arts", "Culinary Arts", "Early Childhood Education"],
    tuition: 4200,
    financialAid: true,
    scheduleOptions: ["full-time", "part-time"],
    transferAgreements: ["Metropolis University", "Downtown College"],
    studentServices: ["Job Placement", "Writing Center", "Health Services", "Online Learning Support"],
    description:
      "Located in the heart of the city, City Central College provides cutting-edge programs and strong industry connections.",
    website: "https://example.com/citycentral",
  },
  {
    id: "sunrise-technical",
    name: "Sunrise Technical Institute",
    location: "Aurora, TX",
    programs: ["Automotive Technology", "HVAC Repair", "Electrical Engineering Tech", "Renewable Energy"],
    tuition: 3000,
    financialAid: false,
    scheduleOptions: ["full-time", "evening"],
    transferAgreements: ["Texas A&M Engineering (specific programs)"],
    studentServices: ["Hands-on Labs", "Apprenticeship Programs", "Tool Vouchers"],
    description:
      "Sunrise Technical Institute focuses on high-demand vocational skills with state-of-the-art facilities.",
    website: "https://example.com/sunrisetech",
  },
  {
    id: "lakeside-arts",
    name: "Lakeside College of Arts",
    location: "Geneva, WI",
    programs: ["Fine Arts", "Music Performance", "Theatre", "Creative Writing", "Digital Media"],
    tuition: 3800,
    financialAid: true,
    scheduleOptions: ["full-time", "part-time"],
    transferAgreements: ["State Arts University", "Midwest Conservatory"],
    studentServices: ["Art Studios", "Performance Venues", "Portfolio Development", "Visiting Artist Workshops"],
    description: "Lakeside College of Arts offers a vibrant creative community and specialized arts education.",
    website: "https://example.com/lakesidearts",
  },
]
