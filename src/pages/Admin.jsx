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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { checkStorageConnection, getAdminContent, resetContent } from '@/services/contentStore'

async function parseAuthResponse(response) {
  const text = await response.text()
  try {
    const data = JSON.parse(text)
    return data?.error || data?.message || text || `Erro ${response.status}`
  } catch {
    return text || `Erro ${response.status}`
  }
}

export default function Admin() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [authChecking, setAuthChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
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
    setAuthChecking(true)
    try {
      const response = await fetch('/api/admin-check', { cache: 'no-store', credentials: 'include' })
      setAuthenticated(response.ok)
    } catch {
      setAuthenticated(false)
    } finally {
      setAuthChecking(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!authenticated) return
    refresh().catch((error) => {
      toast.error(error?.message || 'Nao foi possivel carregar o painel admin.')
    })
  }, [authenticated, refresh])

  const slides = useMemo(() => content.filter((item) => item.section === 'hero_slide'), [content])
  const aboutItems = useMemo(() => content.filter((item) => item.section === 'about'), [content])
  const services = useMemo(() => content.filter((item) => item.section === 'service'), [content])
  const portfolioGroups = useMemo(() => content.filter((item) => item.section === 'portfolio_group'), [content])
  const contact = useMemo(() => content.find((item) => item.section === 'contact'), [content])
  const settings = useMemo(() => content.find((item) => item.section === 'site_settings'), [content])

  const handleLogin = async (event) => {
    event.preventDefault()
    setAuthLoading(true)
    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        throw new Error(await parseAuthResponse(response))
      }

      setAuthenticated(true)
      setPassword('')
      await refresh()
      toast.success('Login realizado com sucesso.')
    } catch (error) {
      toast.error(error?.message || 'Nao foi possivel entrar no admin.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin-logout', {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setAuthenticated(false)
      setContent([])
      toast.success('Sessao encerrada.')
    }
  }

  const handleReset = async () => {
    try {
      await resetContent()
      await refresh()
      toast.success('Conteudo restaurado para o padrao.')
    } catch (error) {
      toast.error(error?.message || 'Nao foi possivel restaurar.')
    }
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-6">
        <p className="text-sm text-muted-foreground font-body">Verificando acesso ao painel...</p>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border bg-background p-8 shadow-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Entrar no painel admin</h1>
            <p className="text-sm text-muted-foreground">Digite a senha configurada na Vercel para liberar as edicoes.</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Senha</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={authLoading || !password.trim()}>
              {authLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminHeader />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground font-body">{loading ? 'Carregando conteudo...' : connectionMessage}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={handleReset} className="gap-2" disabled={loading || !content.length}>
              <RotateCcw className="w-4 h-4" />
              Restaurar padrao
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
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
