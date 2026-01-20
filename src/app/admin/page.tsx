import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminPanel } from "@/components/admin/admin-panel"
import { db } from "@/lib/db"

export default async function AdminPage() {
  const session = await auth()

  // Check if user is authenticated
  if (!session?.user?.email) {
    redirect('/auth/login')
  }

  // Verify admin status from database (more secure than trusting session alone)
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, isAdmin: true }
  })
  
  if (!user || !user.isAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AdminPanel />
      </div>
    </div>
  )
}
