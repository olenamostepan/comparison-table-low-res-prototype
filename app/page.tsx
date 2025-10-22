"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SupplierCard } from "@/components/supplier-card"
import { ComparisonTable } from "@/components/comparison-table"
import { BidDetailsModal } from "@/components/bid-details-modal"
import { KeyFieldsModal } from "@/components/key-fields-modal"
import { suppliers, categories } from "@/lib/tender-data"
import type { Supplier } from "@/types/tender"
import Image from "next/image"

export default function TenderComparisonPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [showKeyFields, setShowKeyFields] = useState(false)
  const [showOverviewDetails, setShowOverviewDetails] = useState(false)
  const [showCompareButton, setShowCompareButton] = useState(false)
  const [sortBy, setSortBy] = useState("price")

  useEffect(() => {
    const handleScroll = () => {
      // Show compare button after scrolling past 2 cards (approximately 800px)
      setShowCompareButton(window.scrollY > 800)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTable = () => {
    document.getElementById("comparison-table")?.scrollIntoView({
      behavior: "smooth",
    })
  }

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    if (sortBy === "price") {
      return a.price - b.price
    }
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    }
    return 0
  })

  const exportToCsv = () => {
    const header = ["Category/Field", ...sortedSuppliers.map((s) => s.name)]

    const rows: string[][] = []
    for (const category of categories) {
      // Category row
      rows.push([category.name, ...sortedSuppliers.map(() => "")])
      // Field rows
      for (const field of category.fields) {
        const row: string[] = [field.label]
        for (const supplier of sortedSuppliers) {
          if (field.key === "price") {
            row.push(String(supplier.price))
          } else {
            // @ts-expect-error dynamic access to known keys
            const value = supplier.fields?.[field.key] ?? "—"
            row.push(String(value))
          }
        }
        rows.push(row)
      }
    }

    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tender-comparison.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-t border-b border-[#F3F4F6]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center py-3">
            <button className="flex items-center gap-2 hover:underline text-sm font-extrabold text-[#1E2832]">
              <ArrowLeft className="h-4 w-4" />
              Back to Tenders
            </button>
            
            <button className="flex items-center gap-2 hover:opacity-80">
              <Image 
                src="/site elements/profile.svg" 
                alt="Profile" 
                width={32} 
                height={32}
              />
              <ChevronDown className="h-4 w-4 text-[#1E2832]" />
            </button>
          </div>
        </div>
      </header>

      {/* Project Info Section */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-3">

          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0">
              <Image 
                src="/site elements/Avatar.svg" 
                alt="Project icon" 
                width={48} 
                height={48}
                className="rounded"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-[28px] font-extrabold mb-2 text-[#1E2832] leading-tight">Heat Pump Pilot Kamekestraße</h1>
              <div className="text-sm text-[#4D5761] mb-3">Schenkendorfstraße 29, Müheim an der Ruhr, 45472, DE</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded">RESIDENTIAL</span>
                <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded">OCCUPIED</span>
                <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded">+ 70KW SOLAR</span>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-col items-start gap-4 p-4 rounded-lg border border-[#F3F4F6] bg-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between w-full">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="font-bold text-[#1E2832]">Tender Overview:</div>
                  <button
                    onClick={() => setShowOverviewDetails((v) => !v)}
                    className="text-sm text-[#1C75BC] hover:underline font-bold flex items-center gap-1"
                    style={{ fontSize: '14px', lineHeight: 'normal' }}
                  >
                    {showOverviewDetails ? (
                      <>
                        Hide details
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Show details
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
                <div className="text-sm text-[#4D5761]">
                  <span className="font-semibold">4</span> of <span className="font-semibold">20</span> suppliers submitted
                  (<span className="font-semibold">20% response rate</span>)
                </div>
                {showOverviewDetails && (
                  <div className="mt-3 flex flex-col items-start gap-4 p-3 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB] self-stretch w-full">
                    <ul className="list-disc pl-6 space-y-1 text-sm text-[#4D5761]">
                      <li>5 unavailable (couldn't meet timeline)</li>
                      <li>3 no capacity (project too large)</li>
                      <li>2 planned to submit but didn't</li>
                      <li>1 excluded by CQuel (incomplete pricing)</li>
                      <li>4 submitted and ready to compare ✓</li>
                    </ul>
                    <div className="text-sm text-[#4D5761]">
                      <span>Tender closed: 15 Oct 2025</span>
                      <span className="mx-2">|</span>
                      <span>Duration: 14 days</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="md:ml-6">
                <div className="flex h-6 px-3 items-center gap-1 rounded-[20px] border border-[#1C75BC] bg-[#1C75BC] text-white font-bold" style={{ fontSize: '14px', lineHeight: 'normal' }}>
                  Closed: 15 Oct
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Supplier Cards */}
      <main className="max-w-7xl mx-auto pt-0 px-6 pb-6">
        <div className="flex flex-col items-start gap-4 self-stretch rounded-lg border border-[#F3F4F6] bg-white mb-8" style={{ padding: '32px 24px 16px 24px' }}>
          <div className="w-full flex items-center justify-between">
            <h2 className="text-[#1E2832] font-extrabold" style={{ fontSize: '20px', lineHeight: 'normal' }}>Interim Tender Results</h2>
            <button 
              onClick={scrollToTable} 
              className="flex h-10 px-3 justify-center items-center gap-4 rounded-lg border border-[#D3D7DC] bg-[#F9FAFB] text-[#1E2832] hover:bg-gray-100"
              style={{ fontSize: '14px', fontWeight: 700, lineHeight: 'normal' }}
            >
              Compare Bids
            </button>
          </div>
          <div className="space-y-3 w-full">
            {sortedSuppliers.map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} onViewDetails={setSelectedSupplier} />
            ))}
          </div>
        </div>

        {/* Comparison Table - Auto-reveal on scroll */}
        <div id="comparison-table" className="mt-8">
          <ComparisonTable
            suppliers={sortedSuppliers}
            onSupplierClick={setSelectedSupplier}
            onShowKeyFields={() => setShowKeyFields(true)}
            onExportCsv={exportToCsv}
          />
        </div>
      </main>

      {/* Floating compare button removed */}

      {/* Modals */}
      <BidDetailsModal
        supplier={selectedSupplier}
        open={!!selectedSupplier}
        onOpenChange={(open) => !open && setSelectedSupplier(null)}
      />

      <KeyFieldsModal open={showKeyFields} onOpenChange={setShowKeyFields} />
    </div>
  )
}
