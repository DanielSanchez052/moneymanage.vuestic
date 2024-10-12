<script lang="ts" setup>
import { toRefs, computed } from 'vue'
import { earningsColor, expensesColor } from '../../../../data/charts/revenueChartData'
import { Chart, registerables } from 'chart.js'

import VaChart from '../../../../components/va-charts/VaChart.vue'
import { SourceTotal } from '../../../../data/charts/sourceChartData'
import { Source } from '../../../sources/types'

const props = defineProps<{
  months: string[]
  sources: Source[]
  revenues: SourceTotal[]
}>()

const { sources, revenues, months } = toRefs(props)

Chart.register(...registerables)

const chart_data = computed(() => ({
  labels: sources.value.map(s => s.name),
  datasets: [
    {
      // Show relative expenses ratio
      // label: "earning",
      data: revenues.value.map(({ earning }) => earning),
      backgroundColor: expensesColor,
      // barThickness: BR_THICKNESS,
    },
    {
      // Show relative expenses ratio
      label: 'expenses',
      data: revenues.value.map(({ expenses }) => expenses),
      backgroundColor: earningsColor,
      // barThickness: BR_THICKNESS,
    },
  ],
}))

const chart_options = computed(() => ({
  maintainAspectRatio: false,
  responsive: true,
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: true,
      stacked: false,
      grid: {
        display: true,
      },
      border: {
        width: 0,
      },
    },
    y: {
      display: true,
      beginAtZero: true,
    },
  },
}))
</script>

<template>
  <div class="flex justify-center w-full h-full overflow-hidden relative">
    <!-- <canvas ref="canvas" id="canvas" style="max-width: 100%"></canvas> -->
    <VaChart type="bar" :data="chart_data" :options="chart_options" />
    <!-- <Bar id="bar-chart" :data="chart_data" :options="chart_options" /> -->
  </div>
</template>

<style lang="scss" scoped>
canvas {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
