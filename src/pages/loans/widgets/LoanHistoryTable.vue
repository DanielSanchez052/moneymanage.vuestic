<script setup lang="ts">
import { PropType } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { Loan, LoanTransactionHistory } from '../types'
import TransactionTypeBadge from '../../transactions/components/TransactionTypeBadge.vue'
import BooleanBadge from '../../../components/general/BooleanBadge.vue'
import { formatMoney, formatDateToISO } from '../../../services/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const columns = defineVaDataTableColumns([
  { label: t('loans.history-table.paymentDate'), key: 'paymentDate' },
  { label: t('loans.history-table.transaction'), key: 'transaction' },
  { label: t('loans.history-table.transactionTypeName'), key: 'transactionTypeName' },
  { label: t('loans.history-table.ammountToPay'), key: 'ammountToPay' },
  { label: t('loans.history-table.ammoundPaid'), key: 'ammoundPaid' },
  { label: t('loans.history-table.generated'), key: 'generated' },
  { label: '', key: 'actions' },
])

defineProps({
  loan: {
    type: Object as PropType<Loan | null>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'showTransaction', loan: Loan, loanHistory: LoanTransactionHistory): void
}>()


</script>

<template>
  <div>
    <VaDataTable :items="loan?.loanTransactionHistory" :columns="columns" :loading="loading">
      <template #cell(ammountToPay)="{ rowData: loanH }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          {{ formatMoney(loanH.ammountToPay) }}
        </div>
      </template>
      <template #cell(transaction)="{ rowData: loanH }">
        <BooleanBadge :status="loanH.transactionCompleted" />
      </template>
      <template #cell(ammoundPaid)="{ rowData: loanH }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          {{ formatMoney(loanH.ammoundPaid) }}
        </div>
      </template>
      <template #cell(transactionTypeName)="{ rowData: loanH }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          <TransactionTypeBadge :status="loanH.transactionTypeName" />
        </div>
      </template>
      <template #cell(generated)="{ rowData: loanH }">
        <BooleanBadge :status="loanH.generated" />
      </template>
      <template #cell(paymentDate)="{ rowData: loanH }">
        <span>{{ formatDateToISO(loanH.paymentDate) }}</span>
      </template>
      <template #cell(actions)="{ rowData: loanH }">
        <div class="flex gap-2 justify-end">
          <VaButton
            v-if="!loanH.transactionCompleted"
            preset="primary"
            size="medium"
            icon="payments"
            color="secondary"
            aria-label="Pagar"
          />
          <VaButton
            v-else
            preset="secondary"
            size="medium"
            icon="account_balance_wallet"
            color="secondary"
            aria-label="Transaccion"
            @click="emit('showTransaction', loan as Loan, loanH as LoanTransactionHistory)"
          />
        </div>
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
