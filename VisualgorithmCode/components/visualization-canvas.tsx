"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shuffle, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SortStep } from "@/lib/algorithms/sorting"

interface VisualizationCanvasProps {
  data: number[]
  currentStepData: SortStep | null
  onGenerateRandom: () => void
  onSetCustomData: (data: number[]) => void
}

export function VisualizationCanvas({
  data,
  currentStepData,
  onGenerateRandom,
  onSetCustomData,
}: VisualizationCanvasProps) {
  const [customInput, setCustomInput] = useState("")

  const handleCustomInput = () => {
    try {
      const numbers = customInput
        .split(",")
        .map((n) => Number.parseInt(n.trim()))
        .filter((n) => !isNaN(n) && n > 0 && n <= 100)

      if (numbers.length > 0 && numbers.length <= 20) {
        onSetCustomData(numbers)
        setCustomInput("")
      }
    } catch (error) {
      // Invalid input, ignore
    }
  }

  const displayData = currentStepData?.array || data
  const maxValue = Math.max(...displayData)

  const getBarColor = (index: number) => {
    if (!currentStepData) return "bg-primary"

    // Sorted elements
    if (currentStepData.sorted?.includes(index)) {
      return "bg-accent"
    }

    // Currently comparing
    if (currentStepData.comparing?.includes(index)) {
      return "bg-yellow-500"
    }

    // Currently swapping
    if (currentStepData.swapping?.includes(index)) {
      return "bg-red-500"
    }

    // Pivot element (for quicksort)
    if (currentStepData.pivot === index) {
      return "bg-purple-500"
    }

    return "bg-primary"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-xl">Visualization</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onGenerateRandom}>
              <Shuffle className="w-4 h-4 mr-2" />
              Random Data
            </Button>
            <Button variant="outline" size="sm" onClick={handleCustomInput}>
              <Plus className="w-4 h-4 mr-2" />
              Set Custom
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Data Input */}
        <div className="mb-6">
          <Input
            placeholder="Enter numbers separated by commas (e.g., 64, 34, 25, 12)"
            className="mb-2"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomInput()}
          />
        </div>

        {/* Visualization Area */}
        <div className="bg-muted rounded-lg p-6 min-h-[300px] flex items-end justify-center gap-1">
          {displayData.map((value, index) => (
            <div
              key={`${index}-${value}`}
              className={cn(
                "rounded-t-sm transition-all duration-300 flex items-end justify-center text-white text-xs font-medium",
                getBarColor(index),
              )}
              style={{
                height: `${(value / maxValue) * 250}px`,
                width: `${Math.max(24, 300 / displayData.length)}px`,
              }}
              title={`Index: ${index}, Value: ${value}`}
            >
              <span className="mb-1">{value}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span>Unsorted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Swapping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded"></div>
            <span>Sorted</span>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 text-center text-muted-foreground">
          <p>Array size: {displayData.length} • Ready to visualize</p>
        </div>
      </CardContent>
    </Card>
  )
}
