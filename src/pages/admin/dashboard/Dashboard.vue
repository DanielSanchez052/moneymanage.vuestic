<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import RevenueUpdates from './cards/RevenueReport.vue'
import SourceReport from './cards/SourceReport.vue'
import MonthlyChart from './cards/MonthlyChart.vue'
import { Transaction, TransactionFilters } from '../../transactions/types'
import { useBreakpoint } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../../stores/auth'
import { Pagination } from '../../../data/types'
import { useTransactions } from '../../transactions/composables/useTransactions'
import { useSources } from '../../sources/composables/useSources'
import { months } from '../../../data/charts/revenueChartData'
import { SourceTotal, SourceTotalPerMonth } from '../../../data/charts/sourceChartData'

const { t } = useI18n()
const authStore = useAuthStore()
const breakpoints = useBreakpoint()
const pagination_filters = ref<Pagination>({ PageIndex: 1, PageSize: 500 })
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

const { sources, isLoading: sourceIsLoading } = useSources({
  authParams: authParams,
})

const pageSizeOptions = ref<number[]>([25, 50, 100, 200, 300, 500, 1000])

const addPageSizeOption = (value: string) => {
  pageSizeOptions.value.push(parseInt(value))
  pagination_filters.value.PageSize = parseInt(value)
}

const clearFilters = () => {
  filters.value.TransactionDateRange = null
  pagination_filters.value.PageSize = 500
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
  if (isLoading.value) {
    return []
  } else {
    return months.map((month: string, idx: number) =>
      transactions.value.items
        .filter((t: Transaction) => new Date(t.transactionDate).getMonth() == idx && t.type.id == 1)
        .reduce((n: number, { ammount }: Transaction) => n + ammount, 0),
    )
  }
})

const expends = computed(() => {
  if (isLoading.value) {
    return []
  } else {
    return months.map((month: string, idx: number) =>
      transactions.value.items
        .filter((t: Transaction) => new Date(t.transactionDate).getMonth() == idx && t.type.id == 2)
        .reduce((n: number, { ammount }: Transaction) => n + ammount, 0),
    )
  }
})

const sourcesPerMonth = computed(() =>
  months.map(
    (month: string, idx: number): SourceTotalPerMonth => ({
      month,
      total: sources.value
        .filter((f) =>
          transactions.value.items.some((t) => t.source.id == f.id && new Date(t.transactionDate).getMonth() == idx),
        )
        .map((s) => ({
          sourceId: s?.id ?? 0,
          sourceName: s?.name ?? '',
          earning: transactions.value.items
            .filter(
              (t: Transaction) =>
                new Date(t.transactionDate).getMonth() == idx && t.source.id == s.id && t.type.id == 1,
            )
            .reduce((n: number, { ammount }: Transaction) => n + ammount, 0),
          expenses: transactions.value.items
            .filter(
              (t: Transaction) =>
                new Date(t.transactionDate).getMonth() == idx && t.source.id == s.id && t.type.id == 2,
            )
            .reduce((n: number, { ammount }: Transaction) => n + ammount, 0),
        })),
    }),
  ),
)

const sourcesUsage = computed((): SourceTotal[] => {
  const grouped = groupBy<SourceTotal>(
    sourcesPerMonth.value.flatMap((s) => s.total),
    'sourceId',
  )

  return sources.value.map(
    (s): SourceTotal => ({
      sourceId: s.id,
      sourceName: s.name ?? '',
      earning: Object.keys(grouped).some((k) => k == s.id)
        ? grouped[s.id]?.reduce((n: number, { earning }: SourceTotal) => n + earning, 0) ?? 0
        : 0,
      expenses: Object.keys(grouped).some((k) => k == s.id)
        ? grouped[s.id]?.reduce((n: number, { expenses }: SourceTotal) => n + expenses, 0) ?? 0
        : 0,
    }),
  )
})

function groupBy<T>(collection: T[], key: keyof T) {
  const groupedResult = collection.reduce((previous, current) => {
    if (!previous[current[key]]) {
      previous[current[key]] = [] as T[]
    }

    previous[current[key]].push(current)
    return previous
  }, {} as any) // tried to figure this out, help!!!!!
  return groupedResult
}

const earningBigger = computed(
  () =>
    sourcesUsage.value
      .slice(0)
      .sort((a, b) => a.earning - b.earning)
      .reverse()[0],
)
const expenseBigger = computed(
  () =>
    sourcesUsage.value
      .slice(0)
      .sort((a, b) => a.expenses - b.expenses)
      .reverse()[0],
)

const earningsOfMostBiggerSource = computed(() =>
  months.map((month: string, idx: number) =>
    transactions.value.items
      .filter(
        (t: Transaction) =>
          new Date(t.transactionDate).getMonth() == idx &&
          t.source.id == earningBigger.value.sourceId &&
          t.type.id == 1,
      )
      .reduce((n: number, { ammount }: Transaction) => n + ammount, 0),
  ),
)

const expensesOfMostBiggerSource = computed(() =>
  months.map((month: string, idx: number) =>
    transactions.value.items
      .filter(
        (t: Transaction) =>
          new Date(t.transactionDate).getMonth() == idx &&
          t.source.id == expenseBigger.value.sourceId &&
          t.type.id == 2,
      )
      .reduce((n: number, { ammount }: Transaction) => n + ammount, 0),
  ),
)
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
                <span v-if="!isLoading">Total: {{ transactions.totalCount }}</span>
                <span v-if="!isLoading">Results: {{ transactions.items.length }}</span>
              </div>
            </div>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
    <div v-if="!isLoading" class="flex flex-col sm:flex-row gap-4">
      <RevenueUpdates :transactions="transactions.items" class="w-full sm:w-[70%]" />
      <div class="flex flex-col gap-4 w-full sm:w-[30%]">
        <MonthlyChart :transactions="earnings" chart-background="rgba(75,192,192,0.4)" chart-label="Monthly Earnings" />
        <MonthlyChart :transactions="expends" chart-background="rgba(75,192,192,0.4)" chart-label="Monthly Expenses" />
      </div>
    </div>
    <div v-if="!isLoading && !sourceIsLoading" class="flex flex-col sm:flex-row gap-4">
      <div class="flex flex-col gap-4 w-full sm:w-[30%]">
        <MonthlyChart
          :transactions="earningsOfMostBiggerSource"
          chart-background="rgba(75,192,192,0.4)"
          :chart-label="`Earnings ${earningBigger.sourceName}`"
        />
        <MonthlyChart
          :transactions="expensesOfMostBiggerSource"
          chart-background="rgba(75,192,192,0.4)"
          :chart-label="`Expenses ${expenseBigger.sourceName}`"
        />
      </div>
      <SourceReport :revenues="sourcesPerMonth" :sources="sources" class="w-full sm:w-[70%]" />
    </div>
  </section>
</template>
