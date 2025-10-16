import type { Supplier, Category } from "@/types/tender"

export const suppliers: Supplier[] = [
  {
    id: "1",
    name: "Klimaservice Malte Born",
    logo: "/generic-company-logo.png",
    price: 45000,
    fields: {
      equipmentRemoval: "Yes",
      unitLocation: "Roof",
      electricalWork: "No",
      noiseControl: "Yes",
      operatingTemps: "Yes",
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
      equipmentRemoval: "Yes",
      unitLocation: "TBC: Roof / Outside",
      electricalWork: "Yes",
      noiseControl: "TBC on site visit",
      operatingTemps: "Yes",
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
      equipmentRemoval: "Not required",
      unitLocation: "Courtyard",
      electricalWork: "Yes",
      noiseControl: "Yes based on analysis",
      operatingTemps: "Yes",
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
      equipmentRemoval: "Not required",
      unitLocation: "Outside",
      electricalWork: "Yes",
      noiseControl: "Yes",
      operatingTemps: "TBC",
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
    name: "Technical Requirements",
    expanded: true,
    fields: [
      { label: "Equipment removal included", key: "equipmentRemoval" },
      { label: "Unit location", key: "unitLocation" },
      { label: "Electrical work included", key: "electricalWork" },
      { label: "Noise control addressed", key: "noiseControl" },
      { label: "Operating temperatures compliant", key: "operatingTemps" },
    ],
  },
  {
    name: "Client Considerations",
    expanded: false,
    fields: [
      { label: "Site visit required", key: "siteVisit" },
      { label: "Warranty period", key: "warranty" },
    ],
  },
  {
    name: "Cost & Financial",
    expanded: false,
    fields: [
      { label: "Total price", key: "price" },
      { label: "Payment terms", key: "paymentTerms" },
    ],
  },
  {
    name: "Installation Timeline",
    expanded: false,
    fields: [
      { label: "Start date", key: "startDate" },
      { label: "Completion date", key: "completionDate" },
    ],
  },
]

export const fieldExplanations: Record<string, string> = {
  equipmentRemoval: "Whether old equipment disposal is included in the quoted price",
  unitLocation: "Where heat pump units will be installed on the property",
  electricalWork: "Whether electrical upgrades and connections are included in the scope",
  noiseControl: "Whether noise mitigation measures have been addressed in the proposal",
  operatingTemps: "Whether the system can operate at the required temperature ranges",
}
