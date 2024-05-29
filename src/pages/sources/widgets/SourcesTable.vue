<script setup lang="ts">
import { PropType } from 'vue'
import { defineVaDataTableColumns } from 'vuestic-ui'
import { Source } from '../types'
import BooleanBadge from '../../../components/general/BooleanBadge.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const columns = defineVaDataTableColumns([
  { label: t('sources.table.name'), key: 'name' },
  { label: t('sources.table.description'), key: 'description' },
  { label: t('sources.table.active'), key: 'isActive' },
  { label: ' ', key: 'actions' },
])

defineProps({
  sources: {
    type: Object as PropType<Source[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'edit', source: Source): void
}>()
</script>

<template>
  <div>
    <VaDataTable :items="sources" :columns="columns" :loading="loading">
      <template #cell(isActive)="{ rowData: transaction }">
        <BooleanBadge :status="transaction.isActive" />
      </template>
      <template #cell(actions)="{ rowData: source }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            color="primary"
            icon="mso-edit"
            aria-label="Edit project"
            @click="emit('edit', source as Source)"
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
