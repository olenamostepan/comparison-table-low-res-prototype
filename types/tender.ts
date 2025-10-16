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
