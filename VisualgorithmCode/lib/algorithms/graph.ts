export interface Node {
  id: string
  x: number
  y: number
  label: string
}

export interface Edge {
  from: string
  to: string
  weight?: number
}

export interface GraphStep {
  nodes: Node[]
  edges: Edge[]
  visitedNodes?: string[]
  currentNode?: string
  queue?: string[]
  stack?: string[]
  distances?: Record<string, number>
  path?: string[]
  exploring?: string[]
}

export interface GraphAlgorithmResult {
  steps: GraphStep[]
  nodesVisited: number
  edgesExplored: number
  pathFound?: string[]
  totalDistance?: number
}

export class GraphAlgorithms {
  static bfs(nodes: Node[], edges: Edge[], startNodeId: string, targetNodeId?: string): GraphAlgorithmResult {
    const steps: GraphStep[] = []
    const visited = new Set<string>()
    const queue: string[] = [startNodeId]
    const parent: Record<string, string | null> = { [startNodeId]: null }
    let nodesVisited = 0
    let edgesExplored = 0

    // Build adjacency list
    const adjacencyList: Record<string, string[]> = {}
    nodes.forEach((node) => {
      adjacencyList[node.id] = []
    })
    edges.forEach((edge) => {
      adjacencyList[edge.from].push(edge.to)
      adjacencyList[edge.to].push(edge.from) // Undirected graph
    })

    // Initial state
    steps.push({
      nodes,
      edges,
      queue: [...queue],
      visitedNodes: [],
    })

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!

      if (visited.has(currentNodeId)) continue

      visited.add(currentNodeId)
      nodesVisited++

      steps.push({
        nodes,
        edges,
        currentNode: currentNodeId,
        visitedNodes: Array.from(visited),
        queue: [...queue],
      })

      // If we found the target, reconstruct path
      if (targetNodeId && currentNodeId === targetNodeId) {
        const path: string[] = []
        let current: string | null = targetNodeId
        while (current !== null) {
          path.unshift(current)
          current = parent[current]
        }

        steps.push({
          nodes,
          edges,
          visitedNodes: Array.from(visited),
          path,
          queue: [],
        })

        return { steps, nodesVisited, edgesExplored, pathFound: path }
      }

      // Explore neighbors
      const neighbors = adjacencyList[currentNodeId] || []
      const newNeighbors: string[] = []

      for (const neighborId of neighbors) {
        edgesExplored++
        if (!visited.has(neighborId) && !queue.includes(neighborId)) {
          queue.push(neighborId)
          parent[neighborId] = currentNodeId
          newNeighbors.push(neighborId)
        }
      }

      if (newNeighbors.length > 0) {
        steps.push({
          nodes,
          edges,
          currentNode: currentNodeId,
          visitedNodes: Array.from(visited),
          queue: [...queue],
          exploring: newNeighbors,
        })
      }
    }

    // Final state
    steps.push({
      nodes,
      edges,
      visitedNodes: Array.from(visited),
      queue: [],
    })

