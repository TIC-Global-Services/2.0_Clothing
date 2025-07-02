"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { useInView } from "react-intersection-observer"

import {
  TShirtImg1, TShirtImg11, TShirtImg2, TShirtImg22,
  TShirtImg3, TShirtImg33, TShirtImg4, TShirtImg44,
  TShirtImg5, TShirtImg55, TShirtImg6, TShirtImg66
} from "@/assets/LatestDrop"

import { DoubleArrowIcon } from "@/assets/HomeIcons"
import { Container } from "@/components/Reusable/Container"

interface ProductImage {
  id: number
  primaryImage: StaticImageData
  secondaryImage: StaticImageData
  alt: string
}

const PRODUCT_IMAGES: ProductImage[] = [
  { id: 1, primaryImage: TShirtImg1, secondaryImage: TShirtImg11, alt: "TShirtImg1" },
  { id: 2, primaryImage: TShirtImg2, secondaryImage: TShirtImg22, alt: "TShirtImg2" },
  { id: 3, primaryImage: TShirtImg3, secondaryImage: TShirtImg33, alt: "TShirtImg3" },
  { id: 4, primaryImage: TShirtImg4, secondaryImage: TShirtImg44, alt: "TShirtImg4" },
  { id: 5, primaryImage: TShirtImg5, secondaryImage: TShirtImg55, alt: "TShirtImg5" },
  { id: 6, primaryImage: TShirtImg6, secondaryImage: TShirtImg66, alt: "TShirtImg6" },
]

// Create a separate component for each product item
function ProductItem({ product, index }: { product: ProductImage; index: number }) {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.5 })
  const [showSecondary, setShowSecondary] = useState(false)
  const [hoveredImage, setHoveredImage] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && inView) {
      setShowSecondary(true)
      const timeout = setTimeout(() => setShowSecondary(false), 1500)
      return () => clearTimeout(timeout)
    }
  }, [inView])

  const isHovered = hoveredImage === product.id

  return (
    <motion.div
      ref={ref}
      className="md:h-[541px] h-[456px] overflow-hidden cursor-pointer group"
      onMouseEnter={() => setHoveredImage(product.id)}
      onMouseLeave={() => setHoveredImage(null)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative w-full h-full">
        {/* Primary Image - always visible */}
        <Image
          src={product.primaryImage}
          alt={product.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Secondary Image - fade in/out over primary */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered || showSecondary ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Image
            src={product.secondaryImage}
            alt={`${product.alt} - hover`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export function LatestDropSection() {
  const [discoverAnimated, setDiscoverAnimated] = useState(false)
  const [discoverRef, discoverInView] = useInView({ threshold: 0.7 })

  useEffect(() => {
    if (discoverInView && !discoverAnimated) {
      setDiscoverAnimated(true)
      setTimeout(() => setDiscoverAnimated(false), 1000)
    }
  }, [discoverInView, discoverAnimated]) // Added discoverAnimated to dependency array

  return (
    <section id="latest-drop" className="md:pt-28 pt-14">
      <Container>
        {/* Section Title */}
        <motion.div
          className="text-center mb-7 md:mb-28"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-medium mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <span className="block text-white text-2xl md:text-[50px]">LATEST</span>
            <span className="block text-[#84cecb] text-7xl md:text-[150px]">DROP</span>
          </motion.h2>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCT_IMAGES.map((product, index) => (
            <ProductItem key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Discover More Link */}
        <motion.div
          ref={discoverRef}
          className="flex md:justify-end justify-center mt-7 md:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: discoverInView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link href="/shop" passHref>
            <motion.div
              className="inline-flex items-start md:gap-[-80px] text-sm tracking-wider text-white hover:text-[#84cecb] transition-colors cursor-pointer"
              animate={discoverAnimated ? { x: 10 } : { x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="mt-[1px]">DISCOVER MORE</span>
              <DoubleArrowIcon />
            </motion.div>
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}