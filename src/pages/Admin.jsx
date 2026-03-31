import { useCallback, useEffect, useMemo, useState } from 'react'
import { LogOut, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSlides from '@/components/admin/AdminSlides'
import AdminAbout from '@/components/admin/AdminAbout'
import AdminServices from '@/components/admin/AdminServices'
import AdminPortfolio from '@/components/admin/AdminPortfolio'
import AdminContact from '@/components/admin/AdminContact'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { checkStorageConnection, getAdminContent, resetContent } from '@/services/contentStore'

async function parseJson(response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return { error: text || `Erro ${response.status}` }
  }
}

export default function Admin() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [connectionMessage, setConnectionMessage] = useState('Conectando ao armazenamento online...')

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [status, items] = await Promise.all([checkStorageConnection(), getAdminContent()])
      setConnectionMessage(
        status.ok
          ? `Painel conectado ao Blob da Vercel (${status.access}). ${status.initialized ? 'Conteudo online carregado.' : 'Conteudo padrao em uso ate o primeiro salvamento.'}`
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

  const checkAuth = useCallback(async () => {
    setCheckingAuth(true)
    try {
      const response = await fetch('/api/admin-check', { cache: 'no-store' })
      const data = await parseJson(response)
      setAuthenticated(Boolean(data?.authenticated))
      if (!data?.configured) {
        toast.error('Configure ADMIN_PASSWORD na Vercel para proteger o painel.')
      }
      return Boolean(data?.authenticated)
    } catch (error) {
      toast.error(error?.message || 'Nao foi possivel validar o acesso ao admin.')
      setAuthenticated(false)
      return false
    } finally {
      setCheckingAuth(false)
    }
  }, [])

  useEffect(() => {
    checkAuth().then((ok) => {
      if (!ok) return
      refresh().catch((error) => {
        toast.error(error?.message || 'Nao foi possivel carregar o painel admin.')
      })
    })
  }, [checkAuth, refresh])

  const slides = useMemo(() => content.filter((item) => item.section === 'hero_slide'), [content])
  const aboutItems = useMemo(() => content.filter((item) => item.section === 'about'), [content])
  const services = useMemo(() => content.filter((item) => item.section === 'service'), [content])
  const portfolioGroups = useMemo(() => content.filter((item) => item.section === 'portfolio_group'), [content])
  const contact = useMemo(() => content.find((item) => item.section === 'contact'), [content])
  const settings = useMemo(() => content.find((item) => item.section === 'site_settings'), [content])

  const handleReset = async () => {
    try {
      await resetContent()
      await refresh()
      toast.success('Conteudo restaurado para o padrao.')
    } catch (error) {
      toast.error(error?.message || 'Nao foi possivel restaurar.')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginLoading(true)
    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await parseJson(response)
      if (!response.ok) {
        throw new Error(data?.error || 'Nao foi possivel entrar no painel.')
      }
      setAuthenticated(true)
      setPassword('')
      toast.success('Acesso liberado.')
      await refresh()
    } catch (error) {
      toast.error(error?.message || 'Senha incorreta.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin-logout', { method: 'POST' })
      setAuthenticated(false)
      setContent([])
      toast.success('Voce saiu do painel.')
    } catch (error) {
      toast.error(error?.message || 'Nao foi possivel sair.')
    }
  }

  if (checkingAuth) {
    return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Verificando acesso...</div>
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Painel administrativo</CardTitle>
            <CardDescription>Digite a senha para editar o conteudo do site.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Senha do admin"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              <Button type="submit" className="w-full" disabled={loginLoading || !password.trim()}>
                {loginLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminHeader />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground font-body">{loading ? 'Carregando conteudo...' : connectionMessage}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset} className="gap-2" disabled={loading || !content.length}>
              <RotateCcw className="w-4 h-4" />
              Restaurar padrao
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
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
