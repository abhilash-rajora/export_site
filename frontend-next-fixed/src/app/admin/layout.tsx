import AdminGuard from '@/components/AdminGuard'
import AdminLayouts from '@/layouts/AdminLayout'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="admin-panel">
        <AdminLayouts>
          {children}
        </AdminLayouts>
      </div>
    </AdminGuard>
  )
}