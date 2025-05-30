import type { CommunityCollege } from "@/types" // Assuming types/index.ts is at the root or correctly aliased

// Helper function to generate a simple ID from a name
function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export async function loadCollegesFromCSV(): Promise<CommunityCollege[]> {
  try {
    // Fetch the CSV file from the public directory
    // Ensure 'public/data/california-community-colleges.csv' exists
    const response = await fetch("/data/california-community-colleges.csv")
    if (!response.ok) {
      console.error("Failed to fetch CSV:", response.status, response.statusText)
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }
    const csvText = await response.text()
    const lines = csvText.split("\n")

    // Skip header row, and ensure lines are valid
    const colleges: CommunityCollege[] = lines
      .slice(1) // Skip header
      .map((line) => line.trim())
      .filter((line) => line) // Remove empty lines
      .map((line, index) => {
        const parts = line.split(",") // Simple CSV split, assumes no commas in names/URLs
        const collegeName = parts[0]?.trim() || `Unknown College ${index + 1}`
        const website = parts[1]?.trim() || "http://example.com"

        // Create a CommunityCollege object with defaults for missing fields
        return {
          id: generateId(collegeName),
          name: collegeName,
          website: website,
          location: {
            city: "Unknown",
            state: "CA", // Default to CA
            zipCode: "00000",
            addressLine1: "",
            coordinates: { lat: 0, lng: 0 },
          },
          programs: [],
          admissionRequirements: {
            gpaMinimum: 0,
            testScores: [],
            prerequisites: ["High School Diploma or GED or Age 18+"],
          },
          costs: {
            inStateTuition: 0,
            outOfStateTuition: 0,
            fees: 0,
            estimatedTotal: 0,
            booksAndSupplies: 0,
            roomAndBoard: 0,
          },
          scheduleOptions: ["Full-time", "Part-time"],
          facilities: ["Library"],
          studentServices: ["Academic Advising"],
          studentBodySize: 0,
          graduationRate: 0,
          transferRate: 0,
          demographics: {
            percentPellGrant: 0,
            raceEthnicity: {},
          },
          hasEveningClasses: false,
          hasOnlineClasses: false,
          hasPartTimeStudies: false,
          applicationDeadline: "Rolling",
          financialAidDeadline: "Varies",
          contactInfo: {
            phone: "N/A",
            email: "N/A",
          },
          accreditation: "Accredited",
          notes: "",
          tags: [],
          imageGallery: [],
          virtualTourLink: "",
          ranking: 0,
          averageSalaryAfter10Years: 0,
          acceptanceRate: 0,
        }
      })

    return colleges
  } catch (error) {
    console.error("Error in loadCollegesFromCSV:", error)
    return [] // Return an empty array or handle error as appropriate
  }
}
