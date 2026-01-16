"use client"

import { useState, ReactNode } from "react"
import { useLongPress } from "@/hooks/use-long-press"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContextMenuOption {
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: "default" | "destructive"
}

interface ContextMenuProps {
  options: ContextMenuOption[]
  children: ReactNode
  disabled?: boolean
  className?: string
}

export function ContextMenu({
  options,
  children,
  disabled = false,
  className,
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const longPressHandlers = useLongPress({
    onLongPress: (e) => {
      if (disabled) return

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      setPosition({ x: clientX, y: clientY })
      setIsOpen(true)
    },
    disabled,
  })

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOptionClick = (option: ContextMenuOption) => {
    option.onClick()
    handleClose()
  }

  return (
    <>
      <div {...longPressHandlers} className={className}>
        {children}
      </div>

      {/* Context Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleClose}
            onTouchStart={handleClose}
          />
          <div
            className="fixed z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl min-w-[200px] py-2"
            style={{
              left: `${Math.min(position.x, window.innerWidth - 220)}px`,
              top: `${Math.min(position.y, window.innerHeight - 200)}px`,
            }}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <span className="text-sm font-semibold text-white">Options</span>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white min-h-[32px] min-w-[32px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="py-1">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={cn(
                    "w-full px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-gray-800 transition-colors min-h-[44px]",
                    option.variant === "destructive" && "text-red-400 hover:text-red-300"
                  )}
                >
                  {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
