import '../tailwind.css'

export const metadata = {
  title: 'YouTube Clone',
  description: 'A YouTube clone built with Next.js and React',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
