"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import { Badge } from "@/components/ui/badge"
import type { MatchResult, StudentProfile } from "@/types"
import "leaflet/dist/leaflet.css"

interface LeafletMapProps {
  userLocation: { lat: number; lng: number }
  matches: MatchResult[]
  studentProfile: StudentProfile
  selectedCollege: string | null
  onCollegeClick: (collegeId: string) => void
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number
}

export default function LeafletMap({ 
  userLocation, 
  matches, 
  studentProfile, 
  selectedCollege, 
  onCollegeClick,
  calculateDistance 
}: LeafletMapProps) {
  useEffect(() => {
    // Fix for default marker icon in react-leaflet
    const L = require('leaflet')
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })
  }, [])

  return (
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
            {studentProfile.address && (
              <div className="text-sm text-gray-600 mt-1">
                {studentProfile.address.city}, {studentProfile.address.state}
              </div>
            )}
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
              click: () => onCollegeClick(match.college.id),
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
  )
}