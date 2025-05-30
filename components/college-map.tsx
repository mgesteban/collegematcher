"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MatchResult, StudentProfile } from "@/types"
import { MapPin, Navigation, Car, Bus, Bike } from "lucide-react"

// Dynamic import of react-leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false })

interface CollegeMapProps {
  matches: MatchResult[]
  studentProfile: StudentProfile
}

export default function CollegeMap({ matches, studentProfile }: CollegeMapProps) {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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

  if (!userLocation || !isClient) {
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

  // Import Leaflet CSS
  if (typeof window !== 'undefined') {
    require('leaflet/dist/leaflet.css')
  }

  // Fix for default marker icon in react-leaflet
  if (typeof window !== 'undefined') {
    const L = require('leaflet')
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })
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
          {/* Interactive Leaflet Map */}
          <div className="rounded-lg overflow-hidden mb-4" style={{ height: "500px" }}>
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={10}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* User location marker */}
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                  <div className="text-center">
                    <strong>Your Location</strong>
                  </div>
                </Popup>
              </Marker>
              
              {/* Preferred distance circle */}
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={studentProfile.geographicPreferences.maxDistance * 1609.34} // Convert miles to meters
                pathOptions={{ color: 'blue', fillColor: '#30f', fillOpacity: 0.1 }}
              />
              
              {/* College markers */}
              {matches.map((match) => {
                const distance = calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  match.college.location.coordinates.lat,
                  match.college.location.coordinates.lng,
                )
                
                return (
                  <Marker
                    key={match.college.id}
                    position={[match.college.location.coordinates.lat, match.college.location.coordinates.lng]}
                    eventHandlers={{
                      click: () => setSelectedCollege(match.college.id),
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-medium">{match.college.name}</h4>
                        <p className="text-sm text-gray-600">
                          {match.college.location.city}, {match.college.location.state}
                        </p>
                        <div className="mt-2 space-y-1">
                          <Badge variant={match.matchScore >= 80 ? "default" : "secondary"}>
                            Match: {match.matchScore}%
                          </Badge>
                          <p className="text-xs text-gray-600">{Math.round(distance)} miles away</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
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