"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import type { MatchResult } from "@/types"
import { CheckCircle, Clock, AlertCircle, Calendar, FileText, GraduationCap, Plus, Edit } from "lucide-react"

interface ApplicationTrackerProps {
  matches: MatchResult[]
}

interface ApplicationStatus {
  id: string
  collegeId: string
  collegeName: string
  status: "not-started" | "in-progress" | "submitted" | "accepted" | "declined" | "waitlisted"
  applicationDeadline: string
  documentsSubmitted: string[]
  requiredDocuments: string[]
  notes: string
  financialAidApplied: boolean
  financialAidDeadline?: string
  acceptanceDeadline?: string
  createdAt: Date
  updatedAt: Date
}

const defaultRequiredDocuments = [
  "High School Transcript",
  "Application Form",
  "Placement Test Scores",
  "Photo ID",
  "FAFSA (if applying for aid)",
]

export default function ApplicationTracker({ matches }: ApplicationTrackerProps) {
  const [applications, setApplications] = useState<ApplicationStatus[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingApplication, setEditingApplication] = useState<string | null>(null)

  const addApplication = (collegeId: string, collegeName: string) => {
    const newApplication: ApplicationStatus = {
      id: Date.now().toString(),
      collegeId,
      collegeName,
      status: "not-started",
      applicationDeadline: "",
      documentsSubmitted: [],
      requiredDocuments: [...defaultRequiredDocuments],
      notes: "",
      financialAidApplied: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setApplications((prev) => [...prev, newApplication])
    setShowAddForm(false)
  }

  const updateApplication = (id: string, updates: Partial<ApplicationStatus>) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, ...updates, updatedAt: new Date() } : app)))
  }

  const toggleDocument = (appId: string, document: string) => {
    const app = applications.find((a) => a.id === appId)
    if (!app) return

    const isSubmitted = app.documentsSubmitted.includes(document)
    const newDocuments = isSubmitted
      ? app.documentsSubmitted.filter((doc) => doc !== document)
      : [...app.documentsSubmitted, document]

    updateApplication(appId, { documentsSubmitted: newDocuments })
  }

  const getStatusIcon = (status: ApplicationStatus["status"]) => {
    switch (status) {
      case "not-started":
        return <Clock className="h-4 w-4 text-gray-500" />
      case "in-progress":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "submitted":
        return <FileText className="h-4 w-4 text-green-500" />
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "declined":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "waitlisted":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: ApplicationStatus["status"]) => {
    switch (status) {
      case "not-started":
        return "secondary"
      case "in-progress":
        return "default"
      case "submitted":
        return "outline"
      case "accepted":
        return "default"
      case "declined":
        return "destructive"
      case "waitlisted":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const calculateProgress = (app: ApplicationStatus): number => {
    const totalTasks = app.requiredDocuments.length + 1 // +1 for application submission
    let completedTasks = app.documentsSubmitted.length

    if (app.status === "submitted" || app.status === "accepted" || app.status === "declined") {
      completedTasks += 1
    }

    return Math.round((completedTasks / totalTasks) * 100)
  }

  const getDaysUntilDeadline = (deadline: string): number => {
    if (!deadline) return 999
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Application Tracker
            </CardTitle>
            <Button onClick={() => setShowAddForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Application
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-4">Start tracking your college applications to stay organized</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Your First Application
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const progress = calculateProgress(app)
                const daysUntilDeadline = getDaysUntilDeadline(app.applicationDeadline)

                return (
                  <Card key={app.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-lg">{app.collegeName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(app.status)}
                            <Badge variant={getStatusColor(app.status)}>
                              {app.status.replace("-", " ").toUpperCase()}
                            </Badge>
                            {app.applicationDeadline && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Calendar className="h-3 w-3" />
                                {daysUntilDeadline >= 0 ? (
                                  <span className={daysUntilDeadline <= 7 ? "text-red-600 font-medium" : ""}>
                                    {daysUntilDeadline} days left
                                  </span>
                                ) : (
                                  <span className="text-red-600">Overdue</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setEditingApplication(app.id)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-gray-600">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        <div>
                          <h5 className="text-sm font-medium mb-2">Required Documents</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {app.requiredDocuments.map((doc) => (
                              <div
                                key={doc}
                                className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                                onClick={() => toggleDocument(app.id, doc)}
                              >
                                <div
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    app.documentsSubmitted.includes(doc)
                                      ? "bg-green-500 border-green-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {app.documentsSubmitted.includes(doc) && (
                                    <CheckCircle className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <span
                                  className={`text-sm ${
                                    app.documentsSubmitted.includes(doc) ? "line-through text-gray-500" : ""
                                  }`}
                                >
                                  {doc}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {app.notes && (
                          <div>
                            <h5 className="text-sm font-medium mb-1">Notes</h5>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{app.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Add Application Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Add New Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select College</Label>
                    <Select
                      onValueChange={(value) => {
                        const [collegeId, collegeName] = value.split("|")
                        addApplication(collegeId, collegeName)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a college" />
                      </SelectTrigger>
                      <SelectContent>
                        {matches
                          .filter((match) => !applications.some((app) => app.collegeId === match.college.id))
                          .map((match) => (
                            <SelectItem key={match.college.id} value={`${match.college.id}|${match.college.name}`}>
                              {match.college.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Edit Application Modal */}
          {editingApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Edit Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const app = applications.find((a) => a.id === editingApplication)
                    if (!app) return null

                    return (
                      <>
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={app.status}
                            onValueChange={(value) => updateApplication(app.id, { status: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not-started">Not Started</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="submitted">Submitted</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="declined">Declined</SelectItem>
                              <SelectItem value="waitlisted">Waitlisted</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Application Deadline</Label>
                          <Input
                            type="date"
                            value={app.applicationDeadline}
                            onChange={(e) => updateApplication(app.id, { applicationDeadline: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label>Notes</Label>
                          <Textarea
                            value={app.notes}
                            onChange={(e) => updateApplication(app.id, { notes: e.target.value })}
                            placeholder="Add any notes about this application..."
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setEditingApplication(null)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setEditingApplication(null)}>Save Changes</Button>
                        </div>
                      </>
                    )
                  })()}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
