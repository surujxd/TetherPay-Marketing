'use client'

import * as React from 'react'

type Lang = 'en' | 'hi'

type Dict = Record<string, string>

const DICTS: Record<Lang, Dict> = {
  en: {
    'nav.howItWorks': 'How it works',
    'nav.rates': 'Rates',
    'nav.forAgents': 'For Agents',
    'nav.compare': 'Compare',
    'nav.referrals': 'Referrals',
    'nav.glossary': 'Glossary',
    'nav.resources': 'Resources',
    'nav.status': 'Status',
    'nav.faq': 'FAQ',
    'hero.title1': 'Earn in USDT.',
    'hero.title2': 'Spend in INR.',
    'hero.cta.calc': 'Calculate your payment',
    'hero.cta.how': 'See how it works',
  },
  hi: {
    'nav.howItWorks': 'कैसे काम करता है',
    'nav.rates': 'दरें',
    'nav.forAgents': 'एजेंटों के लिए',
    'nav.compare': 'तुलना',
    'nav.referrals': 'रेफरल',
    'nav.glossary': 'शब्दावली',
    'nav.resources': 'संसाधन',
    'nav.status': 'स्थिति',
    'nav.faq': 'सामान्य प्रश्न',
    'hero.title1': 'USDT में कमाएं।',
    'hero.title2': 'INR में खर्च करें।',
    'hero.cta.calc': 'अपना भुगतान गणना करें',
    'hero.cta.how': 'देखें कैसे काम करता है',
  },
}

type I18nContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const I18nContext = React.createContext<I18nContextValue | null>(null)

const STORAGE_KEY = 'tetherpay-lang'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>('en')

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null
      if (stored === 'en' || stored === 'hi') setLangState(stored)
    } catch {}
  }, [])

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(STORAGE_KEY, l) } catch {}
  }, [])

  const t = React.useCallback((key: string) => {
    return DICTS[lang][key] ?? DICTS.en[key] ?? key
  }, [lang])

  const value = React.useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = React.useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
