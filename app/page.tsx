"use client"

import { useState } from "react"
import type { StudentProfile, MatchResult } from "@/types"
import { mockColleges } from "@/data/mock-colleges"
import { CollegeMatchingService } from "@/lib/matching-service"
import { geocodeAddress } from "@/lib/geocoding-service"
import StudentAssessment from "@/components/student-assessment"
import MatchResults from "@/components/match-results"
import ChatInterface from "@/components/chat-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Users, MessageCircle, BarChart3 } from "lucide-react"
import CollegeMap from "@/components/college-map"
import ApplicationTracker from "@/components/application-tracker"
import FinancialCalculator from "@/components/financial-calculator"

export default function Home() {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAssessmentComplete = async (profile: StudentProfile) => {
    setIsLoading(true)

    try {
      // Geocode the student's address to get coordinates
      if (profile.address) {
        const coordinates = await geocodeAddress(
          profile.address.street,
          profile.address.city,
          profile.address.state,
          profile.address.zipCode
        )
        
        if (coordinates) {
          profile.address.coordinates = coordinates
        }
      }

      setStudentProfile(profile)

      // Initialize matching service with mock data
      const matchingService = new CollegeMatchingService(mockColleges)

      // Find matches
      const results = await matchingService.findMatches(profile)
      setMatches(results)
    } catch (error) {
      console.error("Error finding matches:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!studentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Community College Matcher</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect community college that matches your goals, interests, and lifestyle. Our AI-powered
              system analyzes your preferences to recommend the best educational opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Personalized Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Complete a comprehensive questionnaire about your academic interests, career goals, and personal
                  preferences.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our AI analyzes hundreds of factors to match you with community colleges that fit your unique needs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">AI Counselor</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Chat with our AI counselor to get personalized advice and answers to your questions about college
                  choices.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <StudentAssessment onComplete={handleAssessmentComplete} />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Finding Your Perfect Matches</h3>
            <p className="text-gray-600 text-center">
              Our AI is analyzing your profile against thousands of community college programs...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {studentProfile.name}!</h1>
          <p className="text-gray-600">Here are your personalized community college recommendations</p>
        </div>

        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="matches">Matches ({matches.length})</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="chat">AI Counselor</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="mt-6">
            <MatchResults matches={matches} />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <ChatInterface studentProfile={studentProfile} matches={matches} />
            </div>
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <CollegeMap matches={matches} studentProfile={studentProfile} />
          </TabsContent>

          <TabsContent value="finances" className="mt-6">
            <FinancialCalculator matches={matches} studentProfile={studentProfile} />
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <ApplicationTracker matches={matches} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
