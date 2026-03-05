'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Sparkles, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as Tabs from '@radix-ui/react-tabs'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ─── Types ─────────────────────────────────────────────────────────────

type ViewMode = 'absolute' | 'per-kwp' | 'pct-total'
type Cluster = 'full-scope' | 'smaller'

type NoteFlag = {
  type: 'warn' | 'info'
  text: string
}

type CategoryBreakdown = {
  equipment?: number
  labour?: number
  overheads?: number
  materials?: number
  design?: number
  commission?: number
  om?: number
}

type Supplier = {
  id: string
  name: string
  badge?: string
  linkedNote?: string
  totalPounds: number
  perKwp: number
  systemKwp: number
  quality: 1 | 2 | 3 // Tier 1, 2, 3 — opacity: high, medium, low
  transparency: 1 | 2 | 3 | 4 | 5
  note?: NoteFlag
  hasEstimates?: boolean
  breakdown?: CategoryBreakdown
}

// ─── Data ───────────────────────────────────────────────────────────────

// Project 322 — Braehead — from breakdown.html, comparison.html
const FULL_SCOPE_SUPPLIERS: Supplier[] = [
  {
    id: 'green-nation',
    name: 'Green Nation',
    badge: 'Rank #5',
    totalPounds: 2_070_513,
    perKwp: 518,
    systemKwp: 3997,
    quality: 1,
    transparency: 4,
    note: { type: 'warn', text: 'PDF total (£2.18M) is £112k higher than cost_estimated (£2.07M)—clarify which applies' },
    hasEstimates: true,
    breakdown: { equipment: 1_181_031, labour: 1_124_459, overheads: 333_223, om: 5_286 },
  },
  {
    id: 'arin-power',
    name: 'Arin Power',
    badge: 'Rank #6',
    totalPounds: 2_295_708,
    perKwp: 574,
    systemKwp: 3997,
    quality: 2,
    transparency: 3,
    note: { type: 'warn', text: 'Scaffolding explicitly excluded—add £150–300k for true comparability' },
    breakdown: { equipment: 817_673, labour: 921_520, overheads: 87_000, om: 19_800 },
  },
  {
    id: 'sustain',
    name: 'Sustain',
    badge: 'Most transparent',
    linkedNote: 'via SNRG (same EPC)',
    totalPounds: 2_425_568,
    perKwp: 607,
    systemKwp: 3997,
    quality: 1,
    transparency: 4,
    hasEstimates: true,
    breakdown: { equipment: 1_020_467, labour: 1_032_768, overheads: 353_026, om: 33_976 },
  },
  {
    id: 'green-volt',
    name: 'Green Volt',
    badge: 'Rank #8',
    totalPounds: 2_657_373,
    perKwp: 589,
    systemKwp: 4513,
    quality: 2,
    transparency: 3,
    note: { type: 'warn', text: 'PDF categories sum to £2.17M but cost_estimated £2.66M—£485k gap unaccounted' },
    breakdown: { equipment: 1_517_000, labour: 560_000, overheads: 95_000, om: 25_500 },
  },
  {
    id: 'ortus',
    name: 'Ortus Energy',
    totalPounds: 2_803_005,
    perKwp: 701,
    systemKwp: 3996,
    quality: 3,
    transparency: 2,
    note: { type: 'warn', text: 'No breakdown provided; PPA/CapEx classification ambiguous' },
    breakdown: { equipment: undefined, labour: undefined, overheads: undefined, om: 47_952 },
  },
  {
    id: 'electron-green',
    name: 'Electron Green',
    badge: 'Rank #9',
    totalPounds: 2_830_049,
    perKwp: 708,
    systemKwp: 3996,
    quality: 3,
    transparency: 1,
    note: { type: 'warn', text: 'No breakdown; description references Lakeside—cross-project submission' },
    breakdown: { equipment: undefined, labour: undefined, overheads: undefined, om: 25_000 },
  },
  {
    id: 'shawton',
    name: 'Shawton Energy',
    badge: 'PPA',
    totalPounds: 3_449_203,
    perKwp: 863,
    systemKwp: 3996,
    quality: 3,
    transparency: 2,
    note: { type: 'warn', text: 'PPA offer; capex figure is indicative benchmark, not client purchase price' },
    breakdown: { equipment: undefined, labour: undefined, overheads: undefined, om: 39_960 },
  },
  {
    id: 'ees',
    name: 'EES Group',
    badge: 'Different scope',
    totalPounds: 4_299_607,
    perKwp: 1184,
    systemKwp: 3630,
    quality: 1,
    transparency: 4,
    note: { type: 'info', text: 'Includes batteries + RC62 fire protection; solar-only cost would be lower' },
    breakdown: { equipment: 2_066_800, labour: 1_533_606, overheads: 811_494, om: 36_940 },
  },
]

