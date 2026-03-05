'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, FileText, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ─── Types ─────────────────────────────────────────────────────────────

type ViewMode = 'absolute' | 'per-kwp' | 'pct-total'
type ClusterType = 'full-scope' | 'smaller'

type KeyFlag = {
  icon: 'doc' | 'warn' | 'info'
  text: string
}

type SubCategory = {
  name: string
  description: string
  tag?: 'provisional' | 'bundled'
  amount?: number
}

type Category = {
  name: string
  rank?: { position: number; total: number }
  flag?: string
  proportionPercent?: number
  medianPercent?: number
  totalAmount?: number
  subCategories: SubCategory[]
  dimmed?: boolean
}

export type SupplierProfileData = {
  id: string
  name: string
  quality: 1 | 2 | 3
  cluster: ClusterType
  totalPounds: number
  perKwp: number
  systemKwp: number
  totalPosition: 'below' | 'above' // vs median
  perKwpPosition: 'below' | 'above'
  totalPercentPosition: number // 0–100, where on min–max scale
  perKwpPercentPosition: number
  specs: {
    panels: string
    inverters: string
    mounting: string
    workmanshipWarranty: string
    panelWarranty: string
    inverterWarranty: string
  }
  characterisation: string
  keyFlags: KeyFlag[]
  categories: Category[]
}

// ─── Default data: Photon Energy ───────────────────────────────────────

const PHOTON_ENERGY_PROFILE: SupplierProfileData = {
  id: 'photon',
  name: 'Photon Energy',
  quality: 1,
  cluster: 'smaller',
  totalPounds: 1_131_500,
  perKwp: 582,
  systemKwp: 1946,
  totalPosition: 'below',
  perKwpPosition: 'below',
  totalPercentPosition: 22,
  perKwpPercentPosition: 35,
  specs: {
    panels: 'Trina TSM-DE09.08 455W (×4,276)',
    inverters: 'Solis S6-GR3P10K (×15)',
    mounting: 'K2 Basic Rail',
    workmanshipWarranty: '2 years',
    panelWarranty: '25 years',
    inverterWarranty: '10 years',
  },
  characterisation:
    "Strong transparency — detailed PDF quotation with itemized equipment, labour, design, and provisional sums. Covers only 4 MPANs at 1,946 kWp (roughly half the full-scope proposals). H&S at £180k (16%) seems high; PDF labels this as provisional 'Attendances' covering edge protection and lifting.",
  keyFlags: [
    { icon: 'doc', text: 'Detailed PDF with good document-to-field corroboration' },
    { icon: 'warn', text: '£40k discrepancy between PDF subtotal and form fields (installation vs commissioning allocation)' },
    { icon: 'info', text: 'Optimisers listed as "not included" with no explanation of substitution or cost impact' },
  ],
  categories: [
    {
      name: 'Equipment',
      rank: { position: 9, total: 13 },
      proportionPercent: 53,
      medianPercent: 44,
      totalAmount: 594_000,
      subCategories: [
        { name: 'Main Equipment', description: '4,276 Trina 455W modules, 15 Solis inverters, BOS components', amount: 594_000 },
        { name: 'Mounting Systems', description: 'Bundled into main_equipment (K2 Basic Rail included)', tag: 'bundled' },
        { name: 'Protection Devices', description: 'Included within main_equipment line' },
        { name: 'Monitoring Equipment', description: 'GSM meter and display included within main_equipment' },
      ],
    },
    {
      name: 'Labour',
      rank: { position: 3, total: 13 },
      proportionPercent: 25,
      medianPercent: 36,
      totalAmount: 287_500,
      subCategories: [
        { name: 'Installation Labour', description: 'In-house installation and commissioning labour across all MPANs', amount: 247_500 },
        { name: 'Electrical Works', description: 'Electrical containment, AC/DC cabling, PVDB connections', amount: 40_000 },
      ],
    },
    {
      name: 'Project Overheads',
      rank: { position: 12, total: 13 },
      flag: 'Above typical range — driven by provisional H&S',
      proportionPercent: 53,
      medianPercent: 44,
      totalAmount: 250_000,
      subCategories: [
        { name: 'Health Safety Management', description: 'Edge protection, lifting, scaffolding, site safety', amount: 180_000, tag: 'provisional' },
        { name: 'Contract Administration', description: 'DNO application, project management, design fees', amount: 70_000 },
      ],
    },
    {
      name: 'Design & Technical Services',
      dimmed: true,
      subCategories: [
        { name: 'Detailed Design', description: 'Included within administration/project management line' },
      ],
    },
    {
      name: 'Commissioning & Assurance',
      dimmed: true,
      subCategories: [
        { name: 'Grid Connection', description: 'DNO application cost within administration; G99 relay included' },
        { name: 'Installation Warranty', description: '2-year workmanship warranty; no separate cost stated' },
      ],
    },
    {
      name: 'Ongoing Services',
      rank: { position: 7, total: 13 },
      proportionPercent: 25,
      medianPercent: 36,
      totalAmount: 23_350,
      subCategories: [
        { name: 'Maintenance Contract', description: '5-year full-scope O&M, paid quarterly; RPI-linked', amount: 23_350 },
      ],
    },
  ],
}

