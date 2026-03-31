import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { createContent, deleteContent, updateContent, uploadImage } from '@/services/contentStore'

export default function AdminAbout({ aboutItems = [], onRefresh }) {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e, itemId) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fileUrl = await uploadImage(file)
      await updateContent(itemId, { image_url: fileUrl })
      await onRefresh()
      toast.success('Imagem atualizada!')
    } catch {
      toast.error('Nao foi possivel carregar a imagem.')
    } finally {
      setUploading(false)
    }
  }

  const updateField = async (id, field, value) => {
    await updateContent(id, { [field]: value })
    await onRefresh()
  }

  const addAboutItem = async () => {
    await createContent({
      section: 'about',
      title: 'Novo Bloco',
      description: 'Descreva aqui...',
      order: aboutItems.length + 1,
      is_active: true,
    })
    await onRefresh()
    toast.success('Bloco adicionado!')
  }

  const handleDelete = async (id) => {
    await deleteContent(id)
    await onRefresh()
    toast.success('Bloco removido!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-xl flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Sobre Mim e Missao
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {aboutItems.sort((a, b) => (a.order || 0) - (b.order || 0)).map((item) => (
          <div key={item.id} className="p-4 border border-border rounded-lg space-y-3 bg-secondary/30">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <Input
                  defaultValue={item.title}
                  onBlur={(e) => updateField(item.id, 'title', e.target.value)}
                  placeholder="Titulo da secao"
                  className="font-heading text-lg"
                />
                <Input
                  defaultValue={item.subtitle}
                  onBlur={(e) => updateField(item.id, 'subtitle', e.target.value)}
                  placeholder="Subtitulo"
                  className="font-body text-sm"
                />
                <Textarea
                  defaultValue={item.description}
                  onBlur={(e) => updateField(item.id, 'description', e.target.value)}
                  placeholder="Descricao"
                  className="font-body text-sm min-h-[100px]"
                />
                {item.image_url && (
                  <div className="w-24 h-24 rounded overflow-hidden">
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="cursor-pointer text-xs text-primary font-body underline">
                  {uploading ? 'Enviando...' : 'Alterar imagem'}
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, item.id)} className="hidden" />
                </label>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive ml-2">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button onClick={addAboutItem} variant="outline" className="w-full gap-2 font-body text-sm">
          <Plus className="w-4 h-4" />
          Adicionar Bloco
        </Button>
      </CardContent>
    </Card>
  )
}
