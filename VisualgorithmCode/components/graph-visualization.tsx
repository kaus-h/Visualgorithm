"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shuffle, Target, Settings } from "lucide-react"
import { GraphConfigurationModal, type GraphConfig } from "./graph-configuration-modal"
import { useState } from "react"
import type { Node, Edge, GraphStep } from "@/lib/algorithms/graph"

interface GraphVisualizationProps {
  nodes: Node[]
  edges: Edge[]
  currentStepData: GraphStep | null
  startNode: string | null
  targetNode: string | null
  onLoadGraph: (graphName: "simple" | "complex") => void
  onGenerateCustomGraph: (config: GraphConfig) => void
  onSetStartNode: (nodeId: string | null) => void
  onSetTargetNode: (nodeId: string | null) => void
}

export function GraphVisualization({
  nodes,
  edges,
  currentStepData,
  startNode,
  targetNode,
  onLoadGraph,
  onGenerateCustomGraph,
  onSetStartNode,
  onSetTargetNode,
}: GraphVisualizationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getNodeColor = (nodeId: string) => {
    if (!currentStepData) {
      if (nodeId === startNode) return "#10b981" // green-500
      if (nodeId === targetNode) return "#ef4444" // red-500
      return "#3b82f6" // blue-500 (primary)
    }

    // Path nodes (final result)
    if (currentStepData.path?.includes(nodeId)) {
      return "#a855f7" // purple-500
    }

    // Current node being processed
    if (currentStepData.currentNode === nodeId) {
      return "#eab308" // yellow-500
    }

    // Nodes being explored
    if (currentStepData.exploring?.includes(nodeId)) {
      return "#f97316" // orange-500
    }

    // Visited nodes
    if (currentStepData.visitedNodes?.includes(nodeId)) {
      return "#6b7280" // gray-500 (accent)
    }

    // Start and target nodes
    if (nodeId === startNode) return "#10b981" // green-500
    if (nodeId === targetNode) return "#ef4444" // red-500

    return "#9ca3af" // gray-400 (muted)
  }

  const getEdgeColor = (edge: Edge) => {
    if (!currentStepData) return "#d1d5db" // gray-300

    // Path edges
    if (currentStepData.path) {
      const pathEdges = []
      for (let i = 0; i < currentStepData.path.length - 1; i++) {
        pathEdges.push([currentStepData.path[i], currentStepData.path[i + 1]])
      }

      const isPathEdge = pathEdges.some(
        ([from, to]) => (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from),
      )

      if (isPathEdge) return "#a855f7" // purple-500
    }

    return "#d1d5db" // gray-300
  }

  const handleNodeClick = (nodeId: string) => {
    if (!startNode) {
      onSetStartNode(nodeId)
    } else if (nodeId === startNode) {
      onSetStartNode(null)
    } else if (!targetNode) {
      onSetTargetNode(nodeId)
    } else if (nodeId === targetNode) {
      onSetTargetNode(null)
    } else {
      // Switch start node
      onSetStartNode(nodeId)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading text-xl">Graph Visualization</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onLoadGraph("simple")}>
                <Shuffle className="w-4 h-4 mr-2" />
                Simple Graph
              </Button>
              <Button variant="outline" size="sm" onClick={() => onLoadGraph("complex")}>
                <Target className="w-4 h-4 mr-2" />
                Complex Graph
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-green-500/10 to-pink-500/10 hover:from-green-500/20 hover:to-pink-500/20 border-green-500/30"
              >
                <Settings className="w-4 h-4 mr-2" />
                Custom Graph
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Instructions */}
          <div className="mb-4 p-3 bg-muted rounded-lg">
            {!startNode && !targetNode && (
              <p className="text-sm text-muted-foreground">
                <strong>Step 1:</strong> Click a node to set it as the start node (green).
              </p>
            )}
            {startNode && !targetNode && (
              <p className="text-sm text-muted-foreground">
                <strong>Step 2:</strong> Click another node to set it as the target node (red) for path finding, or run
                algorithm for full traversal.
              </p>
            )}
            {startNode && targetNode && (
              <p className="text-sm text-muted-foreground">
                <strong>Ready!</strong> Start: {startNode} → Target: {targetNode}. Run an algorithm to find the path.
              </p>
            )}
            {!startNode && !targetNode && (
              <p className="text-xs text-muted-foreground mt-1">
                💡 Select both start and target nodes to see path finding, or just start node for full traversal.
              </p>
            )}
          </div>

          {/* Graph Canvas */}
          <div className="bg-background border rounded-lg p-4 min-h-[400px] relative overflow-hidden">
            <svg width="100%" height="400" className="absolute inset-0">
              {/* Render edges */}
              {edges.map((edge, index) => {
                const fromNode = nodes.find((n) => n.id === edge.from)
                const toNode = nodes.find((n) => n.id === edge.to)
                if (!fromNode || !toNode) return null

                return (
                  <g key={`edge-${index}`}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={getEdgeColor(edge)}
                      strokeWidth={currentStepData?.path ? 3 : 2}
                      style={{ transition: "stroke 0.3s ease-in-out, stroke-width 0.3s ease-in-out" }}
                    />
                    {edge.weight && (
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2 - 5}
                        fill="currentColor"
                        className="text-xs font-medium"
                        textAnchor="middle"
                      >
                        {edge.weight}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Render nodes */}
              {nodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={getNodeColor(node.id)}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => handleNodeClick(node.id)}
                    style={{
                      transition: "fill 0.5s ease-in-out, r 0.2s ease-in-out",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.setAttribute("r", "24")
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.setAttribute("r", "20")
                    }}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    fill="#ffffff"
                    className="text-sm font-bold pointer-events-none"
                    textAnchor="middle"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    {node.label}
                  </text>
                  {/* Distance label for Dijkstra */}
                  {currentStepData?.distances && currentStepData.distances[node.id] !== Number.POSITIVE_INFINITY && (
                    <text
                      x={node.x}
                      y={node.y - 30}
                      fill="currentColor"
                      className="text-xs font-medium"
                      textAnchor="middle"
                      style={{
                        transition: "opacity 0.3s ease-in-out",
                        opacity: currentStepData.distances[node.id] === Number.POSITIVE_INFINITY ? 0 : 1,
                      }}
                    >
                      {currentStepData.distances[node.id]}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Start Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Target Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Exploring</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Path</span>
            </div>
          </div>

          {/* Current State Info */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {currentStepData?.queue && currentStepData.queue.length > 0 && (
              <div>
                <span className="font-medium">Queue: </span>
                <span className="text-muted-foreground">[{currentStepData.queue.join(", ")}]</span>
              </div>
            )}
            {currentStepData?.stack && currentStepData.stack.length > 0 && (
              <div>
                <span className="font-medium">Stack: </span>
                <span className="text-muted-foreground">[{currentStepData.stack.join(", ")}]</span>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="mt-4 text-center text-muted-foreground">
            <p>
              Nodes: {nodes.length} • Edges: {edges.length}
              {startNode && ` • Start: ${startNode}`}
              {targetNode && ` • Target: ${targetNode}`}
              {currentStepData?.path && ` • Path Found: ${currentStepData.path.join(" → ")}`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Graph Configuration Modal */}
      <GraphConfigurationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerateGraph={onGenerateCustomGraph}
      />
    </>
  )
}
