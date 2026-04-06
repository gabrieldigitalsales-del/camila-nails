import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Instagram, MessageCircle } from 'lucide-react';

export default function ContactFooter({ contact, settings }) {
  let parsedSettings = {};
  try {
    parsedSettings = settings?.extra_data ? JSON.parse(settings.extra_data) : {};
  } catch (e) {
    parsedSettings = {};
  }

  const whatsappUrl = parsedSettings.whatsapp_url || 'https://wa.me/553172467698';
  const instagramUrl = parsedSettings.instagram_url || 'https://instagram.com/camilaalmeida__nail';
  const address = parsedSettings.address || 'Rua Paulo Frontin, 980, Centro, Sete Lagoas - MG';
  const instagram = parsedSettings.instagram || '@camilaalmeida__nail';
  const whatsapp = parsedSettings.whatsapp || '+55 31 7246-7698';

  return (
    <section id="contact" className="relative py-20 md:py-32 px-6 bg-foreground text-background">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="w-12 h-px bg-primary mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-5xl font-light">
            {contact?.title || 'Agende Seu Horário'}
          </h2>
          <p className="font-body text-base md:text-lg text-background/60 max-w-2xl mx-auto leading-relaxed">
            {contact?.description || 'Entre em contato e agende seu horário.'}
          </p>

          {/* WhatsApp button with breathe animation */}
          <motion.div className="pt-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-breathe inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground font-body text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors rounded-sm"
            >
              <MessageCircle className="w-5 h-5" />
              Agendar pelo WhatsApp
            </a>
          </motion.div>
        </motion.div>

        {/* Info grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-background/10 pt-12">
          <div className="flex flex-col items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <p className="font-body text-sm text-background/60 text-center">{address}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Instagram className="w-4 h-4 text-primary" />
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-background/60 hover:text-background transition-colors"
            >
              {instagram}
            </a>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-background/60 hover:text-background transition-colors"
            >
              {whatsapp}
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <p className="font-body text-xs text-background/30 tracking-wider">
            © {new Date().getFullYear()} {settings?.title || 'Camila Almeida'} — {settings?.subtitle || 'Nail Designer'} · Feito por{' '}
            <a
              href="https://www.instagram.com/nexor_digital_group_"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-background transition-colors underline-offset-4 hover:underline"
            >
              Nexor Digital Group
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
