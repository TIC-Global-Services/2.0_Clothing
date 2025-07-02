"use client"

import { LogoImg } from "@/assets"
import { FbIcon, YoutubeIcon, PintrastIcon, InstaIcon, SpotifyIcon } from "@/assets/HomeIcons"
import Image from "next/image"
import { Container } from "./Container"
import Link from "next/link"

export function FooterSection() {

  const ScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <footer className="bg-footerBg text-white pt-11 pb-11 md:py-20">
      <Container>
        <div className="flex flex-col lg:flex-row md:justify-between md:gap-16">
          {/* Logo + Social */}
          <div className="flex flex-col items-center">

            {/* Logo */}
            <Link href="/" 
            className="mx-auto"
            onClick={(e) => {
              e.preventDefault();
              ScrollTop();
              window.history.pushState(null, "", "/");
            }}
            >
              <Image src={LogoImg || "/placeholder.svg"} alt="LogoImg" width={61} height={110} className="mb-5" />
            </Link>


            {/* Social Media Section */}
            <p className="text-[#84cecb] text-lg font-[400] mb-2 tracking-wide">2.0 SOCIAL MEDIA</p>
            <div className="flex gap-1 py-[2px]">
              {[FbIcon, InstaIcon, PintrastIcon, YoutubeIcon, SpotifyIcon].map((Icon, i) => (
                <div
                  key={i}
                  className="w-[34px] h-[34px]  rounded-full flex items-center justify-center  hover:scale-110 transition-all duration-300 cursor-pointer"
                >
                  <Icon />
                </div>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          <div className="grid grid-cols-1 text-center gap-7 md:text-left md:grid-cols-4 md:gap-12 lg:gap-16 text-sm mt-14 md:mt-0">
            <div>
              <h4 className="text-[#84cecb] font-[400] text-lg mb-5 tracking-wide">BORING STUFF</h4>
              <ul className="space-y-4 text-sm font-light">
                <li>
                  <Link href={"https://shop.twopointzeroclothing.com/apps/tracktor/track"} target="_blank" className="hover:text-[#84cecb] transition-colors cursor-pointer block">track order</Link>
                </li>
                <li>
                  <Link href={"https://f08821-3.returnsdrive.com/"} target="_blank" className="hover:text-[#84cecb] transition-colors cursor-pointer block">returns</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#84cecb] font-[400] text-lg mb-5 tracking-wide">LEGAL</h4>
              <ul className="space-y-4 text-sm font-light">
                <li>
                  <Link href={"https://shop.twopointzeroclothing.com/policies/terms-of-service"} target="_blank" className="hover:text-[#84cecb] transition-colors cursor-pointer block">terms and conditions</Link>
                </li>
                <li>
                  <Link href={"https://shop.twopointzeroclothing.com/policies/privacy-policy"} target="_blank" className="hover:text-[#84cecb] transition-colors cursor-pointer block">privacy policy</Link>
                </li>
                <li>
                  <Link href={"https://shop.twopointzeroclothing.com/policies/shipping-policy"} target="_blank" className="hover:text-[#84cecb] transition-colors cursor-pointer block">shipping policy</Link>
                </li>
                <li>
                  <Link href={"https://shop.twopointzeroclothing.com/policies/refund-policy"} target="_blank" className="hover:text-[#84cecb] transition-colors cursor-pointer block">returns policy</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#84cecb] font-[400] text-lg mb-5 tracking-wide">LET&apos;S CONNECT</h4>
              <ul className="space-y-4 text-sm font-light">
                <li>
                  <Link href={""} target="_blank" className="hover:text-[#84cecb] transition-colors cursor-pointer block">whatsapp</Link>
                </li>
                <li>
                  <Link href={""} target="_blank" className="hover:text-[#84cecb] transition-colors cursor-pointer block">email</Link>
                </li>
                <li>
                  <Link href={"https://shop.twopointzeroclothing.com/pages/contact"} target="_blank" className="hover:text-[#84cecb] transition-colors cursor-pointer block">contact us</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#84cecb] font-[400] text-lg mb-5 tracking-wide">STORE LOCATOR</h4>
              <ul className="space-y-4 text-sm font-light">
                <li>
                  <Link href={""} target="_blank" className="hover:text-[#84cecb] transition-colors cursor-pointer block">mumbai</Link>
                </li>
                <li>
                  <Link href={""} target="_blank" className="hover:text-[#84cecb] transition-colors cursor-pointer block">bangalore</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="md:mt-16 mt-10 pt-8  flex flex-col md:flex-row justify-between items-center text-xs md:text-lg font-[400] text-white/80">
          <p className="tracking-wide ">COPYRIGHT © 2025 TWO POINT ZERO®</p>
          <Link href="https://www.theinternetcompany.one/" className="mt-2 md:mt-0 text-center tracking-wide hover:text-primary">DESIGNED & DEVELOPED BY TIC GLOBAL SERVICES</Link>
        </div>
      </Container>
    </footer>
  )
}