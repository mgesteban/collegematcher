"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { StudentProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { submitAssessment } from "@/app/actions/assessment" // We'll create this next
import { Loader2 } from "lucide-react"

const academicInterestsOptions = [
  "Computer Science",
  "Nursing",
  "Business",
  "Graphic Design",
  "Welding",
  "Liberal Arts",
  "Data Analytics",
  "Cybersecurity",
  "Culinary Arts",
  "Automotive",
  "Fine Arts",
]
const learningStyleOptions = [
  { value: "visual", label: "Visual (learn by seeing)" },
  { value: "auditory", label: "Auditory (learn by hearing)" },
  { value: "kinesthetic", label: "Kinesthetic (learn by doing)" },
  { value: "reading/writing", label: "Reading/Writing (learn by reading and writing)" },
  { value: "mixed", label: "Mixed (a combination of styles)" },
]

export default function AssessmentForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<StudentProfile>>({
    academicInterests: [],
    careerAspirations: "",
    learningStyle: "mixed",
    geographicPreference: "",
    financialBudget: 5000,
    schedulePreference: ["full-time"],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentValues = (prev[name] as string[]) || []
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] }
      } else {
        return { ...prev, [name]: currentValues.filter((item) => item !== value) }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        // Basic validation
        if (!formData.academicInterests || formData.academicInterests.length === 0) {
          setError("Please select at least one academic interest.")
          return
        }
        if (!formData.careerAspirations?.trim()) {
          setError("Please describe your career aspirations.")
          return
        }

        const result = await submitAssessment(formData as StudentProfile)
        if (result.error) {
          setError(result.error)
        } else if (result.studentId) {
          router.push(`/recommendations/${result.studentId}`)
        } else {
          setError("An unexpected error occurred.")
        }
      } catch (err) {
        console.error("Submission error:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred during submission.")
      }
    })
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Help us understand your preferences to find the best match.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          {/* Academic Interests */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Academic Interests</Label>
            <p className="text-sm text-gray-500">Select all that apply.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              {academicInterestsOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interest-${interest}`}
                    onCheckedChange={(checked) => handleCheckboxChange("academicInterests", interest, !!checked)}
                    checked={(formData.academicInterests || []).includes(interest)}
                  />
                  <Label htmlFor={`interest-${interest}`} className="font-normal">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Career Aspirations */}
          <div className="space-y-2">
            <Label htmlFor="careerAspirations" className="text-lg font-semibold">
              Career Aspirations
            </Label>
            <Textarea
              id="careerAspirations"
              name="careerAspirations"
              value={formData.careerAspirations}
              onChange={handleChange}
              placeholder="e.g., Software Engineer, Registered Nurse, Small Business Owner"
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Learning Style */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Preferred Learning Style</Label>
            <Select
              name="learningStyle"
              value={formData.learningStyle}
              onValueChange={(value) => handleSelectChange("learningStyle", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your learning style" />
              </SelectTrigger>
              <SelectContent>
                {learningStyleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Geographic Preference */}
          <div className="space-y-2">
            <Label htmlFor="geographicPreference" className="text-lg font-semibold">
              Geographic Preference
            </Label>
            <Input
              id="geographicPreference"
              name="geographicPreference"
              value={formData.geographicPreference}
              onChange={handleChange}
              placeholder="e.g., Near San Francisco, CA; Online only; State of Texas"
            />
          </div>

          {/* Financial Budget */}
          <div className="space-y-2">
            <Label htmlFor="financialBudget" className="text-lg font-semibold">
              Maximum Annual Tuition Budget (USD)
            </Label>
            <Input
              id="financialBudget"
              name="financialBudget"
              type="number"
              value={formData.financialBudget}
              onChange={handleChange}
              placeholder="e.g., 5000"
            />
          </div>

          {/* Schedule Preference */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Schedule Preference</Label>
            <p className="text-sm text-gray-500">Select all that apply.</p>
            <div className="flex flex-wrap gap-4 pt-2">
              {["full-time", "part-time", "evening"].map((pref) => (
                <div key={pref} className="flex items-center space-x-2">
                  <Checkbox
                    id={`schedule-${pref}`}
                    onCheckedChange={(checked) => handleCheckboxChange("schedulePreference", pref, !!checked)}
                    checked={(formData.schedulePreference || []).includes(
                      pref as "full-time" | "part-time" | "evening",
                    )}
                  />
                  <Label htmlFor={`schedule-${pref}`} className="font-normal capitalize">
                    {pref}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Find My Matches"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
