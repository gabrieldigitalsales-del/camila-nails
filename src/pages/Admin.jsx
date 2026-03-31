import { useCallback, useEffect, useMemo, useState } from 'react'
import { Lock, LogOut, RotateCcw } from 'lucide-react'
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

async function parseApiResponse(response) {
  const text = await response.text()
  let data = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(data?.error || text || `Erro ${response.status}`)
  }

  return data
}

function LoginScreen({ password, setPassword, loading, onSubmit }) {
  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-background shadow-sm p-6 space-y-5">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold">Area administrativa</h1>
          <p className="text-sm text-muted-foreground">Digite a senha para acessar o painel e editar o site.</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Senha</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !password.trim()}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
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
    setAuthLoading(true)
    try {
      const response = await fetch('/api/admin-check', { cache: 'no-store', credentials: 'include' })
      if (response.status === 401) {
        setAuthenticated(false)
        return
      }
      const data = await parseApiResponse(response)
      setAuthenticated(Boolean(data?.authenticated))
    } catch (error) {
      setAuthenticated(false)
      toast.error(error?.message || 'Nao foi possivel validar a sessao do admin.')
    } finally {
      setAuthLoading(false)
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

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginLoading(true)
    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      await parseApiResponse(response)
      setAuthenticated(true)
      setPassword('')
      await refresh()
      toast.success('Login realizado com sucesso.')
    } catch (error) {
      toast.error(error?.message || 'Nao foi possivel entrar no admin.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin-logout', {
        method: 'POST',
        credentials: 'include',
      })
      await parseApiResponse(response)
      setAuthenticated(false)
      setContent([])
      toast.success('Voce saiu do admin.')
    } catch (error) {
      toast.error(error?.message || 'Nao foi possivel sair do admin.')
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

  const sections = useMemo(() => ({
    slides: content.filter((item) => item.section === 'hero_slide'),
    aboutItems: content.filter((item) => item.section === 'about'),
    services: content.filter((item) => item.section === 'service'),
    portfolioGroups: content.filter((item) => item.section === 'portfolio_group'),
    contact: content.find((item) => item.section === 'contact'),
    settings: content.find((item) => item.section === 'site_settings'),
  }), [content])

  if (authLoading) {
    return <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-6">Validando acesso...</div>
  }

  if (!authenticated) {
    return <LoginScreen password={password} setPassword={setPassword} loading={loginLoading} onSubmit={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminHeader />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground font-body">{loading ? 'Carregando conteudo...' : connectionMessage}</p>
          <div className="flex items-center gap-2">
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
        <AdminSlides slides={sections.slides} onRefresh={refresh} />
        <AdminAbout aboutItems={sections.aboutItems} onRefresh={refresh} />
        <AdminServices services={sections.services} onRefresh={refresh} />
        <AdminPortfolio groups={sections.portfolioGroups} onRefresh={refresh} />
        <AdminContact contact={sections.contact} settings={sections.settings} onRefresh={refresh} />
      </div>
    </div>
  )
}
