import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection({ aboutItems = [] }) {
  const activeItems = aboutItems.filter(a => a.is_active).sort((a, b) => (a.order || 0) - (b.order || 0));
  const mainAbout = activeItems[0];
  const missionAbout = activeItems[1];

  if (!mainAbout) return null;

  return (
    <section id="about" className="py-20 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main about */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {mainAbout.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-sm overflow-hidden">
                <img
                  src={mainAbout.image_url}
                  alt={mainAbout.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-primary/30 rounded-sm" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <div className="w-12 h-px bg-primary" />
              <h2 className="font-heading text-3xl md:text-5xl font-light text-foreground">
                {mainAbout.title}
              </h2>
              {mainAbout.subtitle && (
                <p className="font-heading text-xl md:text-2xl text-primary italic">
                  {mainAbout.subtitle}
                </p>
              )}
            </div>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
              {mainAbout.description}
            </p>
          </motion.div>
        </div>

        {/* Mission */}
        {missionAbout && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="mt-20 md:mt-32 max-w-3xl mx-auto text-center space-y-6"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-px bg-border" />
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <div className="w-16 h-px bg-border" />
            </div>
            <h3 className="font-heading text-2xl md:text-4xl font-light text-foreground">
              {missionAbout.title}
            </h3>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
              {missionAbout.description}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}