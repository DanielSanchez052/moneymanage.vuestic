<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import { Transaction, NewTransaction } from '../../transactions/types'
import { useTransactions } from '../../transactions/composables/useTransactions'
import { useAuthStore } from '../../../stores/auth'
import { useGlobalStore } from '../../../stores/global-store'
import { useI18n } from 'vue-i18n'
import { Loan, LoanTransactionHistory } from '../types'
import { SelectOption, useToast } from 'vuestic-ui'
const { t } = useI18n()

const globalStore = useGlobalStore()
const authStore = useAuthStore()

const authParams = reactive({
  token: authStore.user?.token ?? '',
  accountId: authStore.user?.accountId ?? '',
})

const props = defineProps<{
  loan: Loan | null
  loanHistory: LoanTransactionHistory | null
  isPayment: boolean
}>()

const emit = defineEmits<{
  (event: 'paymentUpdated'): void
  (event: 'pay', transaction: Transaction, loan: string, loanhistory: string): void
  (event: 'close'): void
}>()

const { transaction, getById, isLoading, add, update } = useTransactions({
  authParams: authParams,
  transactionId: props.loanHistory?.transactionId ?? '',
  initialFetch: false,
})

const { init: notify } = useToast()

const defaultSource = {
  id: '0',
  description: '',
  name: '',
  isActive: true,
}

const defaultNewTransaction: Transaction = {
  id: '',
  accountId: authStore.user?.accountId ?? '',
  ammount: props.loanHistory?.ammountToPay ?? 0,
  source: defaultSource,
  type: {
    id: props.loanHistory?.transactionType.id ?? 0,
    name: props.loanHistory?.transactionType.name ?? '',
  },
  typeName: props.loanHistory?.transactionType.name ?? '',
  sourceName: '',
  isActive: true,
  transactionDate: new Date().toISOString(),
  transactionExtendedProperties: [
    {
      key: 'Why',
      displayName: 'why',
      value: 'loan payment',
    },
  ],
}

const currentTransaction = ref<Transaction>(defaultNewTransaction)

watch(
  () => props.loanHistory,
  async () => {
    if (!props.loanHistory || props.isPayment) {
      return
    }

    await getById(props.loanHistory.transactionId ?? '')

    currentTransaction.value = {
      ...(transaction.value ?? defaultNewTransaction),
    }
  },
  { immediate: true },
)

if (props.isPayment) {
  currentTransaction.value.source = globalStore.settings.loanSource ?? defaultSource
  currentTransaction.value.sourceName = globalStore.settings.loanSource?.name ?? defaultSource.name
}

const setPayment = async () => {
  if (props.loan != null && props.loanHistory != null) {
    if (!props.loanHistory.transactionId) {
      const newTransaction: NewTransaction = {
        accountId: currentTransaction.value.accountId,
        ammount: currentTransaction.value.ammount,
        sourceId: currentTransaction.value.source.id,
        type: currentTransaction.value.type.id,
        transactionDate: currentTransaction.value.transactionDate,
        transactionExtendedProperties: currentTransaction.value.transactionExtendedProperties,
      }

      const transaction = await add(newTransaction)

      emit('pay', transaction, props.loan.loanId, props.loanHistory.id)
    } else {
      try {
        await update(currentTransaction.value)
        emit('paymentUpdated')
      } catch (err) {
        notify({
          message: `${err}`,
          color: 'danger',
        })
      }

      notify({
        message: 'Payment Updated',
        color: 'success',
      })
    }
  } else {
    notify({
      message: `Has error occurred on Payment`,
      color: 'danger',
    })
  }
}

const isEnabledAmmount = computed(
  () =>
    !props.isPayment ||
    (props.loanHistory != undefined && props.loanHistory?.ammoundPaid < props.loanHistory?.ammountToPay),
)

const maxAmmount = (v: string | SelectOption) => Number(v) <= (props.loanHistory?.ammountToPay ?? 0) || 'Max ammount allowed is '+ props.loanHistory?.ammountToPay
</script>

<template>
  <div class="relative">
    <VaForm class="flex flex-col gap-2">
      <VaInput v-model="currentTransaction.ammount" label="Ammount" mask="numeral" :rules="[maxAmmount]" :disabled="!isEnabledAmmount" />
      <VaDateInput v-model="currentTransaction.transactionDate" label="Transaction Date" :disabled="!isPayment" />
      <VaInput disabled label="Source" :model-value="currentTransaction.sourceName" />
      <VaInput disabled label="Type" :model-value="t(`transactions.type.${currentTransaction.typeName}`)" />
      <section class="my-2 p-2">
        <h3 class="text-md text-center text-gray-400">{{ t('transactions.moreInfo') }}</h3>
        <div class="overflow-y-auto max-h-72">
          <div
            v-for="(field, index) in currentTransaction.transactionExtendedProperties"
            :key="index"
            class="grid grid-cols-1 sm:grid-cols-9 gap-2 my-2"
          >
            <div class="col-span-3">
              <VaInput
                v-model="currentTransaction.transactionExtendedProperties[index].displayName"
                disabled
                label="DisplayName"
              />
            </div>
            <div class="col-span-3">
              <VaInput v-model="currentTransaction.transactionExtendedProperties[index].key" disabled label="Key" />
            </div>
            <div class="col-span-3">
              <VaInput
                v-model="currentTransaction.transactionExtendedProperties[index].value"
                disabled
                label="DisplayName"
              />
            </div>
          </div>
        </div>
      </section>
      <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton v-if="isEnabledAmmount" preset="primary" color="primary" @click="setPayment">Pay</VaButton>
      </div>
    </VaForm>
    <div v-if="isLoading" class="absolute top-1/4 left-1/2">
      <VaProgressCircle indeterminate />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
