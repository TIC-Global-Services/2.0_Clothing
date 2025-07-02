"use client"
import { useState, useEffect, useRef, useCallback } from "react"

interface CyberTextProps {
  children: string
  className?: string
}

export function CyberText({ children, className = "" }: CyberTextProps) {
  const [displayText, setDisplayText] = useState(children)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const originalText = children
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]{}|\\/<>?.,;:'\"`~"

  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isHovered) {
      let iteration = 0

      // Clear any existing interval
      clearCurrentInterval()

      intervalRef.current = setInterval(() => {
        setDisplayText(() => {
          return originalText
            .split("")
            .map((_, index) => {
              if (index < iteration) {
                return originalText[index]
              }
              return characters[Math.floor(Math.random() * characters.length)]
            })
            .join("")
        })

        if (iteration >= originalText.length) {
          clearCurrentInterval()
          setDisplayText(originalText)
        }

        iteration += 0.5
      }, 50)
    } else {
      // When not hovered, clear interval and reset text
      clearCurrentInterval()
      setDisplayText(originalText)
    }

    return () => {
      clearCurrentInterval()
    }
  }, [isHovered, originalText, characters, clearCurrentInterval])

  return (
    <span
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ fontFamily: "monospace" }}
    >
      {displayText}
    </span>
  )
}