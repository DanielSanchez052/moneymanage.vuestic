<script lang="ts" setup>
import { toRefs, computed } from 'vue'
import type { Revenues } from '../../../../data/charts/revenueChartData'
import { earningsColor, expensesColor } from '../../../../data/charts/revenueChartData'
import { Chart, registerables, ChartOptions} from 'chart.js'
import { Bar } from 'vue-chartjs'
import VaChart from '../../../../components/va-charts/VaChart.vue'

const props = defineProps<{
  months: string[]
  revenues: Revenues[]
}>()

const { revenues, months } = toRefs(props)

Chart.register(...registerables)

const chart_data = computed(() => ({
  labels: months.value,
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

const chart_options = computed<ChartOptions>(() => ({
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
    <VaChart type="bar" :data="chart_data" :options="chart_options"/>
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
