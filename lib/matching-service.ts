import type { StudentProfile, CommunityCollege, MatchResult, Program } from "@/types"

export class CollegeMatchingService {
  private colleges: CommunityCollege[]

  constructor(colleges: CommunityCollege[]) {
    this.colleges = colleges
  }

  async findMatches(studentProfile: StudentProfile): Promise<MatchResult[]> {
    const matches: MatchResult[] = []

    for (const college of this.colleges) {
      const matchScore = this.calculateMatchScore(studentProfile, college)
      const matchReasons = this.generateMatchReasons(studentProfile, college)
      const concerns = this.identifyConcerns(studentProfile, college)
      const recommendedPrograms = this.getRecommendedPrograms(studentProfile, college)
      const nextSteps = this.generateNextSteps(college)

      matches.push({
        college,
        matchScore,
        matchReasons,
        concerns,
        recommendedPrograms,
        nextSteps,
      })
    }

    // Sort by match score (highest first)
    return matches.sort((a, b) => b.matchScore - a.matchScore)
  }

  private calculateMatchScore(student: StudentProfile, college: CommunityCollege): number {
    let score = 0
    let maxScore = 0

    // Financial fit (25% weight)
    maxScore += 25
    if (college.costs.inStateTuition <= student.financialConstraints.maxTuition) {
      score += 25
    } else if (college.costs.inStateTuition <= student.financialConstraints.maxTuition * 1.2) {
      score += 15
    } else if (college.costs.inStateTuition <= student.financialConstraints.maxTuition * 1.5) {
      score += 5
    }

    // Program alignment (30% weight)
    maxScore += 30
    const programMatch = this.calculateProgramAlignment(student, college)
    score += programMatch * 30

    // Schedule compatibility (20% weight)
    maxScore += 20
    const scheduleMatch = this.calculateScheduleCompatibility(student, college)
    score += scheduleMatch * 20

    // Geographic fit (15% weight)
    maxScore += 15
    // For demo purposes, assume all colleges are within range
    score += 15

    // Services and support (10% weight)
    maxScore += 10
    const servicesMatch = this.calculateServicesMatch(student, college)
    score += servicesMatch * 10

    return Math.round((score / maxScore) * 100)
  }

  private calculateProgramAlignment(student: StudentProfile, college: CommunityCollege): number {
    const studentInterests = student.academicInterests
    const studentGoals = student.careerGoals

    let alignment = 0
    const totalPrograms = college.programs.length

    for (const program of college.programs) {
      let programScore = 0

      // Check if program aligns with academic interests
      for (const interest of studentInterests) {
        if (
          program.name.toLowerCase().includes(interest.toLowerCase()) ||
          program.description.toLowerCase().includes(interest.toLowerCase())
        ) {
          programScore += 0.5
        }
      }

      // Check if program aligns with career goals
      for (const goal of studentGoals) {
        if (goal.includes("Transfer") && program.type === "transfer") {
          programScore += 0.8
        } else if (goal.includes("workforce") && program.type === "certificate") {
          programScore += 0.8
        } else if (goal.includes("Career change") && program.type === "associate") {
          programScore += 0.6
        }
      }

      alignment += Math.min(programScore, 1)
    }

    return totalPrograms > 0 ? alignment / totalPrograms : 0
  }

  private calculateScheduleCompatibility(student: StudentProfile, college: CommunityCollege): number {
    const studentFormat = student.schedulePreferences.format
    const collegeOptions = college.scheduleOptions.map((opt) => opt.toLowerCase())

    if (collegeOptions.includes(studentFormat)) {
      return 1.0
    } else if (studentFormat === "part-time" && collegeOptions.includes("evening")) {
      return 0.8
    } else if (studentFormat === "full-time" && collegeOptions.includes("part-time")) {
      return 0.6
    }

    return 0.3
  }