// Shortlisted suppliers for navigation (Smaller Systems cluster)
const SHORTLISTED_SUPPLIERS = [
  { id: 'your-eco', name: 'Your Eco' },
  { id: 'photon', name: 'Photon Energy' },
  { id: 'low-carbon', name: 'Low Carbon Energy' },
]

// All supplier names for breadcrumb/header when not in shortlist
const ALL_SUPPLIER_NAMES: Record<string, string> = {
  'green-nation': 'Green Nation',
  'arin-power': 'Arin Power',
  'green-volt': 'Green Volt',
  sustain: 'Sustain',
  ortus: 'Ortus Energy',
  'electron-green': 'Electron Green',
  shawton: 'Shawton Energy',
  ees: 'EES Group',
  'low-carbon': 'Low Carbon Energy',
  photon: 'Photon Energy',
  'your-eco': 'Your Eco',
  olympus: 'Olympus Power',
}

const SUPPLIER_LOGOS: Record<string, string> = {
  photon: '/site elements/beba.svg',
  'your-eco': '/site elements/gogreen.svg',
  'low-carbon': '/site elements/lowcarbon.svg',
}

// ─── Helpers ────────────────────────────────────────────────────────────

function formatPounds(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `£${(n / 1_000).toFixed(1)}k`
  return `£${n.toLocaleString()}`
}

function formatEur(n: number): string {
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `€${(n / 1_000).toFixed(1)}k`
  return `€${n.toLocaleString()}`
}

function formatKwp(n: number): string {
  return `£${n.toLocaleString()}`
}

function formatPerLuminaire(n: number): string {
  return `€${n.toLocaleString()}`
}

// ─── Sub-components ──────────────────────────────────────────────────────

const QUALITY_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Detailed — full itemised breakdown with equipment, labour, overheads, design, and O&M',
  2: 'Partial — some categories broken down, others bundled or missing',
  3: 'Summary — high-level totals only, no detailed category split',
}

function QualityBadge({ quality }: { quality: 1 | 2 | 3 }) {
  const labels: Record<1 | 2 | 3, string> = { 1: 'Detailed', 2: 'Partial', 3: 'Summary' }
  const shades: Record<1 | 2 | 3, string> = {
    1: 'bg-cq-dark text-white',
    2: 'bg-cq-green text-white',
    3: 'bg-cq-green/60 text-white',
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'inline-flex items-center justify-center min-w-[72px] px-2 py-0.5 rounded text-xs font-semibold cursor-help',
            shades[quality]
          )}
        >
          {labels[quality]}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px]">
        {QUALITY_LABELS[quality]}
      </TooltipContent>
    </Tooltip>
  )
}

function PositionBar({
  percent,
  label,
}: {
  percent: number
  label: string
}) {
  return (
    <div className="space-y-1">
      <div className="h-1.5 w-full rounded-full bg-cq-border overflow-hidden">
        <div
          className="h-full rounded-full bg-cq-green transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-cq-text-secondary">{label}</p>
    </div>
  )
}

