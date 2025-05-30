export async function geocodeAddress(
  street: string,
  city: string,
  state: string,
  zipCode: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    // Using Nominatim OpenStreetMap geocoding service (free, no API key required)
    const address = `${street}, ${city}, ${state} ${zipCode}, USA`
    const encodedAddress = encodeURIComponent(address)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CommunityCollegeMatcher/1.0'
      }
    })

    if (!response.ok) {
      console.error('Geocoding request failed:', response.statusText)
      return null
    }

    const data = await response.json()

    if (data && data.length > 0) {
      const result = data[0]
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      }
    }

    // Fallback: try with just city, state, and zip
    const fallbackAddress = `${city}, ${state} ${zipCode}, USA`
    const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackAddress)}&limit=1`
    
    const fallbackResponse = await fetch(fallbackUrl, {
      headers: {
        'User-Agent': 'CommunityCollegeMatcher/1.0'
      }
    })

    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json()
      if (fallbackData && fallbackData.length > 0) {
        const result = fallbackData[0]
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error geocoding address:', error)
    return null
  }
}

// Calculate distance between two coordinates in miles
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * 
    Math.cos((lat2 * Math.PI) / 180) * 
    Math.sin(dLng / 2) * 
    Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}