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
    <Card className="p-5 border border-gray-200 w-full shadow-sm">
      {/* Header: name on left, logo and actions on right */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1 text-[#1E2832]">{supplier.name}</h3>
        </div>
        <div className="flex items-center gap-3">
          <Image
            src={supplier.logo || "/placeholder.svg"}
            alt={`${supplier.name} logo`}
            width={80}
            height={40}
            className="object-contain"
          />
        </div>
      </div>

      {/* Field boxes with borders and proper styling */}
      <div className="mb-3 flex gap-3">
        <div className="flex flex-col items-start gap-2 flex-1 p-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB]">
          <div className="text-xs text-[#4D5761] font-normal">Price</div>
          <div className="text-base font-bold text-[#1E2832]">£{supplier.price.toLocaleString()}</div>
        </div>
        <div className="flex flex-col items-start gap-2 flex-1 p-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB]">
          <div className="text-xs text-[#4D5761] font-normal">Equipment removal</div>
          <div className={`text-sm font-semibold text-[#1E2832] ${isTBCOrNotRequired(supplier.fields.equipmentRemoval ?? undefined) ? "bg-orange-100 text-orange-700 px-1.5 py-0.5 inline-block rounded" : ""}`}>
            {supplier.fields.equipmentRemoval ?? "—"}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 flex-1 p-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB]">
          <div className="text-xs text-[#4D5761] font-normal">Unit location</div>
          <div className={`text-sm font-semibold text-[#1E2832] ${isTBCOrNotRequired(supplier.fields.unitLocation ?? undefined) ? "bg-orange-100 text-orange-700 px-1.5 py-0.5 inline-block rounded" : ""}`}>
            {supplier.fields.unitLocation ?? "—"}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 flex-1 p-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB]">
          <div className="text-xs text-[#4D5761] font-normal">Electrical work</div>
          <div className={`text-sm font-semibold text-[#1E2832] ${isTBCOrNotRequired(supplier.fields.electricalWork ?? undefined) ? "bg-orange-100 text-orange-700 px-1.5 py-0.5 inline-block rounded" : ""}`}>
            {supplier.fields.electricalWork ?? "—"}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 flex-1 p-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB]">
          <div className="text-xs text-[#4D5761] font-normal">Noise</div>
          <div className={`text-sm font-semibold text-[#1E2832] ${isTBCOrNotRequired(supplier.fields.noiseControl ?? undefined) ? "bg-orange-100 text-orange-700 px-1.5 py-0.5 inline-block rounded" : ""}`}>
            {supplier.fields.noiseControl ?? "—"}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 flex-1 p-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB]">
          <div className="text-xs text-[#4D5761] font-normal">Operating temps</div>
          <div className={`text-sm font-semibold text-[#1E2832] ${isTBCOrNotRequired(supplier.fields.operatingTemps ?? undefined) ? "bg-orange-100 text-orange-700 px-1.5 py-0.5 inline-block rounded" : ""}`}>
            {supplier.fields.operatingTemps ?? "—"}
          </div>
        </div>
      </div>

      {/* Key Differentiator box */}
      <div className="p-3 bg-[#E8F1F8] border border-blue-100 rounded mb-3">
        <span className="font-semibold text-sm text-[#1E2832]">Key Differentiator: </span>
        <span className="text-sm text-[#4D5761]">{supplier.keyDifferentiator}</span>
      </div>

      {/* Action buttons at bottom */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white border-0"
          onClick={() => {/* placeholder for contact action */}}
        >
          Contact Supplier
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border border-gray-300 bg-white hover:bg-gray-50 text-[#1E2832]"
          onClick={() => onViewDetails(supplier)}
        >
          View full details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
