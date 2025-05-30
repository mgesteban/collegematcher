import AssessmentForm from "@/components/assessment-form"

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Student Assessment</h1>
          <p className="mt-4 text-xl text-gray-600">
            Tell us about yourself so we can find the best community colleges for you.
          </p>
        </header>
        <AssessmentForm />
      </div>
    </div>
  )
}
