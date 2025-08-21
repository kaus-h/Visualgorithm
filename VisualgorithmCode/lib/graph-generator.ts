import type { Node, Edge } from "./algorithms/graph"

export interface GraphGenerationOptions {
  nodeCount: number
  pathLength?: number
  graphType: "linear" | "circular" | "grid" | "random" | "star"
  weighted?: boolean
  minWeight?: number
  maxWeight?: number
  canvasWidth?: number
  canvasHeight?: number
}

export class GraphGenerator {
  static generateGraph(options: GraphGenerationOptions): { nodes: Node[]; edges: Edge[] } {
    const {
      nodeCount,
      pathLength,
      graphType,
      weighted = false,
      minWeight = 1,
      maxWeight = 10,
      canvasWidth = 500,
      canvasHeight = 300,
    } = options

    const nodes = this.generateNodes(nodeCount, graphType, canvasWidth, canvasHeight)
    const edges = this.generateEdges(nodes, graphType, pathLength, weighted, minWeight, maxWeight)

    return { nodes, edges }
  }

  private static generateNodes(count: number, type: string, width: number, height: number): Node[] {
    const nodes: Node[] = []
    const padding = 50

    switch (type) {
      case "linear":
        // Arrange nodes in a horizontal line
        for (let i = 0; i < count; i++) {
          const x = padding + (i * (width - 2 * padding)) / Math.max(1, count - 1)
          const y = height / 2
          nodes.push({
            id: String.fromCharCode(65 + i), // A, B, C, etc.
            x,
            y,
            label: String.fromCharCode(65 + i),
          })
        }
        break

      case "circular":
        // Arrange nodes in a circle
        const centerX = width / 2
        const centerY = height / 2
        const radius = Math.min(width, height) / 3

        for (let i = 0; i < count; i++) {
          const angle = (2 * Math.PI * i) / count
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)
          nodes.push({
            id: String.fromCharCode(65 + i),
            x,
            y,
            label: String.fromCharCode(65 + i),
          })
        }
        break

      case "grid":
        // Arrange nodes in a grid pattern
        const cols = Math.ceil(Math.sqrt(count))
        const rows = Math.ceil(count / cols)

        for (let i = 0; i < count; i++) {
          const row = Math.floor(i / cols)
          const col = i % cols
          const x = padding + (col * (width - 2 * padding)) / Math.max(1, cols - 1)
          const y = padding + (row * (height - 2 * padding)) / Math.max(1, rows - 1)
          nodes.push({
            id: String.fromCharCode(65 + i),
            x,
            y,
            label: String.fromCharCode(65 + i),
          })
        }
        break

      case "star":
        // Central node with others around it
        const centerNode = {
          id: "A",
          x: width / 2,
          y: height / 2,
          label: "A",
        }
        nodes.push(centerNode)

        const starRadius = Math.min(width, height) / 3
        for (let i = 1; i < count; i++) {
          const angle = (2 * Math.PI * (i - 1)) / (count - 1)
          const x = width / 2 + starRadius * Math.cos(angle)
          const y = height / 2 + starRadius * Math.sin(angle)
          nodes.push({
            id: String.fromCharCode(65 + i),
            x,
            y,
            label: String.fromCharCode(65 + i),
          })
        }
        break

      case "random":
      default:
        // Random placement
        for (let i = 0; i < count; i++) {
          const x = padding + Math.random() * (width - 2 * padding)
          const y = padding + Math.random() * (height - 2 * padding)
          nodes.push({
            id: String.fromCharCode(65 + i),
            x,
            y,
            label: String.fromCharCode(65 + i),
          })
        }
        break
    }

