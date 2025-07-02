// components/Home/HeroSection.tsx
"use client"
import { motion } from "framer-motion"
import { DownArrowIcon } from "@/assets/HomeIcons"


interface HeroVideoSectionProps {
  targetSectionId?: string
}

export function HeroVideoSection({ targetSectionId = "latest-drop" }: HeroVideoSectionProps) {
  
  const scrollToSection = () => {
    const element = document.getElementById(targetSectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <section className="relative min-h-screen bg-black" id="hero-section">
      {/* Background Video */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0 md:block hidden">
        <source src="/2.0_Desktop.mp4" type="video/mp4" />
      </video>

      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0 md:hidden block">
        <source src="/2.0_Mobile.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Hero Navbar - Sticky within hero section with gradual fade */}
     

      {/* Scroll Down Arrow */}
      <motion.div
        className="absolute bottom-28 xl:bottom-14 md:bottom-7 left-1/2 transform -translate-x-1/2 text-center cursor-pointer z-30"
        onClick={scrollToSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.p className="text-sm tracking-widest text-white/80 hover:text-white transition-colors">
          ENTER THE SALE
        </motion.p>
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="text-white/80 hover:text-[#84cecb] transition-colors flex items-center justify-center"
        >
          <DownArrowIcon />
        </motion.div>
      </motion.div>
    </section>
  )
}