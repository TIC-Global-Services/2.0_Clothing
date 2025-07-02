"use client"

import { useState, useEffect } from "react"

const INFO_MESSAGES = [
  "EMPHASIS ON CRAFTSMANSHIP AND QUALITY",
  "FREE SHIPPING ON ORDERS OVER $100",
  "NEW COLLECTION DROPPING SOON",
  "SUSTAINABLE FASHION FOR THE FUTURE",
  "HANDCRAFTED WITH PRECISION AND CARE",
]

export function InfoBar() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % INFO_MESSAGES.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0b0b0b] text-white py-4 px-4 md:block hidden">
      <div className="text-center">
        <p className="text-xs tracking-widest font-[400] leading-3.5 transition-opacity duration-500">
          {INFO_MESSAGES[currentMessageIndex]}
        </p>
      </div>
    </div>
  )
}
