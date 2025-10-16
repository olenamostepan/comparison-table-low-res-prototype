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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 pt-6 pb-3 bg-white">
        <div className="max-w-7xl mx-auto">
          <button className="flex items-center gap-2 mb-4 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </button>

          <div className="mb-4">
            <h1 className="text-3xl font-bold">Project Name: Heat Pump Pilot Kamekestraße</h1>
          </div>

          <div className="mb-4 p-4 border-2 border-black bg-gray-50">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-bold text-xl md:text-base">Tender Overview:</div>
                  <button
                    onClick={() => setShowOverviewDetails((v) => !v)}
                    className="px-3 py-1 border-2 border-black bg-white hover:bg-gray-100 text-sm shrink-0"
                  >
                    {showOverviewDetails ? (
                      <span className="inline-flex items-center gap-1">Hide details <ChevronUp className="h-4 w-4" /></span>
                    ) : (
                      <span className="inline-flex items-center gap-1">Show details <ChevronDown className="h-4 w-4" /></span>
                    )}
                  </button>
                </div>
                <div className="mt-2 text-sm">
                  <span className="font-medium">4</span> of <span className="font-medium">20</span> suppliers submitted
                  (<span className="font-medium">20% response rate</span>)
                </div>
                {showOverviewDetails && (
                  <div className="mt-3">
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>5 unavailable (couldn't meet timeline)</li>
                      <li>3 no capacity (project too large)</li>
                      <li>2 planned to submit but didn't</li>
                      <li>1 excluded by CQuel (incomplete pricing)</li>
                      <li>4 submitted and ready to compare ✓</li>
                    </ul>
                    <div className="mt-4 text-sm">
                      <span>Tender closed: 15 Oct 2025</span>
                      <span className="mx-2">|</span>
                      <span>Duration: 14 days</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="md:ml-6">
                <div className="inline-block px-3 py-1 border-2 border-black bg-white font-semibold">Closed: 15 Oct</div>
              </div>
            </div>
          </div>

          {/* Removed Sort by and moved Key fields explained into Detailed Comparison */}
        </div>
      </header>

      {/* Supplier Cards */}
      <main className="max-w-7xl mx-auto pt-0 px-0 pb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Interim Tender Results</h2>
          <Button onClick={scrollToTable} className="border-2 border-black">
            Compare bids
          </Button>
        </div>
        <div className="space-y-4 mb-6">
          {sortedSuppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} onViewDetails={setSelectedSupplier} />
          ))}
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
