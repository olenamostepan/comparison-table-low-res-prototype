export type DecisionComparisonSupplier = {
  id: string
  name: string
  badge?: string
  logo?: string
  perKwp: number
  totalPounds: number
  adjustedCost: string
  systemKwp: number
  coverage: string
  panels: string
  inverters: string
  mounting: string
  exclusions: string
  quality: 1 | 2 | 3
  transparency: 1 | 2 | 3 | 4 | 5
  documentation: string
  reconciliation: string
  flags: string[]
  maintenanceContract: string
  panelWarranty: string
  inverterWarranty: string
  workmanship: string
}

export const DEFAULT_DECISION_SUPPLIERS: DecisionComparisonSupplier[] = [
  {
    id: 'photon',
    name: 'Beba',
    badge: 'Lowest',
    logo: '/site elements/beba.svg',
    perKwp: 582,
    totalPounds: 1_131_500,
    adjustedCost: 'As quoted',
    systemKwp: 3998,
    coverage: 'All 6 roof zones incl. car parks',
    panels: 'Not specified in extractable docs',
    inverters: 'Not specified',
    mounting: 'Not specified',
    exclusions: '—',
    quality: 1,
    transparency: 4,
    documentation: 'PDF provided — extractable',
    reconciliation: '£112k gap between PDF and submitted price',
    flags: ['Panel warranty field says 15yr but spec says 30yr'],
    maintenanceContract: '£40,000 (terms not detailed)',
    panelWarranty: '30yr',
    inverterWarranty: 'Not stated',
    workmanship: 'Not stated',
  },
  {
    id: 'your-eco',
    name: 'Your Eco',
    logo: '/site elements/gogreen.svg',
    perKwp: 799,
    totalPounds: 1_726_089,
    adjustedCost: 'As quoted',
    systemKwp: 3998,
    coverage: 'All 6 roof zones incl. car parks',
    panels: 'Trina 455W Tier 1',
    inverters: 'Solis string inverters',
    mounting: 'K2 systems',
    exclusions: '—',
    quality: 1,
    transparency: 4,
    documentation: 'Excel breakdown — fully reconciled',
    reconciliation: 'No issues found',
    flags: ['0% export model is unrealistic for this system size'],
    maintenanceContract: '25-year O&M offer',
    panelWarranty: '25yr',
    inverterWarranty: '12yr',
    workmanship: '2yr',
  },
  {
    id: 'low-carbon',
    name: 'Low Carbon Energy',
    badge: 'best £/kWp',
    logo: '/site elements/lowcarbon.svg',
    perKwp: 499,
    totalPounds: 1_163_127,
    adjustedCost: 'Excludes scaffolding — true cost higher',
    systemKwp: 3998,
    coverage: 'All 6 roof zones incl. car parks',
    panels: 'Not confirmed in docs',
    inverters: 'Not specified',
    mounting: 'Not specified',
    exclusions: 'Scaffolding excluded',
    quality: 2,
    transparency: 2,
    documentation: 'PDF uploaded — unreadable',
    reconciliation: 'No issues found',
    flags: [
      "Proposal references 'Lakeside' — adapted from other tender",
      'Highest labour cost in dataset (£559k, 24%)',
    ],
    maintenanceContract: 'Not stated',
    panelWarranty: 'Not stated',
    inverterWarranty: 'Not stated',
    workmanship: 'Not stated',
  },
]
