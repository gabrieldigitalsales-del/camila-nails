import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { createContent, deleteContent, updateContent, uploadImage } from '@/services/contentStore'

export default function AdminSlides({ slides = [], onRefresh }) {
  const [newSlide, setNewSlide] = useState({ title: '', subtitle: '', image_url: '' })
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e, slideId) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fileUrl = await uploadImage(file)
      if (slideId) {
        await updateContent(slideId, { image_url: fileUrl })
        await onRefresh()
        toast.success('Imagem atualizada!')
      } else {
        setNewSlide((prev) => ({ ...prev, image_url: fileUrl }))
      }
    } catch {
      toast.error('Nao foi possivel carregar a imagem.')
    } finally {
      setUploading(false)
    }
  }

  const addSlide = async () => {
    if (!newSlide.title) return toast.error('Adicione um titulo')
    await createContent({
      section: 'hero_slide',
      title: newSlide.title,
      subtitle: newSlide.subtitle,
      image_url: newSlide.image_url,
      order: slides.length + 1,
      is_active: true,
    })
    setNewSlide({ title: '', subtitle: '', image_url: '' })
    await onRefresh()
    toast.success('Slide adicionado!')
  }

  const handleDelete = async (id) => {
    await deleteContent(id)
    await onRefresh()
    toast.success('Slide removido!')
  }

  const toggleActive = async (slide) => {
    await updateContent(slide.id, { is_active: !slide.is_active })
    await onRefresh()
  }

  const updateField = async (id, field, value) => {
    await updateContent(id, { [field]: value })
    await onRefresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-xl flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          Banner Carrossel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {slides.sort((a, b) => (a.order || 0) - (b.order || 0)).map((slide) => (
          <div key={slide.id} className="flex gap-4 p-4 border border-border rounded-lg bg-secondary/30">
            <div className="flex-shrink-0 w-32 h-20 rounded overflow-hidden bg-muted">
              {slide.image_url ? (
                <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Input
                defaultValue={slide.title}
                onBlur={(e) => updateField(slide.id, 'title', e.target.value)}
                className="font-body text-sm"
                placeholder="Titulo"
              />
              <Input
                defaultValue={slide.subtitle}
                onBlur={(e) => updateField(slide.id, 'subtitle', e.target.value)}
                className="font-body text-sm"
                placeholder="Subtitulo"
              />
              <div className="flex items-center gap-2">
                <label className="cursor-pointer text-xs text-primary font-body underline">
                  Trocar imagem
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, slide.id)} className="hidden" />
                </label>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Switch checked={slide.is_active} onCheckedChange={() => toggleActive(slide)} />
              <Button variant="ghost" size="icon" onClick={() => handleDelete(slide.id)} className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="border-2 border-dashed border-border rounded-lg p-4 space-y-3">
          <p className="font-body text-sm font-medium text-muted-foreground">Novo Slide</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              value={newSlide.title}
              onChange={(e) => setNewSlide((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Titulo do slide"
              className="font-body text-sm"
            />
            <Input
              value={newSlide.subtitle}
              onChange={(e) => setNewSlide((prev) => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Subtitulo"
              className="font-body text-sm"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="cursor-pointer px-4 py-2 border border-border rounded-md text-xs font-body text-muted-foreground hover:bg-secondary transition-colors">
              {uploading ? 'Enviando...' : newSlide.image_url ? 'Imagem selecionada' : 'Selecionar imagem'}
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e)} className="hidden" disabled={uploading} />
            </label>
            <Button onClick={addSlide} size="sm" className="gap-1 font-body text-sm">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
