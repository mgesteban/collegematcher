export interface StudentProfile {
  academicInterests: string[]
  careerAspirations: string
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading/writing" | "mixed"
  geographicPreference: string // e.g., "near Pleasantville, CA", "anywhere in NY", "online only"
  financialBudget: number // Max annual tuition
  schedulePreference: ("full-time" | "part-time" | "evening")[]
  [key: string]: any // For additional fields
}

export interface MatchResult {
  collegeId: string
  collegeName: string
  matchScore: number // e.g., 0-100
  explanation: string
  pros: string[]
  cons: string[]
}
