import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminPanel } from "@/components/admin/admin-panel"

export default async function AdminPage() {
  const session = await auth()

  // Check if user is authenticated
  if (!session?.user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const user = session.user as { id?: string; email?: string; is_admin?: boolean }
  if (!user.is_admin) {
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
