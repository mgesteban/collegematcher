import CollegeList from "@/components/college-list"
import { loadCollegesFromCSV } from "@/data/load-colleges" // Ensure this path is correct

export default async function Home() {
  const allColleges = await loadCollegesFromCSV()

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gray-50">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">California Community Colleges</h1>
          <p className="mt-2 text-lg text-gray-600">
            Browse the list of community colleges loaded from our data source.
          </p>
        </header>

        <section>
          {allColleges && allColleges.length > 0 ? (
            <CollegeList colleges={allColleges} />
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-700">Loading college data or no colleges found.</p>
              {/* You could add more specific error handling here if loadCollegesFromCSV could return null/error objects */}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