const SMALLER_SUPPLIERS: Supplier[] = [
  {
    id: 'photon',
    name: 'Photon Energy',
    badge: 'Lowest',
    totalPounds: 1_131_500,
    perKwp: 582,
    systemKwp: 1945,
    quality: 1,
    transparency: 4,
    note: { type: 'warn', text: '£180k H&S provisional—crane, edge protection, pallet splitting subject to site survey' },
    hasEstimates: true,
    breakdown: { equipment: 594_000, labour: 357_500, overheads: 180_000, om: 23_350 },
  },
  {
    id: 'low-carbon',
    name: 'Low Carbon Energy',
    badge: '2nd lowest',
    totalPounds: 1_163_127,
    perKwp: 499,
    systemKwp: 2333,
    quality: 2,
    transparency: 3,
    note: { type: 'warn', text: 'Materials £240k (~£103/kWp) exceptionally low—typical modules £200–280/kWp' },
    hasEstimates: true,
    breakdown: { equipment: 240_111, labour: 465_863, overheads: 60_500, om: 7_000 },
  },
  {
    id: 'olympus',
    name: 'Olympus Power',
    badge: '3rd lowest',
    totalPounds: 1_226_053,
    perKwp: 734,
    systemKwp: 1670,
    quality: 3,
    transparency: 2,
    note: { type: 'warn', text: 'No breakdown available; 1,670 kWp is smallest scope in CapEx set' },
    breakdown: { equipment: undefined, labour: undefined, overheads: undefined, om: 16_000 },
  },
  {
    id: 'your-eco',
    name: 'Your Eco',
    totalPounds: 1_726_089,
    perKwp: 799,
    systemKwp: 2161,
    quality: 1,
    transparency: 4,
    note: { type: 'info', text: 'SolarEdge Platinum; sum of price_* £56k less than cost_estimated' },
    breakdown: { equipment: 974_838, labour: 584_749, overheads: 109_942, om: 3_250 },
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────

function formatPounds(n: number, currency: 'gbp' | 'eur' = 'gbp'): string {
  const sym = currency === 'eur' ? '€' : '£'
  if (n >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${sym}${(n / 1_000).toFixed(1)}k`
  return `${sym}${n.toLocaleString()}`
}

function formatKwp(n: number, projectType?: ProjectType): string {
  if (projectType === 'led' || projectType === 'led-rostock') return `${n.toLocaleString()} luminaires`
  return `${n.toLocaleString()} kWp`
}

// Stars 1–5 map to filled bars 1–4 (5 stars = 4 bars)
function starsToBars(stars: number): number {
  return Math.min(stars, 4)
}

// ─── Sub-components ────────────────────────────────────────────────────

const TRANSPARENCY_LABELS: Record<number, string> = {
  1: 'Minimal — summary or no breakdown provided',
  2: 'Low — limited breakdown available',
  3: 'Moderate — partial breakdown with some itemisation',
  4: 'High — detailed breakdown provided',
  5: 'Very high — comprehensive itemised breakdown',
}

function TransparencyBars({ stars }: { stars: number }) {
  const filled = starsToBars(stars)
  const heights = [8, 13, 17, 22]
  const label = TRANSPARENCY_LABELS[stars] ?? TRANSPARENCY_LABELS[1]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-end gap-0.5 h-6 cursor-help inline-flex">
          {heights.map((h, i) => (
            <div
              key={i}
              className={cn(
                'w-[5px] rounded-sm transition-colors',
                i < filled ? 'bg-cq-green' : 'bg-cq-green/20'
              )}
              style={{ height: h }}
            />
          ))}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[240px]">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

const QUALITY_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Detailed — full itemised breakdown with equipment, labour, overheads, design, and O&M',
  2: 'Partial — some categories broken down, others bundled or missing',
  3: 'Summary — high-level totals only, no detailed category split',
}

function QualityBadge({ quality }: { quality: Supplier['quality'] }) {
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

// ─── Main component ─────────────────────────────────────────────────────

const ALL_SUPPLIERS = [...FULL_SCOPE_SUPPLIERS, ...SMALLER_SUPPLIERS]

export type ProjectType = 'solar' | 'led' | 'led-rostock'

function mapLedToSupplier(led: import('@/lib/led-supplier-data').LedSupplier): Supplier {
  const b = led.breakdown
  return {
    id: led.id,
    name: led.name,
    badge: led.badge,
    totalPounds: led.totalEur,
    perKwp: led.perLuminaire,
    systemKwp: led.luminaireCount,
    quality: led.quality,
    transparency: led.transparency,
    note: led.note,
    breakdown: b
      ? {
          equipment: b.equipment,
          labour: b.labour,
          overheads: b.projectOverheads,
          materials: b.materials,
          design: b.designTechnical,
          commission: b.commissioningAssurance,
          om: b.ongoingServices,
        }
      : undefined,
  }
}

export function SupplierComparisonTable({
  projectType = 'solar',
}: {
  projectType?: ProjectType
} = {}) {
  const router = useRouter()
  const [cluster, setCluster] = React.useState<Cluster>('full-scope')
  const [mounted, setMounted] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<ViewMode>('absolute')
  const [intelligenceOn, setIntelligenceOn] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = React.useState<'transparency' | 'quality' | null>(null)
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')

  const baseSuppliers =
    projectType === 'led'
      ? (() => {
          const { LED_SUPPLIERS } = require('@/lib/led-supplier-data')
          return LED_SUPPLIERS.map(mapLedToSupplier)
        })()
      : projectType === 'led-rostock'
        ? (() => {
            const { ROSTOCK_LED_SUPPLIERS } = require('@/lib/led-rostock-supplier-data')
            return ROSTOCK_LED_SUPPLIERS.map(mapLedToSupplier)
          })()
        : cluster === 'full-scope'
        ? FULL_SCOPE_SUPPLIERS
        : SMALLER_SUPPLIERS
  const suppliers =
    sortBy === 'transparency'
      ? [...baseSuppliers].sort((a, b) =>
          sortDir === 'desc'
            ? b.transparency - a.transparency
            : a.transparency - b.transparency
        )
      : sortBy === 'quality'
        ? [...baseSuppliers].sort((a, b) =>
            sortDir === 'desc'
              ? b.quality - a.quality
              : a.quality - b.quality
          )
        : baseSuppliers


  React.useEffect(() => setMounted(true), [])

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const basePath =
    projectType === 'led'
      ? '/supplier-comparison/led'
      : projectType === 'led-rostock'
        ? '/supplier-comparison/led-rostock'
        : '/supplier-comparison'
  const currency = (projectType === 'led' || projectType === 'led-rostock') ? 'eur' as const : 'gbp' as const
  const formatAmount = (n: number) => formatPounds(n, currency)
  const handleCompare = () => {
    const ids = Array.from(selectedIds)
    if (ids.length >= 2) {
      router.push(`${basePath}/compare?ids=${ids.join(',')}`)
    }
  }
  const totalSum = suppliers.reduce((s, x) => s + x.totalPounds, 0)

  const clusterConfig = {
    'full-scope': {
      label: 'Full-Scope Systems (3,630–4,513 kWp)',
      count: 8,
      description: '8 suppliers covering most or all roof zones',
    },
    smaller: {
      label: 'Smaller Systems (1,670–2,333 kWp)',
      count: 4,
      description: '4 submissions covering fewer roof zones / smaller scope',
    },
  }

  const cfg = clusterConfig[cluster]

  return (
    <div className={cn('min-h-screen bg-cq-bg', selectedIds.size >= 2 && 'pb-20')}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-xl font-extrabold text-cq-text leading-tight">
            Supplier Price Comparison
          </h1>
        </header>

        {/* Project info — icon + title + address + tags + metrics */}
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-5">
            <Image
              src={(projectType === 'led' || projectType === 'led-rostock') ? '/site elements/Avatar.svg' : '/site elements/solar.svg'}
              alt=""
              width={40}
              height={40}
              className="flex-shrink-0 rounded-lg"
            />
            <div>
              <h2 className="text-xl font-extrabold text-cq-text leading-tight">
                {projectType === 'led'
                  ? 'Project 310 — Alexanderstraße 1/3/5'
                  : projectType === 'led-rostock'
                    ? 'tender_651_650 — Doberaner Straße 114-116'
                    : 'Project 322 — Braehead'}
              </h2>
              <p className="text-sm text-cq-text-secondary mt-0.5">
                {projectType === 'led'
                  ? 'Berlin, 2,494 luminaires'
                  : projectType === 'led-rostock'
                    ? 'Rostock, 2 suppliers (490 / 1,029 luminaires)'
                    : 'Shopping centre, LL1–LL3, Red Parking, car park roofs'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mb-8">
            {((projectType === 'led' || projectType === 'led-rostock')
              ? ['Commercial', 'Occupied', 'LED Retrofit']
              : ['Residential', 'Occupied', '> 70kW Solar']
            ).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider bg-cq-border-light text-cq-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Cluster tabs — hide for LED. Defer Radix Tabs to client to avoid hydration mismatch. */}
        <div className="mt-6">
          {(projectType !== 'led' && projectType !== 'led-rostock') && (
            mounted ? (
              <Tabs.Root value={cluster} onValueChange={(v) => { setCluster(v as Cluster); setExpandedIds(new Set()) }}>
                <Tabs.List className="flex gap-8 border-b border-cq-border mb-4">
                  <Tabs.Trigger
                    value="full-scope"
                    className="px-4 py-3 text-sm font-semibold text-cq-text-secondary data-[state=active]:text-cq-green data-[state=active]:border-b-2 data-[state=active]:border-cq-green outline-none"
                  >
                    Full-Scope Systems (3,630–4,513 kWp)
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="smaller"
                    className="px-4 py-3 text-sm font-semibold text-cq-text-secondary data-[state=active]:text-cq-green data-[state=active]:border-b-2 data-[state=active]:border-cq-green outline-none"
                  >
                    Smaller Systems (1,670–2,333 kWp)
                  </Tabs.Trigger>
                </Tabs.List>
                <p className="text-sm text-cq-text-secondary -mt-2 mb-4">
                  {cfg.description}
                </p>
              </Tabs.Root>
            ) : (
              <div>
                <div className="flex gap-8 border-b border-cq-border mb-4">
                  <span className="px-4 py-3 text-sm font-semibold text-cq-green border-b-2 border-cq-green">
                    Full-Scope Systems (3,630–4,513 kWp)
                  </span>
                  <span className="px-4 py-3 text-sm font-semibold text-cq-text-secondary">
                    Smaller Systems (1,670–2,333 kWp)
                  </span>
                </div>
                <p className="text-sm text-cq-text-secondary -mt-2 mb-4">
                  {clusterConfig['full-scope'].description}
                </p>
              </div>
            )
          )}

          {/* Controls row — breakdown view filter (applies to expanded dropdown only) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-cq-text-secondary">Breakdown view:</span>
              <ToggleGroup.Root
              type="single"
              value={viewMode}
              onValueChange={(v) => v && setViewMode(v as ViewMode)}
              className="inline-flex rounded-lg border border-cq-border bg-cq-bg overflow-hidden"
            >
              {[
                { value: 'absolute', label: (projectType === 'led' || projectType === 'led-rostock') ? 'Absolute €' : 'Absolute £' },
                { value: 'per-kwp', label: (projectType === 'led' || projectType === 'led-rostock') ? '€/luminaire' : '£/kWp' },
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
            </div>

            <label
              className={cn(
                'inline-flex items-center gap-3 text-base font-semibold cursor-pointer',
                intelligenceOn ? 'text-cq-text' : 'text-cq-text-secondary'
              )}
            >
              <Switch
                checked={intelligenceOn}
                onCheckedChange={setIntelligenceOn}
                className={cn(
                  'scale-125 data-[state=checked]:bg-cq-green data-[state=unchecked]:bg-cq-border'
                )}
              />
              CQuel Intelligence
            </label>
          </div>

          {/* CQuel Intelligence callout */}
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

          {/* Table */}
          <div className="rounded-xl border border-cq-border bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cq-border bg-cq-bg">
                    <th className="w-12 py-3 px-2 text-center">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-cq-text-secondary text-xs uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="text-right py-3 px-6 font-semibold text-cq-text-secondary text-xs uppercase tracking-wider w-20">
                      {(projectType === 'led' || projectType === 'led-rostock') ? '€/luminaire' : '£/kWp'}
                    </th>
                    <th className="text-right py-3 px-6 font-semibold text-cq-text-secondary text-xs uppercase tracking-wider w-24">
                      Total
                    </th>
                    <th className="text-right py-3 px-6 font-semibold text-cq-text-secondary text-xs uppercase tracking-wider w-36">
                      System
                    </th>
                    <th className="w-24">
                      <div className="flex items-center justify-center gap-1 py-3 px-6">
                        <span className="font-semibold text-cq-text-secondary text-xs uppercase tracking-wider">
                          Quality
                        </span>
                        <div className="flex flex-col items-center gap-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSortBy('quality')
                              setSortDir('asc')
                            }}
                            className={cn(
                              'p-0.5 rounded hover:bg-cq-border/50 transition-colors -my-0.5',
                              sortBy === 'quality' && sortDir === 'asc' && 'text-cq-green'
                            )}
                            aria-label="Sort ascending"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSortBy('quality')
                              setSortDir('desc')
                            }}
                            className={cn(
                              'p-0.5 rounded hover:bg-cq-border/50 transition-colors -my-0.5',
                              sortBy === 'quality' && sortDir === 'desc' && 'text-cq-green'
                            )}
                            aria-label="Sort descending"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </th>
                    <th className="w-16">
                      <div className="flex items-center justify-center gap-1 py-3 px-6">
                        <span className="font-semibold text-cq-text-secondary text-xs uppercase tracking-wider">
                          Transparency
                        </span>
                        <div className="flex flex-col items-center gap-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSortBy('transparency')
                              setSortDir('asc')
                            }}
                            className={cn(
                              'p-0.5 rounded hover:bg-cq-border/50 transition-colors -my-0.5',
                              sortBy === 'transparency' && sortDir === 'asc' && 'text-cq-green'
                            )}
                            aria-label="Sort ascending"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSortBy('transparency')
                              setSortDir('desc')
                            }}
                            className={cn(
                              'p-0.5 rounded hover:bg-cq-border/50 transition-colors -my-0.5',
                              sortBy === 'transparency' && sortDir === 'desc' && 'text-cq-green'
                            )}
                            aria-label="Sort descending"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-cq-text-secondary text-xs uppercase tracking-wider min-w-[180px]">
                      Note
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-cq-text-secondary text-xs uppercase tracking-wider w-16">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.flatMap((row) => {
                    const isExpanded = expandedIds.has(row.id)
                    const hasBreakdown = row.breakdown != null
                    const breakdownSum = row.breakdown
                      ? (row.breakdown.equipment ?? 0) +
                        (row.breakdown.labour ?? 0) +
                        (row.breakdown.overheads ?? 0) +
                        (row.breakdown.materials ?? 0) +
                        (row.breakdown.design ?? 0) +
                        (row.breakdown.commission ?? 0) +
                        (row.breakdown.om ?? 0)
                      : 0
                    const unallocated = row.totalPounds - breakdownSum
                    const allocatedPct =
                      breakdownSum > 0 ? Math.round((breakdownSum / row.totalPounds) * 100) : 0
                    const showWarning =
                      isExpanded && hasBreakdown && unallocated > 1000

                    const formatBreakdownValue = (n?: number, suffix = '') => {
                      if (n == null) return '—'
                      if (viewMode === 'absolute') return formatAmount(n) + suffix
                      if (viewMode === 'per-kwp')
                        return `${currency === 'eur' ? '€' : '£'}${Math.round(n / row.systemKwp).toLocaleString()}` + suffix
                      if (viewMode === 'pct-total')
                        return `${((n / row.totalPounds) * 100).toFixed(1)}%`
                      return formatAmount(n) + suffix
                    }

                    return [
                      <tr
                        key={row.id}
                        role={hasBreakdown ? 'button' : undefined}
                        tabIndex={hasBreakdown ? 0 : undefined}
                        onClick={hasBreakdown ? () => toggleExpand(row.id) : undefined}
                        onKeyDown={
                          hasBreakdown
                            ? (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  toggleExpand(row.id)
                                }
                              }
                            : undefined
                        }
                        className={cn(
                          'border-b border-cq-border hover:bg-cq-bg/50 transition-colors',
                          selectedIds.has(row.id) && 'bg-cq-green/5',
                          hasBreakdown && 'cursor-pointer'
                        )}
                      >
                        <td
                          className="py-3 px-2 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={selectedIds.has(row.id)}
                            onCheckedChange={() => toggleSelection(row.id)}
                            aria-label={`Select ${row.name}`}
                          />
                        </td>
                        <td className="py-3 px-6 min-w-[140px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-1.5 min-w-0">
                              {hasBreakdown &&
                                (isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-cq-text-secondary shrink-0" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-cq-text-secondary shrink-0" />
                                ))}
                              <span className="font-semibold text-cq-text whitespace-nowrap">
                                {row.name}
                              </span>
                            </span>
                            {row.badge && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-xs font-medium text-cq-dark cursor-help">
                                  {row.badge}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[260px]">
                                {(projectType === 'led' || projectType === 'led-rostock')
                                  ? 'Ranked by €/luminaire — Rank 1 = lowest price (best value)'
                                  : 'Ranked by £/kWp — lower rank = lower price per kWp (better value)'}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </td>
                      <td
                        className={cn(
                          'py-3 px-6 text-right tabular-nums font-bold text-cq-text'
                        )}
                      >
                        {currency === 'eur' ? '€' : '£'}{row.perKwp.toLocaleString()}
                      </td>
                      <td className="py-3 px-6 text-right tabular-nums text-cq-text">
                        {formatAmount(row.totalPounds)}
                      </td>
                      <td className="py-3 px-6 text-right tabular-nums text-cq-text">
                        {formatKwp(row.systemKwp, projectType)}
                      </td>
                      <td className="py-3 px-6" onClick={(e) => e.stopPropagation()}>
                        <QualityBadge quality={row.quality} />
                      </td>
                      <td className="py-3 px-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center">
                          <TransparencyBars stars={row.transparency} />
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex flex-wrap items-center gap-2">
                          {row.hasEstimates && intelligenceOn && (
                            <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-cq-green/20 text-cq-green">
                              has estimates
                            </span>
                          )}
                          {row.note && (
                            <span className="inline-flex items-center gap-1 text-[12px] text-cq-text-secondary">
                              {row.note.type === 'warn' ? '⚠️' : 'ℹ️'} {row.note.text}
                            </span>
                          )}
                          {!row.note && row.linkedNote && (
                            <span className="inline-flex items-center gap-1 text-[12px] text-cq-text-secondary">
                              ℹ️ {row.linkedNote}
                            </span>
                          )}
                          {!row.note && !row.linkedNote && !(row.hasEstimates && intelligenceOn) && (
                            <span className="text-cq-muted">—</span>
                          )}
                        </div>
                      </td>
                      <td
                        className="py-3 px-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`${basePath}/${row.id}`}
                          className="font-bold text-cq-link hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>,
                      isExpanded &&
                        hasBreakdown && (() => {
                          const breakdownCols = (projectType === 'led' || projectType === 'led-rostock')
                            ? [
                                { key: 'equipment' as const, label: 'Equipment' },
                                { key: 'labour' as const, label: 'Labour' },
                                { key: 'overheads' as const, label: 'Overheads' },
                                { key: 'materials' as const, label: 'Materials' },
                                { key: 'commission' as const, label: 'Commissioning & Assurance' },
                              ]
                            : [
                                { key: 'equipment' as const, label: 'Equipment' },
                                { key: 'labour' as const, label: 'Labour' },
                                { key: 'overheads' as const, label: 'Overheads' },
                                { key: 'design' as const, label: 'Design' },
                                { key: 'commission' as const, label: 'Commission' },
                                { key: 'om' as const, label: 'O&M' },
                              ]
                          return (
                            <tr key={`${row.id}-breakdown`} className="border-b border-cq-border bg-cq-link/5">
                              <td colSpan={9} className="p-0 align-top border-l-4 border-cq-link/40">
                                <div className="w-full pl-[4.5rem] pr-6 py-3">
                                  <div className={cn(
                                    'grid gap-x-6 gap-y-2 w-full',
                                    (projectType === 'led' || projectType === 'led-rostock')
                                      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                                      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
                                  )}>
                                    {breakdownCols.map(({ key, label }) => {
                                      const val = row.breakdown?.[key]
                                      const suffix = key === 'equipment' && row.breakdown?.design == null && row.breakdown?.commission == null ? '+' : ''
                                      return (
                                        <div key={key}>
                                          <div className="text-xs text-cq-text-secondary uppercase tracking-wider mb-0.5">{label}</div>
                                          <div className="font-semibold tabular-nums text-cq-text text-sm">
                                            {formatBreakdownValue(val, suffix)}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )
                        })(),
                      isExpanded &&
                        showWarning && (
                          <tr key={`${row.id}-warn`} className="border-b border-cq-border bg-cq-link/5">
                            <td colSpan={9} className="pl-[4.5rem] pr-6 py-3">
                              <div className="flex items-start gap-1.5 text-[12px] text-cq-text-secondary w-full">
                                <span className="text-cq-text-secondary">⚠️</span>
                                <span>Breakdown accounts for {allocatedPct}% of total — {formatAmount(unallocated)} not allocated to categories</span>
                              </div>
                            </td>
                          </tr>
                        ),
                    ].filter(Boolean)
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-4 text-sm text-cq-text-secondary">
            {projectType === 'led'
              ? '7 CapEx submissions · ranked by €/luminaire'
              : projectType === 'led-rostock'
                ? '2 CapEx submissions · ranked by €/luminaire'
                : '12 CapEx submissions · 3 PPA excluded · ranked by £/kWp'}
          </footer>
          {(projectType !== 'led' && projectType !== 'led-rostock') && (
          <p className="mt-2 text-xs text-cq-text-secondary">
            Shawton — PPA-only; Ortus, Electron Green — no breakdown. Power-Zero, SNRG excluded.
          </p>
          )}
        </div>

        {/* Compare shortlisted bar */}
        {selectedIds.size >= 2 && (
          <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-cq-border bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-cq-text-secondary">
                {selectedIds.size} supplier{selectedIds.size > 1 ? 's' : ''} selected
              </p>
              <button
                type="button"
                onClick={handleCompare}
                className="px-4 py-2 rounded-lg bg-cq-green text-primary-foreground font-semibold hover:bg-cq-green-hover transition-colors"
              >
                Compare {selectedIds.size} suppliers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
