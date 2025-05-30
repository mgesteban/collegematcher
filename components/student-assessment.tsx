"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import type { StudentProfile } from "@/types"

interface StudentAssessmentProps {
  onComplete: (profile: StudentProfile) => void
}

export default function StudentAssessment({ onComplete }: StudentAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<Partial<StudentProfile>>({
    academicInterests: [],
    careerGoals: [],
    geographicPreferences: {
      maxDistance: 50,
      preferredStates: [],
      transportationMode: "car",
    },
    financialConstraints: {
      maxTuition: 5000,
      needsFinancialAid: false,
      workStudyInterest: false,
    },
    schedulePreferences: {
      format: "full-time",
      flexibility: "medium",
    },
    personalFactors: {
      age: 18,
      hasFamily: false,
      workingProfessional: false,
      militaryVeteran: false,
    },
  })

  const steps = [
    "Basic Information",
    "Academic Interests",
    "Career Goals",
    "Geographic Preferences",
    "Financial Considerations",
    "Schedule Preferences",
    "Personal Factors",
  ]

  const academicFields = [
    "Business",
    "Healthcare",
    "Technology",
    "Arts & Design",
    "Engineering",
    "Education",
    "Criminal Justice",
    "Culinary Arts",
    "Automotive",
    "Construction",
    "Social Work",
    "Science",
    "Mathematics",
    "Liberal Arts",
  ]

  const careerOptions = [
    "Transfer to 4-year university",
    "Enter workforce immediately",
    "Career change",
    "Skill enhancement",
    "Professional certification",
    "Personal enrichment",
    "Entrepreneurship",
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(profile as StudentProfile)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name || ""}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ""}
                onChange={(e) => updateProfile({ email: e.target.value })}
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={profile.personalFactors?.age || 18}
                onChange={(e) =>
                  updateProfile({
                    personalFactors: {
                      ...profile.personalFactors!,
                      age: Number.parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>Academic Interests (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {academicFields.map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field}
                      checked={profile.academicInterests?.includes(field)}
                      onCheckedChange={(checked) => {
                        const interests = profile.academicInterests || []
                        if (checked) {
                          updateProfile({ academicInterests: [...interests, field] })
                        } else {
                          updateProfile({
                            academicInterests: interests.filter((i) => i !== field),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={field} className="text-sm">
                      {field}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="learning-style">Preferred Learning Style</Label>
              <Select
                value={profile.learningStyle}
                onValueChange={(value) => updateProfile({ learningStyle: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your learning style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual (charts, diagrams, videos)</SelectItem>
                  <SelectItem value="auditory">Auditory (lectures, discussions)</SelectItem>
                  <SelectItem value="kinesthetic">Hands-on (labs, practical work)</SelectItem>
                  <SelectItem value="reading">Reading/Writing (texts, notes)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Career Goals (Select all that apply)</Label>
              <div className="space-y-2 mt-2">
                {careerOptions.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={profile.careerGoals?.includes(goal)}
                      onCheckedChange={(checked) => {
                        const goals = profile.careerGoals || []
                        if (checked) {
                          updateProfile({ careerGoals: [...goals, goal] })
                        } else {
                          updateProfile({
                            careerGoals: goals.filter((g) => g !== goal),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={goal} className="text-sm">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Maximum Distance from Home (miles)</Label>
              <div className="mt-2">
                <Slider
                  value={[profile.geographicPreferences?.maxDistance || 50]}
                  onValueChange={(value) =>
                    updateProfile({
                      geographicPreferences: {
                        ...profile.geographicPreferences!,
                        maxDistance: value[0],
                      },
                    })
                  }
                  max={500}
                  min={5}
                  step={5}
                />
                <div className="text-center mt-1 text-sm text-gray-600">
                  {profile.geographicPreferences?.maxDistance || 50} miles
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="transportation">Primary Transportation</Label>
              <Select
                value={profile.geographicPreferences?.transportationMode}
                onValueChange={(value) =>
                  updateProfile({
                    geographicPreferences: {
                      ...profile.geographicPreferences!,
                      transportationMode: value as any,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Personal Vehicle</SelectItem>
                  <SelectItem value="public">Public Transportation</SelectItem>
                  <SelectItem value="walking">Walking/Biking</SelectItem>
                  <SelectItem value="online">Online Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Maximum Annual Tuition Budget</Label>
              <div className="mt-2">
                <Slider
                  value={[profile.financialConstraints?.maxTuition || 5000]}
                  onValueChange={(value) =>
                    updateProfile({
                      financialConstraints: {
                        ...profile.financialConstraints!,
                        maxTuition: value[0],
                      },
                    })
                  }
                  max={20000}
                  min={1000}
                  step={500}
                />
                <div className="text-center mt-1 text-sm text-gray-600">
                  ${(profile.financialConstraints?.maxTuition || 5000).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="financial-aid"
                  checked={profile.financialConstraints?.needsFinancialAid}
                  onCheckedChange={(checked) =>
                    updateProfile({
                      financialConstraints: {
                        ...profile.financialConstraints!,
                        needsFinancialAid: !!checked,
                      },
                    })
                  }
                />
                <Label htmlFor="financial-aid">I need financial aid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="work-study"
                  checked={profile.financialConstraints?.workStudyInterest}
                  onCheckedChange={(checked) =>
                    updateProfile({
                      financialConstraints: {
                        ...profile.financialConstraints!,
                        workStudyInterest: !!checked,
                      },
                    })
                  }
                />
                <Label htmlFor="work-study">Interested in work-study programs</Label>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="schedule-format">Preferred Schedule Format</Label>
              <Select
                value={profile.schedulePreferences?.format}
                onValueChange={(value) =>
                  updateProfile({
                    schedulePreferences: {
                      ...profile.schedulePreferences!,
                      format: value as any,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time (12+ credits)</SelectItem>
                  <SelectItem value="part-time">Part-time (6-11 credits)</SelectItem>
                  <SelectItem value="evening">Evening classes</SelectItem>
                  <SelectItem value="weekend">Weekend classes</SelectItem>
                  <SelectItem value="online">Online/Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="flexibility">Schedule Flexibility Needed</Label>
              <Select
                value={profile.schedulePreferences?.flexibility}
                onValueChange={(value) =>
                  updateProfile({
                    schedulePreferences: {
                      ...profile.schedulePreferences!,
                      flexibility: value as any,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (need very flexible scheduling)</SelectItem>
                  <SelectItem value="medium">Medium (some flexibility needed)</SelectItem>
                  <SelectItem value="low">Low (can commit to fixed schedule)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-family"
                  checked={profile.personalFactors?.hasFamily}
                  onCheckedChange={(checked) =>
                    updateProfile({
                      personalFactors: {
                        ...profile.personalFactors!,
                        hasFamily: !!checked,
                      },
                    })
                  }
                />
                <Label htmlFor="has-family">I have family responsibilities</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="working-professional"
                  checked={profile.personalFactors?.workingProfessional}
                  onCheckedChange={(checked) =>
                    updateProfile({
                      personalFactors: {
                        ...profile.personalFactors!,
                        workingProfessional: !!checked,
                      },
                    })
                  }
                />
                <Label htmlFor="working-professional">I am currently working</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="military-veteran"
                  checked={profile.personalFactors?.militaryVeteran}
                  onCheckedChange={(checked) =>
                    updateProfile({
                      personalFactors: {
                        ...profile.personalFactors!,
                        militaryVeteran: !!checked,
                      },
                    })
                  }
                />
                <Label htmlFor="military-veteran">I am a military veteran</Label>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Student Assessment</CardTitle>
        <CardDescription>
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </CardDescription>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-[300px]">{renderStep()}</div>
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button onClick={handleNext}>{currentStep === steps.length - 1 ? "Complete Assessment" : "Next"}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
