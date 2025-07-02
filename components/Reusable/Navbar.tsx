"use client"
import { LogoImg } from "@/assets"
import { CartIcon } from "@/assets/HomeIcons"
import Image from "next/image"
import { Container } from "./Container"
import { CyberText } from "./CyberText"
import { useEffect, useState } from "react"
import Link from "next/link"

const INFO_MESSAGES = [
  "EMPHASIS ON CRAFTSMANSHIP AND QUALITY",
  "FREE SHIPPING ON ORDERS OVER $100",
  "NEW COLLECTION DROPPING SOON",
  "SUSTAINABLE FASHION FOR THE FUTURE",
  "HANDCRAFTED WITH PRECISION AND CARE",
]

// InfoBar Component
function InfoBar({ isScrolled }: { isScrolled: boolean }) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % INFO_MESSAGES.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`bg-[#0b0b0b] text-white md:block hidden overflow-hidden transition-all duration-500 ease-in-out ${
      isScrolled ? 'max-h-0 py-0' : 'max-h-20 py-4'
    }`}>
      <div className="text-center px-4">
        <p className={`text-xs tracking-widest font-[400] leading-3.5 transition-opacity duration-500 ${
          isScrolled ? 'opacity-0' : 'opacity-100'
        }`}>
          {INFO_MESSAGES[currentMessageIndex]}
        </p>
      </div>
    </div>
  )
}

// Hamburger Icon Component
function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-7 h-7 relative">
      <span
        className={`block absolute h-0.5 w-7 bg-gradient-to-r from-[#84cecb] to-white rounded-full transform transition-all duration-700 ease-in-out ${
          isOpen ? "rotate-[45deg] top-3 w-7 scale-x-100" : "top-1 scale-x-100 w-7"
        }`}
      ></span>
      <span
        className={`block absolute h-0.5 w-5 bg-gradient-to-r from-[#84cecb] to-white rounded-full transform transition-all duration-700 ease-in-out ${
          isOpen ? "opacity-0 scale-x-0" : "top-3 opacity-100 scale-x-100 w-5 right-0"
        }`}
      ></span>
      <span
        className={`block absolute h-0.5 w-3 bg-gradient-to-r from-[#84cecb] to-white rounded-full transform transition-all duration-700 ease-in-out ${
          isOpen ? "-rotate-[45deg] top-3 w-7 scale-x-100" : "top-5 scale-x-100 w-3 right-0"
        }`}
      ></span>
    </div>
  )
}

// Fixed Navbar component
interface NavbarProps {
  handleMenuOpen?: (isOpen: boolean) => void
  isHeroSection?: boolean
}

