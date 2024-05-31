<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Transaction } from '../../transactions/types'
import { useTransactions } from '../../transactions/composables/useTransactions'
import { useAuthStore } from '../../../stores/auth'
import { useI18n } from 'vue-i18n'
import { Loan, LoanTransactionHistory } from '../types'

const { t } = useI18n()

const authStore = useAuthStore()

const authParams = reactive({
  token: authStore.user?.token ?? '',
  accountId: authStore.user?.accountId ?? '',
})

const props = defineProps<{
  loan: Loan | null
  loanHistory: LoanTransactionHistory | null
}>()

defineEmits<{
  (event: 'close'): void
}>()


const { transaction, getById, isLoading } = useTransactions({
      authParams: authParams,
      transactionId: props.loanHistory?.transactionId ?? "",
      initialFetch: false
    })

const defaultNewTransaction: Transaction = {
  id: '',
  accountId: authStore.user?.accountId ?? '',
  ammount: 0,
  source: {
    id: '0',
    description: '',
    name: '',
    isActive: true,
  },
  type: {
    id: 0,
    name: '',
  },
  typeName: '',
  sourceName: '',
  isActive: true,
  transactionDate: new Date().toISOString(),
  transactionExtendedProperties: [],
}

const currentTransaction = ref<Transaction>(defaultNewTransaction)

watch(
  () => props.loanHistory,
  async () => {
    if (!props.loanHistory) {
      return
    }

    await getById(props.loanHistory.transactionId ?? "")

    currentTransaction.value = {
      ...transaction.value ?? defaultNewTransaction
    }
  },
  { immediate: true },
)

</script>

<template>
  <div class="relative">
    <VaForm class="flex flex-col gap-2">
      <VaInput v-model="currentTransaction.ammount" label="Ammount" mask="numeral" disabled/>
      <VaDateInput
        v-model="currentTransaction.transactionDate"
        label="Transaction Date"
        disabled
      />
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
              <VaInput
                v-model="currentTransaction.transactionExtendedProperties[index].key"
                disabled
                label="Key"
              />
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
      </div>
    </VaForm>
    <div class="absolute top-1/4 left-1/2" v-if="isLoading">
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
