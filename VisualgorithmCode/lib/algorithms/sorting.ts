export interface SortStep {
  array: number[]
  comparing?: [number, number]
  swapping?: [number, number]
  sorted?: number[]
  pivot?: number
  left?: number
  right?: number
}

export interface AlgorithmResult {
  steps: SortStep[]
  comparisons: number
  swaps: number
  arrayAccesses: number
}

export class SortingAlgorithms {
  static bubbleSort(arr: number[]): AlgorithmResult {
    const steps: SortStep[] = []
    const array = [...arr]
    let comparisons = 0
    let swaps = 0
    let arrayAccesses = 0

    steps.push({ array: [...array] })

    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        // Comparing step
        comparisons++
        arrayAccesses += 2
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
        })

        if (array[j] > array[j + 1]) {
          // Swapping step
          swaps++
          arrayAccesses += 2
          steps.push({
            array: [...array],
            swapping: [j, j + 1],
          })
          ;[array[j], array[j + 1]] = [array[j + 1], array[j]]

          steps.push({
            array: [...array],
          })
        }
      }

      // Mark element as sorted
      steps.push({
        array: [...array],
        sorted: Array.from({ length: array.length - i }, (_, idx) => array.length - 1 - idx),
      })
    }

    // Final sorted state
    steps.push({
      array: [...array],
      sorted: Array.from({ length: array.length }, (_, idx) => idx),
    })

    return { steps, comparisons, swaps, arrayAccesses }
  }

  static insertionSort(arr: number[]): AlgorithmResult {
    const steps: SortStep[] = []
    const array = [...arr]
    let comparisons = 0
    let swaps = 0
    let arrayAccesses = 0

    steps.push({ array: [...array] })

    for (let i = 1; i < array.length; i++) {
      const key = array[i]
      let j = i - 1
      arrayAccesses++

      steps.push({
        array: [...array],
        comparing: [i, j >= 0 ? j : 0],
      })

      while (j >= 0 && array[j] > key) {
        comparisons++
        arrayAccesses += 2

        steps.push({
          array: [...array],
          swapping: [j, j + 1],
        })

        array[j + 1] = array[j]
        swaps++
        j--

        steps.push({
          array: [...array],
        })
      }

      if (j >= 0) comparisons++
      array[j + 1] = key
      arrayAccesses++

      steps.push({
        array: [...array],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
      })
    }

    steps.push({
      array: [...array],
      sorted: Array.from({ length: array.length }, (_, idx) => idx),
    })

    return { steps, comparisons, swaps, arrayAccesses }
  }

  static mergeSort(arr: number[]): AlgorithmResult {
    const steps: SortStep[] = []
    const array = [...arr]
    let comparisons = 0
    let swaps = 0
    let arrayAccesses = 0

    steps.push({ array: [...array] })

    function merge(left: number, mid: number, right: number) {
      const leftArr = array.slice(left, mid + 1)
      const rightArr = array.slice(mid + 1, right + 1)

      let i = 0,
        j = 0,
        k = left

      while (i < leftArr.length && j < rightArr.length) {
        comparisons++
        arrayAccesses += 2

        steps.push({
          array: [...array],
          comparing: [left + i, mid + 1 + j],
        })

        if (leftArr[i] <= rightArr[j]) {
          array[k] = leftArr[i]
          i++
        } else {
          array[k] = rightArr[j]
          j++
        }

        arrayAccesses++
        swaps++
        k++

        steps.push({
          array: [...array],
        })
      }

      while (i < leftArr.length) {
        array[k] = leftArr[i]
        arrayAccesses++
        swaps++
        i++
        k++
        steps.push({ array: [...array] })
      }

      while (j < rightArr.length) {
        array[k] = rightArr[j]
        arrayAccesses++
        swaps++
        j++
        k++
        steps.push({ array: [...array] })
      }
    }

    function mergeSortHelper(left: number, right: number) {
      if (left < right) {
        const mid = Math.floor((left + right) / 2)

        mergeSortHelper(left, mid)
        mergeSortHelper(mid + 1, right)
        merge(left, mid, right)
      }
    }

    mergeSortHelper(0, array.length - 1)

    steps.push({
      array: [...array],
      sorted: Array.from({ length: array.length }, (_, idx) => idx),
    })

    return { steps, comparisons, swaps, arrayAccesses }
  }

  static quickSort(arr: number[]): AlgorithmResult {
    const steps: SortStep[] = []
    const array = [...arr]
    let comparisons = 0
    let swaps = 0
    let arrayAccesses = 0

    steps.push({ array: [...array] })

    function partition(low: number, high: number): number {
      const pivot = array[high]
      arrayAccesses++
      let i = low - 1

      steps.push({
        array: [...array],
        pivot: high,
        left: low,
        right: high - 1,
      })

      for (let j = low; j < high; j++) {
        comparisons++
        arrayAccesses++

        steps.push({
          array: [...array],
          comparing: [j, high],
          pivot: high,
        })

        if (array[j] < pivot) {
          i++
          if (i !== j) {
            steps.push({
              array: [...array],
              swapping: [i, j],
              pivot: high,
            })
            ;[array[i], array[j]] = [array[j], array[i]]
            swaps++
            arrayAccesses += 2

            steps.push({
              array: [...array],
              pivot: high,
            })
          }
        }
      }

      if (i + 1 !== high) {
        steps.push({
          array: [...array],
          swapping: [i + 1, high],
          pivot: high,
        })
        ;[array[i + 1], array[high]] = [array[high], array[i + 1]]
        swaps++
        arrayAccesses += 2

        steps.push({
          array: [...array],
        })
      }

      return i + 1
    }

    function quickSortHelper(low: number, high: number) {
      if (low < high) {
        const pi = partition(low, high)
        quickSortHelper(low, pi - 1)
        quickSortHelper(pi + 1, high)
      }
    }

    quickSortHelper(0, array.length - 1)

    steps.push({
      array: [...array],
      sorted: Array.from({ length: array.length }, (_, idx) => idx),
    })

    return { steps, comparisons, swaps, arrayAccesses }
  }
}
