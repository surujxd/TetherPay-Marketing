import { AuroraBackground } from '@/components/site/primitives'
import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/site/hero'
import { TrustBar } from '@/components/site/trust-bar'
import { Features } from '@/components/site/features'
import { HowItWorks } from '@/components/site/how-it-works'
import { RateCalculator } from '@/components/site/rate-calculator'
import { AgentCalculator } from '@/components/site/agent-calculator'
import { DashboardPreview } from '@/components/site/dashboard-preview'
import { Security } from '@/components/site/security'
import { StatusBoard } from '@/components/site/status-board'
import { Faq } from '@/components/site/faq'
import { AgentCta } from '@/components/site/agent-cta'
import { ContactCta } from '@/components/site/contact'
import { Footer } from '@/components/site/footer'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AuroraBackground />
      <Navbar />

      <main className="flex-1">
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        <RateCalculator />
        <AgentCalculator />
        <DashboardPreview />
        <Security />
        <StatusBoard />
        <AgentCta />
        <Faq />
        <ContactCta />
      </main>

      <Footer />
    </div>
  )
}
