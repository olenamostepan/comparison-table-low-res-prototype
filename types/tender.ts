export type Supplier = {
  id: string
  name: string
  logo: string
  price: number
  fields: {
    equipmentRemoval: string
    unitLocation: string
    electricalWork: string
    noiseControl: string
    operatingTemps: string
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
