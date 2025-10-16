"use client"

import { useState, Fragment } from "react"
import { Info } from "lucide-react"
import type { Supplier } from "@/types/tender"
import { categories } from "@/lib/tender-data"
import { ChevronDown, ChevronRight } from "lucide-react"

interface ComparisonTableProps {
  suppliers: Supplier[]
  onSupplierClick: (supplier: Supplier) => void
  onShowKeyFields?: () => void
}

function isTBCOrNotRequired(value: string): boolean {
  return value.toLowerCase().includes("tbc") || value.toLowerCase().includes("not required")
}

export function ComparisonTable({ suppliers, onSupplierClick, onShowKeyFields }: ComparisonTableProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Technical Requirements"])

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((name) => name !== categoryName) : [...prev, categoryName],
    )
  }

  return (
    <div className="border-2 border-black bg-white">
      <div className="p-6 border-b-2 border-black flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Detailed Comparison</h2>
        {onShowKeyFields && (
          <button
            onClick={onShowKeyFields}
            className="flex items-center gap-1 text-sm underline underline-offset-2"
          >
            <Info className="h-4 w-4" />
            Key fields explained
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="p-4 text-left font-bold border-r-2 border-black bg-gray-50 sticky left-0 z-20">Category</th>
              {suppliers.map((supplier) => (
                <th
                  key={supplier.id}
                  className="p-4 text-left font-bold border-r-2 border-black last:border-r-0 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => onSupplierClick(supplier)}
                >
                  {supplier.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const isExpanded = expandedCategories.includes(category.name)
              return (
                <Fragment key={category.name}>
                  <tr
                    className="border-b border-black cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleCategory(category.name)}
                  >
                    <td colSpan={suppliers.length + 1} className="p-4 font-bold">
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        {category.name}
                      </div>
                    </td>
                  </tr>
                  {isExpanded &&
                    category.fields.map((field) => (
                      <tr key={field.key} className="border-b border-gray-300">
                        <td className="p-4 pl-12 border-r-2 border-black bg-gray-50 sticky left-0 z-10">{field.label}</td>
                        {suppliers.map((supplier) => {
                          const value = supplier.fields[field.key as keyof typeof supplier.fields] || "—"
                          return (
                            <td key={supplier.id} className="p-4 border-r border-gray-300 last:border-r-0">
                              <span className={isTBCOrNotRequired(value) ? "bg-yellow-200 px-2 py-1 inline-block" : ""}>
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
          </tbody>
        </table>
      </div>
    </div>
  )
}
