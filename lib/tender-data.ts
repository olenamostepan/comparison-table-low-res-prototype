import type { Supplier, Category } from "@/types/tender"

export const suppliers: Supplier[] = [
  {
    id: "1",
    name: "Klimaservice Malte Born",
    logo: "/generic-company-logo.png",
    price: 45000,
    fields: {
      systemType: "Full fixture replacement",
      manufacturer: "OSRAM",
      numberOfLights: "2,494",
      installationCostsIncluded: "YES",
      replacementType: "New LED fixtures",
      labourAndOtherCosts: "156.573,32 €",
      materialCosts: "180.131,90 €",
      meetsTechnicalRequirements: "YES",
      meetsTenderRequirements: "YES",
      controlStrategyMeetsRegulations: "YES",
      emergencyLightingIncluded: "Installation",
      // legacy fields for cards
      equipmentRemoval: "Yes",
      unitLocation: "Roof",
      electricalWork: "No",
      noiseControl: "Yes",
      operatingTemps: "Yes",
      // Rome fields
      romeCompliance: "TBC",
      romeCertification: "Not required",
      romeStandards: "Compliant",
    },
    additionalNotes: "Price includes an approximate price for lifting equipment",
    keyDifferentiator: "Price includes an approximate price for lifting equipment",
    documents: [
      { name: "Technical spec.pdf", url: "#" },
      { name: "Pricing breakdown.xlsx", url: "#" },
    ],
  },
  {
    id: "2",
    name: "Beka Solar Energie GmbH",
    logo: "/solar-company-logo.png",
    price: 52000,
    fields: {
      systemType: "Full fixture replacement",
      manufacturer: "LEDVANCE, EVN, Nobile, TEGCGET, Schuch, RZB, Philips",
      numberOfLights: "2,494",
      installationCostsIncluded: "YES",
      replacementType: "New LED fixtures",
      labourAndOtherCosts: "132.637,00 €",
      materialCosts: "163.937,05 €",
      meetsTechnicalRequirements: "YES",
      meetsTenderRequirements: "YES",
      controlStrategyMeetsRegulations: "YES",
      emergencyLightingIncluded: "Installation",
      // legacy fields for cards
      equipmentRemoval: "Yes",
      unitLocation: "TBC: Roof / Outside",
      electricalWork: "Yes",
      noiseControl: "TBC on site visit",
      operatingTemps: "Yes",
      // Rome fields
      romeCompliance: "TBC",
      romeCertification: "Not required",
      romeStandards: "TBC",
    },
    additionalNotes:
      "Additional capacity in heat pump and electric immersion heater to minimise heating shortfall risk.",
    keyDifferentiator:
      "Additional capacity in heat pump and electric immersion heater to minimise heating shortfall risk.",
    documents: [
      { name: "Technical spec.pdf", url: "#" },
      { name: "Pricing breakdown.xlsx", url: "#" },
    ],
  },
  {
    id: "3",
    name: "Eco-Heat UG",
    logo: "/eco-heating-logo.jpg",
    price: 48000,
    fields: {
      systemType: "Full fixture replacement",
      manufacturer: "GLT (their own product)",
      numberOfLights: "2,494",
      installationCostsIncluded: "NO",
      replacementType: "New LED fixtures",
      labourAndOtherCosts: "Approximately 160.000,00 €",
      materialCosts: "230.884,60 €",
      meetsTechnicalRequirements: "YES",
      meetsTenderRequirements: "NO",
      controlStrategyMeetsRegulations: "YES",
      emergencyLightingIncluded: "Design",
      // legacy fields for cards
      equipmentRemoval: "Not required",
      unitLocation: "Courtyard",
      electricalWork: "Yes",
      noiseControl: "Yes based on analysis",
      operatingTemps: "Yes",
      // Rome fields
      romeCompliance: "Not required",
      romeCertification: "TBC",
      romeStandards: "Compliant",
    },
    additionalNotes: "Existing gas boilers retained to boost heat pump output if heat pumps fall short.",
    keyDifferentiator: "Existing gas boilers retained to boost heat pump output if heat pumps fall short.",
    documents: [
      { name: "Technical spec.pdf", url: "#" },
      { name: "Pricing breakdown.xlsx", url: "#" },
    ],
  },
  {
    id: "4",
    name: "Ecowatt GmbH",
    logo: "/energy-company-logo.jpg",
    price: 58000,
    fields: {
      systemType: "Full fixture replacement",
      manufacturer: "Philips, LEDVANCE, Beleuchtung Direkt, Dotlux",
      numberOfLights: "2,494",
      installationCostsIncluded: "YES",
      replacementType: "New LED fixtures",
      labourAndOtherCosts: "166.682,23 €",
      materialCosts: "103.607,47 €",
      meetsTechnicalRequirements: "YES",
      meetsTenderRequirements: "YES",
      controlStrategyMeetsRegulations: "YES",
      emergencyLightingIncluded: "Yes, included but only for central battery operation",
      // legacy fields for cards
      equipmentRemoval: "Not required",
      unitLocation: "Outside",
      electricalWork: "Yes",
      noiseControl: "Yes",
      operatingTemps: "TBC",
      // Rome fields
      romeCompliance: "Compliant",
      romeCertification: "TBC",
      romeStandards: "Not required",
    },
    additionalNotes:
      "High allowance for design and planning. Could be reduced/negotiated if subsidy not required. High cost for balancing",
    keyDifferentiator:
      "High allowance for design and planning. Could be reduced/negotiated if subsidy not required. High cost for balancing",
    documents: [
      { name: "Technical spec.pdf", url: "#" },
      { name: "Pricing breakdown.xlsx", url: "#" },
    ],
  },
]

