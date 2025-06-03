import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Community College Matcher',
  description: 'Find the perfect community college that matches your goals, interests, and lifestyle with our AI-powered matching system.',
  generator: 'Next.js',
  openGraph: {
    title: 'College Matcher',
    description: 'Find the perfect community college that matches your goals, interests, and lifestyle with our AI-powered matching system.',
    type: 'website',
    siteName: 'College Matcher',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'College Matcher',
    description: 'Find the perfect community college that matches your goals, interests, and lifestyle with our AI-powered matching system.',
  },
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
