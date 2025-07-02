// hooks/useNavbarState.ts
"use client"
import { useState, useEffect } from "react"

export function useNavbarState() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen)
    }
  
    const closeMenu = () => {
      setIsMenuOpen(false)
    }

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu
  }
}