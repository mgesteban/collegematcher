"use client"

import type { CommunityCollege } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface CollegeListProps {
  colleges: CommunityCollege[]
}

export default function CollegeList({ colleges }: CollegeListProps) {
  if (!colleges || colleges.length === 0) {
    return <p>No colleges to display.</p>
  }

  return (
    <div className="space-y-4">
      {colleges.map((college) => (
        <Card key={college.id}>
          <CardHeader>
            <CardTitle>
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {college.name}
              </a>
            </CardTitle>
            <CardDescription>
              Website:{" "}
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:underline"
              >
                {college.website}
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Location: {college.location.city || "N/A"}, {college.location.state || "N/A"}
            </p>
            {/* We can add more details here as they become available from scraping */}
            <p className="text-xs text-gray-500 mt-2">ID: {college.id}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
