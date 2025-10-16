"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { fieldExplanations } from "@/lib/tender-data"

interface KeyFieldsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyFieldsModal({ open, onOpenChange }: KeyFieldsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Key Fields Explained</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {Object.entries(fieldExplanations).map(([key, explanation]) => (
            <div key={key}>
              <div className="font-bold text-sm mb-1">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </div>
              <div className="text-sm text-gray-700">{explanation}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