export const categories: Category[] = [
  {
    name: "Scope",
    expanded: true,
    fields: [
      { label: "System type/ Scope", key: "systemType" },
      { label: "LED Lighting manufacture", key: "manufacturer" },
      { label: "Number of lights", key: "numberOfLights" },
    ],
  },
  {
    name: "Costs",
    expanded: true,
    fields: [
      { label: "Installation costs (included)", key: "installationCostsIncluded" },
      { label: "Bulb replacement/ New LED fixtures", key: "replacementType" },
      { label: "Labour costs+Other costs", key: "labourAndOtherCosts" },
      { label: "Material costs", key: "materialCosts" },
    ],
  },
  {
    name: "Compliance",
    expanded: true,
    fields: [
      { label: "Meets technical requirements", key: "meetsTechnicalRequirements" },
      { label: "Meets tender requirements", key: "meetsTenderRequirements" },
      { label: "Control strategy meets building regulations", key: "controlStrategyMeetsRegulations" },
      { label: "Emergency lighting - what's included?", key: "emergencyLightingIncluded" },
    ],
  },
  {
    name: "Rome",
    expanded: true,
    fields: [
      { label: "Rome compliance", key: "romeCompliance" },
      { label: "Rome certification", key: "romeCertification" },
      { label: "Rome standards", key: "romeStandards" },
    ],
  },
]

export const fieldExplanations: Record<string, string> = {
  systemType: "Proposed scope of works",
  manufacturer: "Manufacturers proposed for LED lighting",
  numberOfLights: "Count of fixtures in scope",
  installationCostsIncluded: "Whether installation costs are included",
  replacementType: "Whether bulbs or full fixtures are replaced",
  labourAndOtherCosts: "Quoted labour and miscellaneous costs",
  materialCosts: "Quoted materials costs",
  meetsTechnicalRequirements: "Compliance with technical requirements",
  meetsTenderRequirements: "Compliance with tender requirements",
  controlStrategyMeetsRegulations: "Control strategy compliance",
  emergencyLightingIncluded: "Items included within emergency lighting scope",
}