    return { steps, nodesVisited, edgesExplored }
  }

  static dfs(nodes: Node[], edges: Edge[], startNodeId: string, targetNodeId?: string): GraphAlgorithmResult {
    const steps: GraphStep[] = []
    const visited = new Set<string>()
    const stack: string[] = [startNodeId]
    const parent: Record<string, string | null> = { [startNodeId]: null }
    let nodesVisited = 0
    let edgesExplored = 0

    // Build adjacency list
    const adjacencyList: Record<string, string[]> = {}
    nodes.forEach((node) => {
      adjacencyList[node.id] = []
    })
    edges.forEach((edge) => {
      adjacencyList[edge.from].push(edge.to)
      adjacencyList[edge.to].push(edge.from) // Undirected graph
    })

    // Initial state
    steps.push({
      nodes,
      edges,
      stack: [...stack],
      visitedNodes: [],
    })

    while (stack.length > 0) {
      const currentNodeId = stack.pop()!

      if (visited.has(currentNodeId)) continue

      visited.add(currentNodeId)
      nodesVisited++

      steps.push({
        nodes,
        edges,
        currentNode: currentNodeId,
        visitedNodes: Array.from(visited),
        stack: [...stack],
      })

      // If we found the target, reconstruct path
      if (targetNodeId && currentNodeId === targetNodeId) {
        const path: string[] = []
        let current: string | null = targetNodeId
        while (current !== null) {
          path.unshift(current)
          current = parent[current]
        }

        steps.push({
          nodes,
          edges,
          visitedNodes: Array.from(visited),
          path,
          stack: [],
        })

        return { steps, nodesVisited, edgesExplored, pathFound: path }
      }

      // Explore neighbors (in reverse order for DFS)
      const neighbors = adjacencyList[currentNodeId] || []
      const newNeighbors: string[] = []

      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighborId = neighbors[i]
        edgesExplored++
        if (!visited.has(neighborId)) {
          stack.push(neighborId)
          if (!parent[neighborId]) {
            parent[neighborId] = currentNodeId
          }
          newNeighbors.push(neighborId)
        }
      }

      if (newNeighbors.length > 0) {
        steps.push({
          nodes,
          edges,
          currentNode: currentNodeId,
          visitedNodes: Array.from(visited),
          stack: [...stack],
          exploring: newNeighbors,
        })
      }
    }

    // Final state
    steps.push({
      nodes,
      edges,
      visitedNodes: Array.from(visited),
      stack: [],
    })

    return { steps, nodesVisited, edgesExplored }
  }

  static dijkstra(nodes: Node[], edges: Edge[], startNodeId: string, targetNodeId?: string): GraphAlgorithmResult {
    const steps: GraphStep[] = []
    const distances: Record<string, number> = {}
    const visited = new Set<string>()
    const parent: Record<string, string | null> = {}
    let nodesVisited = 0
    let edgesExplored = 0

    // Initialize distances
    nodes.forEach((node) => {
      distances[node.id] = node.id === startNodeId ? 0 : Number.POSITIVE_INFINITY
      parent[node.id] = null
    })

    // Initial state
    steps.push({
      nodes,
      edges,
      distances: { ...distances },
      visitedNodes: [],
    })

    while (visited.size < nodes.length) {
      // Find unvisited node with minimum distance
      let currentNodeId: string | null = null
      let minDistance = Number.POSITIVE_INFINITY

      for (const node of nodes) {
        if (!visited.has(node.id) && distances[node.id] < minDistance) {
          minDistance = distances[node.id]
          currentNodeId = node.id
        }
      }

      if (currentNodeId === null || minDistance === Number.POSITIVE_INFINITY) break

      visited.add(currentNodeId)
      nodesVisited++

      steps.push({
        nodes,
        edges,
        currentNode: currentNodeId,
        visitedNodes: Array.from(visited),
        distances: { ...distances },
      })

      // If we found the target, reconstruct path
      if (targetNodeId && currentNodeId === targetNodeId) {
        const path: string[] = []
        let current: string | null = targetNodeId
        while (current !== null) {
          path.unshift(current)
          current = parent[current]
        }

        steps.push({
          nodes,
          edges,
          visitedNodes: Array.from(visited),
          distances: { ...distances },
          path,
        })

        return {
          steps,
          nodesVisited,
          edgesExplored,
          pathFound: path,
          totalDistance: distances[targetNodeId],
        }
      }

      // Update distances to neighbors
      const neighbors = edges.filter((edge) => edge.from === currentNodeId || edge.to === currentNodeId)
      const exploring: string[] = []

      for (const edge of neighbors) {
        edgesExplored++
        const neighborId = edge.from === currentNodeId ? edge.to : edge.from

        if (!visited.has(neighborId)) {
          const weight = edge.weight || 1
          const newDistance = distances[currentNodeId] + weight

          if (newDistance < distances[neighborId]) {
            distances[neighborId] = newDistance
            parent[neighborId] = currentNodeId
            exploring.push(neighborId)
          }
        }
      }

      if (exploring.length > 0) {
        steps.push({
          nodes,
          edges,
          currentNode: currentNodeId,
          visitedNodes: Array.from(visited),
          distances: { ...distances },
          exploring,
        })
      }
    }

    // Final state
    steps.push({
      nodes,
      edges,
      visitedNodes: Array.from(visited),
      distances: { ...distances },
    })

    return { steps, nodesVisited, edgesExplored }
  }
}

// Default graph configurations
export const defaultGraphs = {
  simple: {
    nodes: [
      { id: "A", x: 100, y: 100, label: "A" },
      { id: "B", x: 300, y: 100, label: "B" },
      { id: "C", x: 200, y: 200, label: "C" },
      { id: "D", x: 400, y: 200, label: "D" },
    ],
    edges: [
      { from: "A", to: "B", weight: 1 },
      { from: "A", to: "C", weight: 2 },
      { from: "B", to: "D", weight: 1 },
      { from: "C", to: "D", weight: 3 },
    ],
  },
  complex: {
    nodes: [
      { id: "A", x: 50, y: 150, label: "A" },
      { id: "B", x: 150, y: 50, label: "B" },
      { id: "C", x: 250, y: 150, label: "C" },
      { id: "D", x: 150, y: 250, label: "D" },
      { id: "E", x: 350, y: 100, label: "E" },
      { id: "F", x: 350, y: 200, label: "F" },
    ],
    edges: [
      { from: "A", to: "B", weight: 4 },
      { from: "A", to: "D", weight: 2 },
      { from: "B", to: "C", weight: 3 },
      { from: "C", to: "E", weight: 1 },
      { from: "C", to: "F", weight: 5 },
      { from: "D", to: "C", weight: 4 },
      { from: "E", to: "F", weight: 2 },
    ],
  },
}
