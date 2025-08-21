"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Zap } from "lucide-react"

interface GraphConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerateGraph: (config: GraphConfig) => void
}

export interface GraphConfig {
  type: "linear" | "circular" | "grid" | "star" | "random"
  nodeCount: number
  edgeCount?: number
  weighted: boolean
  minWeight?: number
  maxWeight?: number
}

export function GraphConfigurationModal({ isOpen, onClose, onGenerateGraph }: GraphConfigurationModalProps) {
  const [config, setConfig] = useState<GraphConfig>({
    type: "random",
    nodeCount: 6,
    edgeCount: 8,
    weighted: false,
    minWeight: 1,
    maxWeight: 10,
  })

  const handlePresetSelect = (preset: GraphConfig) => {
    setConfig(preset)
  }

  const handleGenerate = () => {
    onGenerateGraph(config)
    onClose()
  }

  const presets = [
    {
      name: "Small Path",
      description: "Linear path with 5 nodes",
      config: { type: "linear" as const, nodeCount: 5, weighted: false },
    },
    {
      name: "Circle Network",
      description: "Circular graph with 6 nodes",
      config: { type: "circular" as const, nodeCount: 6, weighted: false },
    },
    {
      name: "Grid Layout",
      description: "3x3 grid structure",
      config: { type: "grid" as const, nodeCount: 9, weighted: false },
    },
    {
      name: "Star Network",
      description: "Central hub with 6 spokes",
      config: { type: "star" as const, nodeCount: 7, weighted: false },
    },
    {
      name: "Weighted Random",
      description: "Random graph with weights",
      config: { type: "random" as const, nodeCount: 8, edgeCount: 12, weighted: true, minWeight: 1, maxWeight: 15 },
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gradient-green text-2xl font-heading">Create Custom Graph</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Presets */}
          <div>
            <h3 className="text-gradient-pink text-lg font-heading mb-3">Quick Presets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presets.map((preset) => (
                <Card
                  key={preset.name}
                  className="cursor-pointer transition-all duration-200 hover:bg-primary/5 hover:border-primary/30"
                  onClick={() => handlePresetSelect(preset.config)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white">{preset.name}</CardTitle>
                    <CardDescription className="text-xs">{preset.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Custom Configuration */}
          <div>
            <h3 className="text-gradient-green text-lg font-heading mb-4">Custom Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nodeCount" className="text-white">
                  Number of Nodes
                </Label>
                <Input
                  id="nodeCount"
                  type="number"
                  min="3"
                  max="20"
                  value={config.nodeCount}
                  onChange={(e) => setConfig({ ...config, nodeCount: Number.parseInt(e.target.value) || 3 })}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="graphType" className="text-white">
                  Graph Type
                </Label>
                <Select value={config.type} onValueChange={(value: any) => setConfig({ ...config, type: value })}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear Path</SelectItem>
                    <SelectItem value="circular">Circular</SelectItem>
                    <SelectItem value="grid">Grid Layout</SelectItem>
                    <SelectItem value="star">Star Network</SelectItem>
                    <SelectItem value="random">Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.type === "random" && (
                <div className="space-y-2">
                  <Label htmlFor="edgeCount" className="text-white">
                    Number of Edges
                  </Label>
                  <Input
                    id="edgeCount"
                    type="number"
                    min={config.nodeCount - 1}
                    max={Math.floor((config.nodeCount * (config.nodeCount - 1)) / 2)}
                    value={config.edgeCount || config.nodeCount}
                    onChange={(e) =>
                      setConfig({ ...config, edgeCount: Number.parseInt(e.target.value) || config.nodeCount })
                    }
                    className="bg-background/50"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="weighted"
                  checked={config.weighted}
                  onCheckedChange={(checked) => setConfig({ ...config, weighted: checked })}
                />
                <Label htmlFor="weighted" className="text-white">
                  Weighted Edges
                </Label>
              </div>

              {config.weighted && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="minWeight" className="text-white">
                      Min Weight
                    </Label>
                    <Input
                      id="minWeight"
                      type="number"
                      min="1"
                      value={config.minWeight || 1}
                      onChange={(e) => setConfig({ ...config, minWeight: Number.parseInt(e.target.value) || 1 })}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxWeight" className="text-white">
                      Max Weight
                    </Label>
                    <Input
                      id="maxWeight"
                      type="number"
                      min={config.minWeight || 1}
                      value={config.maxWeight || 10}
                      onChange={(e) => setConfig({ ...config, maxWeight: Number.parseInt(e.target.value) || 10 })}
                      className="bg-background/50"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-green-500 to-pink-500 hover:from-green-600 hover:to-pink-600 text-white flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Generate Custom Graph
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
