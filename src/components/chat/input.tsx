"use client"

import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outline" | "filled"
  inputSize?: "sm" | "md" | "lg"
  error?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className = "", variant = "default", inputSize = "md", error = false, leftIcon, rightIcon, type, ...props },
    ref,
  ) => {
    const baseClasses =
      "w-full rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

    const variantClasses = {
      default:
        "border border-value2 bg-white text-gray-900 placeholder:text-value1 focus:border-secondary focus:ring-secondary/20",
      outline:
        "border-2 border-value2 bg-transparent text-gray-900 placeholder:text-value1 focus:border-primary focus:ring-primary/20",
      filled: "border-0 bg-value3 text-gray-900 placeholder:text-value1 focus:bg-white focus:ring-primary/20",
    }

    const sizeClasses = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-3 text-sm",
      lg: "h-12 px-4 text-base",
    }

    const errorClasses = error ? "border-danger focus:border-danger focus:ring-danger/20" : ""

    const inputClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[inputSize]} ${errorClasses} ${className}`

    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-value1">{leftIcon}</div>}
          <input
            type={type}
            className={`${inputClasses} ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""}`}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-value1">{rightIcon}</div>
          )}
        </div>
      )
    }

    return <input type={type} className={inputClasses} ref={ref} {...props} />
  },
)

Input.displayName = "Input"

export { Input }
