"use client"

import { forwardRef, type InputHTMLAttributes } from "react"
import { motion } from "framer-motion"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ error, label, className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-muted-foreground mb-2">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all focus:scale-[1.01] ${
          error ? "border-destructive focus:ring-destructive" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

Input.displayName = "Input"
