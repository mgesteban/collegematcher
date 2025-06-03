import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import type { MatchResult, ChatMessage } from "@/types"

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
${(matches as MatchResult[])
  .slice(0, 3)
  .map(
    (match: MatchResult, index: number) => `
${index + 1}. ${match.college.name} (${match.matchScore}% match)
   - Location: ${match.college.location.city}, ${match.college.location.state}
   - Tuition: $${match.college.costs.inStateTuition.toLocaleString()}
   - Programs: ${match.recommendedPrograms.map((p: any) => p.name).join(", ")}
   - Match Reasons: ${match.matchReasons.join("; ")}
   - Concerns: ${match.concerns.join("; ") || "None"}
`,
  )
  .join("")}

Previous conversation:
${(conversationHistory as ChatMessage[])
  .slice(-5)
  .map((msg: ChatMessage) => `${msg.role}: ${msg.content}`)
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
- IMPORTANT: Do not use any markdown formatting in your responses. Avoid using **, *, #, or other special formatting characters. Write in plain text only.

You have access to the student's profile and their top college matches. Use this information to provide personalized responses.`,
      prompt: `Student question: ${message}

Context: ${context}

Please provide a helpful, personalized response based on the student's profile and college matches. Remember to use plain text only without any markdown formatting characters like **, *, #, etc.`,
    })

    // Clean up any remaining markdown formatting characters from the response
    const cleanedText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting **text**
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic formatting *text*
      .replace(/#{1,6}\s/g, '')        // Remove heading markers # ## ### etc.
      .replace(/`(.*?)`/g, '$1')       // Remove inline code formatting `text`
      .replace(/```[\s\S]*?```/g, '')  // Remove code blocks ```text```
      .replace(/^\s*[-*+]\s/gm, '')    // Remove bullet points - * +
      .replace(/^\s*\d+\.\s/gm, '')    // Remove numbered lists 1. 2. etc.
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links [text](url) -> text
      .replace(/_{2,}/g, '')           // Remove underline formatting __text__
      .replace(/~{2,}/g, '')           // Remove strikethrough ~~text~~
      .trim()

    return NextResponse.json({ response: cleanedText })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
