// app/layout.tsx
"use client"
import type React from "react"
import { IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { FooterSection } from "@/components/Reusable/Footer"
import IconImage from "@/assets/logo.png"
import { Navbar } from "@/components/Reusable/Navbar"
import { useEffect, useState } from "react"
import Head from "next/head"

// Load IBM Plex Mono
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const isCurrentlyScrolled = scrollPosition > 50 // Lower threshold for smoother transition
      
      setIsScrolled(isCurrentlyScrolled) 
    }
    
    window.addEventListener('scroll', handleScroll)
    
    // Call once to set initial state
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <html lang="en">
      <Head>
        <title>Two Point Zero Clothing</title>
        <link rel="icon" href={IconImage.src} />
        <link rel="shortcut icon" href={IconImage.src} />
        <link rel="apple-touch-icon" href={IconImage.src} />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body 
        className={`${plexMono.variable} antialiased bg-black`}
        style={{ fontFamily: "var(--font-plex-mono)" }}
      >
        {/* Navbar - Always fixed but with smooth transitions */}
        <div
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:block hidden"
        >
          <Navbar           
            isHeroSection={!isScrolled}
          />
        </div>
        
        {/* Mobile Navbar - Always fixed */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50">
          <Navbar 
            isHeroSection={true}
          />
        </div>
        
        {/* Main content */}
        <main className={isScrolled ? "pt-0" : ""}>
          {children}
        </main>
        
        <FooterSection />
      </body>
    </html>
  )
}