<script setup lang="ts">
import { PropType, computed } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { Loan, LoanFilters } from '../types'
import BooleanBadge from '../../../components/general/BooleanBadge.vue'
import { PaginatedResult, Pagination } from '../../../data/types'
import { formatMoney } from '../../../services/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const columns = defineVaDataTableColumns([
  { label: t('loans.table.lend'), key: 'lend' },
  { label: t('loans.table.borrow'), key: 'borrow' },
  { label: t('loans.table.ammountBorrowed'), key: 'ammountBorrowed' },
  { label: t('loans.table.percentage'), key: 'percentage' },
  { label: t('loans.table.paymentFrecuencyName'), key: 'paymentFrecuencyName' },
  { label: t('loans.table.paid'), key: 'paid' },
  { label: ' ', key: 'actions' },
])

const props = defineProps({
  loans: {
    type: Object as PropType<PaginatedResult<Loan>>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  pagination: {
    type: Object as PropType<Pagination>,
    required: true,
  },
  filters: {
    type: Object as PropType<LoanFilters>,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'moreInfo', loan: Loan): void
}>()

const totalPages = computed(() => Math.ceil(props.loans.totalCount / props.pagination.PageSize))
</script>

<template>
  <div>
    <VaDataTable :items="loans.items" :columns="columns" :loading="loading">
      <template #cell(ammountBorrowed)="{ rowData: loan }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          {{ formatMoney(loan.ammountBorrowed) }}
        </div>
      </template>
      <template #cell(paid)="{ rowData: loan }">
        <BooleanBadge :status="loan.paid" />
      </template>
      <template #cell(percentage)="{ rowData: loan }">
        <span>{{ loan.percentage }}%</span>
      </template>
      <template #cell(actions)="{ rowData: loan }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            icon="visibility"
            color="secondary"
            aria-label="Show More Info"
            @click="emit('moreInfo', loan as Loan)"
          />
        </div>
      </template>
    </VaDataTable>
    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
      <div>
        <b>{{ $props.loans.totalCount }} results.</b>
        Results per page
        <VaSelect v-model="$props.pagination.PageSize" class="!w-20" :options="[10, 25, 50, 100]" />
      </div>

      <div v-if="totalPages > 1" class="flex">
        <VaButton
          preset="secondary"
          icon="va-arrow-left"
          aria-label="Previous page"
          :disabled="$props.pagination.PageIndex === 1"
          @click="$props.pagination.PageIndex--"
        />
        <VaButton
          class="mr-2"
          preset="secondary"
          icon="va-arrow-right"
          aria-label="Next page"
          :disabled="$props.pagination.PageIndex === totalPages"
          @click="$props.pagination.PageIndex++"
        />
        <VaPagination
          v-model="$props.pagination.PageIndex"
          buttons-preset="secondary"
          :pages="totalPages"
          :visible-pages="5"
          :boundary-links="false"
          :direction-links="false"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
