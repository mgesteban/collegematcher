"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MatchResult, StudentProfile } from "@/types"
import { MapPin, Navigation, Car, Bus, Bike } from "lucide-react"

interface CollegeMapProps {
  matches: MatchResult[]
  studentProfile: StudentProfile
}

export default function CollegeMap({ matches, studentProfile }: CollegeMapProps) {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Location access denied:", error)
          // Fallback to a default location (e.g., center of US)
          setUserLocation({ lat: 39.8283, lng: -98.5795 })
        },
      )
    }
  }, [])

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959 // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getTransportationIcon = (mode: string) => {
    switch (mode) {
      case "car":
        return <Car className="h-4 w-4" />
      case "public":
        return <Bus className="h-4 w-4" />
      case "walking":
        return <Bike className="h-4 w-4" />
      default:
        return <Navigation className="h-4 w-4" />
    }
  }

  const getEstimatedTravelTime = (distance: number, mode: string): string => {
    const speeds = {
      car: 35, // mph average with traffic
      public: 15, // mph average public transport
      walking: 3, // mph walking/biking
      online: 0,
    }

    if (mode === "online") return "Online - No travel required"

    const speed = speeds[mode as keyof typeof speeds] || 35
    const time = (distance / speed) * 60 // minutes

    if (time < 60) {
      return `~${Math.round(time)} minutes`
    } else {
      const hours = Math.floor(time / 60)
      const minutes = Math.round(time % 60)
      return `~${hours}h ${minutes}m`
    }
  }

  if (!userLocation) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Colleges Near You
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Simple map representation */}
          <div className="bg-gray-100 rounded-lg p-6 mb-4 relative min-h-[400px]">
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
              📍 Your Location
            </div>

            {/* College markers */}
            {matches.slice(0, 5).map((match, index) => {
              const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                match.college.location.coordinates.lat,
                match.college.location.coordinates.lng,
              )

              return (
                <div
                  key={match.college.id}
                  className={`absolute bg-white border-2 rounded-lg p-2 cursor-pointer shadow-md transition-all ${
                    selectedCollege === match.college.id ? "border-blue-500 scale-110" : "border-gray-300"
                  }`}
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + index * 10}%`,
                  }}
                  onClick={() => setSelectedCollege(match.college.id)}
                >
                  <div className="text-xs font-medium">{match.college.name}</div>
                  <div className="text-xs text-gray-600">{Math.round(distance)} miles</div>
                  <Badge variant={match.matchScore >= 80 ? "default" : "secondary"} className="text-xs">
                    {match.matchScore}%
                  </Badge>
                </div>
              )
            })}
          </div>

          {/* Distance and travel information */}
          <div className="grid gap-4">
            {matches.slice(0, 5).map((match) => {
              const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                match.college.location.coordinates.lat,
                match.college.location.coordinates.lng,
              )

              return (
                <div
                  key={match.college.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCollege === match.college.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedCollege(match.college.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{match.college.name}</h4>
                    <Badge
                      variant={distance <= studentProfile.geographicPreferences.maxDistance ? "default" : "secondary"}
                    >
                      {Math.round(distance)} miles
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      {getTransportationIcon(studentProfile.geographicPreferences.transportationMode)}
                      {getEstimatedTravelTime(distance, studentProfile.geographicPreferences.transportationMode)}
                    </div>
                    <div>
                      {match.college.location.city}, {match.college.location.state}
                    </div>
                  </div>

                  {distance > studentProfile.geographicPreferences.maxDistance && (
                    <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                      ⚠️ Exceeds your preferred maximum distance of {studentProfile.geographicPreferences.maxDistance}{" "}
                      miles
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
