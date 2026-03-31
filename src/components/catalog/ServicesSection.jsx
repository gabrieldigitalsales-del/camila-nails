import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function ServicesSection({ services = [], whatsappUrl }) {
  const activeServices = services.filter(s => s.is_active).sort((a, b) => (a.order || 0) - (b.order || 0));

  if (activeServices.length === 0) return null;

  return (
    <section id="services" className="py-20 md:py-32 px-6 bg-secondary/50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <div className="w-12 h-px bg-primary mx-auto mb-6" />
          <p className="font-heading text-sm md:text-base text-muted-foreground tracking-[0.3em] uppercase mb-1">Tabela de</p>
          <h2 className="font-heading text-4xl md:text-6xl font-light italic text-foreground">
            Serviços
          </h2>
          <p className="font-body text-xs text-muted-foreground mt-4 tracking-wider">
            * Cutilagem e esmaltação não inclusas no valor de banho de gel e alongamentos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-background rounded-sm border border-border overflow-hidden"
        >
          {activeServices.map((service, index) => {
            let price = '';
            try { price = service.extra_data ? JSON.parse(service.extra_data).price : ''; } catch (e) {}
            return (
              <div
                key={service.id}
                className={`flex items-center justify-between px-6 md:px-10 py-4 md:py-5 gap-4 ${
                  index < activeServices.length - 1 ? 'border-b border-border/60' : ''
                }`}
              >
                <div>
                  <p className="font-body text-sm md:text-base text-foreground font-medium uppercase tracking-wide">
                    {service.title}
                  </p>
                  {service.description && (
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{service.description}</p>
                  )}
                </div>
                <span className="font-heading text-lg md:text-xl text-primary font-semibold whitespace-nowrap">
                  {price}
                </span>
              </div>
            );
          })}
        </motion.div>

        {whatsappUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 text-center"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-foreground text-background font-body text-sm uppercase tracking-[0.2em] hover:bg-primary transition-colors rounded-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Agendar pelo WhatsApp
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}