/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import { Container } from "@/components/Reusable/Container"
import { useEffect, useRef } from "react"
import { ProofCard } from "./ProofCard"

interface CardData {
  text: string;
  title: string;
}

// Use consistent type definitions across all files
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
  timeScale: (value?: number) => number | GSAPTimeline;
  vars: Record<string, any>;
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


const leftCards: { title: string; text: string }[] = [
  {
    title: "Order Delayed with No Communication",
    text: "I placed my order on May 10th and it's now been\nover 2 weeks with no updates, no tracking info —\nnothing. This is really disappointing."
  },
  {
    title: "Received the Wrong Product",
    text: "I ordered a blue 'Throttle & Fate' t-shirt,\nbut I got a white 'Winged Machines' one instead.\nI've emailed multiple times but no one is replying."
  },
  {
    title: "Return Request Ignored",
    text: "I raised a return request the same day\nI received the item. It's been more than 10 days\nand no pickup has been scheduled yet.\nTerrible service."
  },
  {
    title: "Order Marked as Cancelled Without Consent",
    text: "Why was my order marked as cancelled\nby the merchant? I never cancelled it.\nAt least inform me before doing this.\nI want a proper update."
  },
  {
    title: "Wrong Size Delivered and No Exchange",
    text: "I ordered size L and got XXL.\nI tried to exchange it, but the website doesn't\nallow me to complete the return,\nand your team never replies."
  }
];


const rightCards: { title: string; text: string }[] = [
  {
    title: "Damaged Product Received, Still No Resolution",
    text: "The t-shirt arrived wrinkled and folded\nover the design. It looks used.\nI asked for a replacement and haven't\nheard back for over a week."
  },
  {
    title: "False Shipping Promises",
    text: "You said the order would be dispatched\nwithin 48 hours, but it's been over 7 days.\nNo update. No tracking. Nothing.\nThis is unacceptable."
  },
  {
    title: "Customer Service Not Responding",
    text: "I've sent three emails, and not a single one\nhas been answered. At this point,\nI just want my money back."
  },
  {
    title: "Refund Not Issued After Cancellation",
    text: "I cancelled my order last week because\nthere was no update. I'm still waiting\nfor the refund. How long does it take?"
  },
  {
    title: "Delivery Too Late for Need",
    text: "I had mentioned that I was flying abroad\nand needed the product urgently.\nDespite that, you didn't dispatch it on time.\nCompletely unprofessional."
  }
];


