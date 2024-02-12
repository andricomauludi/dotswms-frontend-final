export const metadata = {
  title: 'DOTS WMS',
  description: 'Website Management System for DOTS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <body>{children}</body>
    </>
  )
}
