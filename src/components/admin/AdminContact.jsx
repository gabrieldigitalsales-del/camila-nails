import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Save } from 'lucide-react'
import { toast } from 'sonner'
import { updateContent } from '@/services/contentStore'

export default function AdminContact({ contact, settings, onRefresh }) {
  const [form, setForm] = useState({
    siteName: '',
    siteSubtitle: '',
    heroTagline: '',
    contactTitle: '',
    contactDescription: '',
    instagram: '',
    instagramUrl: '',
    whatsapp: '',
    whatsappUrl: '',
    address: '',
  })

  useEffect(() => {
    let parsedSettings = {}
    try {
      parsedSettings = settings?.extra_data ? JSON.parse(settings.extra_data) : {}
    } catch {
      parsedSettings = {}
    }

    setForm({
      siteName: settings?.title || '',
      siteSubtitle: settings?.subtitle || '',
      heroTagline: settings?.description || '',
      contactTitle: contact?.title || '',
      contactDescription: contact?.description || '',
      instagram: parsedSettings.instagram || '',
      instagramUrl: parsedSettings.instagram_url || '',
      whatsapp: parsedSettings.whatsapp || '',
      whatsappUrl: parsedSettings.whatsapp_url || '',
      address: parsedSettings.address || '',
    })
  }, [contact, settings])

  const handleSave = async () => {
    if (settings) {
      await updateContent(settings.id, {
        title: form.siteName,
        subtitle: form.siteSubtitle,
        description: form.heroTagline,
        extra_data: JSON.stringify({
          instagram: form.instagram,
          instagram_url: form.instagramUrl,
          whatsapp: form.whatsapp,
          whatsapp_url: form.whatsappUrl,
          address: form.address,
        }),
      })
    }

    if (contact) {
      await updateContent(contact.id, {
        title: form.contactTitle,
        description: form.contactDescription,
      })
    }

    await onRefresh()
    toast.success('Configuracoes salvas!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-xl flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Configuracoes Gerais e Contato
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-body text-sm">Nome do Site</Label>
            <Input value={form.siteName} onChange={(e) => setForm((prev) => ({ ...prev, siteName: e.target.value }))} className="font-body text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Subtitulo</Label>
            <Input value={form.siteSubtitle} onChange={(e) => setForm((prev) => ({ ...prev, siteSubtitle: e.target.value }))} className="font-body text-sm" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-body text-sm">Tagline principal</Label>
          <Textarea value={form.heroTagline} onChange={(e) => setForm((prev) => ({ ...prev, heroTagline: e.target.value }))} className="font-body text-sm" />
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <p className="font-body text-sm font-medium text-foreground">Secao de Contato</p>
          <Input value={form.contactTitle} onChange={(e) => setForm((prev) => ({ ...prev, contactTitle: e.target.value }))} placeholder="Titulo da secao de contato" className="font-body text-sm" />
          <Textarea value={form.contactDescription} onChange={(e) => setForm((prev) => ({ ...prev, contactDescription: e.target.value }))} placeholder="Descricao" className="font-body text-sm" />
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <p className="font-body text-sm font-medium text-foreground">Redes Sociais e Endereco</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body text-sm">Instagram @</Label>
              <Input value={form.instagram} onChange={(e) => setForm((prev) => ({ ...prev, instagram: e.target.value }))} className="font-body text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Link do Instagram</Label>
              <Input value={form.instagramUrl} onChange={(e) => setForm((prev) => ({ ...prev, instagramUrl: e.target.value }))} className="font-body text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">WhatsApp</Label>
              <Input value={form.whatsapp} onChange={(e) => setForm((prev) => ({ ...prev, whatsapp: e.target.value }))} className="font-body text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Link do WhatsApp</Label>
              <Input value={form.whatsappUrl} onChange={(e) => setForm((prev) => ({ ...prev, whatsappUrl: e.target.value }))} className="font-body text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Endereco</Label>
            <Input value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} className="font-body text-sm" />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full gap-2 font-body text-sm">
          <Save className="w-4 h-4" />
          Salvar Configuracoes
        </Button>
      </CardContent>
    </Card>
  )
}
