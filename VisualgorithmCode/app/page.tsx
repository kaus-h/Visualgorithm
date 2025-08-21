"use client"

import { AlgorithmSelector } from "@/components/algorithm-selector"
import { VisualizationCanvas } from "@/components/visualization-canvas"
import { GraphVisualization } from "@/components/graph-visualization"
import { PlaybackControls } from "@/components/playback-controls"
import { InfoPanel } from "@/components/info-panel"
import { useAlgorithmVisualizer } from "@/hooks/use-algorithm-visualizer"

export default function Home() {
  const visualizer = useAlgorithmVisualizer()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-heading text-4xl font-bold text-gradient-green mb-2">
            Algorithm Visualizer by Kaustav Kalra
          </h1>
          <p className="text-muted-foreground text-lg">Interactive step-by-step visualization of classic algorithms</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Algorithm Selection Only */}
          <div className="lg:col-span-1 space-y-6">
            <AlgorithmSelector
              selectedAlgorithm={visualizer.selectedAlgorithm}
              onSelectAlgorithm={visualizer.selectAlgorithm}
            />
          </div>

          {/* Center - Visualization Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border p-1">
              {visualizer.mode === "sorting" ? (
                <VisualizationCanvas
                  data={visualizer.data}
                  currentStepData={visualizer.currentStepData}
                  onGenerateRandom={() => visualizer.generateRandomData()}
                  onSetCustomData={visualizer.setCustomData}
                />
              ) : (
                <GraphVisualization
                  nodes={visualizer.nodes}
                  edges={visualizer.edges}
                  currentStepData={visualizer.currentGraphStepData}
                  startNode={visualizer.startNode}
                  targetNode={visualizer.targetNode}
                  onLoadGraph={visualizer.loadGraph}
                  onGenerateCustomGraph={visualizer.generateCustomGraph}
                  onSetStartNode={visualizer.setStartNode}
                  onSetTargetNode={visualizer.setTargetNode}
                />
              )}
            </div>
            <PlaybackControls
              isPlaying={visualizer.isPlaying}
              currentStep={visualizer.currentStep}
              totalSteps={visualizer.totalSteps}
              speed={visualizer.speed}
              onPlay={visualizer.play}
              onPause={visualizer.pause}
              onReset={visualizer.reset}
              onStepForward={visualizer.stepForward}
              onStepBackward={visualizer.stepBackward}
              onSpeedChange={visualizer.setSpeed}
            />
          </div>

          {/* Right Sidebar - Info Panel */}
          <div className="lg:col-span-1">
            <InfoPanel
              selectedAlgorithm={visualizer.selectedAlgorithm}
              algorithmResult={visualizer.mode === "sorting" ? visualizer.algorithmResult : null}
              graphAlgorithmResult={visualizer.mode === "graph" ? visualizer.graphAlgorithmResult : null}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
