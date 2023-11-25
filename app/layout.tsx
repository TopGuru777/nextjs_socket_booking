import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calender',
  description: 'Event generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="h-full bg-white">{children}</body>
    </html>
  )
}
