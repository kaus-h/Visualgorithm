"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react"

interface PlaybackControlsProps {
  isPlaying: boolean
  currentStep: number
  totalSteps: number
  speed: number
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onSpeedChange: (speed: number) => void
}

export function PlaybackControls({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
}: PlaybackControlsProps) {
  const hasAlgorithm = totalSteps > 0

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStep} of {Math.max(totalSteps - 1, 0)}
              </span>
              <span>Speed: {speed}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: totalSteps > 0 ? `${(currentStep / Math.max(totalSteps - 1, 1)) * 100}%` : "0%" }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={onReset} disabled={!hasAlgorithm}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onStepBackward} disabled={!hasAlgorithm || currentStep <= 0}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={isPlaying ? onPause : onPlay}
              disabled={!hasAlgorithm || currentStep >= totalSteps - 1}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onStepForward}
              disabled={!hasAlgorithm || currentStep >= totalSteps - 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Animation Speed</label>
            <Slider
              value={[speed]}
              onValueChange={(value) => onSpeedChange(value[0])}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very Slow</span>
              <span>Very Fast</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
