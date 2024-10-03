<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import RevenueUpdates from './cards/RevenueReport.vue'
import MonthlyChart from './cards/MonthlyChart.vue'
import { Transaction, TransactionFilters } from '../../transactions/types'
import { useBreakpoint } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../../stores/auth'
import { Pagination } from '../../../data/types'
import { useTransactions } from '../../transactions/composables/useTransactions'
import { months } from '../../../data/charts/revenueChartData'

const { t } = useI18n()
const authStore = useAuthStore()
const breakpoints = useBreakpoint()
const pagination_filters = ref<Pagination>({ PageIndex: 1, PageSize: 100 })
const filters = ref<TransactionFilters>({
  Type: null,
  Source: null,
  AccountId: null,
  TransactionDateRange: null,
})
const authParams = reactive({
  token: authStore.user?.token ?? '',
  accountId: authStore.user?.accountId ?? '',
})

const { transactions, isLoading } = useTransactions({
  authParams: authParams,
  filters: filters,
  pagination: pagination_filters,
})

const pageSizeOptions = ref<number[]>([25, 50, 100, 200, 300, 500, 1000])


const addPageSizeOption = (value: string) => {
  pageSizeOptions.value.push(parseInt(value))
  pagination_filters.value.PageSize = parseInt(value)
}

const clearFilters = () => {
  filters.value.TransactionDateRange = null
  pagination_filters.value.PageSize = 100
}

const isMobile = ref(false)

const onResize = () => {
  isMobile.value = breakpoints.smDown
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  onResize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

const earnings = computed(() => {
  return months.map((month: string, idx: number) =>
    transactions.value.items
      .filter((t: Transaction) => new Date(t.transactionDate).getMonth() == idx && t.type.id == 1)
      .reduce((n: number, { ammount }: Transaction) => n + ammount, 0),
  )
})

const expends = computed(() => {
  return months.map((month: string, idx: number) =>
    transactions.value.items
      .filter((t: Transaction) => new Date(t.transactionDate).getMonth() == idx && t.type.id == 2)
      .reduce((n: number, { ammount }: Transaction) => n + ammount, 0),
  )
})
</script>

<template>
  <h1 class="page-title font-bold">Dashboard</h1>
  <section class="flex flex-col gap-4">
    <div>
      <VaCard>
        <VaCardContent>
          <div class="flex gap-4 flex-col sm:flex-row justify-between">
            <div class="flex items-center justify-center">
              <VaButton icon="cleaning_services" class="w-" :block="isMobile" color="primary" @click="clearFilters" />
            </div>
            <div class="flex gap-4 flex-col sm:flex-row">
              <VaDateInput
                v-model="filters.TransactionDateRange"
                :placeholder="t('transactions.dateRangeFilter')"
                mode="range"
              />
              <VaSelect
                v-model="pagination_filters.PageSize"
                :options="pageSizeOptions"
                allow-create
                placeholder="Page Size"
                @createNew="addPageSizeOption"
              />
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
              <VaProgressCircle indeterminate :thickness="0.3" :class="!isLoading ? 'hidden' : ''" />
              <div class="flex flex-col items-center justify-center">
                <span>Total: {{ transactions.totalCount }}</span>
                <span>Results: {{ transactions.items.length }}</span>
              </div>
            </div>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
    <div class="flex flex-col sm:flex-row gap-4">
      <RevenueUpdates :transactions="transactions.items" class="w-full sm:w-[70%]" />
      <div class="flex flex-col gap-4 w-full sm:w-[30%]">
        <MonthlyChart :transactions="earnings" chart-background="rgba(75,192,192,0.4)" chart-label="Monthly Earnings" />
        <MonthlyChart :transactions="expends" chart-background="rgba(75,192,192,0.4)" chart-label="Monthly Expenses" />
      </div>
    </div>
  </section>
</template>
