import {
  Wallet,
  Send,
  ShieldCheck,
  Clock,
  Users,
  BadgePercent,
  Layers,
  Lock,
  Eye,
  FileCheck2,
  Network,
  Bell,
} from 'lucide-react'

export const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Rates', href: '#calculator' },
  { label: 'For Agents', href: '#agents' },
  { label: 'Compare', href: '#features' },
  { label: 'Referrals', href: '#referrals' },
  { label: 'Glossary', href: '#glossary' },
  { label: 'Resources', href: '#resources' },
  { label: 'Status', href: '#status' },
  { label: 'FAQ', href: '#faq' },
]

export const STATS = [
  { label: 'Total settled volume', value: '₹48.2 Cr+', sub: 'across customer orders' },
  { label: 'Avg. settlement time', value: '4 min', sub: 'order to INR delivered' },
  { label: 'Verified agents', value: '1,240', sub: 'across 18 states' },
  { label: 'Uptime (90d)', value: '99.98%', sub: 'all systems operational' },
]

export const FEATURES = [
  {
    icon: Wallet,
    title: 'Deposit USDT',
    desc: 'Send USDT on TRC-20 to the central TetherPay wallet. Submit your TX hash and managers verify on-chain before your ledger is credited.',
    tag: 'TRC-20 native',
  },
  {
    icon: Send,
    title: 'Create INR payment',
    desc: 'Scan any UPI QR or enter a UPI ID. We reserve the exact USDT from your available balance and lock the rate at quote time.',
    tag: 'UPI ready',
  },
  {
    icon: BadgePercent,
    title: 'Settle instantly',
    desc: 'A verified agent fulfils your UPI payment in INR. On manager approval, the order completes and your receipt is generated.',
    tag: 'Verified network',
  },
]

export const HOW_STEPS = [
  {
    n: '01',
    title: 'Deposit & credit',
    desc: 'You deposit USDT to the central wallet and submit the TX hash. Operations verifies on-chain and credits your internal ledger.',
    icon: Wallet,
  },
  {
    n: '02',
    title: 'Order & reserve',
    desc: 'You create an INR payment order. We reserve the USDT from your available balance and snapshot the rate so it is locked at quote time.',
    icon: Layers,
  },
  {
    n: '03',
    title: 'Agent fulfils & settles',
    desc: 'A verified agent pays your recipient via UPI and submits proof. Operations approves, and the agent is settled in USDT with commission.',
    icon: Send,
  },
]

export const SECURITY_POINTS = [
  {
    icon: Lock,
    title: 'Ledger-first balances',
    desc: 'No direct balance mutations from the frontend. Every credit and debit flows through an append-only ledger with double-entry invariants.',
  },
  {
    icon: FileCheck2,
    title: 'Manual on-chain verification',
    desc: 'Deposits and agent payouts are verified manually by operations on the blockchain before any ledger movement — no blind automation.',
  },
  {
    icon: ShieldCheck,
    title: 'Rate locked at quote',
    desc: 'The rate at order creation is snapshotted immutably. Market moves after you confirm do not change your USDT debit.',
  },
  {
    icon: Eye,
    title: 'Auditable trail',
    desc: 'Every state transition is recorded with actor, timestamp, and reason. Disputes and escalations are traceable end-to-end.',
  },
  {
    icon: Network,
    title: 'Single central wallet',
    desc: 'One treasury address per network. Your balance is an internal ledger entry — never a hot wallet you must secure yourself.',
  },
  {
    icon: Bell,
    title: 'Realtime notifications',
    desc: 'Order status, deposit approvals, and settlements push to your dashboard and optional Telegram channel in real time.',
  },
]

export const FAQS = [
  {
    q: 'Is TetherPay a bank or a regulated exchange?',
    a: 'No. TetherPay is a technical platform that lets you deposit USDT and create INR payment orders fulfilled through a verified agent network. It is not a bank and does not hold INR deposits. Regulatory clearances for any public-money launch require qualified Indian legal and compliance review.',
  },
  {
    q: 'Which network should I use to deposit USDT?',
    a: 'TRON (TRC-20) is the primary network because of its low fees. Always confirm you are sending USDT on the correct network — sending on the wrong network can result in permanent loss of funds. Copy the exact central wallet address shown on the deposit screen.',
  },
  {
    q: 'How is my USDT balance calculated?',
    a: 'Your balance is an internal ledger entry maintained by TetherPay. When you deposit, operations verifies your transaction on-chain and credits your ledger. Your available balance and reserved balance are shown separately so you always know what you can spend.',
  },
  {
    q: 'What rate will I get?',
    a: 'The customer quote rate is shown live in the calculator. When you create a payment order, that rate is snapshotted and locked — it will not change even if the market moves before settlement. Rates are subject to change between orders.',
  },
  {
    q: 'How long does an INR payment take?',
    a: 'Once you confirm an order, it enters the marketplace for a verified agent to claim. Agents typically fulfil UPI payments within minutes. The order expires after a configurable window (default 10 minutes) if not claimed.',
  },
  {
    q: 'How do agents earn?',
    a: 'Agents provide INR liquidity by paying recipients via their own UPI channels. On approval, they are reimbursed in USDT plus a commission based on their tier (Standard 1.50%, Trusted 1.75%, Premium 2.00%). Agents can request USDT payouts to their external wallet.',
  },
  {
    q: 'Are there fees?',
    a: 'Platform fees are configurable and shown transparently in your quote breakdown before you confirm. There are no hidden charges — every line item (INR amount, fee, total, rate, USDT debit) is itemised.',
  },
  {
    q: 'What about compliance and KYC?',
    a: 'Customers and agents are subject to KYC. The platform is designed to support AML/KYC obligations under applicable Indian law. Specific obligations require review by qualified legal counsel before any public launch.',
  },
]

export const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Rates & fees', href: '#calculator' },
      { label: 'For agents', href: '#agents' },
      { label: 'Security', href: '#security' },
      { label: 'Status', href: '#status' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Risk Disclosure', href: '#' },
      { label: 'AML / KYC Policy', href: '#' },
      { label: 'Refund Policy', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: '#contact' },
      { label: 'Complaints', href: '#' },
      { label: 'Law enforcement', href: '#' },
      { label: 'Acceptable use', href: '#' },
    ],
  },
]
