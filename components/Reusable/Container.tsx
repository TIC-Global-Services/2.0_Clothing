import type { ElementType, ReactNode } from "react"

type ContainerProps = {
  children: ReactNode
  as?: ElementType // allows switching between section, div, etc.
  className?: string
}

export function Container({
  children,
  as: Component = "div", // default to <div> if not provided
  className = "",
}: ContainerProps) {
  return <Component className={`w-full mx-auto px-8 md:px-20 ${className}`}>{children}</Component>
}
