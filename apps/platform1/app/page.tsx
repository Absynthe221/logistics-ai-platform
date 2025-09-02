import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Stats } from '@/components/home/Stats'
import { CTA } from '@/components/home/CTA'

export default function HomePage() {
  return (
    <div className="space-y-0">
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <CTA />
    </div>
  )
}