    return nodes
  }

  private static generateEdges(
    nodes: Node[],
    type: string,
    pathLength?: number,
    weighted = false,
    minWeight = 1,
    maxWeight = 10,
  ): Edge[] {
    const edges: Edge[] = []
    const getWeight = () => (weighted ? Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight : 1)

    switch (type) {
      case "linear":
        // Connect nodes in sequence
        for (let i = 0; i < nodes.length - 1; i++) {
          edges.push({
            from: nodes[i].id,
            to: nodes[i + 1].id,
            weight: getWeight(),
          })
        }

        // Add some additional connections if pathLength is specified
        if (pathLength && pathLength > nodes.length - 1) {
          const additionalEdges = Math.min(pathLength - (nodes.length - 1), (nodes.length * (nodes.length - 1)) / 2)
          for (let i = 0; i < additionalEdges; i++) {
            const from = Math.floor(Math.random() * nodes.length)
            const to = Math.floor(Math.random() * nodes.length)
            if (
              from !== to &&
              !edges.some(
                (e) =>
                  (e.from === nodes[from].id && e.to === nodes[to].id) ||
                  (e.from === nodes[to].id && e.to === nodes[from].id),
              )
            ) {
              edges.push({
                from: nodes[from].id,
                to: nodes[to].id,
                weight: getWeight(),
              })
            }
          }
        }
        break

      case "circular":
        // Connect each node to the next, and last to first
        for (let i = 0; i < nodes.length; i++) {
          const nextIndex = (i + 1) % nodes.length
          edges.push({
            from: nodes[i].id,
            to: nodes[nextIndex].id,
            weight: getWeight(),
          })
        }
        break

      case "grid":
        // Connect adjacent nodes in grid
        const cols = Math.ceil(Math.sqrt(nodes.length))
        for (let i = 0; i < nodes.length; i++) {
          const row = Math.floor(i / cols)
          const col = i % cols

          // Connect to right neighbor
          if (col < cols - 1 && i + 1 < nodes.length) {
            edges.push({
              from: nodes[i].id,
              to: nodes[i + 1].id,
              weight: getWeight(),
            })
          }

          // Connect to bottom neighbor
          if (row < Math.ceil(nodes.length / cols) - 1 && i + cols < nodes.length) {
            edges.push({
              from: nodes[i].id,
              to: nodes[i + cols].id,
              weight: getWeight(),
            })
          }
        }
        break

      case "star":
        // Connect center node to all others
        const centerNode = nodes[0]
        for (let i = 1; i < nodes.length; i++) {
          edges.push({
            from: centerNode.id,
            to: nodes[i].id,
            weight: getWeight(),
          })
        }
        break

      case "random":
      default:
        // Create random connections ensuring connectivity
        const targetEdgeCount = Math.min(
          pathLength || Math.floor(nodes.length * 1.5),
          (nodes.length * (nodes.length - 1)) / 2,
        )

        // First ensure connectivity with a spanning tree
        const connected = new Set([nodes[0].id])
        const unconnected = new Set(nodes.slice(1).map((n) => n.id))

        while (unconnected.size > 0) {
          const connectedNode = Array.from(connected)[Math.floor(Math.random() * connected.size)]
          const unconnectedNode = Array.from(unconnected)[Math.floor(Math.random() * unconnected.size)]

          edges.push({
            from: connectedNode,
            to: unconnectedNode,
            weight: getWeight(),
          })

          connected.add(unconnectedNode)
          unconnected.delete(unconnectedNode)
        }

        // Add additional random edges
        while (edges.length < targetEdgeCount) {
          const from = Math.floor(Math.random() * nodes.length)
          const to = Math.floor(Math.random() * nodes.length)

          if (
            from !== to &&
            !edges.some(
              (e) =>
                (e.from === nodes[from].id && e.to === nodes[to].id) ||
                (e.from === nodes[to].id && e.to === nodes[from].id),
            )
          ) {
            edges.push({
              from: nodes[from].id,
              to: nodes[to].id,
              weight: getWeight(),
            })
          }
        }
        break
    }

    return edges
  }

  static getPresetOptions(): Record<string, GraphGenerationOptions> {
    return {
      "Small Path": {
        nodeCount: 4,
        pathLength: 3,
        graphType: "linear",
        weighted: false,
      },
      "Medium Circle": {
        nodeCount: 6,
        graphType: "circular",
        weighted: true,
        minWeight: 1,
        maxWeight: 5,
      },
      "Large Grid": {
        nodeCount: 9,
        graphType: "grid",
        weighted: false,
      },
      "Star Network": {
        nodeCount: 7,
        graphType: "star",
        weighted: true,
        minWeight: 2,
        maxWeight: 8,
      },
      "Random Graph": {
        nodeCount: 8,
        pathLength: 12,
        graphType: "random",
        weighted: true,
        minWeight: 1,
        maxWeight: 10,
      },
    }
  }
}
