"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraphGenerator, type GraphGenerationOptions } from "@/lib/graph-generator"
import { useState } from "react"

interface GraphConfigurationProps {
  onGenerateGraph: (options: GraphGenerationOptions) => void
  isVisible: boolean
}

export function GraphConfiguration({ onGenerateGraph, isVisible }: GraphConfigurationProps) {
  const [options, setOptions] = useState<GraphGenerationOptions>({
    nodeCount: 6,
    pathLength: 8,
    graphType: "random",
    weighted: true,
    minWeight: 1,
    maxWeight: 5,
  })

  const presets = GraphGenerator.getPresetOptions()

  const handleGenerate = () => {
    onGenerateGraph(options)
  }

  const handlePresetSelect = (presetName: string) => {
    setOptions(presets[presetName])
  }

  const updateOptions = (key: keyof GraphGenerationOptions, value: any) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }

  if (!isVisible) return null

  return (
    <Card className="bg-card border-border shadow-xl">
      <CardHeader>
        <CardTitle className="font-heading text-xl text-gradient-green">Graph Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-heading font-semibold text-lg mb-3 text-gradient-pink">Quick Presets</h3>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(presets).map(([name, preset]) => (
              <Button
                key={name}
                variant="outline"
                className="w-full justify-start h-auto p-3 bg-card hover:bg-gradient-to-r hover:from-green-500/20 hover:to-pink-500/20 text-white border-gray-600 hover:border-green-400 hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300"
                onClick={() => handlePresetSelect(name)}
              >
                <div className="text-left w-full">
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-medium text-sm text-white">{name}</span>
                    <Badge variant="secondary" className="text-xs bg-gray-700 text-green-400 border-gray-600">
                      {preset.nodeCount} nodes
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-300">
                    {preset.graphType} • {preset.weighted ? "weighted" : "unweighted"}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-lg mb-3 text-gradient-pink">Custom Configuration</h3>
          <div className="space-y-4">
            {/* Graph Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="graph-type" className="text-sm font-medium text-gray-300">
                Graph Type
              </Label>
              <Select value={options.graphType} onValueChange={(value) => updateOptions("graphType", value as any)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="linear">Linear Path</SelectItem>
                  <SelectItem value="circular">Circular</SelectItem>
                  <SelectItem value="grid">Grid Layout</SelectItem>
                  <SelectItem value="star">Star Network</SelectItem>
                  <SelectItem value="random">Random Graph</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Node Count */}
            <div className="space-y-2">
              <Label htmlFor="node-count" className="text-sm font-medium text-gray-300">
                Number of Nodes
              </Label>
              <Input
                id="node-count"
                type="number"
                min="3"
                max="15"
                value={options.nodeCount}
                onChange={(e) => updateOptions("nodeCount", Number.parseInt(e.target.value) || 3)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            {/* Path Length (for applicable graph types) */}
            {(options.graphType === "random" || options.graphType === "linear") && (
              <div className="space-y-2">
                <Label htmlFor="path-length" className="text-sm font-medium text-gray-300">
                  Target Edge Count
                </Label>
                <Input
                  id="path-length"
                  type="number"
                  min={options.nodeCount - 1}
                  max={Math.floor((options.nodeCount * (options.nodeCount - 1)) / 2)}
                  value={options.pathLength || options.nodeCount}
                  onChange={(e) => updateOptions("pathLength", Number.parseInt(e.target.value) || options.nodeCount)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            )}

            {/* Weighted Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="weighted" className="text-sm font-medium text-gray-300">
                Use Weighted Edges
              </Label>
              <Switch
                id="weighted"
                checked={options.weighted}
                onCheckedChange={(checked) => updateOptions("weighted", checked)}
              />
            </div>

            {/* Weight Range (if weighted) */}
            {options.weighted && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-weight" className="text-sm font-medium text-gray-300">
                    Min Weight
                  </Label>
                  <Input
                    id="min-weight"
                    type="number"
                    min="1"
                    max="20"
                    value={options.minWeight}
                    onChange={(e) => updateOptions("minWeight", Number.parseInt(e.target.value) || 1)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-weight" className="text-sm font-medium text-gray-300">
                    Max Weight
                  </Label>
                  <Input
                    id="max-weight"
                    type="number"
                    min="1"
                    max="20"
                    value={options.maxWeight}
                    onChange={(e) => updateOptions("maxWeight", Number.parseInt(e.target.value) || 1)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              className="w-full gradient-purple text-white border-purple-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            >
              Generate Custom Graph
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
