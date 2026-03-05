/**
 * LED Project 310 — report-derived content for bid profiles
 * Extracted from report (1).html
 */

import type { KeyFlag } from '@/components/supplier-profile-view'

type SubCat = { name: string; description: string; amount?: number }

export type LedReportOverlay = {
  characterisation: string
  keyFlags: KeyFlag[]
  specs?: { workmanshipWarranty?: string; panelWarranty?: string }
  equipmentSubs?: SubCat[]
  labourSubs?: SubCat[]
  overheadsSubs?: SubCat[]
  materialsSubs?: SubCat[]
  commissioningSubs?: SubCat[]
  ongoingSubs?: SubCat[]
}

export const LED_REPORT_OVERLAYS: Record<string, LedReportOverlay> = {
  'german-led-tech': {
    characterisation:
      'Lowest-cost bid using proprietary GLT tube retrofit approach; Excel schedule provides per-line product costs (€143,749 total equipment) but residual €87,136 covers unitemized labour, materials, and overheads with no breakdown.',
    specs: { workmanshipWarranty: '5 years', panelWarranty: '5 years' },
    keyFlags: [
      { icon: 'warn', text: 'Total luminaire count in Excel is 2,680 vs. 2,494 lamps—discrepancy likely due to multi-lamp fittings' },
      { icon: 'warn', text: 'No labour or materials split provided; ~€87,136 gap between equipment and total is unallocated' },
      { icon: 'info', text: 'Retrofit-tube approach preserves existing luminaire bodies rather than replacing full fixtures—scope differs from other suppliers' },
    ],
    equipmentSubs: [
      { name: 'Main Equipment', description: 'GLT LED tubes, downlights, and spot fixtures; 12 product lines from Excel', amount: 143_749 },
      { name: 'Mounting Systems', description: 'Assumed bundled into main equipment unit prices' },
    ],
    labourSubs: [
      { name: 'Installation Labour', description: 'Not separately itemized; embedded in total price' },
      { name: 'Electrical Works', description: 'Not separately itemized; embedded in total price' },
    ],
    materialsSubs: [
      { name: 'Cables Wiring', description: 'Not separately itemized; embedded in total price' },
      { name: 'Consumables', description: 'Not separately itemized; embedded in total price' },
    ],
    overheadsSubs: [
      { name: 'Waste Disposal', description: 'Included per description; not separately costed' },
    ],
    commissioningSubs: [
      { name: 'Equipment Warranty', description: '5-year product warranty included; no separate cost' },
      { name: 'Installation Warranty', description: '5-year workmanship warranty included; no separate cost' },
    ],
  },
  ecowatt: {
    characterisation:
      'Second-lowest price with good cost structure transparency from PDF; uniquely includes BAFA funding support and on-site container logistics, but critically omits all warranty and technical performance data.',
    keyFlags: [
      { icon: 'warn', text: 'All warranty fields show 0 years; no warranty terms mentioned anywhere in submission' },
      { icon: 'warn', text: 'All energy performance fields (demand, consumption pa, lifetime) show 0.00—form fields left blank' },
      { icon: 'info', text: 'BAFA application support and disposal explicitly priced unlike most competitors' },
    ],
    equipmentSubs: [
      { name: 'Main Equipment', description: 'Named LED fixtures (Ledvance, EVN, Nobile, Schuch, RZB, Philips) across 12 zones', amount: 164_261 },
    ],
    labourSubs: [
      { name: 'Installation Labour', description: '1,380 hours at €66.34/hr; 6 installers × 230 hours', amount: 91_549 },
    ],
    materialsSubs: [
      { name: 'Consumables', description: 'Assumed included within installation labour rate' },
    ],
    overheadsSubs: [
      { name: 'Preliminaries', description: 'Two on-site storage containers for materials and security', amount: 6_000 },
      { name: 'Waste Disposal', description: 'Professional disposal of old fixtures, lamps, packaging', amount: 5_500 },
      { name: 'Contract Administration', description: 'BAFA funding application support service', amount: 225 },
    ],
    commissioningSubs: [
      { name: 'Equipment Warranty', description: 'No warranty terms stated in submission' },
    ],
  },
  'die-stromspar': {
    characterisation:
      'Best-documented submission after SAFLUX; line-item PDF clearly shows product selection, per-fixture material cost, and zone-by-zone installation rate, enabling straightforward audit of the €270,290 total.',
    keyFlags: [
      { icon: 'info', text: 'Labour (€166,682) is high relative to materials (€103,607); ratio inverted vs industry norm' },
      { icon: 'info', text: '5-year product and workmanship warranty included; no separate cost' },
    ],
    equipmentSubs: [
      { name: 'Main Equipment', description: 'Named fixtures: Philips, LEDVANCE, and generic LED products across all 12 zones', amount: 103_607 },
    ],
    labourSubs: [
      { name: 'Installation Labour', description: 'Per-fixture installation rates (€55–€75/hr tiers) applied zone by zone', amount: 166_682 },
    ],
    overheadsSubs: [
      { name: 'Contract Administration', description: 'Documentation, site visits, acceptance protocol with photographic evidence', amount: 1_350 },
      { name: 'Transportation Logistics', description: 'Included within per-fixture installation rates' },
    ],
    commissioningSubs: [
      { name: 'Equipment Warranty', description: '5-year product warranty included; no separate cost' },
      { name: 'Installation Warranty', description: '5-year workmanship warranty included; no separate cost' },
      { name: 'Training Handover', description: 'Photographic documentation and acceptance protocol included in overhead line' },
    ],
  },
  'led-on': {
    characterisation:
      'Premium product selection from named European manufacturers (RZB KALEEA BASIC dominates at €234,890 for 1,522 units) but structurally opaque pricing with labour absorbed into materials and complete absence of warranty commitments.',
    keyFlags: [
      { icon: 'warn', text: 'All warranty fields show 0 years—no warranty terms provided anywhere' },
      { icon: 'warn', text: 'Labour embedded in materials; optional 90-hour add-on at €58/hr (€5,220) creates pricing ambiguity' },
      { icon: 'info', text: 'LEDVANCE, OSRAM, PRISMICA, RZB fixtures; labour stated as included within equipment figure' },
    ],
    equipmentSubs: [
      { name: 'Main Equipment', description: 'LEDVANCE, OSRAM, PRISMICA, RZB fixtures; labour stated as included within this figure', amount: 299_987 },
    ],
    labourSubs: [
      { name: 'Installation Labour', description: 'Stated as included in materials price; optional 90-hour add-on at €58/hr (€5,220) if needed' },
    ],
    overheadsSubs: [
      { name: 'Preliminaries', description: 'One symbolic labour-hour buffer line; only charged if additional hours required', amount: 58 },
    ],
    commissioningSubs: [
      { name: 'Equipment Warranty', description: 'No warranty terms stated; all warranty fields show 0 years' },
      { name: 'Installation Warranty', description: 'No workmanship warranty stated in submission' },
    ],
  },
  'beka-solar': {
    characterisation:
      'Simple two-page quote with fixture-type breakdown matching the survey document but using generic descriptions and no brand specification; flat per-fixture installation rate and complete absence of technical or warranty data raises significant quality concerns given the company\'s primary HVAC/solar focus.',
    keyFlags: [
      { icon: 'warn', text: 'All warranty fields show 0 years; no warranty mentioned anywhere' },
      { icon: 'warn', text: 'All energy/technical performance fields show 0.00; no durability standard specified' },
      { icon: 'warn', text: 'VAT-inclusive total (€400,679) referenced conflicts with cost_estimated (€336,705 net)—confirm which basis applies' },
    ],
    equipmentSubs: [
      { name: 'Main Equipment', description: 'Generic fixture types (no brands); 12 line items matching survey fixture categories', amount: 180_132 },
    ],
    labourSubs: [
      { name: 'Installation Labour', description: 'Flat rate €62.78 per fixture across all 2,494 units', amount: 156_573 },
    ],
    commissioningSubs: [
      { name: 'Equipment Warranty', description: 'No warranty terms provided; all fields show 0 years' },
      { name: 'Installation Warranty', description: 'No workmanship warranty stated' },
    ],
  },
  genesis: {
    characterisation:
      'UK-based supplier with a well-structured fixture schedule showing energy modelling per zone, but the highest labour cost (€193,285) is unexplained and no workmanship warranty is offered, creating risk on both cost and quality dimensions.',
    keyFlags: [
      { icon: 'warn', text: 'Workmanship warranty explicitly 0 years—significant gap vs German competitors offering 5 years' },
      { icon: 'warn', text: 'Labour at €193,285 is 54% higher than next-highest (Die Stromspar €166,682) with no justification' },
      { icon: 'info', text: 'UK-based contractor on German project—may face additional mobilization and regulatory challenges' },
    ],
    equipmentSubs: [
      { name: 'Main Equipment', description: '12 LED fixture types; per-unit costs range €29–€164 across zones', amount: 162_505 },
    ],
    labourSubs: [
      { name: 'Installation Labour', description: 'Highest labour cost among all suppliers; no hour rate breakdown provided', amount: 193_285 },
    ],
    overheadsSubs: [
      { name: 'Preliminaries', description: 'Not separately itemized; assumed embedded in labour figure' },
    ],
    commissioningSubs: [
      { name: 'Equipment Warranty', description: '5-year lamp and component warranty; no separate cost stated' },
      { name: 'Installation Warranty', description: '0-year workmanship warranty—explicitly absent from submission' },
    ],
  },
  saflux: {
    characterisation:
      'Most expensive and most comprehensively documented submission; the €449,000 base price includes explicit line items for H&S and administration that other suppliers absorb silently, and the optional maintenance contract (€13,470/year) if taken over 10 years adds €134,700 to lifetime cost.',
    keyFlags: [
      { icon: 'info', text: 'Only supplier with six explicit cost categories; fully itemized with H&S, admin, electrical, maintenance lines' },
      { icon: 'info', text: '7-year product and 5-year workmanship warranty; BEG NWG eligible fixtures' },
    ],
    equipmentSubs: [
      { name: 'Main Equipment', description: 'ROOX family (KARL, OTTO, OSKAR, IDA, ALMA, AUGUST); BEG NWG eligible; 7-year warranty', amount: 260_000 },
    ],
    labourSubs: [
      { name: 'Installation Labour', description: '4 electricians plus project manager; ~46 working days at 11 hrs/day', amount: 100_000 },
      { name: 'Project Management', description: 'Included within labour figure; dedicated PM throughout' },
    ],
    overheadsSubs: [
      { name: 'Health Safety Management', description: 'Explicit H&S budget; DGUV-compliant working at height and site safety', amount: 29_000 },
      { name: 'Contract Administration', description: 'Project administration, coordination, as-built documentation, asset register', amount: 40_000 },
      { name: 'Waste Disposal', description: 'WEEE/ElektroG compliant disposal included; not separately priced' },
    ],
    commissioningSubs: [
      { name: 'System Commissioning', description: 'Electrical works and commissioning; 3-day commissioning phase specified', amount: 20_000 },
      { name: 'Equipment Warranty', description: '7-year product warranty on all ROOX components; cost embedded in materials' },
      { name: 'Installation Warranty', description: '5-year workmanship warranty; cost embedded in labour' },
      { name: 'Training Handover', description: 'As-built plans, guarantee certificates, final energy model included' },
    ],
    ongoingSubs: [
      { name: 'Maintenance Contract', description: "Optional 'SAFLUX Care!' annual contract; €0.45/luminaire/month; 5-year term", amount: 13_470 },
      { name: 'Reactive Maintenance', description: '48-hour response included within maintenance contract if selected' },
    ],
  },
}
