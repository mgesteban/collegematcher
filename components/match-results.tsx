"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { MatchResult } from "@/types"
import { MapPin, DollarSign, Clock, GraduationCap, Phone, Mail, ExternalLink } from "lucide-react"

interface MatchResultsProps {
  matches: MatchResult[]
}

export default function MatchResults({ matches }: MatchResultsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your College Matches</h2>
        <p className="text-gray-600">Found {matches.length} community colleges that match your preferences</p>
      </div>

      <div className="grid gap-6">
        {matches.map((match, index) => (
          <Card key={match.college.id} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {match.college.name}
                    <Badge
                      variant={match.matchScore >= 80 ? "default" : match.matchScore >= 60 ? "secondary" : "outline"}
                    >
                      {match.matchScore}% Match
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {match.college.location.city}, {match.college.location.state}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />${match.college.costs.inStateTuition.toLocaleString()}/year
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4" />
                    {match.college.studentPopulation.toLocaleString()} students
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Match Reasons */}
              <div>
                <h4 className="font-semibold text-green-700 mb-2">Why this is a good match:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {match.matchReasons.map((reason, idx) => (
                    <li key={idx} className="text-green-600">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concerns */}
              {match.concerns.length > 0 && (
                <div>
                  <h4 className="font-semibold text-orange-700 mb-2">Things to consider:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {match.concerns.map((concern, idx) => (
                      <li key={idx} className="text-orange-600">
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Programs */}
              {match.recommendedPrograms.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Recommended Programs:</h4>
                  <div className="grid gap-2">
                    {match.recommendedPrograms.map((program) => (
                      <div key={program.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium">{program.name}</h5>
                          <Badge variant="outline">{program.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{program.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {program.duration}
                          </span>
                          <span>{program.credits} credits</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* College Details */}
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h4 className="font-semibold mb-2">Schedule Options:</h4>
                  <div className="flex flex-wrap gap-1">
                    {match.college.scheduleOptions.map((option) => (
                      <Badge key={option} variant="secondary" className="text-xs">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Student Services:</h4>
                  <div className="flex flex-wrap gap-1">
                    {match.college.studentServices.slice(0, 4).map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {match.college.studentServices.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{match.college.studentServices.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" asChild>
                  <a href={match.college.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit Website
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${match.college.contactInfo.phone}`}>
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${match.college.contactInfo.email}`}>
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </a>
                </Button>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="font-semibold mb-2">Next Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {match.nextSteps.map((step, idx) => (
                    <li key={idx} className="text-gray-600">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
