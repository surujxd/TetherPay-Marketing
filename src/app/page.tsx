import { ScrollProgress } from '@/components/site/scroll-progress'
import { AuroraBackground } from '@/components/site/primitives'
import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/site/hero'
import { ActivityTicker } from '@/components/site/activity-ticker'
import { TrustBar } from '@/components/site/trust-bar'
import { Features } from '@/components/site/features'
import { HowItWorks } from '@/components/site/how-it-works'
import { RateCalculator } from '@/components/site/rate-calculator'
import { AgentCalculator } from '@/components/site/agent-calculator'
import { OrderBook } from '@/components/site/order-book'
import { DashboardPreview } from '@/components/site/dashboard-preview'
import { TreasuryMetrics } from '@/components/site/treasury-metrics'
import { Comparison } from '@/components/site/comparison'
import { Testimonials } from '@/components/site/testimonials'
import { Security } from '@/components/site/security'
import { StatusBoard } from '@/components/site/status-board'
import { ReferralPanel } from '@/components/site/referral-panel'
import { AgentCta } from '@/components/site/agent-cta'
import { Faq } from '@/components/site/faq'
import { ContactCta } from '@/components/site/contact'
import { Footer } from '@/components/site/footer'

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AuroraBackground />
      <ScrollProgress />
      <Navbar />

      <main className="flex-1">
        <Hero />
        <ActivityTicker />
        <TrustBar />
        <Features />
        <HowItWorks />
        <RateCalculator />
        <AgentCalculator />
        <OrderBook />
        <DashboardPreview />
        <TreasuryMetrics />
        <Comparison />
        <Testimonials />
        <Security />
        <StatusBoard />
        <ReferralPanel />
        <AgentCta />
        <Faq />
        <ContactCta />
      </main>

      <Footer />
    </div>
  )
}
