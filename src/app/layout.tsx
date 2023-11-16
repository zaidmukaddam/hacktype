import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Urbanist } from "next/font/google"

import {
  APP_NAME,
  BASE_URL,
  title,
  description,
  baseOpenGraphMetadata,
  baseTwitterMetadata,
} from "@/config"

const urban = Urbanist({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title,
  description,
  applicationName: APP_NAME,
  robots: "index, follow",
  metadataBase: new URL(BASE_URL),
  openGraph: baseOpenGraphMetadata,
  twitter: baseTwitterMetadata,
  icons: {
    icon: "/favicon.ico"
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${urban.className}`}>
        <div className="bg-gray-100">
          {children}
        </div>
      </body>
    </html>
  )
}
