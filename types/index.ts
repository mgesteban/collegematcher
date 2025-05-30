export interface StudentProfile {
  id: string
  name: string
  email: string
  academicInterests: string[]
  careerGoals: string[]
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading"
  geographicPreferences: {
    maxDistance: number
    preferredStates: string[]
    transportationMode: "car" | "public" | "walking" | "online"
  }
  financialConstraints: {
    maxTuition: number
    needsFinancialAid: boolean
    workStudyInterest: boolean
  }
  schedulePreferences: {
    format: "full-time" | "part-time" | "evening" | "weekend" | "online"
    flexibility: "high" | "medium" | "low"
  }
  personalFactors: {
    age: number
    hasFamily: boolean
    workingProfessional: boolean
    militaryVeteran: boolean
  }
}

export interface CommunityCollege {
  id: string
  name: string
  location: {
    city: string
    state: string
    zipCode: string
    coordinates: { lat: number; lng: number }
  }
  programs: Program[]
  admissionRequirements: {
    gpaMinimum?: number
    testScores?: string[]
    prerequisites?: string[]
  }
  costs: {
    inStateTuition: number
    outOfStateTuition: number
    fees: number
    estimatedTotal: number
  }
  scheduleOptions: string[]
  facilities: string[]
  studentServices: string[]
  transferAgreements: string[]
  accreditation: string[]
  studentPopulation: number
  website: string
  contactInfo: {
    phone: string
    email: string
    admissionsOffice: string
  }
}

export interface Program {
  id: string
  name: string
  type: "certificate" | "associate" | "transfer"
  duration: string
  credits: number
  description: string
  careerOutcomes: string[]
  prerequisites: string[]
  schedule: string[]
}

export interface MatchResult {
  college: CommunityCollege
  matchScore: number
  matchReasons: string[]
  concerns: string[]
  recommendedPrograms: Program[]
  nextSteps: string[]
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}
