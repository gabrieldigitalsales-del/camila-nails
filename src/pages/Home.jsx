import { useEffect, useState } from 'react'
import FloatingNav from '@/components/catalog/FloatingNav'
import HeroCarousel from '@/components/catalog/HeroCarousel'
import AboutSection from '@/components/catalog/AboutSection'
import ServicesSection from '@/components/catalog/ServicesSection'
import BeforeAfterMosaic from '@/components/catalog/BeforeAfterMosaic'
import ContactFooter from '@/components/catalog/ContactFooter'
import { getPublicContent } from '@/services/contentStore'

export default function Home() {
  const [content, setContent] = useState([])

  useEffect(() => {
    let active = true

    async function load() {
      const items = await getPublicContent()
      if (active) setContent(items)
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const slides = content.filter((item) => item.section === 'hero_slide')
  const aboutItems = content.filter((item) => item.section === 'about')
  const services = content.filter((item) => item.section === 'service')
  const portfolioGroups = content.filter((item) => item.section === 'portfolio_group')
  const contact = content.find((item) => item.section === 'contact')
  const settings = content.find((item) => item.section === 'site_settings')

  let parsedSettings = {}
  try {
    parsedSettings = settings?.extra_data ? JSON.parse(settings.extra_data) : {}
  } catch {
    parsedSettings = {}
  }

  return (
    <main>
      <FloatingNav settings={settings} />
      <HeroCarousel slides={slides} />
      <AboutSection aboutItems={aboutItems} />
      <ServicesSection services={services} whatsappUrl={parsedSettings.whatsapp_url} />
      <BeforeAfterMosaic groups={portfolioGroups} />
      <ContactFooter contact={contact} settings={settings} />
    </main>
  )
}
