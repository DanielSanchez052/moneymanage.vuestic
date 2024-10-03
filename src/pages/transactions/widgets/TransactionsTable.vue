<script setup lang="ts">
import { PropType, computed } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { Transaction, TransactionFilters } from '../types'
import TransactionTypeBadge from '../components/TransactionTypeBadge.vue'
import BooleanBadge from '../../../components/general/BooleanBadge.vue'
import { PaginatedResult, Pagination } from '../../../data/types'
import { formatMoney, formatDateToISO } from '../../../services/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const columns = defineVaDataTableColumns([
  { label: t('transactions.table.ammount'), key: 'ammount' },
  { label: t('transactions.table.transactionDate'), key: 'transactionDate' },
  { label: t('transactions.table.type'), key: 'typeName' },
  { label: t('transactions.table.source'), key: 'sourceName' },
  { label: t('transactions.table.active'), key: 'isActive' },
  { label: ' ', key: 'actions' },
])

const props = defineProps({
  transactions: {
    type: Object as PropType<PaginatedResult<Transaction>>,
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
    type: Object as PropType<TransactionFilters>,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'edit', transaction: Transaction): void
  (event: 'delete', transaction: Transaction): void
  (event: 'moreInfo', transaction: Transaction): void
}>()

const totalPages = computed(() => Math.ceil(props.transactions.totalCount / props.pagination.PageSize))
</script>

<template>
  <div>
    <VaDataTable :items="transactions.items" :columns="columns" :loading="loading">
      <template #cell(ammount)="{ rowData: transaction }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          {{ formatMoney(transaction.ammount) }}
        </div>
      </template>
      <template #cell(transactionDate)="{ rowData: transaction }">
        <div class="flex items-center gap-2 ellipsis max-w-[230px]">
          {{ formatDateToISO(transaction.transactionDate) }}
        </div>
      </template>
      <template #cell(typeName)="{ rowData: transaction }">
        <TransactionTypeBadge :status-name="transaction.typeName" :status="transaction.type.name" />
      </template>
      <template #cell(isActive)="{ rowData: transaction }">
        <BooleanBadge :status="transaction.isActive" />
      </template>
      <template #cell(actions)="{ rowData: transaction }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="mso-edit"
            aria-label="Edit project"
            @click="$emit('edit', transaction as Transaction)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete project"
            @click="$emit('delete', transaction as Transaction)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="visibility"
            color="secondary"
            aria-label="Show More Info"
            @click="emit('moreInfo', transaction as Transaction)"
          />
        </div>
      </template>
    </VaDataTable>
    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
      <div>
        <b>{{ $props.transactions.totalCount }} results.</b>
        Results per page
        <VaSelect v-model="$props.pagination.PageSize" class="!w-20" :options="[10, 25, 50, 100, 200, 300, 500, 1000]" />
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
