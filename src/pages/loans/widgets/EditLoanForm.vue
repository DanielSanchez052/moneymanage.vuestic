<script setup lang="ts">
import { computed, ref } from 'vue'
import { NewLoan } from '../types'
import { TypeProp } from '../../../data/types'
import { SelectOption } from 'vuestic-ui'
import { useAuthStore } from '../../../stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const authStore = useAuthStore()

const props = defineProps<{
  frecuencyList: TypeProp[]
}>()

defineEmits<{
  (event: 'save', budget: NewLoan): void
  (event: 'close'): void
}>()

const defaultNewLoan: NewLoan = {
  accountId: authStore.user?.accountId ?? '',
  lend: "",
  borrow: "",
  ammountBorrowed: 0,
  paymentFrecuency: props.frecuencyList[0],
  percentage: 0,
  periodCount: 1

}

const newLoan = ref({ ...defaultNewLoan })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newLoan.value).some((key) => {
    return newLoan.value[key as keyof NewLoan] !== defaultNewLoan?.[key as keyof NewLoan]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

const required = (v: string | SelectOption) => !!v || 'This field is required'
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newLoan.lend" label="Lend" :rules="[required]" />
    <VaInput v-model="newLoan.borrow" label="Borrow" :rules="[required]" />
    <VaInput v-model="newLoan.ammountBorrowed" label="Ammount" :rules="[required]" mask="numeral" />
    <VaInput v-model="newLoan.percentage" label="Percentage" mask="numeral" />
    <VaInput v-model="newLoan.periodCount" label="Period Count" :rules="[required]" mask="numeral" />
    <VaSelect
      v-model="newLoan.paymentFrecuency"
      label="Frecuencia"
      text-by="name"
      track-by="id"
      :rules="[required]"
      :options="frecuencyList"
    >
      <template #content="{ value: user }">
        <div v-if="user" :key="user.id" class="flex items-center gap-1 mr-4">
          {{ user.name }}
        </div>
      </template>
    </VaSelect>
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newLoan as NewLoan)">add</VaButton>
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
