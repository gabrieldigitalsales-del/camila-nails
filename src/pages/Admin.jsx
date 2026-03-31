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
import { checkStorageConnection, getAdminContent, resetContent } from '@/services/contentStore'

export default function Admin() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [connectionMessage, setConnectionMessage] = useState('Conectando ao armazenamento online...')

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [status, items] = await Promise.all([checkStorageConnection(), getAdminContent()])
      setConnectionMessage(
        status.ok
          ? 'Painel conectado ao armazenamento online da Vercel.'
          : 'Falha ao validar a conexao com o armazenamento online.'
      )
      setContent(items)
    } catch (error) {
      setConnectionMessage(error?.message || 'Nao foi possivel conectar ao armazenamento online.')
      setContent([])
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh().catch((error) => {
      toast.error(error?.message || 'Nao foi possivel carregar o painel admin.')
    })
  }, [refresh])

  const slides = content.filter((item) => item.section === 'hero_slide')
  const aboutItems = content.filter((item) => item.section === 'about')
  const services = content.filter((item) => item.section === 'service')
  const portfolioGroups = content.filter((item) => item.section === 'portfolio_group')
  const contact = content.find((item) => item.section === 'contact')
  const settings = content.find((item) => item.section === 'site_settings')

  const handleReset = async () => {
    try {
      await resetContent()
      await refresh()
      toast.success('Conteudo restaurado para o padrao.')
    } catch (error) {
      toast.error(error?.message || 'Nao foi possivel restaurar.')
    }
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminHeader />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-body">{loading ? 'Carregando conteudo...' : connectionMessage}</p>
          <Button variant="outline" onClick={handleReset} className="gap-2" disabled={loading || !content.length}>
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
