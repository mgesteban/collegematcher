import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-gray-100 p-6 text-center">
      <header className="mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Find Your Perfect Community College</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Our intelligent agent helps you discover community colleges that match your skills, interests, and career
          goals.
        </p>
      </header>

      <main className="mb-12">
        <Link href="/assessment">
          <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white shadow-lg">
            Start Your Assessment
          </Button>
        </Link>
      </main>

      <section className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-sky-700 mb-2">Personalized Matches</h3>
          <p className="text-gray-600">
            Answer a few questions, and we'll find colleges tailored to your unique profile.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-sky-700 mb-2">Comprehensive Data</h3>
          <p className="text-gray-600">Access detailed information on programs, tuition, and student services.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-sky-700 mb-2">AI-Powered Guidance</h3>
          <p className="text-gray-600">Chat with our AI to understand your options and plan your next steps.</p>
        </div>
      </section>

      <footer className="mt-16 text-gray-500">
        <p>&copy; {new Date().getFullYear()} Community College Matcher. All rights reserved.</p>
      </footer>
    </div>
  )
}
