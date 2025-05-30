"use server"

import type { StudentProfile, MatchResult } from "@/lib/types"
import { mockColleges } from "@/lib/college-data"
import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic" // Ensure ANTHROPIC_API_KEY is set

// In a real app, you'd save this to a database and return a real ID.
// For now, we'll "store" it in memory (will be lost on server restart).
const studentAssessments: Record<string, { profile: StudentProfile; recommendations: MatchResult[] }> = {}

export async function submitAssessment(
  profile: StudentProfile,
): Promise<{ studentId?: string; recommendations?: MatchResult[]; error?: string }> {
  try {
    console.log("Received student profile:", profile)

    // Simulate Apify data fetch - we already have mockColleges
    const colleges = mockColleges

    // Construct prompt for Claude (Anthropic)
    const prompt = `
      A student has provided the following profile:
      - Academic Interests: ${profile.academicInterests.join(", ")}
      - Career Aspirations: ${profile.careerAspirations}
      - Preferred Learning Style: ${profile.learningStyle}
      - Geographic Preference: ${profile.geographicPreference || "Not specified"}
      - Max Annual Tuition Budget: $${profile.financialBudget}
      - Schedule Preference: ${profile.schedulePreference.join(", ")}
      ${profile.additionalNotes ? `- Additional Notes: ${profile.additionalNotes}` : ""}

      Here is a list of available community colleges:
      ${colleges
        .map(
          (college) => `
        ---
        College ID: ${college.id}
        Name: ${college.name}
        Location: ${college.location}
        Programs: ${college.programs.join(", ")}
        Annual Tuition: $${college.tuition}
        Financial Aid Available: ${college.financialAid ? "Yes" : "No"}
        Schedule Options: ${college.scheduleOptions.join(", ")}
        Transfer Agreements with: ${college.transferAgreements.join(", ") || "None listed"}
        Description: ${college.description}
        ---
      `,
        )
        .join("\n")}

      Based on the student's profile and the college data, provide a ranked list of the top 3 most suitable colleges.
      For each recommended college, include:
      1. collegeId: The ID of the college.
      2. collegeName: The name of the college.
      3. matchScore: A numerical score from 0 to 100 indicating the suitability, where 100 is a perfect match.
      4. explanation: A brief explanation (1-2 sentences) of why this college is a good match.
      5. pros: A list of 2-3 specific advantages for this student.
      6. cons: A list of 1-2 potential drawbacks or areas where it might not be a perfect fit.

      Return the recommendations as a JSON array of objects. Each object should follow this structure:
      {
        "collegeId": "string",
        "collegeName": "string",
        "matchScore": number,
        "explanation": "string",
        "pros": ["string", "string"],
        "cons": ["string"]
      }

      Ensure the output is ONLY the JSON array, without any introductory text or markdown formatting.
    `

    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"), // Or other Claude model
      prompt: prompt,
      // You could add system prompts or other configurations here
    }) // [^1]

    let recommendations: MatchResult[]
    try {
      recommendations = JSON.parse(text)
    } catch (parseError) {
      console.error("Error parsing Claude's response:", parseError)
      console.error("Claude's raw response:", text)
      return { error: "Failed to process AI recommendations. The AI returned an unexpected format." }
    }

    console.log("Claude recommendations:", recommendations)

    // Generate a simple unique ID for this "session"
    const studentId = `student-${Date.now()}-${Math.random().toString(36).substring(7)}`
    studentAssessments[studentId] = { profile, recommendations }

    return { studentId, recommendations }
  } catch (error) {
    console.error("Error in submitAssessment:", error)
    // Check if it's an API error from Anthropic (you might need to inspect the error object structure)
    if (error && typeof error === "object" && "message" in error) {
      const typedError = error as { message: string; type?: string; status?: number }
      if (typedError.message.includes("API key")) {
        return { error: "AI service API key is invalid or missing. Please check your environment variables." }
      }
      return { error: `An AI service error occurred: ${typedError.message}` }
    }
    return { error: "An unexpected error occurred while processing your assessment." }
  }
}

// Function to retrieve stored assessment (e.g., for the recommendations page)
export async function getAssessmentResults(
  studentId: string,
): Promise<{ profile: StudentProfile; recommendations: MatchResult[] } | null> {
  return studentAssessments[studentId] || null
}
