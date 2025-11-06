import { SparklesIcon } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
}

export function Logo({ size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  }

  return (
    <div className="flex items-center justify-center rounded-lg bg-primary p-1.5">
      <SparklesIcon className={`${sizeClasses[size]} text-primary-foreground`} />
    </div>
  )
}
