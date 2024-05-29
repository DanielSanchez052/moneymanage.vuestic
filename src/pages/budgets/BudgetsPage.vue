<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useBudgets } from './composables/useBudgets'
import { useBudgetTypes } from './composables/useBudgetTypes'
import { useTypes } from '../transactions/composables/useTypes'
import { useAuthStore } from '../../stores/auth'
import BudgetsTable from './widgets/BudgetsTable.vue'
import BudgetHistoryTable from './widgets/BudgetHistoryTable.vue'
import EditBudgetForm from './widgets/EditBudgetForm.vue'
import { Budget, BudgetFilters, NewBudget } from './types'
import { useModal, useToast } from 'vuestic-ui'
import { useSources } from '../sources/composables/useSources'
import { type Source } from '../sources/types'
import { TypeProp } from '../../data/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()
const budgetSelected = ref<Budget | null>(null)
const doShowBudgetFormModal = ref(false)
const doShowMoreInfoModal = ref(false)
const pageSection = ref<'list' | 'detail'>('list')
const filters = ref<BudgetFilters>({
  Type: null,
  Source: null,
  AccountId: null,
})
const authParams = reactive({
  token: authStore.user?.token ?? '',
  accountId: authStore.user?.accountId ?? '',
})
const { budgets, add, isLoading, pagination } = useBudgets({
  authParams: authParams,
  filters: filters,
})
const { sources } = useSources({ authParams })
const { types } = useTypes({ authParams })
const { budgetTypes } = useBudgetTypes({ authParams })

function setPageSection(section: 'list' | 'detail' = 'detail') {
  pageSection.value = section
}

const showMoreInfo = (budget: Budget) => {
  budgetSelected.value = budget
  doShowMoreInfoModal.value = true
  setPageSection('detail')
}

const createNewBudget = () => {
  budgetSelected.value = null
  doShowBudgetFormModal.value = true
}

const { init: notify } = useToast()

const onBudgetSaved = async (budget: NewBudget) => {
  doShowBudgetFormModal.value = false

  const result = await add(budget)

  if (result?.success) {
    notify({
      message: 'Budget created',
      color: 'success',
    })
  } else {
    notify({
      message: `Has error occurred on Budget creation`,
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

const defaultSource: Source = {
  id: '0',
  description: 'all',
  name: 'all',
  isActive: true,
}
const defaultType: TypeProp = {
  id: 0,
  name: 'all',
}
</script>

<template>
  <h1 class="page-title">{{ t('budgets.tittle') }}</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaSelect
            v-model="filters.Source"
            :class="[pageSection != 'list' ? 'hidden' : '']"
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
            :class="[pageSection != 'list' ? 'hidden' : '']"
            :placeholder="t('budgets.typeFilter')"
            :text-by="(v: TypeProp) => t(`budgets.type.${v.name}`)"
            track-by="id"
            :options="[defaultType, ...types]"
          >
            <template #content="{ value: type }">
              <div v-if="type" :key="type.id" class="flex items-center gap-1 mr-4">
                {{ t(`budgets.type.${type.name}`) }}
              </div>
            </template>
          </VaSelect>
          <VaButton
            icon="arrow_back"
            :class="[pageSection != 'detail' ? 'hidden' : '']"
            @click="setPageSection('list')"
          />
        </div>
        <VaButton icon="add" size="medium" :loading="isLoading" @click="createNewBudget" />
      </div>
      <div v-if="pageSection == 'list'">
        <BudgetsTable
          v-model:pagination="pagination"
          :budgets="budgets"
          :loading="isLoading"
          :filters="filters"
          @moreInfo="showMoreInfo"
        />
      </div>
      <div v-else>
        <BudgetHistoryTable :budget="budgetSelected" :loading="isLoading" />
      </div>
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowBudgetFormModal"
      size="large"
      mobile-fullscreen
      close-button
      stateful
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 v-if="budgetSelected === null" class="va-h5 mb-4">{{ t('transactions.add') }}</h1>
      <h1 v-else class="va-h5 mb-4">{{ t('transactions.edit') }}</h1>
      <EditBudgetForm
        ref="editFormRef"
        :sources="sources"
        :types="budgetTypes"
        :transactiontypes="types"
        @close="cancel"
        @save="
          (budget) => {
            onBudgetSaved(budget)
            ok()
          }
        "
      />
    </VaModal>
  </VaCard>
</template>
