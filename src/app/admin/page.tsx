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
  const user = db.prepare('SELECT id, email, is_admin FROM users WHERE email = ?').get(session.user.email) as { id?: string; email?: string; is_admin?: boolean } | undefined
  
  if (!user || !user.is_admin) {
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
