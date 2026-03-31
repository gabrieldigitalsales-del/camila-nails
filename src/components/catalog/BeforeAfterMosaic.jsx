import React from 'react'
import { motion } from 'framer-motion'

function getImages(item) {
  try {
    const data = item.extra_data ? JSON.parse(item.extra_data) : {}
    return {
      before: data.before_image || '',
      after: data.after_image || '',
    }
  } catch {
    return { before: '', after: '' }
  }
}

export default function BeforeAfterMosaic({ groups = [] }) {
  const activeGroups = groups
    .filter((item) => item.is_active)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  if (activeGroups.length === 0) return null

  return (
    <section id="portfolio" className="py-20 md:py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="w-12 h-px bg-primary mx-auto mb-6" />
          <p className="font-heading text-sm md:text-base text-muted-foreground tracking-[0.3em] uppercase mb-1">Mosaico</p>
          <h2 className="font-heading text-4xl md:text-6xl font-light italic text-foreground">Antes e Depois</h2>
          <p className="font-body text-sm text-muted-foreground mt-4 max-w-2xl mx-auto">
            Selecione suas proprias fotos no painel admin para substituir estas imagens de exemplo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {activeGroups.map((group, index) => {
            const images = getImages(group)
            return (
              <motion.article
                key={group.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.04 }}
                className="rounded-3xl overflow-hidden border border-border bg-secondary/40 shadow-sm"
              >
                <div className="px-6 pt-6 pb-4 text-center">
                  <h3 className="font-heading text-2xl text-foreground">{group.title}</h3>
                  {group.description && <p className="font-body text-sm text-muted-foreground mt-1">{group.description}</p>}
                </div>
                <div className="grid grid-cols-2 gap-px bg-border">
                  <div className="bg-background">
                    {images.before ? (
                      <img src={images.before} alt={`Antes ${group.title}`} className="w-full aspect-[4/5] object-cover" />
                    ) : (
                      <div className="aspect-[4/5] flex items-center justify-center text-sm text-muted-foreground">Antes</div>
                    )}
                    <div className="px-4 py-3 text-center font-body text-xs uppercase tracking-[0.25em] text-muted-foreground">Antes</div>
                  </div>
                  <div className="bg-background">
                    {images.after ? (
                      <img src={images.after} alt={`Depois ${group.title}`} className="w-full aspect-[4/5] object-cover" />
                    ) : (
                      <div className="aspect-[4/5] flex items-center justify-center text-sm text-muted-foreground">Depois</div>
                    )}
                    <div className="px-4 py-3 text-center font-body text-xs uppercase tracking-[0.25em] text-muted-foreground">Depois</div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
