"use client"

import type { Supplier } from "@/types/tender"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface SupplierCardProps {
  supplier: Supplier
  onViewDetails: (supplier: Supplier) => void
}

function isTBCOrNotRequired(value?: string): boolean {
  if (!value) return false
  const v = value.toLowerCase()
  return v.includes("tbc") || v.includes("not required")
}

export function SupplierCard({ supplier, onViewDetails }: SupplierCardProps) {
  return (
    <Card className="p-4 border-2 border-black w-full">
      {/* Header: logo + name on left, actions on right */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <Image
            src={supplier.logo || "/placeholder.svg"}
            alt={`${supplier.name} logo`}
            width={48}
            height={48}
            className="border border-black"
          />
          <h3 className="text-lg font-bold">{supplier.name}</h3>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="border-2 border-black bg-black text-white hover:bg-black/90"
            onClick={() => {/* placeholder for contact action */}}
          >
            Contact supplier
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-2 border-black bg-transparent"
            onClick={() => onViewDetails(supplier)}
          >
            View full details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Inline fields row with vertical dividers */}
      <div className="mb-2 grid grid-cols-6">
        <div className="pr-4 py-0.5">
          <div className="text-sm leading-none">Price</div>
          <div className="text-xl font-bold leading-tight">£{supplier.price.toLocaleString()}</div>
        </div>
        <div className="px-4 py-0.5 border-l-2 border-black">
          <div className="text-sm leading-none">Equipment removal</div>
          <div className={`font-bold leading-tight ${isTBCOrNotRequired(supplier.fields.equipmentRemoval ?? undefined) ? "bg-yellow-200 px-2 py-0.5 inline-block" : ""}`}>
            {supplier.fields.equipmentRemoval ?? "—"}
          </div>
        </div>
        <div className="px-4 py-0.5 border-l-2 border-black">
          <div className="text-sm leading-none">Unit location</div>
          <div className={`font-bold leading-tight ${isTBCOrNotRequired(supplier.fields.unitLocation ?? undefined) ? "bg-yellow-200 px-2 py-0.5 inline-block" : ""}`}>
            {supplier.fields.unitLocation ?? "—"}
          </div>
        </div>
        <div className="px-4 py-0.5 border-l-2 border-black">
          <div className="text-sm leading-none">Electrical work</div>
          <div className={`font-bold leading-tight ${isTBCOrNotRequired(supplier.fields.electricalWork ?? undefined) ? "bg-yellow-200 px-2 py-0.5 inline-block" : ""}`}>
            {supplier.fields.electricalWork ?? "—"}
          </div>
        </div>
        <div className="px-4 py-0.5 border-l-2 border-black">
          <div className="text-sm leading-none">Noise</div>
          <div className={`font-bold leading-tight ${isTBCOrNotRequired(supplier.fields.noiseControl ?? undefined) ? "bg-yellow-200 px-2 py-0.5 inline-block" : ""}`}>
            {supplier.fields.noiseControl ?? "—"}
          </div>
        </div>
        <div className="pl-4 py-0.5 border-l-2 border-black">
          <div className="text-sm leading-none">Operating temps</div>
          <div className={`font-bold leading-tight ${isTBCOrNotRequired(supplier.fields.operatingTemps ?? undefined) ? "bg-yellow-200 px-2 py-0.5 inline-block" : ""}`}>
            {supplier.fields.operatingTemps ?? "—"}
          </div>
        </div>
      </div>

      {/* Key Differentiator box */}
      <div className="p-2 border border-black bg-gray-100">
        <span className="font-semibold text-sm leading-tight">Key Differentiator:</span>
        <span className="ml-2 text-sm leading-tight">{supplier.keyDifferentiator}</span>
      </div>
    </Card>
  )
}
