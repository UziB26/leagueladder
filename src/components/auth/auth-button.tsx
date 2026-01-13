"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export function AuthButton() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Hi, {session.user?.name}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push("/login")}
      >
        Login
      </Button>
      <Button size="sm" onClick={() => router.push("/register")}>
        Register
      </Button>
    </div>
  )
}
