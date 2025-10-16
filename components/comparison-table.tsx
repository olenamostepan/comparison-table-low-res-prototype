"use client"

import { useState, Fragment } from "react"
import { Info, ChevronUp, ChevronDown } from "lucide-react"
import type { Supplier } from "@/types/tender"
import { categories } from "@/lib/tender-data"
import { ChevronDown as ChevronDownIcon, ChevronRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ComparisonTableProps {
  suppliers: Supplier[]
  onSupplierClick: (supplier: Supplier) => void
  onShowKeyFields?: () => void
  onExportCsv?: () => void
}

function isTBCOrNotRequired(value: string): boolean {
  return value.toLowerCase().includes("tbc") || value.toLowerCase().includes("not required")
}

export function ComparisonTable({ suppliers, onSupplierClick, onShowKeyFields, onExportCsv }: ComparisonTableProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categories.map((c) => c.name))
  const [selectedScoreModal, setSelectedScoreModal] = useState<{category: string, supplier: string} | null>(null)

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((name) => name !== categoryName) : [...prev, categoryName],
    )
  }

  const openScoreModal = (category: string, supplier: string) => {
    setSelectedScoreModal({ category, supplier })
  }

  // Mock scoring data - in real app this would come from props or API
  const getScore = (category: string, supplierId: string) => {
    const scores: Record<string, Record<string, number>> = {
      "Scope": { "1": 4, "2": 3, "3": 5, "4": 3 },
      "Costs": { "1": 3, "2": 4, "3": 2, "4": 4 },
      "Compliance": { "1": 4, "2": 4, "3": 3, "4": 5 }
    }
    return scores[category]?.[supplierId] || 3
  }

  const getScoreExplanation = (category: string, supplierId: string) => {
    const explanations: Record<string, Record<string, string>> = {
      "Scope": {
        "1": "The scope definition is comprehensive with clear system type specification and detailed manufacturer information. The number of lights is clearly stated at 2,494 units. However, the scope could benefit from more detailed installation specifications.",
        "2": "Good scope definition with multiple manufacturer options provided. The system type is clearly defined as full fixture replacement. The supplier offers flexibility in manufacturer selection which adds value to the proposal.",
        "3": "Excellent scope definition with proprietary product offering. The supplier provides their own GLT product which shows technical expertise. Clear specification of 2,494 lights and comprehensive system type definition.",
        "4": "Strong scope with multiple manufacturer options including Philips and LEDVANCE. Clear system type definition and accurate light count. The supplier demonstrates good product knowledge and selection."
      },
      "Costs": {
        "1": "Labour costs are clearly detailed at £156,573.32 with material costs of £180,131.90. Installation costs are included which adds value. However, the total cost is on the higher side compared to other bids.",
        "2": "Competitive pricing with labour costs at £132,637.00 and materials at £163,937.05. Installation costs included. This represents good value for money with reasonable cost breakdown.",
        "3": "Higher material costs at £230,884.60 with labour around £160,000. Installation costs not included which reduces value. The pricing structure could be more competitive.",
        "4": "Excellent pricing with low material costs at £103,607.47 and labour at £166,682.23. Installation costs included. This represents the best value proposition among all bids."
      },
      "Compliance": {
        "1": "Meets all technical and tender requirements. Control strategy complies with building regulations. Emergency lighting installation included. Strong compliance across all areas.",
        "2": "Good compliance with technical and tender requirements met. Control strategy meets building regulations. Emergency lighting installation included. Solid performance across compliance areas.",
        "3": "Meets technical requirements and building regulations. However, does not meet tender requirements which is a significant concern. Emergency lighting design only, not installation.",
        "4": "Excellent compliance with all technical and tender requirements met. Control strategy fully compliant with building regulations. Comprehensive emergency lighting solution included."
      }
    }
    return explanations[category]?.[supplierId] || "Standard compliance and performance across all evaluated criteria."
  }

  return (
    <div className="border-2 border-black bg-white">
      <div className="p-6 border-b-2 border-black flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Detailed Comparison</h2>
        <div className="flex items-center gap-3">
          {onShowKeyFields && (
            <button
              onClick={onShowKeyFields}
              className="flex items-center gap-1 text-sm underline underline-offset-2"
            >
              <Info className="h-4 w-4" />
              Key fields explained
            </button>
          )}
          {onExportCsv && (
            <Button onClick={onExportCsv} className="border-2 border-black bg-transparent" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <tbody>
            {categories.map((category) => {
              const isExpanded = expandedCategories.includes(category.name)
              return (
                <Fragment key={category.name}>
                  {/* Category header row */}
                  <tr className="border-b border-gray-300">
                    <td
                      className="p-2 pl-4 border-r-2 border-black sticky left-0 z-10 font-bold text-sm cursor-pointer select-none w-64"
                      onClick={() => toggleCategory(category.name)}
                    >
                      <span className="inline-flex items-center gap-2">
                        {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        {category.name}
                      </span>
                    </td>
                    {suppliers.map((supplier) => (
                      <td
                        key={`header-${category.name}-${supplier.id}`}
                        className="p-2 text-sm font-bold text-gray-800 border-r border-gray-200 last:border-r-0 text-center w-56"
                      >
                        {supplier.name}
                      </td>
                    ))}
                  </tr>

                  {/* Score Results row - first in each category */}
                  {isExpanded && (
                    <tr className="border-b border-gray-200">
                      <td className="p-2 pl-8 border-r-2 border-black bg-gray-50 sticky left-0 z-10 text-sm w-64 leading-tight font-medium">
                        Score Results
                      </td>
                      {suppliers.map((supplier) => (
                        <td
                          key={`scores-${category.name}-${supplier.id}`}
                          className="p-2 border-r border-gray-200 last:border-r-0 text-sm w-56 leading-tight"
                        >
                          <button
                            onClick={() => openScoreModal(category.name, supplier.name)}
                            className="text-blue-600 hover:text-blue-800 underline underline-offset-2 cursor-pointer"
                          >
                            {getScore(category.name, supplier.id)}/5
                          </button>
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Field rows */}
                  {isExpanded && category.fields.map((field) => (
                    <tr key={`${category.name}-${field.label}`} className="border-b border-gray-200">
                      <td className="p-2 pl-8 border-r-2 border-black bg-gray-50 sticky left-0 z-10 text-sm w-64 leading-tight font-medium">
                        {field.label}
                      </td>
                      {suppliers.map((supplier) => {
                        const value = supplier.fields[field.key as keyof typeof supplier.fields] || "—"
                        return (
                          <td
                            key={`${category.name}-${field.label}-${supplier.id}`}
                            className={`p-2 border-r border-gray-200 last:border-r-0 text-sm w-56 leading-tight ${
                              isTBCOrNotRequired(value) ? "py-0.5" : ""
                            }`}
                          >
                            <span
                              className={
                                isTBCOrNotRequired(value)
                                  ? "bg-yellow-200 px-2 py-1 inline-block text-xs"
                                  : ""
                              }
                            >
                              {value}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </Fragment>
              )
            })}
            {/* Price row */}
            <tr className="border-b border-gray-300 text-sm">
              <td className="p-2 pl-8 border-r-2 border-black bg-gray-50 sticky left-0 z-10 text-sm w-64 leading-tight font-medium">Price</td>
              {suppliers.map((supplier) => (
                <td key={`price-${supplier.id}`} className="p-2 border-r border-gray-300 last:border-r-0 text-sm w-56 leading-tight font-bold">
                  £{supplier.price.toLocaleString()}
                </td>
              ))}
            </tr>
            {/* Contact CTA row */}
            <tr className="border-b border-gray-300 text-sm">
              <td className="p-2 pl-8 border-r-2 border-black bg-gray-50 sticky left-0 z-10 text-sm w-64 leading-tight font-medium">Contact</td>
              {suppliers.map((supplier) => (
                <td key={`contact-${supplier.id}`} className="p-2 border-r border-gray-300 last:border-r-0 text-sm w-56 leading-tight">
                  <Button
                    size="sm"
                    className="border-2 border-black bg-black text-white hover:bg-black/90 text-xs"
                    onClick={() => {/* placeholder for contact action */}}
                  >
                    Contact supplier
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Score Explanation Modal */}
      <Dialog open={!!selectedScoreModal} onOpenChange={() => setSelectedScoreModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedScoreModal?.supplier}'s Score for {selectedScoreModal?.category}
            </DialogTitle>
          </DialogHeader>
          
          {selectedScoreModal && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                  TEST
                </div>
                <h3 className="font-semibold">Why this has scored {getScore(selectedScoreModal.category, suppliers.find(s => s.name === selectedScoreModal.supplier)?.id || "1")}/5.</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <p>
                  {getScoreExplanation(selectedScoreModal.category, suppliers.find(s => s.name === selectedScoreModal.supplier)?.id || "1")}
                </p>
                <p>
                  This information has been generated by our AI-driven ranking engine, and we are happy to provide more detail into the thoughts if needed.
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Score Results</h4>
                <div className="space-y-1">
                  {suppliers.map((supplier) => (
                    <div key={supplier.id} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm">{supplier.name}</span>
                      <span className="ml-auto text-sm font-bold">
                        {getScore(selectedScoreModal.category, supplier.id)}/5
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs">?</div>
                  <h4 className="font-semibold">What does this score mean?</h4>
                </div>
                <p className="text-sm">
                  We use our AI-driven ranking engine to analyse bids and identify key points to differentiate them from others. Our ranking favours installers who detail their bids clearly.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}