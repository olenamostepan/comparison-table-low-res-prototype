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
  const [expandedSections, setExpandedSections] = useState<string[]>(["Price", "Financial Model"])

  if (!supplier) return null

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Image
              src={supplier.logo || "/placeholder.svg"}
              alt={`${supplier.name} logo`}
              width={48}
              height={48}
            />
            <SheetTitle className="text-2xl">{supplier.name}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Download Documents CTA at top */}
          <Button className="w-full border-2 border-black bg-transparent" variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Download their pricing documents
          </Button>
          {/* Contact Supplier CTA */}
          <Button className="w-full border-2 border-black bg-black text-white hover:bg-black/90">
            Contact Supplier
          </Button>
          {/* Price */}
          <div>
            <button
              onClick={() => toggleSection("Price")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>Price</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("Price") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("Price") && (
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-sm font-medium">Total CAPEX</div>
                  <div className="text-sm">£100,000</div>
                </div>
              </div>
            )}
          </div>

          {/* Financial Model */}
          <div>
            <button
              onClick={() => toggleSection("Financial Model")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>Financial Model</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("Financial Model") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("Financial Model") && (
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-sm font-medium">PPA Term</div>
                  <div className="text-sm">20 years</div>
                </div>
                <div>
                  <div className="text-sm font-medium">First Year Cost</div>
                  <div className="text-sm">£511.11</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Tariff Rate</div>
                  <div className="text-sm">£0.16/kWh</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Annual Increase</div>
                  <div className="text-sm">2.5%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Maintenance Cost</div>
                  <div className="text-sm">£150 per year</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Ten Year Savings</div>
                  <div className="text-sm">-£607.76</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Twenty Year Savings</div>
                  <div className="text-sm">-£1,150.40</div>
                </div>
              </div>
            )}
          </div>

          {/* How do they compare? */}
          <div>
            <button
              onClick={() => toggleSection("How do they compare?")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>How do they compare?</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("How do they compare?") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("How do they compare?") && (
              <div className="p-4 space-y-3">
                <div className="text-sm">
                  Cannot compare as this is the only bid provided in the dataset
                </div>
                <div className="text-sm">
                  PPA model suggests focus on zero upfront cost with long-term energy savings potential
                </div>
              </div>
            )}
          </div>

          {/* Additional costs */}
          <div>
            <button
              onClick={() => toggleSection("Additional costs")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>Additional costs</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("Additional costs") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("Additional costs") && (
              <div className="p-4 space-y-3">
                <div className="text-sm">
                  Maintenance costs of £150 per year
                </div>
                <div className="text-sm">
                  Battery storage included in the offer (capacity not specified)
                </div>
              </div>
            )}
          </div>

          {/* Why is this important? */}
          <div>
            <button
              onClick={() => toggleSection("Why is this important?")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>Why is this important?</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("Why is this important?") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("Why is this important?") && (
              <div className="p-4 space-y-3">
                <div className="text-sm">
                  Integrated battery storage can improve system efficiency and provide backup power capability
                </div>
              </div>
            )}
          </div>

          {/* Activities */}
          <div>
            <button
              onClick={() => toggleSection("Activities")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>Activities</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("Activities") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("Activities") && (
              <div className="p-4 space-y-3">
                <div className="text-sm">
                  Battery storage installation included where other suppliers may not offer this
                </div>
                <div className="text-sm">
                  Insufficient data to determine excluded activities
                </div>
              </div>
            )}
          </div>

          {/* Further information */}
          <div>
            <button
              onClick={() => toggleSection("Further information")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>Further information</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("Further information") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("Further information") && (
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-sm font-medium">Company established</div>
                  <div className="text-sm">2022</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Works completed</div>
                  <div className="text-sm">Over 1000</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Work focus</div>
                  <div className="text-sm">100% commercial work</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Company size</div>
                  <div className="text-sm">Small company (10 employees)</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Key staff</div>
                  <div className="text-sm">Rich Amos noted as "best installer in the world"</div>
                </div>
              </div>
            )}
          </div>

          {/* Maintenance Offering */}
          <div>
            <button
              onClick={() => toggleSection("Maintenance Offering")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>Maintenance Offering</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("Maintenance Offering") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("Maintenance Offering") && (
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-sm font-medium">Annual maintenance cost</div>
                  <div className="text-sm">£150</div>
                </div>
                <div className="text-sm">
                  Specific maintenance details not provided in submission
                </div>
              </div>
            )}
          </div>

          {/* Equipment */}
          <div>
            <button
              onClick={() => toggleSection("Equipment")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>Equipment</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("Equipment") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("Equipment") && (
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-sm font-medium">Solar Panels</div>
                  <div className="text-sm">Insufficient information provided in submission</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Inverters</div>
                  <div className="text-sm">Insufficient information provided in submission</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Warranty</div>
                  <div className="text-sm">No specific warranty information provided in submission</div>
                </div>
              </div>
            )}
          </div>

          {/* Timelines */}
          <div>
            <button
              onClick={() => toggleSection("Timelines")}
              className="w-full p-4 flex items-center justify-between font-bold hover:bg-gray-50"
            >
              <span>Timelines</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expandedSections.includes("Timelines") ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.includes("Timelines") && (
              <div className="p-4 space-y-3">
                <div className="text-sm">
                  Insufficient information provided about specific delivery and lead times
                </div>
              </div>
            )}
          </div>

          {/* Cost & Financial */}
          <div>
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
              <div className="p-4">
                <div className="text-sm font-medium">Total price</div>
                <div className="text-2xl font-bold">£{supplier.price.toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div>
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
              <div className="p-4">
                <p className="text-sm">{supplier.additionalNotes}</p>
              </div>
            )}
          </div>

        </div>
      </SheetContent>
    </Sheet>
  )
}
