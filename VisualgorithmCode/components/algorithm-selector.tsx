"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AlgorithmType } from "@/hooks/use-algorithm-visualizer"

const algorithms = [
  {
    category: "Sorting",
    items: [
      { name: "Bubble Sort" as AlgorithmType, complexity: "O(n²)", description: "Simple comparison-based sorting" },
      {
        name: "Insertion Sort" as AlgorithmType,
        complexity: "O(n²)",
        description: "Builds sorted array one item at a time",
      },
      { name: "Merge Sort" as AlgorithmType, complexity: "O(n log n)", description: "Divide and conquer approach" },
      { name: "Quick Sort" as AlgorithmType, complexity: "O(n log n)", description: "Efficient pivot-based sorting" },
    ],
  },
  {
    category: "Graph & Search",
    items: [
      { name: "BFS" as AlgorithmType, complexity: "O(V + E)", description: "Breadth-first search traversal" },
      { name: "DFS" as AlgorithmType, complexity: "O(V + E)", description: "Depth-first search traversal" },
      { name: "Dijkstra" as AlgorithmType, complexity: "O(V²)", description: "Shortest path algorithm" },
      { name: "A*", complexity: "O(b^d)", description: "Heuristic pathfinding" },
    ],
  },
]

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType | null
  onSelectAlgorithm: (algorithm: AlgorithmType) => void
}

export function AlgorithmSelector({ selectedAlgorithm, onSelectAlgorithm }: AlgorithmSelectorProps) {
  return (
    <Card className="bg-card border-border shadow-xl">
      <CardHeader>
        <CardTitle className="font-heading text-xl text-gradient-green">Select Algorithm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {algorithms.map((category) => (
          <div key={category.category}>
            <h3 className="font-heading font-semibold text-lg mb-3 text-gradient-pink">{category.category}</h3>
            <div className="space-y-2">
              {category.items.map((algorithm) => {
                const isSelectable =
                  category.category === "Sorting" || (category.category === "Graph & Search" && algorithm.name !== "A*")
                const isSelected = selectedAlgorithm === algorithm.name

                return (
                  <Button
                    key={algorithm.name}
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full justify-start h-auto p-4 transition-all duration-300 ${
                      isSelected
                        ? "gradient-purple text-white border-purple-500 shadow-lg shadow-purple-500/25"
                        : "bg-card hover:bg-gradient-to-r hover:from-green-500/20 hover:to-pink-500/20 text-white border-gray-600 hover:border-green-400 hover:shadow-lg hover:shadow-green-400/25"
                    } ${!isSelectable ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => isSelectable && onSelectAlgorithm(algorithm.name as AlgorithmType)}
                    disabled={!isSelectable}
                  >
                    <div className="text-left w-full">
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-medium text-sm text-white">{algorithm.name}</span>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-700 text-green-400 border-gray-600 font-mono"
                        >
                          {algorithm.complexity}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-300">{algorithm.description}</p>
                      {!isSelectable && <p className="text-xs text-pink-400 mt-1 italic">Coming soon</p>}
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
