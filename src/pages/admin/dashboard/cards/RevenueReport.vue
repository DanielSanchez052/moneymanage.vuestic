<script lang="ts" setup>
import { ref, computed, PropType } from 'vue'
import { VaCard } from 'vuestic-ui'
import RevenueReportChart from './RevenueReportChart.vue'
import { downloadAsCSV } from '../../../../services/toCSV'
import {
  Revenues,
  earningsColor,
  expensesColor,
  months,
  getRevenuePerMonth,
  formatMoney,
} from '../../../../data/charts/revenueChartData'
import { Transaction } from '../../../transactions/types'

const props = defineProps({
  transactions: {
    type: Object as PropType<Transaction[]>,
    required: true,
  },
})

const revenues = computed(() => {
  return months.map((month: string, idx: number): Revenues => {
    return {
      month: month,
      earning: props.transactions
        .filter((t: Transaction) => new Date(t.transactionDate).getMonth() == idx && t.type.id == 1)
        .reduce((n: number, { ammount }: Transaction) => n + ammount, 0),
      expenses: props.transactions
        .filter((t: Transaction) => new Date(t.transactionDate).getMonth() == idx && t.type.id == 2)
        .reduce((n: number, { ammount }: Transaction) => n + ammount, 0),
    }
  })
})

const currentYear = new Date().getFullYear()
const month = new Date().getMonth()
const monthsWithCurrentYear = months.map((month) => `${month} ${currentYear}`)

const selectedMonth = ref(monthsWithCurrentYear[month])

const earningsForSelectedMonth = computed(() => getRevenuePerMonth(selectedMonth.value.split(' ')[0], revenues.value))
const totalEarnings = computed(() => {
  return earningsForSelectedMonth.value.earning + earningsForSelectedMonth.value.expenses
})

const exportAsCSV = () => {
  downloadAsCSV(revenues.value, 'revenue-report')
}
</script>

<template>
  <VaCard class="flex flex-col">
    <VaCardTitle class="flex items-start justify-between">
      <h1 class="card-title text-secondary font-bold uppercase">Revenue Report</h1>
      <div class="flex gap-2">
        <VaSelect v-model="selectedMonth" preset="small" :options="monthsWithCurrentYear" class="w-24" />
        <VaButton class="h-2" size="small" preset="primary" @click="exportAsCSV">Export</VaButton>
      </div>
    </VaCardTitle>
    <VaCardContent class="flex flex-col-reverse md:flex-row md:items-center justify-between gap-5 h-full">
      <section class="flex flex-col items-start w-full sm:w-1/3 md:w-2/5 lg:w-1/4 gap-2 md:gap-8 pl-4">
        <div>
          <p class="text-xl font-semibold">{{ formatMoney(totalEarnings) }}</p>
          <p class="whitespace-nowrap mt-2">Total:</p>
        </div>
        <div class="flex flex-col sm:flex-col gap-2 md:gap-8 w-full">
          <div>
            <div class="flex items-center">
              <span class="inline-block w-2 h-2 mr-2 -ml-4" :style="{ backgroundColor: earningsColor }"></span>
              <span class="text-secondary">Earnings this month</span>
            </div>
            <div class="mt-2 text-xl font-semibold">{{ formatMoney(earningsForSelectedMonth.earning) }}</div>
          </div>
          <div>
            <div class="flex items-center">
              <span class="inline-block w-2 h-2 mr-2 -ml-4" :style="{ backgroundColor: expensesColor }"></span>
              <span class="text-secondary">Expense this month</span>
            </div>
            <div class="mt-2 text-xl font-semibold">{{ formatMoney(earningsForSelectedMonth.expenses) }}</div>
          </div>
        </div>
      </section>
      <RevenueReportChart
        class="w-2/3 md:w-3/5 lg:w-3/4 h-full min-h-72 sm:min-h-32"
        :revenues="revenues"
        :months="months"
      />
    </VaCardContent>
  </VaCard>
</template>
