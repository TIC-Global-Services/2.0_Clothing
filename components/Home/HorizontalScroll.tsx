/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useEffect, useRef } from "react"

interface GSAPTimeline {
  kill: () => void;
  play: () => void;
  progress: (progress: number, suppressEvents?: boolean) => GSAPTimeline;
  totalTime: (time?: number) => number;
  rawTime: () => number;
  duration: () => number;
  reverse: () => void;
  to: (targets: any, vars: Record<string, any>, position?: string | number) => GSAPTimeline;
  fromTo: (targets: any, fromVars: Record<string, any>, toVars: Record<string, any>, position?: string | number) => GSAPTimeline;
  tweenTo: (time: number, vars: Record<string, any>) => GSAPTimeline;
  time: () => number;
  vars: Record<string, any>;
  timeScale: (value?: number) => number | GSAPTimeline;
  add: (child: any, position?: string | number) => GSAPTimeline;
}

interface GSAPStatic {
  registerPlugin: (plugin: any) => void;
  timeline: (config?: Record<string, any>) => GSAPTimeline;
  set: (targets: any, vars: Record<string, any>) => void;
  getProperty: (target: any, property: string, unit?: string) => string;
  to: (targets: any, vars: Record<string, any>) => GSAPTimeline;
  utils: {
    toArray: (items: any) => HTMLElement[];
    snap: (increment: number) => (value: number) => number;
    wrap: (min: number, max: number) => (value: number) => number;
  };
}

interface ScrollTriggerStatic {
  create: (config: Record<string, any>) => { kill: () => void };
  getAll: () => Array<{ kill: () => void }>;
}

interface ScrollTriggerSelf {
  direction: number;
}

declare global {
  interface Window {
    gsap?: GSAPStatic;
    ScrollTrigger?: ScrollTriggerStatic;
  }
}

const textItems = ["LIMITED EDITIONS", "ONLY HERE, ONLY NOW", "WEAR IT BEFORE THEY DO", "LATEST DROPS", "COLLABS"]