function ProportionBar({
  supplierPercent,
  medianPercent,
}: {
  supplierPercent: number
  medianPercent: number
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-3 min-w-[140px] max-w-[180px] cursor-help">
          <div className="flex-1 relative h-3 rounded-full bg-cq-border overflow-hidden min-w-[80px]">
            <div
              className="absolute inset-y-0 left-0 bg-cq-green rounded-full"
              style={{ width: `${Math.min(supplierPercent, 100)}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-cq-text -translate-x-px z-10"
              style={{ left: `${Math.min(medianPercent, 99)}%` }}
            />
          </div>
          <span className="text-sm font-bold tabular-nums text-cq-text shrink-0">{supplierPercent}%</span>
          <span className="text-xs text-cq-text-secondary shrink-0">vs {medianPercent}%</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[240px]">
        Your share of total spend in this category vs median across suppliers
      </TooltipContent>
    </Tooltip>
  )
}

function KeyFlagIcon({ icon }: { icon: KeyFlag['icon'] }) {
  switch (icon) {
    case 'doc':
      return <FileText className="w-4 h-4 flex-shrink-0 text-cq-text-secondary" />
    case 'warn':
      return <span className="text-cq-text-secondary">⚠️</span>
    case 'info':
      return <span className="text-cq-text-secondary">ℹ️</span>
  }
}

// ─── Main component ─────────────────────────────────────────────────────

type SupplierProfileViewProps = {
  data?: SupplierProfileData
  shortlist?: { id: string; name: string }[]
  supplierId?: string // From URL — used to determine nav position; data comes from lookup
  projectType?: 'solar' | 'led'
}

export function SupplierProfileView({
  data = PHOTON_ENERGY_PROFILE,
  shortlist = SHORTLISTED_SUPPLIERS,
  supplierId,
  projectType = 'solar',
}: SupplierProfileViewProps) {
  // Use supplierId from URL to position nav; fall back to data.id
  const currentId = supplierId ?? data.id
  const [viewMode, setViewMode] = React.useState<ViewMode>('absolute')
  const [intelligenceOn, setIntelligenceOn] = React.useState(false)

  const currentIndex = shortlist.findIndex((s) => s.id === currentId)
  const prevSupplier = currentIndex > 0 ? shortlist[currentIndex - 1] : null
  const nextSupplier = currentIndex >= 0 && currentIndex < shortlist.length - 1 ? shortlist[currentIndex + 1] : null

  const totalSum = data.categories.reduce(
    (sum, c) => sum + (c.totalAmount ?? 0),
    0
  )

  const clusterLabel =
    data.cluster === 'full-scope' ? 'FULL SCOPE SYSTEM' : 'SMALLER SYSTEM'
  const basePath = projectType === 'led' ? '/supplier-comparison/led' : '/supplier-comparison'

  const formatAmount = (amount: number) => {
    if (viewMode === 'absolute') return projectType === 'led' ? formatEur(amount) : formatPounds(amount)
    if (viewMode === 'per-kwp') {
      const perUnit = Math.round(amount / data.systemKwp)
      return projectType === 'led' ? formatPerLuminaire(perUnit) : formatKwp(perUnit)
    }
    return `${((amount / totalSum) * 100).toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-cq-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 1. Header */}
        <nav className="flex items-center gap-1.5 text-sm text-cq-text-secondary mb-4 font-medium">
          <Link
            href={basePath}
            className="hover:text-cq-link hover:underline"
          >
            Supplier Price Comparison
          </Link>
          <ChevronRight className="w-4 h-4 text-cq-muted" />
          <span className="text-cq-text font-medium">
            {shortlist.find((s) => s.id === currentId)?.name ?? ALL_SUPPLIER_NAMES[currentId] ?? data.name}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          {/* Left: name, badge, specs (no box) */}
          <div className="min-w-0 flex-1">
            <h1 className="text-[28px] font-extrabold text-cq-text leading-tight mb-2">
              {shortlist.find((s) => s.id === currentId)?.name ?? ALL_SUPPLIER_NAMES[currentId] ?? data.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <QualityBadge quality={data.quality} />
              <span className="text-xs font-bold uppercase tracking-wider text-cq-text-secondary">
                {clusterLabel}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-6 text-sm">
              {(
                projectType === 'led'
                  ? [
                      { label: 'Luminaires', value: data.specs.panels },
                      { label: 'Workmanship warranty', value: data.specs.workmanshipWarranty },
                      { label: 'Luminaire warranty', value: data.specs.panelWarranty },
                    ]
                  : [
                      { label: 'Panels', value: data.specs.panels },
                      { label: 'Inverters', value: data.specs.inverters },
                      { label: 'Mounting', value: data.specs.mounting },
                      { label: 'Workmanship warranty', value: data.specs.workmanshipWarranty },
                      { label: 'Panel warranty', value: data.specs.panelWarranty },
                      { label: 'Inverter warranty', value: data.specs.inverterWarranty },
                    ]
              ).map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-cq-text-secondary mb-0.5">{label}</p>
                  <p className="font-medium text-cq-text">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: logo + price cards */}
          <div className="flex flex-col items-end gap-4 shrink-0">
            {SUPPLIER_LOGOS[currentId] ? (
              <Image
                src={SUPPLIER_LOGOS[currentId]}
                alt=""
                width={80}
                height={80}
                className="object-contain rounded-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-cq-border-light flex items-center justify-center text-xl font-bold text-cq-text-secondary">
                {(shortlist.find((s) => s.id === currentId)?.name ?? ALL_SUPPLIER_NAMES[currentId] ?? data.name)
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div className="flex gap-4">
              <div className="w-44 rounded-xl border border-cq-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-cq-text-secondary mb-1">Total</p>
                <p className="text-2xl font-bold text-cq-text tabular-nums">
                  {projectType === 'led' ? formatEur(data.totalPounds) : formatPounds(data.totalPounds)}
                </p>
                <div className="mt-3">
                  <PositionBar
                    percent={data.totalPercentPosition}
                    label={data.totalPosition === 'below' ? 'Below median' : 'Above median'}
                  />
                </div>
              </div>
              <div className="w-44 rounded-xl border border-cq-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-cq-text-secondary mb-1">
                  {projectType === 'led' ? '€/luminaire' : '£/kWp'}
                </p>
                <p className="text-2xl font-bold text-cq-text tabular-nums">
                  {projectType === 'led' ? formatPerLuminaire(data.perKwp) : formatKwp(data.perKwp)}
                </p>
                <div className="mt-3">
                  <PositionBar
                    percent={data.perKwpPercentPosition}
                    label={data.perKwpPosition === 'below' ? 'Below median' : 'Above median'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. CQuel characterisation — Overview */}
        <div className="rounded-xl border-2 border-cq-border bg-white p-6 mb-6">
          <h2 className="text-sm font-extrabold text-cq-text uppercase tracking-wider mb-4">Overview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-cq-text leading-relaxed">{data.characterisation}</p>
            </div>
            <div className="space-y-3">
              {data.keyFlags.map((flag, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-cq-text-secondary">
                  <KeyFlagIcon icon={flag.icon} />
                  <span>{flag.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <ToggleGroup.Root
            type="single"
            value={viewMode}
            onValueChange={(v) => v && setViewMode(v as ViewMode)}
            className="inline-flex rounded-lg border border-cq-border bg-cq-bg overflow-hidden"
          >
            {[
              { value: 'absolute', label: projectType === 'led' ? 'Absolute €' : 'Absolute £' },
              { value: 'per-kwp', label: projectType === 'led' ? '€/luminaire' : '£/kWp' },
              { value: 'pct-total', label: '% of total' },
            ].map(({ value, label }) => (
              <ToggleGroup.Item
                key={value}
                value={value}
                className={cn(
                  'px-4 py-2 text-sm font-bold transition-colors',
                  viewMode === value
                    ? 'bg-white text-cq-green border border-cq-green'
                    : 'bg-transparent text-cq-text border border-cq-border hover:bg-cq-border/50'
                )}
              >
                {label}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
          <label
            className={cn(
              'inline-flex items-center gap-3 text-base font-semibold cursor-pointer',
              intelligenceOn ? 'text-cq-text' : 'text-cq-text-secondary'
            )}
          >
            <Switch
              checked={intelligenceOn}
              onCheckedChange={setIntelligenceOn}
              className="scale-125 data-[state=checked]:bg-cq-green data-[state=unchecked]:bg-cq-border"
            />
            CQuel Intelligence
          </label>
        </div>

        {intelligenceOn && (
          <div className="rounded-lg border border-cq-green/30 bg-cq-green/5 px-4 py-3 mb-4 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-cq-green flex-shrink-0 mt-0.5" />
            <p className="text-sm text-cq-text">
              Where full pricing breakdowns are missing, CQuel Intelligence uses project
              benchmarks and supplier history to produce estimates. These are flagged with a green
              pill for transparency.
            </p>
          </div>
        )}

        {/* 6. Category breakdown table */}
        <div className="rounded-xl border border-cq-border bg-white overflow-hidden mb-8">
          <div className="divide-y divide-cq-border">
            {data.categories.map((cat, catIdx) => (
              <div
                key={catIdx}
                className={cn(cat.dimmed && 'opacity-60')}
              >
                {/* Category header row */}
                <div className="flex flex-wrap items-center gap-3 gap-y-2 px-4 py-3 bg-cq-bg">
                  <span className={cn('font-bold text-cq-text whitespace-nowrap w-48 shrink-0', cat.dimmed && 'text-cq-muted')}>
                    {cat.name}
                  </span>
                  {cat.rank && (
                    <span className="text-sm font-bold text-white shrink-0 px-2 py-0.5 rounded bg-cq-dark">
                      {cat.rank.position}th of {cat.rank.total}
                    </span>
                  )}
                  {cat.flag && (
                    <span className="inline-flex items-center gap-1 text-xs text-cq-text-secondary shrink-0">
                      ⚠️ {cat.flag}
                    </span>
                  )}
                  <div className="flex items-center gap-6 ml-auto shrink-0">
                    {cat.proportionPercent != null && cat.medianPercent != null && (
                      <ProportionBar
                        supplierPercent={cat.proportionPercent}
                        medianPercent={cat.medianPercent}
                      />
                    )}
                    <div className="text-right tabular-nums font-bold text-cq-text w-20 shrink-0">
                      {cat.totalAmount != null ? formatAmount(cat.totalAmount) : '—'}
                    </div>
                  </div>
                </div>

                {/* Sub-category rows */}
                {cat.subCategories.map((sub, subIdx) => (
                  <div
                    key={subIdx}
                    className="flex flex-wrap items-start gap-2 sm:gap-4 px-4 py-2 border-t border-cq-border/50"
                  >
                    <span className={cn('text-sm font-medium text-cq-text w-48 shrink-0 whitespace-nowrap', cat.dimmed && 'text-cq-muted')}>
                      {sub.name}
                    </span>
                    <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                      <span className={cn('text-sm', cat.dimmed ? 'text-cq-muted' : 'text-cq-text')}>
                        {sub.description}
                      </span>
                      {sub.tag === 'provisional' && (
                        <span className="text-xs font-medium text-cq-amber shrink-0">provisional</span>
                      )}
                      {sub.tag === 'bundled' && (
                        <span className="text-xs text-cq-muted shrink-0">bundled</span>
                      )}
                    </div>
                    <div className="text-right tabular-nums text-sm text-cq-text shrink-0 sm:ml-auto w-16">
                      {sub.amount != null ? formatAmount(sub.amount) : '—'}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 7. Navigation footer */}
        <div className="flex items-center justify-end gap-3">
          {prevSupplier ? (
            <Link
              href={`${basePath}/${prevSupplier.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cq-border bg-white text-cq-text font-semibold hover:bg-cq-bg transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              {prevSupplier.name}
            </Link>
          ) : (
            <span className="w-24" />
          )}
          <span className="inline-flex items-center px-4 py-2 text-cq-text font-semibold">
            {shortlist.find((s) => s.id === currentId)?.name ?? ALL_SUPPLIER_NAMES[currentId] ?? data.name}
          </span>
          {nextSupplier ? (
            <Link
              href={`${basePath}/${nextSupplier.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cq-border bg-white text-cq-text font-semibold hover:bg-cq-bg transition-colors text-sm"
            >
              {nextSupplier.name}
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="w-24" />
          )}
        </div>
      </div>
    </div>
  )
}
