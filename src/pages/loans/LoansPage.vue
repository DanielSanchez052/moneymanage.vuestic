<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useLoans } from './composables/useLoans'
import { useAuthStore } from '../../stores/auth'
import LoanTable from './widgets/LoansTable.vue'
import LoanHistoryTable from './widgets/LoanHistoryTable.vue'
import EditLoanForm from './widgets/EditLoanForm.vue'
import TransactionForm from './widgets/TransactionForm.vue'
import { Loan, LoanFilters, LoanTransactionHistory, NewLoan } from './types'
import { useModal, useToast } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { useLoanFrecuency } from './composables/useLoanFrecuency'

const { t } = useI18n()
const authStore = useAuthStore()
const loanSelected = ref<Loan | null>(null)
const isPayment = ref(false)
const loanHistorySelected = ref<LoanTransactionHistory | null>(null)
const doShowLoanFormModal = ref(false)
const doShowTransactionModal = ref(false)
const doShowMoreInfoModal = ref(false)
const pageSection = ref<'list' | 'detail'>('list')
const filters = ref<LoanFilters>({
  AccountId: null,
  Borrow: null,
  Frecuency: null,
  isPaid: null,
  Lend: null,
})
const authParams = reactive({
  token: authStore.user?.token ?? '',
  accountId: authStore.user?.accountId ?? '',
})
const { loans, isLoading, pagination, add } = useLoans({
  authParams: authParams,
  filters: filters,
})

const { loanFrecuency } = useLoanFrecuency({ authParams })

function setPageSection(section: 'list' | 'detail' = 'detail') {
  pageSection.value = section
}

const showMoreInfo = (loan: Loan) => {
  loanSelected.value = loan
  doShowMoreInfoModal.value = true
  setPageSection('detail')
}

const showTransactionModal = (loan: Loan | null, loanHistory: LoanTransactionHistory | null, isPaymentV: boolean) => {
  loanHistorySelected.value = loanHistory
  loanSelected.value = loan
  doShowTransactionModal.value = true
  isPayment.value = isPaymentV
}

const createNewLoan = () => {
  loanSelected.value = null
  doShowLoanFormModal.value = true
}

const { init: notify } = useToast()

const onLoanSaved = async (loan: NewLoan) => {
  doShowLoanFormModal.value = false
  const result = await add(loan)

  if (result?.success) {
    notify({
      message: 'Loan created',
      color: 'success',
    })
  } else {
    const messages = result?.errors.flatMap((item) => item.message).join(',')
    notify({
      message: `Has error occurred on Loan creation: ${messages}`,
      color: 'danger',
    })
  }
}

const { confirm } = useModal()

const editFormRef = ref()

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}
</script>

<template>
  <h1 class="page-title">{{ t('loans.tittle') }}</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButton
            icon="arrow_back"
            :class="[pageSection != 'detail' ? 'hidden' : '']"
            @click="setPageSection('list')"
          />
        </div>
        <VaButton icon="add" size="medium" :loading="isLoading" @click="createNewLoan" />
      </div>
      <div v-if="pageSection == 'list'">
        <LoanTable
          v-model:pagination="pagination"
          :loans="loans"
          :loading="isLoading"
          :filters="filters"
          @moreInfo="showMoreInfo"
        />
      </div>
      <div v-else>
        <LoanHistoryTable :loan="loanSelected" :loading="isLoading" @showTransaction="showTransactionModal" />
      </div>
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowLoanFormModal"
      size="small"
      mobile-fullscreen
      close-button
      stateful
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 class="va-h5 mb-4">{{ t('loans.add') }}</h1>
      <EditLoanForm
        ref="editFormRef"
        :frecuency-list="loanFrecuency"
        @close="cancel"
        @save="
          (budget) => {
            onLoanSaved(budget)
            ok()
          }
        "
      />
    </VaModal>
    <VaModal
      v-slot="{ cancel }"
      v-model="doShowTransactionModal"
      size="small"
      mobile-fullscreen
      close-button
      stateful
      hide-default-actions
    >
      <h1 class="va-h5 mb-4">{{ isPayment ? 'Pago' : 'Detalle Transaccion' }}</h1>
      <TransactionForm
        :loan-history="loanHistorySelected"
        :loan="loanSelected"
        :is-payment="isPayment"
        @close="cancel"
      />
    </VaModal>
  </VaCard>
</template>
