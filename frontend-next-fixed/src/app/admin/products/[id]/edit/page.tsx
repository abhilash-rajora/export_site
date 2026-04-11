import AdminProductFormPage from '@/components/pages/Admin/AdminProductFormPage'
export default function Page({ params }: { params: { id: string } }) {
  return <AdminProductFormPage id={params.id} />
}