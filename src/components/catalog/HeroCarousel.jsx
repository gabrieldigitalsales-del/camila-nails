import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroCarousel({ slides = [] }) {
  const [current, setCurrent] = useState(0);
  const activeSlides = slides.filter(s => s.is_active);

  const next = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prev = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, activeSlides.length]);

  if (activeSlides.length === 0) {
    return (
      <section id="hero" className="relative w-full h-screen bg-secondary flex items-center justify-center">
        <p className="font-heading text-3xl text-muted-foreground">Adicione slides no painel admin</p>
      </section>
    );
  }

  const slide = activeSlides[current];

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image_url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-white/80 text-xs md:text-sm uppercase tracking-[0.4em] font-body mb-4">
              {slide.subtitle}
            </p>
            <h1 className="font-heading text-4xl md:text-7xl lg:text-8xl text-white font-light italic leading-tight">
              {slide.title}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-0.5 rounded-full transition-all duration-500 ${
                i === current ? 'w-8 bg-white' : 'w-4 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Vertical watermark */}
      <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10">
        <p className="font-heading text-white/20 text-xs tracking-[0.3em] rotate-90 origin-center whitespace-nowrap">
          By Camila Almeida
        </p>
      </div>
    </section>
  );
}