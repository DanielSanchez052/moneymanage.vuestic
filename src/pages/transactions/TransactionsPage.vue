<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useTransactions } from './composables/useTransactions'
import { useTypes } from './composables/useTypes'
import { useAuthStore } from '../../stores/auth'
import TransactionsTable from './widgets/TransactionsTable.vue'
import EditTransactionForm from './widgets/EditTransactionForm.vue'
import { Transaction, TransactionFilters, NewTransaction } from './types'
import { useModal, useToast } from 'vuestic-ui'
import { useSources } from '../sources/composables/useSources'
import { type Source } from '../sources/types'
import { TypeProp } from '../../data/types'
import { DateInputRange } from 'vuestic-ui/dist/types/components/va-date-input/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()
const transactionSelected = ref<Transaction | null>(null)
const doShowTransactionFormModal = ref(false)
const doShowMoreInfoModal = ref(false)
const filters = ref<TransactionFilters>({
  Type: null,
  Source: null,
  AccountId: null,
  UserId: null,
  TransactionDateRange: null,
})
const authParams = reactive({
  token: authStore.user?.token ?? '',
  accountId: authStore.user?.accountId ?? '',
})
const { transactions, update, add, isLoading, remove, pagination } = useTransactions({
  authParams: authParams,
  filters: filters,
})
const { sources } = useSources({ authParams })
const { types } = useTypes({ authParams })

const editTransaction = (transaction: Transaction) => {
  transactionSelected.value = transaction
  doShowTransactionFormModal.value = true
}

const createNewTransaction = () => {
  transactionSelected.value = null
  doShowTransactionFormModal.value = true
}

const showMoreInfo = (transaction: Transaction) => {
  transactionSelected.value = transaction
  doShowMoreInfoModal.value = true
}

const { init: notify } = useToast()

const onTransactionSaved = async (transaction: Transaction) => {
  doShowTransactionFormModal.value = false
  if ('id' in transaction && transaction['id'] != '') {
    try {
      await update(transaction)
    } catch (err) {
      notify({
        message: `${err}`,
        color: 'danger',
      })
    }

    notify({
      message: 'Transaction updated',
      color: 'success',
    })
  } else {
    const newTransaction: NewTransaction = {
      accountId: transaction.accountId,
      ammount: transaction.ammount,
      sourceId: transaction.source.id,
      type: transaction.type.id,
      transactionDate: transaction.transactionDate,
      transactionExtendedProperties: transaction.transactionExtendedProperties,
    }
    try {
      await add(newTransaction)
    } catch (err) {
      notify({
        message: `${err}`,
        color: 'danger',
      })
    }

    notify({
      message: 'Transaction created',
      color: 'success',
    })
  }
}

const { confirm } = useModal()

const onSourceDeleted = async (project: Transaction) => {
  const response = await confirm({
    title: 'Delete project',
    message: `Are you sure you want to delete project ?`,
    okText: 'Delete',
    size: 'small',
    maxWidth: '380px',
  })

  if (!response) {
    return
  }

  await remove(project)
  notify({
    message: 'Project deleted',
    color: 'success',
  })
}

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

const beforeMoreInfoClose = async (hide: () => unknown) => {
  hide()
}

const defaultSource: Source = {
  id: '0',
  description: 'Todos',
  name: 'Todos',
  isActive: true,
}
const defaultType: TypeProp = {
  id: 0,
  name: 'all',
}

const formatFn = (date: DateInputRange<Date>): string => {
  const start =
    date.start != undefined ? `${date.start?.getDate()}/${date.start?.getMonth() + 1}/${date.start?.getFullYear()}` : ''

  const end =
    date.end != undefined ? `${date.end?.getDate()}/${date.end?.getMonth() + 1}/${date.end?.getFullYear()}` : ''

  return `${start} - ${end}`
}
</script>

<template>
  <h1 class="page-title">{{ t('transactions.tittle') }}</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaSelect
            v-model="filters.Source"
            :placeholder="t('menu.sources')"
            text-by="name"
            track-by="id"
            :options="[defaultSource, ...sources]"
          >
            <template #content="{ value: source }">
              <div v-if="source" :key="source.id" class="flex items-center gap-1 mr-4">
                {{ source.name }}
              </div>
            </template>
          </VaSelect>
          <VaSelect
            v-model="filters.Type"
            :placeholder="t('transactions.typeFilter')"
            :text-by="(v: TypeProp) => t(`transactions.type.${v.name}`)"
            track-by="id"
            :options="[defaultType, ...types]"
          >
            <template #content="{ value: type }">
              <div v-if="type" :key="type.id" class="flex items-center gap-1 mr-4">
                {{ t(`transactions.type.${type.name}`) }}
              </div>
            </template>
          </VaSelect>
          <VaDateInput
            v-model="filters.TransactionDateRange"
            :placeholder="t('transactions.dateRangeFilter')"
            mode="range"
            :format="formatFn"
          />
        </div>
        <VaButton icon="add" size="medium" :loading="isLoading" @click="createNewTransaction" />
      </div>

      <TransactionsTable
        v-model:pagination="pagination"
        :transactions="transactions"
        :loading="isLoading"
        :filters="filters"
        @edit="editTransaction"
        @delete="onSourceDeleted"
        @moreInfo="showMoreInfo"
      />
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowTransactionFormModal"
      size="large"
      mobile-fullscreen
      close-button
      stateful
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 v-if="transactionSelected === null" class="va-h5 mb-4">{{ t('transactions.add') }}</h1>
      <h1 v-else class="va-h5 mb-4">{{ t('transactions.edit') }}</h1>
      <EditTransactionForm
        ref="editFormRef"
        :transaction="transactionSelected"
        :save-button-label="transactionSelected === null ? 'Add' : 'Save'"
        :action="transactionSelected === null ? 'add' : 'update'"
        :sources="sources"
        :types="types"
        @close="cancel"
        @save="
          (transaction) => {
            onTransactionSaved(transaction)
            ok()
          }
        "
      />
    </VaModal>
    <VaModal
      v-slot="{ cancel }"
      v-model="doShowMoreInfoModal"
      size="small"
      mobile-fullscreen
      close-button
      hide-default-actions
      :before-cancel="beforeMoreInfoClose"
    >
      <h1 class="va-h5 mb-4">{{ t('transactions.moreInfo') }}</h1>
      <div>
        <p
          v-for="item in transactionSelected?.transactionExtendedProperties"
          :key="item.key"
          class="text-center dark:text-white"
        >
          {{ item.displayName }} : {{ item.value }}
        </p>
      </div>
      <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
        <VaButton preset="secondary" color="secondary" @click="cancel">Cancel</VaButton>
      </div>
    </VaModal>
  </VaCard>
</template>
