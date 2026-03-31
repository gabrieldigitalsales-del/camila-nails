import { useCallback, useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSlides from '@/components/admin/AdminSlides'
import AdminAbout from '@/components/admin/AdminAbout'
import AdminServices from '@/components/admin/AdminServices'
import AdminPortfolio from '@/components/admin/AdminPortfolio'
import AdminContact from '@/components/admin/AdminContact'
import { Button } from '@/components/ui/button'
import { getAllContent, resetContent } from '@/services/contentStore'

export default function Admin() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const items = await getAllContent()
    setContent(items)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const slides = content.filter((item) => item.section === 'hero_slide')
  const aboutItems = content.filter((item) => item.section === 'about')
  const services = content.filter((item) => item.section === 'service')
  const portfolioGroups = content.filter((item) => item.section === 'portfolio_group')
  const contact = content.find((item) => item.section === 'contact')
  const settings = content.find((item) => item.section === 'site_settings')

  const handleReset = async () => {
    await resetContent()
    await refresh()
    toast.success('Conteudo restaurado para o padrao.')
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminHeader />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-body">
            {loading ? 'Carregando conteudo...' : 'Painel conectado ao armazenamento da Vercel.'}
          </p>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Restaurar padrao
          </Button>
        </div>
        <AdminSlides slides={slides} onRefresh={refresh} />
        <AdminAbout aboutItems={aboutItems} onRefresh={refresh} />
        <AdminServices services={services} onRefresh={refresh} />
        <AdminPortfolio groups={portfolioGroups} onRefresh={refresh} />
        <AdminContact contact={contact} settings={settings} onRefresh={refresh} />
      </div>
    </div>
  )
}