export function Navbar({ handleMenuOpen, isHeroSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50) // Hide InfoBar after scrolling 50px
    }

    window.addEventListener('scroll', handleScroll)
    // Set initial state
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    const newState = !isOpen

    // Disable scrolling immediately if opening the menu
    if (newState) {
      document.body.style.overflow = "hidden"
    }

    setIsOpen(newState)
    handleMenuOpen?.(newState)

    // When closing the menu in hero section
    if (!newState && isHeroSection) {
      // First disable scrolling immediately
      document.body.style.overflow = "hidden"
      
      // Then scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" })

      // Re-enable scroll after animation finishes (~800ms)
      setTimeout(() => {
        document.body.style.overflow = "auto"
      }, 900) // Increased buffer for the longer scroll animation
    }
  }

  useEffect(() => {
    // Avoid double-setting overflow in hero case
    if (!isHeroSection) {
      document.body.style.overflow = isOpen ? "hidden" : "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen, isHeroSection])

  return (
    <>
      {/* InfoBar - Always rendered, visibility controlled by CSS */}
      <InfoBar isScrolled={isScrolled} />
      
      {/* Main Navbar */}
      <nav className="bg-transparent backdrop-blur-md border-b border-white/10">
        <Container>
          <div className="flex items-center justify-between py-4 md:py-3">
            {/* Mobile Logo */}
            <Link href={"https://shop.twopointzeroclothing.com/"} target="_blank" className="flex items-center md:hidden">
              <Image src={LogoImg || "/placeholder.svg"} alt="LogoImg" width={23} height={41} />
            </Link>

            {/* Desktop Left Navigation */}
            <div className="hidden md:flex items-center space-x-12 flex-1">
              <Link
                href="https://shop.twopointzeroclothing.com/collections/all"
                className="text-[#84cecb] text-sm tracking-wider font-[400] hover:text-[#b2e5e1] transition-colors block"
              >
                <CyberText>SHOP</CyberText>
              </Link>
              <Link
                href="https://shop.twopointzeroclothing.com/collections/all"
                className="text-white text-sm tracking-wider font-[400] hover:text-[#84cecb] transition-colors block"
              >
                <CyberText>COLLECTION</CyberText>
              </Link>
              <Link
                href="https://shop.twopointzeroclothing.com/collections/all"
                className="text-white text-sm tracking-wider font-[400] hover:text-[#84cecb] transition-colors block"
              >
                <CyberText>APPAREL</CyberText>
              </Link>
              <Link
                href="https://shop.twopointzeroclothing.com/collections/all"
                className="text-white text-sm tracking-wider font-[400] hover:text-[#84cecb] transition-colors block"
              >
                <CyberText>STORE</CyberText>
              </Link>
            </div>

            {/* Desktop Center Logo */}
            <Link href={"https://shop.twopointzeroclothing.com/"} target="_blank" className="hidden md:flex justify-center flex-shrink-0">
              <Image src={LogoImg || "/placeholder.svg"} alt="LogoImg" width={23} height={41} />
            </Link>

            {/* Desktop Right Navigation */}
            <div className="hidden md:flex items-center space-x-12 justify-end flex-1">
              <Link href={"#"} target="_blank" className="flex items-center space-x-2 text-white hover:text-[#84cecb] transition-colors">
                <CyberText className="text-sm tracking-wider font-[400]">SEARCH</CyberText>
              </Link>
              <Link href={"https://shop.twopointzeroclothing.com/account/login"} target="_blank" className="flex items-center space-x-2 text-white hover:text-[#84cecb] transition-colors">
                <CyberText className="text-sm tracking-wider font-[400]">LOGIN</CyberText>
              </Link>
              <Link href={"https://shop.twopointzeroclothing.com/cart"} target="_blank" className="text-white hover:text-[#84cecb] transition-colors">
                <CartIcon />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button className="md:hidden text-white hover:text-[#84cecb] transition-colors" onClick={toggleMenu}>
              <HamburgerIcon isOpen={isOpen} />
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-800 ease-in-out ${
              isOpen ? "h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className={`flex flex-col items-center h-full space-y-9 py-6 bg-transparent backdrop-blur-md transform transition-transform duration-800 ease-in-out ${
              isOpen ? "translate-y-0" : "-translate-y-full"
            }`}>
              <Link 
                href="https://shop.twopointzeroclothing.com/collections/all"
                target="_blank"
                className="text-[#84cecb] text-lg tracking-wider font-[400] hover:text-[#b2e5e1] transition-colors transform hover:scale-105 duration-200"
              >
                <CyberText>SHOP</CyberText>
              </Link>
              <Link 
                href="https://shop.twopointzeroclothing.com/collections/all"
                target="_blank"
                className="text-white text-lg tracking-wider font-[400] hover:text-[#84cecb] transition-colors transform hover:scale-105 duration-200"
              >
                <CyberText>COLLECTION</CyberText>
              </Link>
              <Link 
                href="https://shop.twopointzeroclothing.com/collections/all"
                target="_blank"
                className="text-white text-lg tracking-wider font-[400] hover:text-[#84cecb] transition-colors transform hover:scale-105 duration-200"
              >
                <CyberText>APPAREL</CyberText>
              </Link>
              <Link 
                href="https://shop.twopointzeroclothing.com/"
                target="_blank"
                className="text-white text-lg tracking-wider font-[400] hover:text-[#84cecb] transition-colors transform hover:scale-105 duration-200"
              >
                <CyberText>STORE</CyberText>
              </Link>
              <Link href={""} target="_blank" className="flex items-center space-x-2 text-white hover:text-[#84cecb] transition-colors transform hover:scale-105 duration-200">
                <CyberText className="text-lg tracking-wider font-[400]">SEARCH</CyberText>
              </Link>
              <Link href={"https://shop.twopointzeroclothing.com/account/login"} target="_blank" className="flex items-center space-x-2 text-white hover:text-[#84cecb] transition-colors transform hover:scale-105 duration-200">
                <CyberText className="text-lg tracking-wider font-[400]">LOGIN</CyberText>
              </Link>
              <Link href={"https://shop.twopointzeroclothing.com/cart"} target="_blank" className="text-white hover:text-[#84cecb] transition-colors transform hover:scale-105 duration-200">
                <CartIcon />
              </Link>
            </div>
          </div>
        </Container>
      </nav>
    </>
  )
}