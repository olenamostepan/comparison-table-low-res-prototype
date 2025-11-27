export type Supplier = {
  id: string
  name: string
  logo: string
  price: number
  fields: {
    // Lighting comparison fields
    systemType?: string
    manufacturer?: string
    numberOfLights?: string
    installationCostsIncluded?: string
    replacementType?: string
    labourAndOtherCosts?: string
    materialCosts?: string
    meetsTechnicalRequirements?: string
    meetsTenderRequirements?: string
    controlStrategyMeetsRegulations?: string
    emergencyLightingIncluded?: string

    // Legacy fields kept for other prototypes
    equipmentRemoval?: string
    unitLocation?: string
    electricalWork?: string
    noiseControl?: string
    operatingTemps?: string

    // Rome fields
    romeCompliance?: string
    romeCertification?: string
    romeStandards?: string

    // Allow scenario-specific extensions
    [key: string]: string | undefined
  }
  additionalNotes: string
  keyDifferentiator: string
  documents: Document[]
}

export type Document = {
  name: string
  url: string
}

export type Category = {
  name: string
  fields: CategoryField[]
  expanded: boolean
}

export type CategoryField = {
  label: string
  key: string
}

export type TenderOverview = {
  invited: number
  submitted: number
  responseRate: number
  details: string[]
  closedDate: string
  duration: string
}

export type TenderScenario = "led" | "solar-pv" | "hvac"

export type TenderConfig = {
  slug: TenderScenario
  title: string
  description: string
  location: string
  avatar: string
  tags: string[]
  overview: TenderOverview
  suppliers: Supplier[]
  categories: Category[]
  fieldExplanations: Record<string, string>
}
