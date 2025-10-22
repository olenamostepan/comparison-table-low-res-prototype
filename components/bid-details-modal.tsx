"use client"

import type { Supplier } from "@/types/tender"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Download } from "lucide-react"
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
  const [activeTab, setActiveTab] = useState<"proposal" | "about">("proposal")
  const [expandedSections, setExpandedSections] = useState<string[]>(["Price"])

  if (!supplier) return null

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-white p-0">
        {/* Header with Logo and Company Name */}
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <SheetTitle 
              className="text-[#1E2832] font-extrabold"
              style={{ fontSize: '24px', lineHeight: 'normal' }}
            >
              {supplier.name}
            </SheetTitle>
            <Image
              src={supplier.logo || "/placeholder.svg"}
              alt={`${supplier.name} logo`}
              width={120}
              height={60}
              className="object-contain"
            />
          </div>
        </SheetHeader>

        {/* Tabs */}
        <div className="flex border-b border-[#F3F4F6] px-6 mt-6">
          <button
            onClick={() => setActiveTab("proposal")}
            className={`pb-3 px-1 font-semibold text-sm relative ${
              activeTab === "proposal" 
                ? "text-[#1E2832] border-b-2 border-[#1E2832]" 
                : "text-[#4D5761]"
            }`}
          >
            Proposal
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`pb-3 px-1 ml-6 font-semibold text-sm relative ${
              activeTab === "about" 
                ? "text-[#1E2832] border-b-2 border-[#1E2832]" 
                : "text-[#4D5761]"
            }`}
          >
            About Company
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* CTAs at top */}
          <button
            className="flex h-10 w-full px-4 justify-center items-center gap-2 rounded-lg bg-[#29B273] text-white hover:bg-[#239f63]"
            style={{ boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.02)', fontSize: '14px', fontWeight: 700, lineHeight: 'normal' }}
          >
            Contact supplier
          </button>
          <button
            className="flex h-10 w-full px-3 justify-center items-center gap-2 rounded-lg border border-[#D3D7DC] bg-[#F9FAFB] text-[#1E2832] hover:bg-gray-100"
            style={{ fontSize: '14px', fontWeight: 700, lineHeight: 'normal' }}
          >
            <Download className="h-4 w-4" />
            Download proposal
          </button>
          {/* Price Section */}
          <div className="border-0">
            <button
              onClick={() => toggleSection("Price")}
              className="w-full py-3 px-0 flex items-center justify-between text-[#1E2832] font-bold hover:opacity-70 transition-opacity"
              style={{ fontSize: '18px', lineHeight: 'normal' }}
            >
              <span>Price</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold">£{supplier.price.toLocaleString()}</span>
                {expandedSections.includes("Price") ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </button>
            {expandedSections.includes("Price") && (
              <div className="pt-3 pb-4 space-y-2">
                <div className="text-sm text-[#4D5761] flex justify-between">
                  <span>Price Breakdown by other factors</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-[#4D5761]">
                  <li>Labour: £21,500</li>
                  <li>Materials: £34,200</li>
                  <li>Health & Safety: £5,800</li>
                  <li>Electrical: £8,150</li>
                  <li>Maintenance: £3,200</li>
                </ul>
                <div className="mt-4 p-3 bg-[#E8F1F8] border border-[#D2E3F2] rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-[#004B75] font-bold text-sm">⚡</span>
                    <div>
                      <div className="font-bold text-sm text-[#1E2832]">How do they compare?</div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-[#4D5761] mt-2">
                        <li>Mid-range price, approximately 9% higher than lowest bid from Carraldo Energy</li>
                        <li>Higher cost likely due to extended warranties and Historic Environment England consultation support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activities */}
          <div className="border-0 border-t border-[#F3F4F6] pt-4">
            <button
              onClick={() => toggleSection("Activities")}
              className="w-full py-3 px-0 flex items-center justify-between text-[#1E2832] font-bold hover:opacity-70 transition-opacity"
              style={{ fontSize: '18px', lineHeight: 'normal' }}
            >
              <span>Activities</span>
              {expandedSections.includes("Activities") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {expandedSections.includes("Activities") && (
              <div className="pt-3 pb-4">
                <ul className="list-disc list-inside space-y-1 text-sm text-[#4D5761]">
                  <li>Includes Historic Environment England consultation support</li>
                  <li>Includes full MCS certification compliance</li>
                  <li>Insurance coverage with £10M public liability included</li>
                </ul>
              </div>
            )}
          </div>

          {/* Further information */}
          <div className="border-0 border-t border-[#F3F4F6] pt-4">
            <button
              onClick={() => toggleSection("Further information")}
              className="w-full py-3 px-0 flex items-center justify-between text-[#1E2832] font-bold hover:opacity-70 transition-opacity"
              style={{ fontSize: '18px', lineHeight: 'normal' }}
            >
              <span>Further information</span>
              {expandedSections.includes("Further information") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {expandedSections.includes("Further information") && (
              <div className="pt-3 pb-4">
                <ul className="list-disc list-inside space-y-1 text-sm text-[#4D5761]">
                  <li>Total project duration of 48 days</li>
                  <li>Installation period of 7 days</li>
                  <li>Commissioning time of 3 days</li>
                  <li>Preferred start date of November 10, 2025</li>
                </ul>
              </div>
            )}
          </div>

          {/* Maintenance Offering */}
          <div className="border-0 border-t border-[#F3F4F6] pt-4">
            <button
              onClick={() => toggleSection("Maintenance Offering")}
              className="w-full py-3 px-0 flex items-center justify-between text-[#1E2832] font-bold hover:opacity-70 transition-opacity"
              style={{ fontSize: '18px', lineHeight: 'normal' }}
            >
              <span>Maintenance Offering</span>
              {expandedSections.includes("Maintenance Offering") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {expandedSections.includes("Maintenance Offering") && (
              <div className="pt-3 pb-4">
                <ul className="list-disc list-inside space-y-1 text-sm text-[#4D5761]">
                  <li>Annual maintenance included in price</li>
                  <li>System expected to generate 72,540 kWh annually</li>
                  <li>Export generation estimated at 25,200 kWh annually</li>
                </ul>
              </div>
            )}
          </div>

          {/* Equipment */}
          <div className="border-0 border-t border-[#F3F4F6] pt-4">
            <button
              onClick={() => toggleSection("Equipment")}
              className="w-full py-3 px-0 flex items-center justify-between text-[#1E2832] font-bold hover:opacity-70 transition-opacity"
              style={{ fontSize: '18px', lineHeight: 'normal' }}
            >
              <span>Equipment</span>
              {expandedSections.includes("Equipment") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {expandedSections.includes("Equipment") && (
              <div className="pt-3 pb-4 space-y-4">
                <div>
                  <div className="font-bold text-sm text-[#1E2832] mb-2">Solar Panels</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-[#4D5761]">
                    <li>Total System Capacity: 85 kWp</li>
                  </ul>
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1E2832] mb-2">Lifespan</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-[#4D5761]">
                    <li>No specific degradation standards provided</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Warranty */}
          <div className="border-0 border-t border-[#F3F4F6] pt-4">
            <button
              onClick={() => toggleSection("Warranty")}
              className="w-full py-3 px-0 flex items-center justify-between text-[#1E2832] font-bold hover:opacity-70 transition-opacity"
              style={{ fontSize: '18px', lineHeight: 'normal' }}
            >
              <span>Warranty</span>
              {expandedSections.includes("Warranty") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {expandedSections.includes("Warranty") && (
              <div className="pt-3 pb-4 space-y-4">
                <div>
                  <div className="font-bold text-sm text-[#1E2832] mb-2">Panel Warranty</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-[#4D5761]">
                    <li>30 years (Covers defects in materials and workmanship)</li>
                  </ul>
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-[#4D5761]">
                    Longest panel warranty among all bidders, exceeding others by 5 years
                  </div>
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1E2832] mb-2">Inverter Warranty</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-[#4D5761]">
                    <li>12 years (Covers manufacturing defects and operational issues)</li>
                  </ul>
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-[#4D5761]">
                    Highest inverter warranty offered among all bidders
                  </div>
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1E2832] mb-2">Installation Warranty</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-[#4D5761]">
                    <li>10 years (Protects against any issues related to installation quality)</li>
                  </ul>
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-[#4D5761]">
                    Double the warranty period offered by most other suppliers
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timelines */}
          <div className="border-0 border-t border-[#F3F4F6] pt-4">
            <button
              onClick={() => toggleSection("Timelines")}
              className="w-full py-3 px-0 flex items-center justify-between text-[#1E2832] font-bold hover:opacity-70 transition-opacity"
              style={{ fontSize: '18px', lineHeight: 'normal' }}
            >
              <span>Timelines</span>
              {expandedSections.includes("Timelines") ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {expandedSections.includes("Timelines") && (
              <div className="pt-3 pb-4 space-y-4">
                <div>
                  <div className="font-bold text-sm text-[#1E2832] mb-2">Delivery time:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-[#4D5761]">
                    <li>38 days Lead time: 5.4 weeks</li>
                  </ul>
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-[#4D5761]">
                    Fastest delivery time among all suppliers, 25% quicker than slowest bidder
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </SheetContent>
    </Sheet>
  )
}
