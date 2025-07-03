"use client"

import { Container } from "@/components/Reusable/Container"
import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
// import Image from "next/image"

export function BehindThreadsSection() {
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const fullText = "WELCOME TO 2.0 – progress over perfection"

  // Separate refs for desktop and mobile
  const descriptionRef = useRef(null)
  const mobileDescriptionRef = useRef(null)

  // Separate inView states with more mobile-friendly settings
  const isInView = useInView(descriptionRef, {
    once: true,
    margin: "-50px",
  })

  const isMobileInView = useInView(mobileDescriptionRef, {
    once: true,
    margin: "-20px",
  })

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isTyping) {
      // Typing animation
      if (displayText.length < fullText.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1))
        }, 100)
      } else {
        // Finished typing, wait then start deleting
        timeoutId = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
      }
    } else {
      // Deleting animation
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 50)
      } else {
        // Finished deleting, start typing again
        timeoutId = setTimeout(() => {
          setIsTyping(true)
        }, 500)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [displayText, isTyping, fullText])

  // Function to render text with colored "2.0"
  const renderText = (text: string) => {
    const parts = text.split("2.0")
    if (parts.length === 1) {
      return text
    }
    return (
      <>
        {parts[0]}
        <span className="text-[#84cecb] font-bold">2.0</span>
        {parts[1]}
      </>
    )
  }

  // Split description into lines for animation
  const descriptionLines = [
    "At Two Point Zero, we're more than just creators of premium merch – we're architects of an attitude.",
    "Our story revolves around breaking norms, embracing change, and propelling into new chapters.",
    "Join us in the journey of style, freedom, and relentless progression."
  ]

  const MobiledescriptionLines = [
    "At Two Point Zero, we're more than just",
    "creators of premium merch – we're architects",
    " of an attitude. Our story revolves around ",
    "breaking norms, embracing change, and propelling ",
    "into new chapters. Join us in the journey of ,",
    "style freedom, and relentless progression.",
  ]

  const lineVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)"
    }
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.1
      }
    }
  }

  return (
    <Container as="section" className=" text-white text-center py-14 md:py-28 md:pb-28 flex flex-col items-center">
      {/* Top Text */}
      <h2 className="text-2xl  md:text-[50px] tracking-widest font-medium uppercase">BEHIND THE</h2>

      {/* THREADS */}
      <h1 className="text-7xl md:text-[150px] font-medium tracking-tight text-[#84cecb] md:leading-[150px]">THREADS</h1>

      {/* Tagline with Typewriter Effect */}
      <p className="mt-2 text-xs md:text-xl md:leading-6 uppercase tracking-widest font-medium text-white/90 min-h-[1.5rem]">
        {renderText(displayText)}
        <span className="animate-pulse ml-1">|</span>
      </p>

      <div className="md:my-16 my-14 md:w-48 md:h-48 ">
        {/* Try video first */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-contain md:block hidden"
        >
          <source src="/LogoAnimation.mp4" type="video/mp4" />
          <source src="/LogoAnimation.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/LogoAnimationGif.gif"
          alt="Logo Animation"
          width={63}
          height={114}
          className="w-[63px] h-[114px] object-cover md:hidden bg-transparent"
        />
      </div>


      {/* Desktop - Description with Line-wise Reveal Animation */}
      <motion.div
        ref={descriptionRef}
        className="uppercase text-xs md:text-xl leading-6 font-medium text-white md:block hidden"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {descriptionLines.map((line, index) => (
          <motion.p
            key={index}
            variants={lineVariants}
            className="mb-2 last:mb-0"
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      {/* Mobile - Description with Line-wise Reveal Animation */}
      <motion.div
        ref={mobileDescriptionRef}
        className="uppercase text-xs font-medium text-white md:hidden block"
        variants={containerVariants}
        initial="hidden"
        animate={isMobileInView ? "visible" : "hidden"}
      >
        {MobiledescriptionLines.map((line, index) => (
          <motion.p
            key={index}
            variants={lineVariants}
            className=" last:mb-0"
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>
    </Container>
  )
}