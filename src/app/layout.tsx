import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const nunito = Nunito({ subsets: ['latin'], display: 'swap', variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'RankLab — Learning Adventure',
  description: 'Master subjects with fun insights and colorful concepts!',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nunito.className} bg-slate-50 text-slate-800 min-h-screen antialiased`}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-JKX2THHZ14" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JKX2THHZ14');
        `}</Script>
        <Sidebar />
        <main className="md:ml-72 pt-16 md:pt-0 min-h-screen relative overflow-hidden">
          {/* Fun background decorative elements */}
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
             <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-300/20 blur-3xl" />
             <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-300/20 blur-3xl" />
          </div>
          {children}
        </main>
      </body>
    </html>
  )
}
