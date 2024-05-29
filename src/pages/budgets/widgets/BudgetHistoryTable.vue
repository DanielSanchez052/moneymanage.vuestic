<script setup lang="ts">
import { PropType } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { Budget } from '../types'
import TransactionTypeBadge from '../../transactions/components/TransactionTypeBadge.vue'
import BooleanBadge from '../../../components/general/BooleanBadge.vue'
import { formatMoney } from '../../../services/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const columns = defineVaDataTableColumns([
  { label: t('budgets.history-table.targetAmmount'), key: 'targetAmmount' },
  { label: t('budgets.history-table.currentAmmount'), key: 'currentAmmount' },
  { label: t('budgets.history-table.type'), key: 'budgetTypeName' },
  { label: t('budgets.history-table.transactionType'), key: 'targetTypeName' },
  { label: t('budgets.history-table.source'), key: 'targetSourceName' },
  { label: t('budgets.history-table.startDate'), key: 'startDate' },
  { label: t('budgets.history-table.endDate'), key: 'endDate' },
  { label: t('budgets.history-table.active'), key: 'isActive' },
])

defineProps({
  budget: {
    type: Object as PropType<Budget | null>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <div>
    <VaDataTable :items="budget?.budgetHistory" :columns="columns" :loading="loading">
      <template #cell(targetAmmount)="{ rowData: budgetE }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          {{ formatMoney(budgetE.targetAmmount) }}
        </div>
      </template>
      <template #cell(currentAmmount)="{ rowData: budgetE }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          {{ formatMoney(budgetE.currentAmmount) }}
        </div>
      </template>
      <template #cell(targetTypeName)="{ rowData: budgetE }">
        <TransactionTypeBadge :status="budgetE.targetType.name" />
      </template>
      <template #cell(isActive)="{ rowData: budgetE }">
        <BooleanBadge :status="budgetE.isActive" />
      </template>
    </VaDataTable>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(tbody .va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
