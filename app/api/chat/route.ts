import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, studentProfile, matches, conversationHistory } = await request.json()

    // Create context about the student and their matches
    const context = `
Student Profile:
- Name: ${studentProfile.name}
- Academic Interests: ${studentProfile.academicInterests.join(", ")}
- Career Goals: ${studentProfile.careerGoals.join(", ")}
- Learning Style: ${studentProfile.learningStyle}
- Schedule Preference: ${studentProfile.schedulePreferences.format}
- Budget: $${studentProfile.financialConstraints.maxTuition.toLocaleString()}
- Needs Financial Aid: ${studentProfile.financialConstraints.needsFinancialAid ? "Yes" : "No"}

Top College Matches:
${matches
  .slice(0, 3)
  .map(
    (match, index) => `
${index + 1}. ${match.college.name} (${match.matchScore}% match)
   - Location: ${match.college.location.city}, ${match.college.location.state}
   - Tuition: $${match.college.costs.inStateTuition.toLocaleString()}
   - Programs: ${match.recommendedPrograms.map((p) => p.name).join(", ")}
   - Match Reasons: ${match.matchReasons.join("; ")}
   - Concerns: ${match.concerns.join("; ") || "None"}
`,
  )
  .join("")}

Previous conversation:
${conversationHistory
  .slice(-5)
  .map((msg) => `${msg.role}: ${msg.content}`)
  .join("\n")}
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a helpful and knowledgeable college counselor AI assistant. You help students understand their community college options and make informed decisions about their education.

Key guidelines:
- Be encouraging and supportive
- Provide specific, actionable advice
- Reference the student's profile and match data when relevant
- Help students understand the pros and cons of different options
- Suggest next steps when appropriate
- Be conversational but professional
- If asked about specific colleges not in the matches, acknowledge you're focusing on their personalized recommendations

You have access to the student's profile and their top college matches. Use this information to provide personalized responses.`,
      prompt: `Student question: ${message}

Context: ${context}

Please provide a helpful, personalized response based on the student's profile and college matches.`,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