export function ProofSection() {
  const leftContainerRef = useRef<HTMLDivElement>(null)
  const rightContainerRef = useRef<HTMLDivElement>(null)
  const leftTlRef = useRef<GSAPTimeline | null>(null)
  const rightTlRef = useRef<GSAPTimeline | null>(null)
  const leftSpeedTweenRef = useRef<GSAPTimeline | null>(null)
  const rightSpeedTweenRef = useRef<GSAPTimeline | null>(null)

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
      const leftRail = leftContainerRef.current
      const rightRail = rightContainerRef.current
      
      if (leftRail) {
        leftRail.style.animation = 'scroll-up 30s linear infinite'
      }
      
      if (rightRail) {
        rightRail.style.animation = 'scroll-down 30s linear infinite'
      }
      
      if (!document.querySelector('#vertical-scroll-animation-styles')) {
        const style = document.createElement('style')
        style.id = 'vertical-scroll-animation-styles'
        style.textContent = `
          @keyframes scroll-up {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          @keyframes scroll-down {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0); }
          }
        `
        document.head.appendChild(style)
      }
    }

    const verticalLoop = (items: HTMLElement[], config: Record<string, any> = {}): GSAPTimeline | null => {
      const gsap = (window as any).gsap as GSAPStatic
      if (!gsap) return null
      
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
      const startY = itemsArray[0]?.offsetTop || 0
      const heights: number[] = []
      const yPercents: number[] = []
      const pixelsPerSecond = ((config.speed as number) || 1) * 100
      
      const snap = config.snap === false ? (v: number) => v : gsap.utils.snap((config.snap as number) || 1)
      
      gsap.set(itemsArray, {
        yPercent: (i: number, el: HTMLElement) => {
          const h = heights[i] = parseFloat(gsap.getProperty(el, "height", "px")) || el.offsetHeight
          const y = parseFloat(gsap.getProperty(el, "y", "px")) || 0
          const yPct = parseFloat(gsap.getProperty(el, "yPercent")) || 0
          yPercents[i] = snap(y / h * 100 + yPct)
          return yPercents[i]
        }
      })
      
      gsap.set(itemsArray, {y: 0})
      
      const lastElement = itemsArray[length-1]
      if (!lastElement) return tl
      
      const lastScale = parseFloat(gsap.getProperty(lastElement, "scaleY")) || 1
      const totalHeight = lastElement.offsetTop + yPercents[length-1] / 100 * heights[length-1] - startY + 
                        lastElement.offsetHeight * lastScale + 
                        (parseFloat(String(config.paddingBottom)) || 0)
      
      for (let i = 0; i < length; i++) {
        const item = itemsArray[i]
        const curY = yPercents[i] / 100 * heights[i]
        const distanceToStart = item.offsetTop + curY - startY
        const itemScale = parseFloat(gsap.getProperty(item, "scaleY")) || 1
        const distanceToLoop = distanceToStart + heights[i] * itemScale
        
        tl.to(item, {
          yPercent: snap((curY - distanceToLoop) / heights[i] * 100), 
          duration: distanceToLoop / pixelsPerSecond
        }, 0)
        
        tl.fromTo(item, 
          {yPercent: snap((curY - distanceToLoop + totalHeight) / heights[i] * 100)}, 
          {
            yPercent: yPercents[i], 
            duration: (curY - distanceToLoop + totalHeight - curY) / pixelsPerSecond, 
            immediateRender: false
          }, 
          distanceToLoop / pixelsPerSecond
        )
      }
      
      tl.progress(1, true)
      tl.progress(0, true)
      
      if (config.reversed) {
        tl.reverse()
      }
      
      return tl
    }

    const initializeAnimation = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js')
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js')
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const gsap = (window as any).gsap as GSAPStatic
        const ScrollTrigger = (window as any).ScrollTrigger as ScrollTriggerStatic

        if (!gsap || !ScrollTrigger) {
          throw new Error('GSAP not loaded')
        }

        // Register plugin
        gsap.registerPlugin(ScrollTrigger)

        // Left column animation
        const leftCardNodes = leftContainerRef.current?.querySelectorAll('.proof-card')
        if (leftCardNodes && leftCardNodes.length > 0) {
          const leftCardArray = Array.from(leftCardNodes) as HTMLElement[]
          const leftTimeline = verticalLoop(leftCardArray, {
            repeat: -1,
            speed: 0.5,
            reversed: true,
            paused: false
          })
          
          if (leftTimeline) {
            leftTlRef.current = leftTimeline
            leftTimeline.play()
          }
        }

        // Right column animation
        const rightCardNodes = rightContainerRef.current?.querySelectorAll('.proof-card')
        if (rightCardNodes && rightCardNodes.length > 0) {
          const rightCardArray = Array.from(rightCardNodes) as HTMLElement[]
          const rightTimeline = verticalLoop(rightCardArray, {
            repeat: -1,
            speed: 0.5,
            reversed: false,
            paused: false
          })
          
          if (rightTimeline) {
            rightTlRef.current = rightTimeline
            rightTimeline.play()
          }
        }

        // ScrollTrigger for left column
        if (leftTlRef.current) {
          ScrollTrigger.create({
            trigger: leftContainerRef.current,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self: ScrollTriggerSelf) => {
              if (leftSpeedTweenRef.current) {
                leftSpeedTweenRef.current.kill()
              }
              
              if (leftTlRef.current) {
                leftSpeedTweenRef.current = gsap.timeline()
                
                const direction = self.direction || 1
                leftSpeedTweenRef.current.to(leftTlRef.current, {
                  timeScale: 3 * direction,
                  duration: 0.25
                })
                leftSpeedTweenRef.current.to(leftTlRef.current, {
                  timeScale: 1 * direction,
                  duration: 1.5
                })
              }
            }
          })
        }

        // ScrollTrigger for right column
        if (rightTlRef.current) {
          ScrollTrigger.create({
            trigger: rightContainerRef.current,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self: ScrollTriggerSelf) => {
              if (rightSpeedTweenRef.current) {
                rightSpeedTweenRef.current.kill()
              }
              
              if (rightTlRef.current) {
                rightSpeedTweenRef.current = gsap.timeline()
                
                const direction = self.direction || 1
                rightSpeedTweenRef.current.to(rightTlRef.current, {
                  timeScale: 3 * -direction,
                  duration: 0.25
                })
                rightSpeedTweenRef.current.to(rightTlRef.current, {
                  timeScale: 1 * -direction,
                  duration: 1.5
                })
              }
            }
          })
        }

      } catch (error) {
        console.error('Failed to load GSAP:', error)
        startCSSFallback()
      }
    }

    initializeAnimation()

    return () => {
      // Cleanup function
      if (leftTlRef.current) {
        leftTlRef.current.kill()
        leftTlRef.current = null
      }
      if (rightTlRef.current) {
        rightTlRef.current.kill()
        rightTlRef.current = null
      }
      if (leftSpeedTweenRef.current) {
        leftSpeedTweenRef.current.kill()
        leftSpeedTweenRef.current = null
      }
      if (rightSpeedTweenRef.current) {
        rightSpeedTweenRef.current.kill()
        rightSpeedTweenRef.current = null
      }
      
      const ScrollTrigger = (window as any).ScrollTrigger as ScrollTriggerStatic
      if (ScrollTrigger) {
        const triggers = ScrollTrigger.getAll()
        triggers.forEach((trigger) => {
          trigger.kill()
        })
      }
    }
  }, [])

  const renderInfiniteCards = (cards: CardData[], side: "left" | "right") => {
    return (
      <>
        {Array.from({ length: 4 }).flatMap((_, setIndex) => 
          cards.map((card, idx) => (
            <div key={`${side}-${setIndex}-${idx}`} className="proof-card py-3">
              <ProofCard {...card} side={side} />
            </div>
          ))
        )}
      </>
    )
  }

  return (
    <section className="bg-transparent md:pt-28 pt-14 md:pb-20 text-center">
      <Container className="">
        <h2 className="text-white uppercase text-base md:text-5xl font-medium mb-2 md:mb-5">
          {/* PROOF THE DRIP SPEAKS FOR ITSELF. */}
          proof that progress is not easy
        </h2>
        <p className="text-white font-medium md:leading-6 text-[10px] md:text-xl mb-14 uppercase">
        They doubted. They mocked <br />
        They said we&apos;d never make it. But every harsh word became a lesson. Every failure, a foundation. Remember when you fell learning to ride? Or stumbled through your first step, first fight, first dream? You didn&apos;t stop. Neither did we. We&apos;re not here to be perfect — wer&apos;e here to grow, evolve, and rise. This wall isn&apos;t just filled with criticism. It&apos;s filled with proof that we&apos;re not afraid to begin, to mess up, to try again. Because progress? That&apos;s the loudest thing we wear.
        </p>

        <div className="flex flex-col w-full md:flex-row justify-center md:px-7 gap-3">
          <div className="h-[600px] overflow-hidden relative ">
            <div ref={leftContainerRef} className="will-change-transform">
              {renderInfiniteCards(leftCards, "left")}
            </div>
          </div>

          <div className="h-[600px] overflow-hidden relative md:block hidden">
            <div ref={rightContainerRef} className="will-change-transform">
              {renderInfiniteCards(rightCards, "right")}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}