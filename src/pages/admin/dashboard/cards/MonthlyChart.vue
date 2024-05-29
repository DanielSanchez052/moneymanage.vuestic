<template>
  <VaCard>
    <VaCardTitle>
      <h1 class="card-title text-tag text-secondary font-bold uppercase">{{ chartLabel }}</h1>
    </VaCardTitle>
    <VaCardContent>
      <div class="p-1 bg-black rounded absolute right-4 top-4">
        <VaIcon name="mso-attach_money" color="#fff" size="large" />
      </div>
      <section>
        <div class="text-xl font-bold mb-2">{{ formatMoney(total) }}</div>
      </section>
      <div class="w-full flex items-center">
        <!-- <Line id="line-chart" :data="chartData" :options="options"/> -->
        <VaChart :data="chartData" class="h-24" type="line" :options="options" />
      </div>
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
import { PropType, computed, toRefs } from 'vue'
import { VaCard } from 'vuestic-ui'
import VaChart from '../../../../components/va-charts/VaChart.vue'
import { useChartData } from '../../../../data/charts/composables/useChartData'
import { TLineChartData } from '../../../../data/types'
import { months } from '../../../../data/charts/revenueChartData'
import { Chart, registerables, ChartOptions } from 'chart.js'
import { formatMoney } from '../../../../services/utils'

Chart.register(...registerables)

const props = defineProps({
  transactions: {
    type: Object as PropType<number[]>,
    required: true,
  },
  chartLabel: {
    type: String,
    required: true,
  },
  chartBackground: {
    type: String,
    required: true,
  },
})

const { transactions, chartBackground, chartLabel } = toRefs(props)

const lineChartData = computed<TLineChartData>(() => {
  return {
    labels: months,
    datasets: [
      {
        label: chartLabel.value,
        backgroundColor: chartBackground.value,
        data: transactions.value,
      },
    ],
  }
})

const chartData = useChartData(lineChartData)

const total = computed(() => transactions.value.reduce((n: number, ammount) => n + ammount, 0))

const options: ChartOptions<'line'> = {
  scales: {
    x: {
      display: false,
      grid: {
        display: false, // Disable X-axis grid lines ("net")
      },
    },
    y: {
      display: false,
      grid: {
        display: false, // Disable Y-axis grid lines ("net")
      },
      ticks: {
        display: false, // Hide Y-axis values
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
}
</script>
