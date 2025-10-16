"use client"

import type { Supplier } from "@/types/tender"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { FileText, ChevronDown } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface BidDetailsModalProps {
  supplier: Supplier | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function isTBCOrNotRequired(value: string): boolean {
  return value.toLowerCase().includes("tbc") || value.toLowerCase().includes("not required")
}

export function BidDetailsModal({ supplier, open, onOpenChange }: BidDetailsModalProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Technical Requirements"])

  if (!supplier) return null

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto border-l-2 border-black">
        <SheetHeader className="border-b-2 border-black pb-4">
          <div className="flex items-center gap-4">
            <Image
              src={supplier.logo || "/placeholder.svg"}
              alt={`${supplier.name} logo`}
              width={48}
              height={48}
              className="border border-black"
            />
            <SheetTitle className="text-2xl">{supplier.name}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Technical Requirements */}
          <div className="border-2 border-black">
            <button
              onClick={() => toggleSection("Technical Requirements")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>Technical Requirements</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("Technical Requirements") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("Technical Requirements") && (
              <div className="p-4 border-t-2 border-black space-y-3">
                <div>
                  <div className="text-sm font-medium">Equipment removal included</div>
                  <div
                    className={`text-sm ${
                      isTBCOrNotRequired(supplier.fields.equipmentRemoval) ? "bg-yellow-200 px-2 py-1 inline-block" : ""
                    }`}
                  >
                    {supplier.fields.equipmentRemoval}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Unit location</div>
                  <div
                    className={`text-sm ${
                      isTBCOrNotRequired(supplier.fields.unitLocation) ? "bg-yellow-200 px-2 py-1 inline-block" : ""
                    }`}
                  >
                    {supplier.fields.unitLocation}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Electrical work included</div>
                  <div
                    className={`text-sm ${
                      isTBCOrNotRequired(supplier.fields.electricalWork) ? "bg-yellow-200 px-2 py-1 inline-block" : ""
                    }`}
                  >
                    {supplier.fields.electricalWork}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Noise control addressed</div>
                  <div
                    className={`text-sm ${
                      isTBCOrNotRequired(supplier.fields.noiseControl) ? "bg-yellow-200 px-2 py-1 inline-block" : ""
                    }`}
                  >
                    {supplier.fields.noiseControl}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Operating temperatures compliant</div>
                  <div
                    className={`text-sm ${
                      isTBCOrNotRequired(supplier.fields.operatingTemps) ? "bg-yellow-200 px-2 py-1 inline-block" : ""
                    }`}
                  >
                    {supplier.fields.operatingTemps}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cost & Financial */}
          <div className="border-2 border-black">
            <button
              onClick={() => toggleSection("Cost & Financial")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>Cost & Financial</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("Cost & Financial") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("Cost & Financial") && (
              <div className="p-4 border-t-2 border-black">
                <div className="text-sm font-medium">Total price</div>
                <div className="text-2xl font-bold">£{supplier.price.toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="border-2 border-black">
            <button
              onClick={() => toggleSection("Additional Notes")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>Additional Notes</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("Additional Notes") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("Additional Notes") && (
              <div className="p-4 border-t-2 border-black">
                <p className="text-sm">{supplier.additionalNotes}</p>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="border-2 border-black p-4">
            <div className="font-bold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Download Documents
            </div>
            <div className="space-y-2">
              {supplier.documents.map((doc, index) => (
                <a key={index} href={doc.url} className="block text-sm hover:underline">
                  - {doc.name}
                </a>
              ))}
            </div>
          </div>

          <Button className="w-full border-2 border-black bg-transparent" variant="outline">
            Contact Supplier
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