  private calculateServicesMatch(student: StudentProfile, college: CommunityCollege): number {
    let score = 0
    let maxScore = 0

    // Financial aid services
    if (student.financialConstraints.needsFinancialAid) {
      maxScore += 1
      if (college.studentServices.includes("Financial Aid")) {
        score += 1
      }
    }

    // Career services
    if (student.careerGoals.includes("Enter workforce immediately")) {
      maxScore += 1
      if (college.studentServices.includes("Career Services") || college.studentServices.includes("Career Placement")) {
        score += 1
      }
    }

    // Transfer counseling
    if (student.careerGoals.includes("Transfer to 4-year university")) {
      maxScore += 1
      if (college.studentServices.includes("Transfer Counseling") || college.transferAgreements.length > 0) {
        score += 1
      }
    }

    // Academic support
    maxScore += 1
    if (
      college.studentServices.includes("Tutoring") ||
      college.studentServices.includes("Academic Support") ||
      college.studentServices.includes("Academic Advising")
    ) {
      score += 1
    }

    return maxScore > 0 ? score / maxScore : 0.5
  }

  private generateMatchReasons(student: StudentProfile, college: CommunityCollege): string[] {
    const reasons: string[] = []

    // Financial reasons
    if (college.costs.inStateTuition <= student.financialConstraints.maxTuition) {
      reasons.push(`Tuition ($${college.costs.inStateTuition.toLocaleString()}) fits within your budget`)
    }

    // Program reasons
    const alignedPrograms = this.getRecommendedPrograms(student, college)
    if (alignedPrograms.length > 0) {
      reasons.push(`Offers ${alignedPrograms.length} program(s) matching your interests`)
    }

    // Schedule reasons
    if (college.scheduleOptions.map((opt) => opt.toLowerCase()).includes(student.schedulePreferences.format)) {
      reasons.push(`Offers ${student.schedulePreferences.format} scheduling options`)
    }

    // Services reasons
    if (student.financialConstraints.needsFinancialAid && college.studentServices.includes("Financial Aid")) {
      reasons.push("Provides financial aid services")
    }

    if (student.careerGoals.includes("Transfer to 4-year university") && college.transferAgreements.length > 0) {
      reasons.push(`Has transfer agreements with ${college.transferAgreements.length} universities`)
    }

    return reasons
  }

  private identifyConcerns(student: StudentProfile, college: CommunityCollege): string[] {
    const concerns: string[] = []

    // Financial concerns
    if (college.costs.inStateTuition > student.financialConstraints.maxTuition) {
      const overage = college.costs.inStateTuition - student.financialConstraints.maxTuition
      concerns.push(`Tuition exceeds budget by $${overage.toLocaleString()}`)
    }

    // Schedule concerns
    if (!college.scheduleOptions.map((opt) => opt.toLowerCase()).includes(student.schedulePreferences.format)) {
      concerns.push(`May not offer preferred ${student.schedulePreferences.format} schedule`)
    }

    // Program concerns
    const alignedPrograms = this.getRecommendedPrograms(student, college)
    if (alignedPrograms.length === 0) {
      concerns.push("Limited programs matching your academic interests")
    }

    return concerns
  }

  private getRecommendedPrograms(student: StudentProfile, college: CommunityCollege): Program[] {
    return college.programs.filter((program) => {
      // Check academic interest alignment
      const interestMatch = student.academicInterests.some(
        (interest) =>
          program.name.toLowerCase().includes(interest.toLowerCase()) ||
          program.description.toLowerCase().includes(interest.toLowerCase()),
      )

      // Check career goal alignment
      const goalMatch = student.careerGoals.some((goal) => {
        if (goal.includes("Transfer") && program.type === "transfer") return true
        if (goal.includes("workforce") && program.type === "certificate") return true
        if (goal.includes("Career change")) return true
        return false
      })

      return interestMatch || goalMatch
    })
  }

  private generateNextSteps(college: CommunityCollege): string[] {
    return [
      `Visit ${college.website} for detailed program information`,
      `Contact admissions at ${college.contactInfo.phone}`,
      "Schedule a campus tour",
      "Apply for financial aid if needed",
      "Submit application before deadline",
    ]
  }
}
