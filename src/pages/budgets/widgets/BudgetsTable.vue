<script setup lang="ts">
import { PropType, computed } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { Budget, BudgetFilters } from '../types'
import TransactionTypeBadge from '../../transactions/components/TransactionTypeBadge.vue'
import BooleanBadge from '../../../components/general/BooleanBadge.vue'
import { PaginatedResult, Pagination } from '../../../data/types'
import { formatMoney } from '../../../services/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const columns = defineVaDataTableColumns([
  { label: t('budgets.table.ammount'), key: 'targetAmmount' },
  { label: t('budgets.table.type'), key: 'budgetTypeName' },
  { label: t('budgets.table.TransactionType'), key: 'targetTypeName' },
  { label: t('budgets.table.source'), key: 'targetSourceName' },
  { label: t('budgets.table.active'), key: 'isActive' },
  { label: ' ', key: 'actions' },
])

const props = defineProps({
  budgets: {
    type: Object as PropType<PaginatedResult<Budget>>,
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
    type: Object as PropType<BudgetFilters>,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'moreInfo', budget: Budget): void
}>()

const totalPages = computed(() => Math.ceil(props.budgets.totalCount / props.pagination.PageSize))
</script>

<template>
  <div>
    <VaDataTable :items="budgets.items" :columns="columns" :loading="loading">
      <template #cell(targetAmmount)="{ rowData: budget }">
        <div class="ellipsis max-w-[230px] lg:max-w-[450px]">
          {{ formatMoney(budget.targetAmmount) }}
        </div>
      </template>
      <template #cell(targetTypeName)="{ rowData: budget }">
        <TransactionTypeBadge :status-name="budget.targetType.nameT" :status="budget.targetType.name" />
      </template>
      <template #cell(isActive)="{ rowData: budget }">
        <BooleanBadge :status="budget.isActive" />
      </template>
      <template #cell(actions)="{ rowData: budget }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            icon="visibility"
            color="secondary"
            aria-label="Show More Info"
            @click="emit('moreInfo', budget as Budget)"
          />
        </div>
      </template>
    </VaDataTable>
    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
      <div>
        <b>{{ $props.budgets.totalCount }} results.</b>
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
