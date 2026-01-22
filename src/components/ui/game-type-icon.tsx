"use client"

import { Gamepad2 } from "lucide-react"

interface GameTypeIconProps {
  gameType: 'fifa' | 'table-tennis'
  className?: string
  iconClassName?: string
}

export function GameTypeIcon({ gameType, className, iconClassName }: GameTypeIconProps) {
  if (gameType === 'fifa') {
    return <Gamepad2 className={iconClassName || className || "h-6 w-6 text-blue-700"} strokeWidth={2} />
  }
  return <span className={className || "text-2xl"}>🏓</span>
}
