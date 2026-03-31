import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ImageIcon, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateContent, uploadImage } from '@/services/contentStore'

function getImages(item) {
  try {
    const data = item.extra_data ? JSON.parse(item.extra_data) : {}
    return {
      before_image: data.before_image || '',
      after_image: data.after_image || '',
    }
  } catch {
    return { before_image: '', after_image: '' }
  }
}

export default function AdminPortfolio({ groups = [], onRefresh }) {
  const [uploadingId, setUploadingId] = useState('')

  const updateField = async (id, field, value) => {
    await updateContent(id, { [field]: value })
    await onRefresh()
  }

  const updateImage = async (item, field, file) => {
    if (!file) return
    setUploadingId(`${item.id}-${field}`)
    try {
      const image = await uploadImage(file)
      const current = getImages(item)
      await updateContent(item.id, {
        extra_data: JSON.stringify({
          ...current,
          [field]: image,
        }),
      })
      await onRefresh()
      toast.success('Imagem atualizada!')
    } catch (error) {
      toast.error(error?.message || 'Nao foi possivel carregar a imagem.')
    } finally {
      setUploadingId('')
    }
  }


  const removeImage = async (item, field) => {
    try {
      const current = getImages(item)
      await updateContent(item.id, {
        extra_data: JSON.stringify({
          ...current,
          [field]: '',
        }),
      })
      await onRefresh()
      toast.success('Imagem removida!')
    } catch (error) {
      toast.error(error?.message || 'Nao foi possivel remover a imagem.')
    }
  }

  const toggleActive = async (item) => {
    await updateContent(item.id, { is_active: !item.is_active })
    await onRefresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-xl flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          Mosaico Antes e Depois
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {groups.sort((a, b) => (a.order || 0) - (b.order || 0)).map((item) => {
          const images = getImages(item)
          return (
            <div key={item.id} className="p-4 border border-border rounded-xl bg-secondary/30 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    defaultValue={item.title}
                    onBlur={(e) => updateField(item.id, 'title', e.target.value)}
                    placeholder="Nome do grupo"
                    className="font-body text-sm"
                  />
                  <Input
                    defaultValue={item.description}
                    onBlur={(e) => updateField(item.id, 'description', e.target.value)}
                    placeholder="Descricao curta"
                    className="font-body text-sm"
                  />
                </div>
                <Switch checked={item.is_active} onCheckedChange={() => toggleActive(item)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground">Antes</p>
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-muted border border-border">
                    {images.before_image ? <img src={images.before_image} alt="Antes" className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer text-xs text-primary font-body underline">
                      {uploadingId === `${item.id}-before_image` ? 'Enviando...' : 'Trocar imagem antes'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateImage(item, 'before_image', e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                    {images.before_image ? (
                      <button type="button" onClick={() => removeImage(item, 'before_image')} className="text-xs text-destructive font-body inline-flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />
                        Remover
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground">Depois</p>
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-muted border border-border">
                    {images.after_image ? <img src={images.after_image} alt="Depois" className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer text-xs text-primary font-body underline">
                      {uploadingId === `${item.id}-after_image` ? 'Enviando...' : 'Trocar imagem depois'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateImage(item, 'after_image', e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                    {images.after_image ? (
                      <button type="button" onClick={() => removeImage(item, 'after_image')} className="text-xs text-destructive font-body inline-flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />
                        Remover
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
