import '../tailwind.css'

export const metadata = {
  title: 'ZenTuber',
  description: 'ZenTuber Guided Mastery Engine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white min-h-screen">{children}</body>
    </html>
  )
}
