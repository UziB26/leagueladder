"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export function AuthButton() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session) {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <span className="text-sm text-gray-600 hidden sm:inline">Hi, {session.user?.name}</span>
        <Button
          variant="outline"
          size="sm"
          className="min-h-[44px] md:min-h-0"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-3 md:gap-2">
      <Button
        variant="outline"
        size="sm"
        className="min-h-[44px] md:min-h-0"
        onClick={() => router.push("/auth/login")}
      >
        Login
      </Button>
      <Button 
        size="sm" 
        className="min-h-[44px] md:min-h-0"
        onClick={() => router.push("/auth/register")}
      >
        Register
      </Button>
    </div>
  )
}
