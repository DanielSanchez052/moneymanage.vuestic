<template>
  <component :is="chartComponent" :chart-data="data" :data="data" :options="chartOptions" class="va-chart" />
</template>

<script lang="ts" setup generic="T extends 'line' | 'bar' | 'bubble' | 'doughnut' | 'pie'">
import { computed, toRefs } from 'vue'
import type { ChartOptions, ChartData } from 'chart.js'
import { defaultConfig, chartTypesMap } from './vaChartConfigs'

defineOptions({
  name: 'VaChart',
})

const props = defineProps<{
  data: ChartData<T>
  options?: ChartOptions<T>
  type: T
}>()

const { data, options, type } = toRefs(props)

const chartComponent = chartTypesMap[type.value]

const chartOptions = computed<ChartOptions<T>>(() => ({
  ...(defaultConfig as any),
  ...options.value,
}))
</script>

<style lang="scss">
.va-chart {
  min-width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > * {
    height: 100%;
    width: 100%;
  }

  canvas {
    width: 100%;
    height: 80%;
    min-height: 20px;
    margin-bottom: 5%;
  }
}
</style>
