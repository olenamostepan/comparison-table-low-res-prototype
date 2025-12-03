"use client"

import { useState, Fragment, useEffect } from "react"
import { Info, ChevronUp, ChevronDown } from "lucide-react"
import type { Supplier, Category } from "@/types/tender"
import { ChevronDown as ChevronDownIcon, ChevronRight, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ComparisonTableProps {
  suppliers: Supplier[]
  categories: Category[]
  onSupplierClick: (supplier: Supplier) => void
  onShowKeyFields?: () => void
  onExportCsv?: () => void
}

function isTBCOrNotRequired(value: string): boolean {
  return value.toLowerCase().includes("tbc") || value.toLowerCase().includes("not required")
}

export function ComparisonTable({ suppliers, categories, onSupplierClick, onShowKeyFields, onExportCsv }: ComparisonTableProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(() => categories.map((c) => c.name))
  const [selectedScoreModal, setSelectedScoreModal] = useState<{category: string, supplier: string, isGeneralScore?: boolean} | null>(null)
  const [selectedOMApproach, setSelectedOMApproach] = useState<{supplierName: string, text: string} | null>(null)
  const [tooltipVisible, setTooltipVisible] = useState<{field: string, supplierId: string} | null>(null)
  const [activeFilter, setActiveFilter] = useState<"financial" | "relevance" | "speed">("relevance")

  // Reorder categories based on active filter
  const getOrderedCategories = () => {
    const categoryMap = new Map(categories.map(c => [c.name, c]))
    const ordered: Category[] = []
    
    if (activeFilter === "relevance") {
      if (categoryMap.has("Supplier relevance")) ordered.push(categoryMap.get("Supplier relevance")!)
      if (categoryMap.has("Financial scope")) ordered.push(categoryMap.get("Financial scope")!)
      if (categoryMap.has("Speed")) ordered.push(categoryMap.get("Speed")!)
      if (categoryMap.has("Technical scope")) ordered.push(categoryMap.get("Technical scope")!)
    } else if (activeFilter === "financial") {
      if (categoryMap.has("Financial scope")) ordered.push(categoryMap.get("Financial scope")!)
      if (categoryMap.has("Supplier relevance")) ordered.push(categoryMap.get("Supplier relevance")!)
      if (categoryMap.has("Speed")) ordered.push(categoryMap.get("Speed")!)
      if (categoryMap.has("Technical scope")) ordered.push(categoryMap.get("Technical scope")!)
    } else if (activeFilter === "speed") {
      if (categoryMap.has("Speed")) ordered.push(categoryMap.get("Speed")!)
      if (categoryMap.has("Supplier relevance")) ordered.push(categoryMap.get("Supplier relevance")!)
      if (categoryMap.has("Financial scope")) ordered.push(categoryMap.get("Financial scope")!)
      if (categoryMap.has("Technical scope")) ordered.push(categoryMap.get("Technical scope")!)
    }
    
    // Add any remaining categories that weren't in the map
    categories.forEach(cat => {
      if (!ordered.find(c => c.name === cat.name)) {
        ordered.push(cat)
      }
    })
    
    return ordered
  }

  const orderedCategories = getOrderedCategories()

  // Get general score based on active filter
  const getGeneralScore = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId)
    if (supplier?.categoryScores) {
      return supplier.categoryScores[activeFilter]
    }
    return 0
  }

  useEffect(() => {
    // Collapse all categories except the one matching the active filter
    let categoryToExpand = ""
    if (activeFilter === "relevance") {
      categoryToExpand = "Supplier relevance"
    } else if (activeFilter === "financial") {
      categoryToExpand = "Financial scope"
    } else if (activeFilter === "speed") {
      categoryToExpand = "Speed"
    }
    
    if (categoryToExpand) {
      setExpandedCategories([categoryToExpand])
    } else {
      setExpandedCategories(orderedCategories.map((c) => c.name))
    }
  }, [activeFilter])

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((name) => name !== categoryName) : [...prev, categoryName],
    )
  }

  const openScoreModal = (category: string, supplier: string) => {
    setSelectedScoreModal({ category, supplier })
  }

  // Get score from supplier data or mock data
  const getScore = (category: string, supplierId: string, fieldKey?: string) => {
    const supplier = suppliers.find(s => s.id === supplierId)
    
    // Handle Supplier relevance category
    if (category === "Supplier relevance") {
      if (supplier?.supplierRelevance && fieldKey) {
        const relevance = supplier.supplierRelevance as any
        return relevance[fieldKey] ?? 0
      }
      if (supplier?.supplierRelevance) {
        return supplier.supplierRelevance.generalScore
      }
    }
    
    // Handle category scores based on active filter and category name
    if (supplier?.categoryScores) {
      if (category === "Financial scope") {
        return supplier.categoryScores.financial
      }
      if (category === "Supplier relevance") {
        return supplier.categoryScores.relevance
      }
      if (category === "Speed") {
        return supplier.categoryScores.speed
      }
      if (category === "Technical scope") {
        return supplier.categoryScores.technical
      }
    }
    
    // Fallback to mock scoring data for other categories
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
    <div className="flex flex-col items-start gap-4 self-stretch rounded-lg border border-[#F3F4F6] bg-white" style={{ padding: '32px 24px 16px 24px' }}>
      <div className="flex items-center justify-between gap-3 w-full">
        <h2 className="text-[#1E2832] font-extrabold" style={{ fontSize: '20px', lineHeight: 'normal' }}>Detailed Comparison</h2>
        <div className="flex items-center gap-6">
          {onShowKeyFields && (
            <button
              onClick={onShowKeyFields}
              className="flex items-center gap-1 text-sm text-[#1C75BC] hover:underline font-bold"
              style={{ fontSize: '14px', lineHeight: 'normal' }}
            >
              <Info className="h-4 w-4" />
              Key fields explained
            </button>
          )}
          {onExportCsv && (
            <button 
              onClick={onExportCsv} 
              className="flex h-10 px-3 justify-center items-center gap-4 rounded-lg border border-[#D3D7DC] bg-[#F9FAFB] text-[#1E2832] hover:bg-gray-100"
              style={{ fontSize: '14px', fontWeight: 700, lineHeight: 'normal' }}
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-3">
        <div className="text-[14px] text-[#4D5761]">Filter by:</div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter("relevance")}
            className={`px-4 py-2 rounded-lg text-[14px] font-bold transition-colors ${
              activeFilter === "relevance"
                ? 'bg-white text-[#29b273] border border-[#29b273]'
                : 'bg-[#F9FAFB] text-[#1E2832] border border-[#D3D7DC]'
            }`}
          >
            Relevance
          </button>
          <button
            onClick={() => setActiveFilter("financial")}
            className={`px-4 py-2 rounded-lg text-[14px] font-bold transition-colors ${
              activeFilter === "financial"
                ? 'bg-white text-[#29b273] border border-[#29b273]'
                : 'bg-[#F9FAFB] text-[#1E2832] border border-[#D3D7DC]'
            }`}
          >
            Financial
          </button>
          <button
            onClick={() => setActiveFilter("speed")}
            className={`px-4 py-2 rounded-lg text-[14px] font-bold transition-colors ${
              activeFilter === "speed"
                ? 'bg-white text-[#29b273] border border-[#29b273]'
                : 'bg-[#F9FAFB] text-[#1E2832] border border-[#D3D7DC]'
            }`}
          >
            Speed
          </button>
        </div>
      </div>

      <div style={{ marginLeft: '-24px', marginRight: '-24px', paddingLeft: '24px', paddingRight: '0', overflowX: 'auto', width: 'calc(100% + 48px)', position: 'relative' }}>
        <table style={{ width: '100%', minWidth: `${200 + (suppliers.length * 180)}px`, margin: '0', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <tbody>
            {orderedCategories.map((category) => {
              const isExpanded = expandedCategories.includes(category.name)
              return (
                <Fragment key={category.name}>
                  {/* Category header row */}
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td
                      className="p-3 pl-4 border-r border-gray-200 sticky font-bold text-sm cursor-pointer select-none text-[#1E2832]"
                      style={{ minWidth: '200px', width: '200px', left: '0', position: 'sticky', backgroundColor: '#f9fafb', zIndex: 30, boxShadow: '2px 0 4px rgba(0,0,0,0.05)' }}
                    onClick={() => toggleCategory(category.name)}
                  >
                      <span className="inline-flex items-center gap-2">
                        {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        {category.name}
                      </span>
                    </td>
                    {suppliers.map((supplier, index) => (
                      <td
                        key={`header-${category.name}-${supplier.id}`}
                        className="p-3 text-sm font-semibold text-[#1E2832] border-r border-gray-200"
                        style={{ minWidth: '180px', width: '180px', borderRight: index === suppliers.length - 1 ? 'none' : '1px solid #e5e7eb' }}
                      >
                        {supplier.name}
                      </td>
                    ))}
                  </tr>

                         {/* Score Results row - first in each category */}
                         {isExpanded && (
                           <tr className="border-b border-gray-200 bg-white hover:bg-blue-50 group">
                      <td className="p-3 pl-8 border-r border-gray-200 sticky group-hover:bg-blue-50 text-sm leading-tight font-medium text-[#4D5761]"
                          style={{ minWidth: '200px', width: '200px', left: '0', position: 'sticky', backgroundColor: 'white', zIndex: 30, boxShadow: '2px 0 4px rgba(0,0,0,0.05)' }}>
                        Score Results
                      </td>
                      {suppliers.map((supplier, index) => (
                        <td
                          key={`scores-${category.name}-${supplier.id}`}
                          className="p-3 border-r border-gray-200 text-sm leading-tight"
                          style={{ minWidth: '180px', width: '180px', borderRight: index === suppliers.length - 1 ? 'none' : '1px solid #e5e7eb' }}
                        >
                          <button
                            onClick={() => openScoreModal(category.name, supplier.name)}
                            className="text-[#1C75BC] hover:text-[#1C75BC] hover:underline cursor-pointer font-bold"
                            style={{ fontSize: '14px', lineHeight: 'normal' }}
                          >
                            {getScore(category.name, supplier.id)}/5
                          </button>
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Field rows */}
                         {isExpanded && category.fields.map((field) => (
                           <tr key={`${category.name}-${field.label}`} className="border-b border-gray-200 bg-white hover:bg-blue-50 group">
                             <td className="p-3 pl-8 border-r border-gray-200 sticky group-hover:bg-blue-50 text-sm leading-tight font-medium text-[#4D5761]"
                                 style={{ minWidth: '200px', width: '200px', left: '0', position: 'sticky', backgroundColor: 'white', zIndex: 30, boxShadow: '2px 0 4px rgba(0,0,0,0.05)' }}>
                               <div className="flex items-center gap-1">
                                 <span>{field.label}</span>
                                 {field.tooltip && (
                                   <div className="relative inline-block">
                                     <button
                                       className="text-[#1C75BC] hover:text-[#004b75]"
                                       onMouseEnter={() => setTooltipVisible({ field: `${field.key}-header`, supplierId: 'header' })}
                                       onMouseLeave={() => setTooltipVisible(null)}
                                     >
                                       <Info size={14} />
                                     </button>
                                     {tooltipVisible?.field === `${field.key}-header` && tooltipVisible?.supplierId === 'header' && (
                                       <div
                                         className="absolute z-50 w-64 p-3 text-xs bg-white border border-[#d3d7dc] rounded-lg shadow-lg"
                                         style={{
                                           bottom: "100%",
                                           left: "50%",
                                           transform: "translateX(-50%)",
                                           marginBottom: "5px",
                                         }}
                                       >
                                         <div className="whitespace-pre-line text-[#4d5761]">{field.tooltip}</div>
                                         <div
                                           className="absolute w-2 h-2 bg-white border-r border-b border-[#d3d7dc]"
                                           style={{
                                             bottom: "-6px",
                                             left: "50%",
                                             transform: "translateX(-50%) rotate(45deg)",
                                           }}
                                         />
                                       </div>
                                     )}
                                   </div>
                                 )}
                               </div>
                             </td>
                             {suppliers.map((supplier, index) => {
                               // Handle Supplier relevance scores
                               let value: string | number = "—"
                               if (category.name === "Supplier relevance" && supplier.supplierRelevance) {
                                 const relevance = supplier.supplierRelevance as any
                                 value = relevance[field.key] ?? "—"
                               } else {
                                 value = supplier.fields[field.key as keyof typeof supplier.fields] || "—"
                                 // Convert TRUE/FALSE to Yes/No for better readability
                                 if (typeof value === "string") {
                                   if (value.toUpperCase() === "TRUE") value = "Yes"
                                   if (value.toUpperCase() === "FALSE") value = "No"
                                 }
                               }
                               
                               // Handle long O&M approach text
                               const isOMApproach = field.key === "oMApproach"
                               const isLongText = typeof value === "string" && value.length > 150
                               const truncatedValue = isLongText ? value.substring(0, 150) + "..." : value
                               const isScore = field.isScore || false
                               
                          return (
                                 <td
                                   key={`${category.name}-${field.label}-${supplier.id}`}
                                   className="p-3 border-r border-gray-200 text-sm leading-tight text-[#4D5761]"
                                   style={{ minWidth: '180px', width: '180px', maxWidth: '180px', borderRight: index === suppliers.length - 1 ? 'none' : '1px solid #e5e7eb' }}
                                 >
                                   {isScore && value !== "—" ? (
                                     <span className="text-[#1E2832]"
                                       style={{ fontSize: '14px', lineHeight: 'normal' }}
                                     >
                                       {value}/5
                                     </span>
                                   ) : isOMApproach && isLongText ? (
                                     <div className="flex flex-col gap-1">
                                       <span
                                         className="line-clamp-3"
                                         style={{ fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                                       >
                                         {truncatedValue}
                                       </span>
                                       <button
                                         onClick={() => setSelectedOMApproach({ supplierName: supplier.name, text: value as string })}
                                         className="text-[#1C75BC] hover:underline font-bold text-left text-sm self-start"
                                         style={{ fontSize: '14px', lineHeight: 'normal' }}
                                       >
                                         Read more
                                       </button>
                                     </div>
                                   ) : (
                                     <span
                                       className={
                                         isTBCOrNotRequired(value as string)
                                           ? "bg-orange-100 text-orange-700 px-2 py-1 inline-block rounded"
                                           : ""
                                       }
                                       style={isTBCOrNotRequired(value as string) ? { fontSize: '14px' } : {}}
                                     >
                                {value}
                              </span>
                                   )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                </Fragment>
              )
            })}
            {/* Price row */}
            <tr className="border-b border-gray-200 bg-white hover:bg-blue-50 text-sm group">
              <td className="p-3 pl-8 border-r border-gray-200 sticky group-hover:bg-blue-50 text-sm leading-tight font-medium text-[#4D5761]"
                  style={{ minWidth: '200px', width: '200px', left: '0', position: 'sticky', backgroundColor: 'white', zIndex: 30, boxShadow: '2px 0 4px rgba(0,0,0,0.05)' }}>Price</td>
              {suppliers.map((supplier, index) => (
                <td key={`price-${supplier.id}`} className="p-3 border-r border-gray-200 text-sm leading-tight font-bold text-[#1E2832]"
                    style={{ minWidth: '180px', width: '180px', borderRight: index === suppliers.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                  £{supplier.price.toLocaleString()}
                </td>
              ))}
            </tr>
            {/* General score row */}
            <tr className="border-b border-gray-200 bg-white hover:bg-blue-50 text-sm group">
              <td className="p-3 pl-8 border-r border-gray-200 sticky group-hover:bg-blue-50 text-sm leading-tight font-medium text-[#4D5761]"
                  style={{ minWidth: '200px', width: '200px', left: '0', position: 'sticky', backgroundColor: 'white', zIndex: 30, boxShadow: '2px 0 4px rgba(0,0,0,0.05)' }}>General score</td>
              {suppliers.map((supplier, index) => (
                <td key={`general-score-${supplier.id}`} className="p-3 border-r border-gray-200 text-sm leading-tight"
                    style={{ minWidth: '180px', width: '180px', borderRight: index === suppliers.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                  <button
                    onClick={() => {
                      const categoryName = activeFilter === "relevance" ? "Supplier relevance" : activeFilter === "financial" ? "Financial scope" : "Speed"
                      setSelectedScoreModal({ category: categoryName, supplier: supplier.name, isGeneralScore: true })
                    }}
                    className="text-[#1C75BC] hover:text-[#1C75BC] hover:underline cursor-pointer font-bold"
                    style={{ fontSize: '14px', lineHeight: 'normal' }}
                  >
                    {getGeneralScore(supplier.id)}/5
                  </button>
                </td>
              ))}
            </tr>
                   {/* Contact CTA row */}
                   <tr className="border-b border-gray-200 bg-white text-sm group">
                     <td className="p-3 pl-8 border-r border-gray-200 sticky text-sm leading-tight font-medium text-[#4D5761]"
                         style={{ minWidth: '200px', width: '200px', left: '0', position: 'sticky', backgroundColor: 'white', zIndex: 30, boxShadow: '2px 0 4px rgba(0,0,0,0.05)' }}>Contact</td>
                     {suppliers.map((supplier, index) => (
                       <td key={`contact-${supplier.id}`} className="p-3 border-r border-gray-200 text-sm leading-tight"
                           style={{ minWidth: '180px', width: '180px', borderRight: index === suppliers.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                         <button
                           className="w-full flex h-10 px-4 flex-col justify-center items-center gap-2 rounded-lg bg-[#29B273] text-white hover:bg-[#239f63]"
                           style={{ boxShadow: '0 2px 0 0 rgba(0, 0, 0, 0.02)', fontSize: '14px', fontWeight: 700, lineHeight: 'normal' }}
                           onClick={() => {/* placeholder for contact action */}}
                         >
                           Contact supplier
                         </button>
                       </td>
                     ))}
                   </tr>
          </tbody>
        </table>
      </div>

      {/* Score Explanation Modal */}
      <Dialog open={!!selectedScoreModal} onOpenChange={() => setSelectedScoreModal(null)}>
        <DialogContent 
          className="flex flex-col items-start rounded-lg border border-[#F3F4F6] bg-white !max-w-[850px] w-full max-h-[90vh] overflow-y-auto"
          style={{ width: '850px', padding: '29px 32px', gap: '20px' }}
        >
          <DialogHeader>
            <DialogTitle 
              className="font-extrabold text-[#1E2832]"
              style={{ fontSize: '20px', lineHeight: 'normal' }}
            >
              {selectedScoreModal?.supplier}'s Score for {selectedScoreModal?.category}
            </DialogTitle>
          </DialogHeader>
          
          {selectedScoreModal && (
            <div className="flex flex-col items-start w-full" style={{ gap: '20px' }}>
              {/* Why this has scored field */}
              <div 
                className="flex flex-col items-start self-stretch rounded-lg border border-[#F3F4F6] bg-[#F9FAFB]"
                style={{ padding: '16px', gap: '16px' }}
              >
                <h3 
                  className="font-bold text-[#1E2832]"
                  style={{ fontSize: '18px', lineHeight: 'normal' }}
                >
                  Why this has scored {getScore(selectedScoreModal.category, suppliers.find(s => s.name === selectedScoreModal.supplier)?.id || "1")}/5.
                </h3>
                
                <div className="flex flex-col gap-3 text-sm">
                  <p>
                    {getScoreExplanation(selectedScoreModal.category, suppliers.find(s => s.name === selectedScoreModal.supplier)?.id || "1")}
                  </p>
                  <p>
                    This information has been generated by our AI-driven ranking engine, and we are happy to provide more detail into the thoughts if needed.
                  </p>
                  
                  {/* Score Breakdown - only show for General Score */}
                  {selectedScoreModal.isGeneralScore ? (
                    <div className="mt-4 p-4 rounded-lg border border-[#F3F4F6] bg-white">
                      <div className="text-sm font-semibold text-[#1E2832] mb-2">Score Breakdown:</div>
                      <div className="flex flex-col gap-2 text-sm">
                        {activeFilter === "relevance" ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-[#4D5761]">Supplier</span>
                              <span className="font-bold text-[#1E2832]">65%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#4D5761]">Bid</span>
                              <span className="font-bold text-[#1E2832]">35%</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span className="text-[#4D5761]">Supplier</span>
                              <span className="font-bold text-[#1E2832]">35%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#4D5761]">Bid</span>
                              <span className="font-bold text-[#1E2832]">65%</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* What you might want to consider field */}
              <div 
                className="flex flex-col items-start self-stretch rounded-lg border border-[#FBDDD2] bg-[#FDEEE9]"
                style={{ padding: '16px', gap: '8px' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-orange-300 rounded-full flex items-center justify-center text-xs">⚠</div>
                  <h4 
                    className="font-bold text-[#E9571F]"
                    style={{ fontSize: '14px', lineHeight: 'normal' }}
                  >
                    What you might want to consider
                  </h4>
                </div>
                <p className="text-sm text-left">
                  We only ask for 4 pricing items, so it's important you understand that different installers break their prices down differently. These breakdowns are to illustrate how they have reached their price and are not directly comparable.
                </p>
              </div>

              {/* Score Results section */}
              <div className="flex flex-col items-start self-stretch">
                <h4 
                  className="font-bold text-[#1E2832] mb-3"
                  style={{ fontSize: '18px', lineHeight: 'normal' }}
                >
                  Score Results
                </h4>
                <div className="flex flex-col items-start self-stretch">
                  {suppliers.map((supplier, index) => (
                    <div 
                      key={supplier.id} 
                      className="flex justify-between items-center self-stretch border-t border-b border-[#D3D7DC]"
                      style={{ padding: '12px 16px', marginTop: index > 0 ? '-1px' : '0' }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm">{supplier.name}</span>
                      </div>
                      <span className="text-sm font-bold">
                        {getScore(selectedScoreModal.category, supplier.id)}/5
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What does this score mean field */}
              <div 
                className="flex flex-col items-start self-stretch rounded-lg border border-[#D2E3F2] bg-[#E8F1F8]"
                style={{ padding: '16px', gap: '8px' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs">?</div>
                  <h4 
                    className="font-bold text-[#004B75]"
                    style={{ fontSize: '14px', lineHeight: 'normal' }}
                  >
                    What does this score mean?
                  </h4>
                </div>
                <p className="text-sm text-left">
                  We use our AI-driven ranking engine to analyse bids and identify key points to differentiate them from others. Our ranking favours installers who detail their bids clearly.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* O&M Approach Modal */}
      <Dialog open={!!selectedOMApproach} onOpenChange={() => setSelectedOMApproach(null)}>
        <DialogContent 
          className="flex flex-col items-start rounded-lg border border-[#F3F4F6] bg-white !max-w-[850px] w-full max-h-[90vh] overflow-y-auto"
          style={{ width: '850px', padding: '32px', gap: '20px' }}
        >
          <DialogHeader>
            <DialogTitle 
              className="font-extrabold text-[#1E2832]"
              style={{ fontSize: '20px', lineHeight: 'normal' }}
            >
              O&M Approach - {selectedOMApproach?.supplierName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOMApproach && (
            <div className="flex flex-col items-start w-full">
              <div 
                className="flex flex-col items-start self-stretch rounded-lg border border-[#F3F4F6] bg-[#F9FAFB]"
                style={{ padding: '16px', gap: '12px' }}
              >
                <p 
                  className="text-sm text-[#4D5761] whitespace-pre-wrap"
                  style={{ lineHeight: '1.6' }}
                >
                  {selectedOMApproach.text}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}