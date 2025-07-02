'use client'

interface ProofCardProps {
  text: string
  title: string
  side: "left" | "right"
}

export function ProofCard({ text, title, side }: ProofCardProps) {
  const isLeft = side === "left";
  const isRight = side === "right";

  // Parse text and convert <br/> to actual line breaks
  const parseText = (text: string) => {
    return text.split('<br/>').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('<br/>').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="relative w-[340px] md:w-[580px] mx-auto">
      <div className="relative bg-[#0c0c0c] rounded-xl px-6 py-5 md:py-6 overflow-hidden">
        {/* Left side: top & left gradient borders */}
        {isLeft && (
          <>
            {/* Top border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#84cecb] to-transparent z-0" />
            {/* Left border */}
            <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-[#84cecb] to-transparent z-0" />
            {/* Top-left corner fix: small box with top and left border only */}
            <div className="absolute top-0 left-0 w-[12px] h-[15px] rounded-tl-xl border-t-2 border-l-[2px] border-[#84cecb] bg-transparent z-0" />
          </>
        )}

        {/* Right side: bottom & right gradient borders */}
        {isRight && (
          <>
            {/* Bottom border - gradient from transparent to cyan */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-[#84cecb] z-0" />
            {/* Right border - Make it more visible with different gradient */}
            <div className="absolute top-0 right-0 bottom-0 w-[2px] z-0">
              <div className="w-full h-full bg-gradient-to-t from-[#84cecb] via-[#84cecb]/70 to-transparent" />
            </div>
            {/* Bottom-right corner fix: mirror of top-left styling */}
            <div className="absolute bottom-0 right-0 w-[12px] h-[15px] rounded-br-xl border-b-2 border-r-[2px] border-[#84cecb] bg-transparent z-0" />
          </>
        )}

        {/* Card Content */}
        <p className="relative z-10 text-xs md:text-sm font-[400] mb-4 tracking-wide text-white leading-relaxed">
        &quot;{parseText(text)}&quot;
        </p>
        <p className="relative z-10 text-[#84cecb] text-sm md:text-sm font-[400]">
          @{title}
        </p>
      </div>
    </div>
  );
}