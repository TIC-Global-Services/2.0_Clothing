"use client"

import { motion } from "framer-motion"
import { Container } from "../Reusable/Container"
import { RightArrowIcon } from "@/assets/HomeIcons"

export function NewsletterSection() {
  return (
    <section className=" text-white text-center py-14 md:py-[120px] md:pt-36">
      <Container>
        {/* Heading */}
        <h2 className="text-base md:text-xl font-medium md:leading-6 mb-7 md:mb-5 uppercase">
          SLIDE INTO OUR INBOX.<br className="md:hidden block"/> GET EARLY DROPS <span className="text-[#84cecb]">+</span> SECRET SALES
        </h2>

        {/* Email input and subscribe */}
        <form className="bg-white mt-4 w-full font-medium text-[10px] leading-6 mx-auto flex items-center justify-between md:px-28 px-4 py-4">
          <input
            type="email"
            placeholder="YOUR EMAIL ADDRESS"
            className="text-black placeholder:text-black outline-none w-full"
          />
          <motion.button 
            type="submit" 
            className="text-black flex items-center gap-1 ml-4"
            whileHover="hover"
            initial="initial"
            variants={{
              initial: {
                x: 0,
              },
              hover: {
                x: 8,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }
              }
            }}
          >
            <motion.span
              variants={{
                initial: { x: 0 },
                hover: { 
                  x: 4,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }
                }
              }}
            >
              SUBSCRIBE
            </motion.span>
            <motion.div
              variants={{
                initial: { 
                  x: 0,
                  rotate: 0,
                  scale: 1
                },
                hover: { 
                  x: 6,
                  rotate: 0,
                  scale: 1.1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }
                }
              }}
            >
              <RightArrowIcon/>
            </motion.div>
          </motion.button>
        </form>
      </Container>
    </section>
  )
}