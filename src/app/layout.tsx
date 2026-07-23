import '../tailwind.css'
import ThemeWrapper from '../components/ThemeWrapper'

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
      <body>
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  )
}
