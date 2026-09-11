import { ScrollProgress } from '@/components/site/scroll-progress'
import { BackToTop } from '@/components/site/back-to-top'
import { CookieConsent } from '@/components/site/cookie-consent'
import { HelpWidget } from '@/components/site/help-widget'
import { GuidedTour } from '@/components/site/guided-tour'
import { AuroraBackground } from '@/components/site/primitives'
import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/site/hero'
import { ActivityTicker } from '@/components/site/activity-ticker'
import { TrustBar } from '@/components/site/trust-bar'
import { PartnersStrip } from '@/components/site/partners-strip'
import { Features } from '@/components/site/features'
import { HowItWorks } from '@/components/site/how-it-works'
import { NetworkChooser } from '@/components/site/network-chooser'
import { NetworkStatusWidget } from '@/components/site/network-status-widget'
import { RateCalculator } from '@/components/site/rate-calculator'
import { RateExplainer } from '@/components/site/rate-explainer'
import { MarketComparison } from '@/components/site/market-comparison'
import { AgentCalculator } from '@/components/site/agent-calculator'
import { AgentPricing } from '@/components/site/agent-pricing'
import { WithdrawalCalculator } from '@/components/site/withdrawal-calculator'
import { OrderBook } from '@/components/site/order-book'
import { DashboardPreview } from '@/components/site/dashboard-preview'
import { TreasuryMetrics } from '@/components/site/treasury-metrics'
import { Comparison } from '@/components/site/comparison'
import { Testimonials } from '@/components/site/testimonials'
import { Security } from '@/components/site/security'
import { StatusBoard } from '@/components/site/status-board'
import { ReferralPanel } from '@/components/site/referral-panel'
import { RateAlertForm } from '@/components/site/rate-alert-form'
import { AgentCta } from '@/components/site/agent-cta'
import { Faq } from '@/components/site/faq'
import { GlossarySection } from '@/components/site/glossary-section'
import { BlogPreview } from '@/components/site/blog-preview'
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
        <PartnersStrip />
        <Features />
        <HowItWorks />
        <NetworkChooser />
        <NetworkStatusWidget />
        <RateCalculator />
        <RateExplainer />
        <MarketComparison />
        <AgentCalculator />
        <AgentPricing />
        <WithdrawalCalculator />
        <OrderBook />
        <DashboardPreview />
        <TreasuryMetrics />
        <Comparison />
        <Testimonials />
        <Security />
        <StatusBoard />
        <ReferralPanel />
        <RateAlertForm />
        <AgentCta />
        <Faq />
        <GlossarySection />
        <BlogPreview />
        <ContactCta />
      </main>

      <Footer />
      <BackToTop />
      <HelpWidget />
      <CookieConsent />
      <GuidedTour />
    </div>
  )
}
