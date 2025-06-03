import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Community College Matcher',
  description: 'Find the perfect community college that matches your goals, interests, and lifestyle with our AI-powered matching system.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