export function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<GSAPTimeline | null>(null)
  const speedTweenRef = useRef<GSAPTimeline | null>(null)

  useEffect(() => {
    const loadScript = (src: string): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve(true)
          return
        }
        const script = document.createElement('script')
        script.src = src
        script.onload = () => resolve(true)
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    const startCSSFallback = () => {
      const rail = containerRef.current?.querySelector('.rail') as HTMLElement
      if (rail) {
        rail.style.animation = 'scroll-left 20s linear infinite'
        
        // Add CSS keyframes if not already added
        if (!document.querySelector('#scroll-animation-styles')) {
          const style = document.createElement('style')
          style.id = 'scroll-animation-styles'
          style.textContent = `
            @keyframes scroll-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `
          document.head.appendChild(style)
        }
      }
    }

    const horizontalLoop = (items: HTMLElement[], config: Record<string, any> = {}) => {
      const gsap = window.gsap!
      const itemsArray = gsap.utils.toArray(items) as HTMLElement[]
      
      if (itemsArray.length === 0) return null
      
      const tl = gsap.timeline({
        repeat: config.repeat ?? -1, 
        paused: config.paused ?? true, 
        defaults: {ease: "none"}, 
        onReverseComplete: function() {
          if (this && typeof this.totalTime === 'function' && typeof this.rawTime === 'function' && typeof this.duration === 'function') {
            this.totalTime(this.rawTime() + this.duration() * 100)
          }
        }
      })
      
      const length = itemsArray.length
      const startX = itemsArray[0]?.offsetLeft || 0
      const times: number[] = []
      const widths: number[] = []
      const xPercents: number[] = []
      let curIndex = 0
      const pixelsPerSecond = ((config.speed as number) || 1) * 100
      const snap = config.snap === false ? (v: number) => v : gsap.utils.snap((config.snap as number) || 1)

      // Initialize positions
      gsap.set(itemsArray, {
        xPercent: (i: number, el: HTMLElement) => {
          const w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px")) || el.offsetWidth
          const x = parseFloat(gsap.getProperty(el, "x", "px")) || 0
          const xPct = parseFloat(gsap.getProperty(el, "xPercent")) || 0
          xPercents[i] = snap(x / w * 100 + xPct)
          return xPercents[i]
        }
      })
      
      gsap.set(itemsArray, {x: 0})
      
      const lastItem = itemsArray[length-1]
      if (!lastItem) return tl
      
      const lastScale = parseFloat(gsap.getProperty(lastItem, "scaleX")) || 1
      const totalWidth = lastItem.offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + 
                        lastItem.offsetWidth * lastScale + 
                        (parseFloat(String(config.paddingRight)) || 0)
      
      // Create animations for each item
      for (let i = 0; i < length; i++) {
        const item = itemsArray[i]
        const curX = xPercents[i] / 100 * widths[i]
        const distanceToStart = item.offsetLeft + curX - startX
        const itemScale = parseFloat(gsap.getProperty(item, "scaleX")) || 1
        const distanceToLoop = distanceToStart + widths[i] * itemScale
        
        tl.to(item, {
          xPercent: snap((curX - distanceToLoop) / widths[i] * 100), 
          duration: distanceToLoop / pixelsPerSecond
        }, 0)
        
        tl.fromTo(item, 
          {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, 
          {
            xPercent: xPercents[i], 
            duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, 
            immediateRender: false
          }, 
          distanceToLoop / pixelsPerSecond
        )
        
        times[i] = distanceToStart / pixelsPerSecond
      }

      function toIndex(index: number, vars: Record<string, any> = {}) {
        if (Math.abs(index - curIndex) > length / 2) {
          index += index > curIndex ? -length : length
        }
        const newIndex = gsap.utils.wrap(0, length)(index)
        let time = times[newIndex] || 0
        if ((time > tl.time()) !== (index > curIndex)) {
          vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())}
          time += tl.duration() * (index > curIndex ? 1 : -1)
        }
        curIndex = newIndex
        vars.overwrite = true
        return tl.tweenTo(time, vars)
      }
      
      // Add custom methods to timeline
      const extendedTl = Object.assign(tl, {
        next: (vars?: Record<string, any>) => toIndex(curIndex+1, vars || {}),
        previous: (vars?: Record<string, any>) => toIndex(curIndex-1, vars || {}),
        current: () => curIndex,
        toIndex: (index: number, vars?: Record<string, any>) => toIndex(index, vars || {}),
        times: times
      })
      
      extendedTl.progress(1, true).progress(0, true)
      
      if (config.reversed) {
        tl.reverse()
      }
      
      return extendedTl
    }

    const initializeAnimation = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js')
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js')
        
        // Wait for scripts to be ready
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const gsap = window.gsap
        const ScrollTrigger = window.ScrollTrigger

        if (!gsap || !ScrollTrigger) {
          throw new Error('GSAP not loaded')
        }

        gsap.registerPlugin(ScrollTrigger)

        const scrollingTextNodes = containerRef.current?.querySelectorAll('.rail .text-item')
        if (!scrollingTextNodes || scrollingTextNodes.length === 0) {
          console.warn('No text items found for animation')
          return
        }

        const scrollingText = Array.from(scrollingTextNodes) as HTMLElement[]

        // Create the horizontal loop
        const timeline = horizontalLoop(scrollingText, {
          repeat: -1,
          speed: 0.5,
          paused: false
        })

        if (!timeline) {
          throw new Error('Failed to create timeline')
        }

        tlRef.current = timeline
        timeline.play()

        // Create ScrollTrigger for scroll-based speed control
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self: ScrollTriggerSelf) => {
            if (speedTweenRef.current) {
              speedTweenRef.current.kill()
            }
            
            if (tlRef.current && gsap) {
              const direction = self.direction || 1
              speedTweenRef.current = gsap.timeline()
              speedTweenRef.current.to(tlRef.current, {
                timeScale: 3 * direction,
                duration: 0.25
              })
              speedTweenRef.current.to(tlRef.current, {
                timeScale: 1 * direction,
                duration: 1.5
              }, "+=0.5")
            }
          }
        })

      } catch (error) {
        console.error('Failed to load GSAP, using CSS fallback:', error)
        startCSSFallback()
      }
    }

    initializeAnimation()

    return () => {
      // Cleanup
      if (tlRef.current) {
        tlRef.current.kill()
        tlRef.current = null
      }
      if (speedTweenRef.current) {
        speedTweenRef.current.kill()
        speedTweenRef.current = null
      }
      
      const ScrollTrigger = window.ScrollTrigger
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    }
  }, [])

  return (
    <div className="overflow-hidden bg-white py-2 md:py-7 select-none">
      <div ref={containerRef} className="scrolling-text">
        <div className="rail flex items-end will-change-transform">
          {/* Render multiple sets for seamless loop */}
          {Array.from({ length: 4 }).flatMap((_, setIndex) => 
            textItems.map((text, i) => (
              <div 
                key={`${setIndex}-${i}`} 
                className="text-item flex items-center shrink-0 text-black font-medium text-xs md:text-xl tracking-wide whitespace-nowrap leading-6 md:leading-0"
              >
                <span className="mr-8">{text}</span>
                <span className="text-[#84cecb] text-xl font-medium mr-8">·</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}