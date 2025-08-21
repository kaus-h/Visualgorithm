"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AlgorithmType } from "@/hooks/use-algorithm-visualizer"
import type { AlgorithmResult } from "@/lib/algorithms/sorting"
import type { GraphAlgorithmResult } from "@/lib/algorithms/graph"

const algorithmInfo = {
  "Bubble Sort": {
    description:
      "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    stable: true,
    pseudocode: `for i = 0 to n-1:
  for j = 0 to n-i-2:
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])`,
  },
  "Insertion Sort": {
    description:
      "Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    stable: true,
    pseudocode: `for i = 1 to n-1:
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key:
    arr[j+1] = arr[j]
    j = j - 1
  arr[j+1] = key`,
  },
  "Merge Sort": {
    description:
      "A divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    stable: true,
    pseudocode: `function mergeSort(arr):
  if length(arr) <= 1:
    return arr
  mid = length(arr) / 2
  left = mergeSort(arr[0...mid])
  right = mergeSort(arr[mid...end])
  return merge(left, right)`,
  },
  "Quick Sort": {
    description:
      "A divide-and-conquer algorithm that picks a 'pivot' element and partitions the array around the pivot, then recursively sorts the sub-arrays.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    stable: false,
    pseudocode: `function quickSort(arr, low, high):
  if low < high:
    pi = partition(arr, low, high)
    quickSort(arr, low, pi - 1)
    quickSort(arr, pi + 1, high)`,
  },
  BFS: {
    description:
      "Breadth-First Search explores nodes level by level, visiting all neighbors before moving to the next depth level.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    stable: false,
    pseudocode: `function BFS(graph, start):
  queue = [start]
  visited = set()
  while queue is not empty:
    node = queue.dequeue()
    if node not in visited:
      visited.add(node)
      for neighbor in graph[node]:
        queue.enqueue(neighbor)`,
  },
  DFS: {
    description:
      "Depth-First Search explores as far as possible along each branch before backtracking to explore other branches.",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    stable: false,
    pseudocode: `function DFS(graph, start):
  stack = [start]
  visited = set()
  while stack is not empty:
    node = stack.pop()
    if node not in visited:
      visited.add(node)
      for neighbor in graph[node]:
        stack.push(neighbor)`,
  },
  Dijkstra: {
    description:
      "Dijkstra's algorithm finds the shortest path between nodes in a weighted graph with non-negative edge weights.",
    timeComplexity: "O(V²)",
    spaceComplexity: "O(V)",
    stable: false,
    pseudocode: `function dijkstra(graph, start):
  distances = {node: ∞ for node in graph}
  distances[start] = 0
  unvisited = set(graph.nodes)
  
  while unvisited:
    current = min(unvisited, key=distances.get)
    unvisited.remove(current)
    
    for neighbor, weight in graph[current]:
      distance = distances[current] + weight
      if distance < distances[neighbor]:
        distances[neighbor] = distance`,
  },
}

interface InfoPanelProps {
  selectedAlgorithm: AlgorithmType | null
  algorithmResult: AlgorithmResult | null
  graphAlgorithmResult: GraphAlgorithmResult | null
}

export function InfoPanel({ selectedAlgorithm, algorithmResult, graphAlgorithmResult }: InfoPanelProps) {
  const info = selectedAlgorithm ? algorithmInfo[selectedAlgorithm] : null
  const result = algorithmResult || graphAlgorithmResult

  return (
    <div className="space-y-6">
      {/* Algorithm Info */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg text-gradient-pink">Algorithm Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {info ? (
            <div>
              <h4 className="font-heading font-semibold mb-2 text-gradient-green">{selectedAlgorithm}</h4>
              <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Time: {info.timeComplexity}</Badge>
                <Badge variant="outline">Space: {info.spaceComplexity}</Badge>
                {info.stable && <Badge variant="outline">Stable</Badge>}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select an algorithm to see details</p>
          )}
        </CardContent>
      </Card>

      {/* Code Display */}
      {info && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg text-gradient-pink">Pseudocode</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">{info.pseudocode}</pre>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg text-gradient-pink">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {algorithmResult && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Comparisons:</span>
                <span className="font-medium">{algorithmResult.comparisons}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Swaps:</span>
                <span className="font-medium">{algorithmResult.swaps}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Array Accesses:</span>
                <span className="font-medium">{algorithmResult.arrayAccesses}</span>
              </div>
            </>
          )}
          {graphAlgorithmResult && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nodes Visited:</span>
                <span className="font-medium">{graphAlgorithmResult.nodesVisited}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Edges Explored:</span>
                <span className="font-medium">{graphAlgorithmResult.edgesExplored}</span>
              </div>
              {graphAlgorithmResult.pathFound && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Path Length:</span>
                  <span className="font-medium">{graphAlgorithmResult.pathFound.length}</span>
                </div>
              )}
              {graphAlgorithmResult.totalDistance !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Distance:</span>
                  <span className="font-medium">{graphAlgorithmResult.totalDistance}</span>
                </div>
              )}
            </>
          )}
          {!result && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Comparisons:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Operations:</span>
                <span className="font-medium">0</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
