<script setup lang="ts">
import { computed, ref } from 'vue'
import { NewBudget } from '../types'
import { TypeProp } from '../../../data/types'
import { SelectOption } from 'vuestic-ui'
import { useAuthStore } from '../../../stores/auth'
import { Source } from '../../sources/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const authStore = useAuthStore()

const props = defineProps<{
  sources: Source[]
  types: TypeProp[]
  transactiontypes: TypeProp[]
}>()

defineEmits<{
  (event: 'save', budget: NewBudget): void
  (event: 'close'): void
}>()

const defaultNewBudget: NewBudget = {
  accountId: authStore.user?.accountId ?? '',
  targetAmmount: 0,
  source: props.sources[0],
  targetType: props.transactiontypes[0],
  budgetType: props.types[0],
  startDate: new Date().toISOString(),
}

const newBudget = ref({ ...defaultNewBudget })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newBudget.value).some((key) => {
    return newBudget.value[key as keyof NewBudget] !== defaultNewBudget?.[key as keyof NewBudget]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

const formatFn = (value: any): string => {
  const date = new Date(value)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const required = (v: string | SelectOption) => !!v || 'This field is required'
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newBudget.targetAmmount" label="Ammount" :rules="[required]" mask="numeral" />
    <VaDateInput v-model="newBudget.startDate" label="Start Date" :format="formatFn" />
    <VaSelect
      v-model="newBudget.source"
      :label="t('menu.sources')"
      text-by="name"
      track-by="id"
      :rules="[required]"
      :options="sources"
    >
      <template #content="{ value: user }">
        <div v-if="user" :key="user.id" class="flex items-center gap-1 mr-4">
          {{ user.name }}
        </div>
      </template>
    </VaSelect>
    <VaSelect
      v-model="newBudget.targetType"
      :label="t('budgets.typeFilter')"
      text-by="nameT"
      track-by="id"
      :rules="[required]"
      :options="transactiontypes"
    >
      <template #content="{ value: type }">
        <div v-if="type" :key="type.id" class="flex items-center gap-1 mr-4">
          {{ type.nameT }}
        </div>
      </template>
    </VaSelect>
    <VaSelect
      v-model="newBudget.budgetType"
      :label="t('budgets.budgetType')"
      text-by="nameT"
      track-by="id"
      :rules="[required]"
      :options="types"
    >
      <template #content="{ value: type }">
        <div v-if="type" :key="type.id" class="flex items-center gap-1 mr-4">
          {{ type.nameT }}
        </div>
      </template>
    </VaSelect>
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newBudget as NewBudget)">add</VaButton>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
