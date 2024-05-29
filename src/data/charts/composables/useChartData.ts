import { computed, ComputedRef, Ref } from 'vue'
import { useChartColors } from './useChartColors'
import { TChartData } from '../../types'

export function useChartData<T extends TChartData>(data: Ref<T>, alfa?: number): ComputedRef<T> {
  const datasetsColors = data.value.datasets.map((dataset) => dataset.backgroundColor as string)

  const datasetsThemesColors = datasetsColors.map(
    (colors) => useChartColors(colors, alfa)[alfa ? 'generatedHSLAColors' : 'generatedColors'],
  )

  return computed(() => {
    const datasets = data.value.datasets.map((dataset, idx) => ({
      ...dataset,
      backgroundColor: datasetsThemesColors[idx].value,
    }))

    return { ...data.value, datasets } as T
  })
}
