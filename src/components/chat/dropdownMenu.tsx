"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

export interface DropdownMenuItem {
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
  className?: string
  disabled?: boolean
  type?: "item" | "separator"
}

interface DropdownMenuProps {
  trigger: React.ReactNode
  items: DropdownMenuItem[]
  align?: "left" | "right"
  className?: string
}

export function DropdownMenu({ trigger, items, align = "right", className = "" }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.disabled) return

    if (item.onClick) {
      item.onClick()
    }
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1 w-48 bg-white border border-value2 rounded-md shadow-lg py-1 ${
            align === "right" ? "right-0" : "left-0"
          } ${className}`}
          role="menu"
        >
          {items.map((item, index) => {
            if (item.type === "separator") {
              return <div key={index} className="h-px bg-value2 my-1" role="separator" />
            }

            const baseClasses = `w-full px-3 py-2 text-sm text-left flex items-center transition-colors ${
              item.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-value3 cursor-pointer"
            } ${item.className || ""}`

            const content = (
              <>
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </>
            )

            if (item.href && !item.disabled) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={baseClasses}
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                >
                  {content}
                </Link>
              )
            }

            return (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                className={baseClasses}
                disabled={item.disabled}
                role="menuitem"
              >
                {content}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
