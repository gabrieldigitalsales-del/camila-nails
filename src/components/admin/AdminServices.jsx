import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Sparkles, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { createContent, deleteContent, updateContent } from '@/services/contentStore'

function getPrice(service) {
  try {
    return service.extra_data ? JSON.parse(service.extra_data).price : ''
  } catch {
    return ''
  }
}

export default function AdminServices({ services = [], onRefresh }) {
  const [newService, setNewService] = useState({ title: '', description: '', price: '' })

  const addService = async () => {
    if (!newService.title) return toast.error('Adicione um nome para o servico')
    await createContent({
      section: 'service',
      title: newService.title,
      description: newService.description,
      order: services.length + 1,
      is_active: true,
      extra_data: JSON.stringify({ price: newService.price }),
    })
    setNewService({ title: '', description: '', price: '' })
    await onRefresh()
    toast.success('Servico adicionado!')
  }

  const handleDelete = async (id) => {
    await deleteContent(id)
    await onRefresh()
    toast.success('Servico removido!')
  }

  const updateField = async (id, field, value) => {
    await updateContent(id, { [field]: value })
    await onRefresh()
  }

  const updatePrice = async (service, price) => {
    let current = {}
    try {
      current = service.extra_data ? JSON.parse(service.extra_data) : {}
    } catch {}
    await updateContent(service.id, { extra_data: JSON.stringify({ ...current, price }) })
    await onRefresh()
  }

  const toggleActive = async (service) => {
    await updateContent(service.id, { is_active: !service.is_active })
    await onRefresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-xl flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Servicos e Precos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {services.sort((a, b) => (a.order || 0) - (b.order || 0)).map((service) => (
          <div key={service.id} className="flex gap-3 p-4 border border-border rounded-lg bg-secondary/30 items-center">
            <div className="flex-1 space-y-2">
              <div className="flex gap-2 flex-col md:flex-row">
                <Input
                  defaultValue={service.title}
                  onBlur={(e) => updateField(service.id, 'title', e.target.value)}
                  placeholder="Nome do servico"
                  className="font-body text-sm flex-1"
                />
                <Input
                  defaultValue={getPrice(service)}
                  onBlur={(e) => updatePrice(service, e.target.value)}
                  placeholder="R$0,00"
                  className="font-body text-sm w-full md:w-32"
                />
              </div>
              <Input
                defaultValue={service.description}
                onBlur={(e) => updateField(service.id, 'description', e.target.value)}
                placeholder="Observacao"
                className="font-body text-sm"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Switch checked={service.is_active} onCheckedChange={() => toggleActive(service)} />
              <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)} className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="border-2 border-dashed border-border rounded-lg p-4 space-y-3">
          <p className="font-body text-sm font-medium text-muted-foreground">Novo Servico</p>
          <div className="grid grid-cols-1 md:grid-cols-[1fr,140px] gap-3">
            <Input
              value={newService.title}
              onChange={(e) => setNewService((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Nome do servico"
              className="font-body text-sm"
            />
            <Input
              value={newService.price}
              onChange={(e) => setNewService((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="R$0,00"
              className="font-body text-sm"
            />
          </div>
          <Input
            value={newService.description}
            onChange={(e) => setNewService((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Descricao"
            className="font-body text-sm"
          />
          <Button onClick={addService} size="sm" className="gap-1 font-body text-sm">
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
