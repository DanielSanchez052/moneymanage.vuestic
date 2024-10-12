<script lang="ts" setup>
import { ref, computed, PropType, toRefs } from 'vue'
import { VaCard } from 'vuestic-ui'
import { downloadAsCSV } from '../../../../services/toCSV'
import { earningsColor, expensesColor, months, formatMoney } from '../../../../data/charts/revenueChartData'
import { Source } from '../../../sources/types'
import { getRevenueFiltered, SourceTotalPerMonth } from '../../../../data/charts/sourceChartData'
import SourceReportChart from './SourceReportChart.vue'

const props = defineProps({
  revenues: {
    type: Object as PropType<SourceTotalPerMonth[]>,
    required: true,
  },
  sources: {
    type: Object as PropType<Source[]>,
    required: true,
  },
})

const { sources, revenues } = toRefs(props)

const selectedSource = ref(sources.value[0])

const currentYear = new Date().getFullYear()
const month = new Date().getMonth()
const monthsWithSomeValue = computed(() => revenues.value.filter((r) => r.total.length > 0).map((r) => r.month))
const monthsWithCurrentYear = monthsWithSomeValue.value
  .sort((a, b) => months.indexOf(a) - months.indexOf(b))
  .map((month) => `${month} ${currentYear}`)

const selectedMonth = ref(
  monthsWithCurrentYear[
    monthsWithSomeValue.value.some((m) => m == months[month]) ? monthsWithSomeValue.value.indexOf(months[month]) : 0
  ],
)
const earningsFilteredPerMonth = computed(() => getRevenueFiltered(selectedMonth.value.split(' ')[0], revenues.value))
const earningsFiltered = computed(
  () =>
    earningsFilteredPerMonth.value.total.find((f) => f.sourceId == selectedSource.value.id) ?? {
      earning: 0,
      expenses: 0,
    },
)
const totalEarnings = computed(() => earningsFiltered.value?.earning + earningsFiltered.value?.expenses)

const sourcesWithSomeValue = computed(() =>
  sources.value.filter((s) => earningsFilteredPerMonth.value.total.some((r) => r.sourceId == s.id)),
)

const exportAsCSV = () => {
  downloadAsCSV(revenues.value, 'revenue-report')
}
</script>

<template>
  <VaCard class="flex flex-col">
    <VaCardTitle class="flex items-start justify-between">
      <h1 class="card-title text-secondary font-bold uppercase">Source Report</h1>
      <div class="flex justify-between gap-2">
        <VaSelect v-model="selectedMonth" preset="small" :options="monthsWithCurrentYear" />
        <VaSelect
          v-model="selectedSource"
          placeholder="source"
          text-by="name"
          track-by="id"
          preset="small"
          :options="sourcesWithSomeValue"
        >
          <template #content="{ value: source }">
            <div v-if="source" :key="source.id" class="flex items-center gap-1 mr-4">
              {{ source.name }}
            </div>
          </template>
        </VaSelect>
        <VaButton class="w-full" size="small" preset="primary" @click="exportAsCSV">Export</VaButton>
      </div>
    </VaCardTitle>
    <VaCardContent class="flex flex-col-reverse md:flex-row md:items-center justify-between gap-5 h-full">
      <section class="flex flex-col items-start w-full sm:w-1/3 md:w-2/5 lg:w-1/4 gap-2 md:gap-8 pl-4">
        <div>
          <p class="text-xl font-semibold">{{ formatMoney(totalEarnings) }}</p>
          <p class="whitespace-nowrap mt-2">Total</p>
        </div>
        <div class="flex flex-col sm:flex-col gap-2 md:gap-8 w-full">
          <div>
            <div class="flex items-center">
              <span class="inline-block w-2 h-2 mr-2 -ml-4" :style="{ backgroundColor: earningsColor }"></span>
              <span class="text-secondary">Earnings this month</span>
            </div>
            <div class="mt-2 text-xl font-semibold">{{ formatMoney(earningsFiltered?.earning) }}</div>
          </div>
          <div>
            <div class="flex items-center">
              <span class="inline-block w-2 h-2 mr-2 -ml-4" :style="{ backgroundColor: expensesColor }"></span>
              <span class="text-secondary">Expense this month</span>
            </div>
            <div class="mt-2 text-xl font-semibold">{{ formatMoney(earningsFiltered.expenses) }}</div>
          </div>
        </div>
      </section>
      <SourceReportChart
        class="w-2/3 md:w-3/5 lg:w-3/4 h-full min-h-72 sm:min-h-32"
        :revenues="earningsFilteredPerMonth.total"
        :months="months"
        :sources="sourcesWithSomeValue"
      />
    </VaCardContent>
  </VaCard>
</template>
