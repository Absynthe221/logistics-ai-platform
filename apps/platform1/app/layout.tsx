import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Navigation } from '@/components/layout/Navigation'
import { NextAuthProvider } from '@/components/auth/NextAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Logistics Nigeria - AI-Powered Freight Platform',
  description: 'One barcode, one dashboard, complete freight visibility. SME-focused logistics platform for Nigeria & ECOWAS.',
  keywords: 'logistics, freight, Nigeria, ECOWAS, LTL, barcode tracking, AI optimization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <NextAuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </NextAuthProvider>
      </body>
    </html>
  )
}
