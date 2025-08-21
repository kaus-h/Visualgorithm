"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { SortingAlgorithms, type AlgorithmResult, type SortStep } from "@/lib/algorithms/sorting"
import {
  GraphAlgorithms,
  type GraphAlgorithmResult,
  type GraphStep,
  type Node,
  type Edge,
  defaultGraphs,
} from "@/lib/algorithms/graph"
import { GraphGenerator, type GraphGenerationOptions } from "@/lib/graph-generator"

export type AlgorithmType = "Bubble Sort" | "Insertion Sort" | "Merge Sort" | "Quick Sort" | "BFS" | "DFS" | "Dijkstra"

export type VisualizationMode = "sorting" | "graph"

export interface VisualizerState {
  mode: VisualizationMode
  // Sorting state
  data: number[]
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  selectedAlgorithm: AlgorithmType | null
  algorithmResult: AlgorithmResult | null
  currentStepData: SortStep | null
  // Graph state
  nodes: Node[]
  edges: Edge[]
  graphAlgorithmResult: GraphAlgorithmResult | null
  currentGraphStepData: GraphStep | null
  startNode: string | null
  targetNode: string | null
}

export function useAlgorithmVisualizer() {
  const [state, setState] = useState<VisualizerState>({
    mode: "sorting",
    data: [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42],
    currentStep: 0,
    totalSteps: 0,
    isPlaying: false,
    speed: 50,
    selectedAlgorithm: null,
    algorithmResult: null,
    currentStepData: null,
    nodes: defaultGraphs.simple.nodes,
    edges: defaultGraphs.simple.edges,
    graphAlgorithmResult: null,
    currentGraphStepData: null,
    startNode: null,
    targetNode: null,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const setMode = useCallback((mode: VisualizationMode) => {
    setState((prev) => ({
      ...prev,
      mode,
      currentStep: 0,
      totalSteps: 0,
      isPlaying: false,
      selectedAlgorithm: null,
      algorithmResult: null,
      currentStepData: null,
      graphAlgorithmResult: null,
      currentGraphStepData: null,
    }))
  }, [])

  const generateRandomData = useCallback((size = 11) => {
    const newData = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
    setState((prev) => ({
      ...prev,
      data: newData,
      currentStep: 0,
      totalSteps: 0,
      algorithmResult: null,
      currentStepData: null,
      isPlaying: false,
    }))
  }, [])

  const setCustomData = useCallback((data: number[]) => {
    setState((prev) => ({
      ...prev,
      data: [...data],
      currentStep: 0,
      totalSteps: 0,
      algorithmResult: null,
      currentStepData: null,
      isPlaying: false,
    }))
  }, [])

  const loadGraph = useCallback((graphName: "simple" | "complex") => {
    const graph = defaultGraphs[graphName]
    setState((prev) => ({
      ...prev,
      nodes: [...graph.nodes],
      edges: [...graph.edges],
      currentStep: 0,
      totalSteps: 0,
      graphAlgorithmResult: null,
      currentGraphStepData: null,
      isPlaying: false,
      startNode: null,
      targetNode: null,
    }))
  }, [])

  const generateCustomGraph = useCallback((options: GraphGenerationOptions) => {
    const { nodes, edges } = GraphGenerator.generateGraph(options)
    setState((prev) => ({
      ...prev,
      nodes: [...nodes],
      edges: [...edges],
      currentStep: 0,
      totalSteps: 0,
      graphAlgorithmResult: null,
      currentGraphStepData: null,
      isPlaying: false,
      startNode: null,
      targetNode: null,
    }))
  }, [])

  const setStartNode = useCallback((nodeId: string | null) => {
    setState((prev) => ({ ...prev, startNode: nodeId }))
  }, [])

  const setTargetNode = useCallback((nodeId: string | null) => {
    setState((prev) => ({ ...prev, targetNode: nodeId }))
  }, [])

  const selectAlgorithm = useCallback(
    (algorithm: AlgorithmType) => {
      const currentData = state.data
      const currentNodes = state.nodes
      const currentEdges = state.edges
      const currentStartNode = state.startNode
      const currentTargetNode = state.targetNode

      setState((prev) => ({
        ...prev,
        selectedAlgorithm: algorithm,
        currentStep: 0,
        isPlaying: false,
      }))

      // Determine mode based on algorithm
      const isSortingAlgorithm = ["Bubble Sort", "Insertion Sort", "Merge Sort", "Quick Sort"].includes(algorithm)
      const newMode: VisualizationMode = isSortingAlgorithm ? "sorting" : "graph"

      if (isSortingAlgorithm) {
        // Generate sorting algorithm steps
        let result: AlgorithmResult
        switch (algorithm) {
          case "Bubble Sort":
            result = SortingAlgorithms.bubbleSort(currentData)
            break
          case "Insertion Sort":
            result = SortingAlgorithms.insertionSort(currentData)
            break
          case "Merge Sort":
            result = SortingAlgorithms.mergeSort(currentData)
            break
          case "Quick Sort":
            result = SortingAlgorithms.quickSort(currentData)
            break
          default:
            return
        }

        const initialStep: SortStep = {
          array: [...currentData],
          comparing: [],
          swapping: [],
          sorted: [],
        }
        const stepsWithInitial = [initialStep, ...result.steps]

        setState((prev) => ({
          ...prev,
          mode: newMode,
          algorithmResult: { ...result, steps: stepsWithInitial },
          totalSteps: stepsWithInitial.length,
          currentStepData: initialStep,
        }))
      } else {
        // Generate graph algorithm steps
        let startNodeId = currentStartNode

        // Auto-select first node as start if none selected
        if (!startNodeId && currentNodes.length > 0) {
          startNodeId = currentNodes[0].id
          setState((prev) => ({ ...prev, startNode: startNodeId }))
        }

        if (!startNodeId) return

        console.log("[v0] Running graph algorithm:", algorithm)
        console.log("[v0] Start node:", startNodeId)
        console.log("[v0] Target node:", currentTargetNode)

        let result: GraphAlgorithmResult
        switch (algorithm) {
          case "BFS":
            result = GraphAlgorithms.bfs(currentNodes, currentEdges, startNodeId, currentTargetNode || undefined)
            break
          case "DFS":
            result = GraphAlgorithms.dfs(currentNodes, currentEdges, startNodeId, currentTargetNode || undefined)
            break
          case "Dijkstra":
            result = GraphAlgorithms.dijkstra(currentNodes, currentEdges, startNodeId, currentTargetNode || undefined)
            break
          default:
            return
        }

        console.log("[v0] Algorithm result:", result)
        console.log("[v0] Path found:", result.pathFound)

        const initialStep: GraphStep = {
          nodes: [...currentNodes],
          edges: [...currentEdges],
          visitedNodes: [],
          currentNode: null,
          queue: [],
          exploring: [],
        }
        const stepsWithInitial = [initialStep, ...result.steps]

        console.log("[v0] Graph algorithm result with initial step:", { ...result, steps: stepsWithInitial })

        setState((prev) => ({
          ...prev,
          mode: newMode,
          graphAlgorithmResult: { ...result, steps: stepsWithInitial },
          totalSteps: stepsWithInitial.length,
          currentGraphStepData: initialStep,
        }))
      }
    },
    [state.data, state.nodes, state.edges, state.startNode, state.targetNode],
  )

  const play = useCallback(() => {
    const result = state.mode === "sorting" ? state.algorithmResult : state.graphAlgorithmResult
    if (!result || state.currentStep >= state.totalSteps - 1) return

    setState((prev) => ({ ...prev, isPlaying: true }))

    const delay = state.speed <= 10 ? 3000 - state.speed * 200 : 1200 - state.speed * 10

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        const result = prev.mode === "sorting" ? prev.algorithmResult : prev.graphAlgorithmResult
        if (!result || prev.currentStep >= prev.totalSteps - 1) {
          return { ...prev, isPlaying: false }
        }

        const nextStep = prev.currentStep + 1
        const updates: Partial<VisualizerState> = {
          currentStep: nextStep,
        }

        if (prev.mode === "sorting" && prev.algorithmResult) {
          updates.currentStepData = prev.algorithmResult.steps[nextStep] || null
        } else if (prev.mode === "graph" && prev.graphAlgorithmResult) {
          updates.currentGraphStepData = prev.graphAlgorithmResult.steps[nextStep] || null
          console.log("[v0] Updated graph step:", updates.currentGraphStepData)
        }

        return { ...prev, ...updates }
      })
    }, delay)
  }, [state.mode, state.algorithmResult, state.graphAlgorithmResult, state.currentStep, state.totalSteps, state.speed])

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setState((prev) => ({ ...prev, isPlaying: false }))
  }, [])

  const reset = useCallback(() => {
    pause()
    setState((prev) => {
      const updates: Partial<VisualizerState> = {
        currentStep: 0,
      }

      if (prev.mode === "sorting" && prev.algorithmResult) {
        updates.currentStepData = prev.algorithmResult.steps[0] || null
      } else if (prev.mode === "graph" && prev.graphAlgorithmResult) {
        updates.currentGraphStepData = prev.graphAlgorithmResult.steps[0] || null
      }

      return { ...prev, ...updates }
    })
  }, [pause])

  const stepForward = useCallback(() => {
    const result = state.mode === "sorting" ? state.algorithmResult : state.graphAlgorithmResult
    if (!result || state.currentStep >= state.totalSteps - 1) return

    const nextStep = state.currentStep + 1
    setState((prev) => {
      const updates: Partial<VisualizerState> = {
        currentStep: nextStep,
      }

      if (prev.mode === "sorting" && prev.algorithmResult) {
        updates.currentStepData = prev.algorithmResult.steps[nextStep] || null
      } else if (prev.mode === "graph" && prev.graphAlgorithmResult) {
        updates.currentGraphStepData = prev.graphAlgorithmResult.steps[nextStep] || null
      }

      return { ...prev, ...updates }
    })
  }, [state.mode, state.algorithmResult, state.graphAlgorithmResult, state.currentStep, state.totalSteps])

  const stepBackward = useCallback(() => {
    if (state.currentStep <= 0) return

    const prevStep = state.currentStep - 1
    setState((prev) => {
      const updates: Partial<VisualizerState> = {
        currentStep: prevStep,
      }

      if (prev.mode === "sorting" && prev.algorithmResult) {
        updates.currentStepData = prev.algorithmResult.steps[prevStep] || null
      } else if (prev.mode === "graph" && prev.graphAlgorithmResult) {
        updates.currentGraphStepData = prev.graphAlgorithmResult.steps[prevStep] || null
      }

      return { ...prev, ...updates }
    })
  }, [state.currentStep])

  const setSpeed = useCallback(
    (speed: number) => {
      setState((prev) => ({ ...prev, speed }))

      // If playing, restart with new speed
      if (state.isPlaying) {
        pause()
        setTimeout(play, 100)
      }
    },
    [state.isPlaying, pause, play],
  )

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Auto-pause when reaching the end
  useEffect(() => {
    if (state.currentStep >= state.totalSteps - 1 && state.isPlaying) {
      pause()
    }
  }, [state.currentStep, state.totalSteps, state.isPlaying, pause])

  return {
    ...state,
    setMode,
    generateRandomData,
    setCustomData,
    loadGraph,
    generateCustomGraph,
    setStartNode,
    setTargetNode,
    selectAlgorithm,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setSpeed,
  }
}
