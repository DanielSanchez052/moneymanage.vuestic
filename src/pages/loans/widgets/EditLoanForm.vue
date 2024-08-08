<script setup lang="ts">
import { computed, ref } from 'vue'
import { NewLoan } from '../types'
import { TypeProp } from '../../../data/types'
import { SelectOption } from 'vuestic-ui'
import { useAuthStore } from '../../../stores/auth'

// const { t } = useI18n()

const authStore = useAuthStore()
const islender = ref<boolean | undefined>(undefined)
const props = defineProps<{
  frecuencyList: TypeProp[]
}>()

const emit = defineEmits<{
  (event: 'save', budget: NewLoan): void
  (event: 'close'): void
}>()

const defaultNewLoan: NewLoan = {
  accountId: authStore.user?.accountId ?? '',
  lend: '',
  borrow: '',
  ammountBorrowed: 0,
  paymentFrecuency: props.frecuencyList[0],
  percentage: 0,
  periodCount: 1,
}

const newLoan = ref({ ...defaultNewLoan })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newLoan.value).some((key) => {
    return newLoan.value[key as keyof NewLoan] !== defaultNewLoan?.[key as keyof NewLoan]
  })
})

const selectLender = (value: boolean) => {
  islender.value = value
  newLoan.value.lend = authStore.user?.username ?? 'Me'
}

defineExpose({
  isFormHasUnsavedChanges,
})

const required = (v: string | SelectOption) => !!v || 'This field is required'

const saveForm = () => {
  if (islender.value != undefined && islender) {
    newLoan.value.lend = newLoan.value.accountId
  } else {
    newLoan.value.borrow = newLoan.value.accountId
  }

  emit('save', newLoan.value as NewLoan)
}
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <div class="flex gap-2">
      <VaInput v-model="newLoan.lend" :disabled="islender != false" label="Lend" :rules="[required]" />
      <div class="flex items-end">
        <VaButton id="lend" :disabled="islender != undefined" @click="() => selectLender(true)">Me</VaButton>
      </div>
    </div>
    <div class="flex gap-2">
      <VaInput v-model="newLoan.borrow" :disabled="islender != true" label="Borrow" :rules="[required]" />
      <div class="flex items-end">
        <VaButton id="borrow" :disabled="islender != undefined" @click="() => selectLender(false)">Me</VaButton>
      </div>
    </div>
    <VaInput v-model="newLoan.ammountBorrowed" label="Ammount" :rules="[required]" mask="numeral" />
    <VaInput v-model="newLoan.percentage" label="Percentage" mask="numeral" />
    <VaInput v-model="newLoan.periodCount" label="Period Count" :rules="[required]" mask="numeral" />
    <VaSelect
      v-model="newLoan.paymentFrecuency"
      label="Frecuencia"
      text-by="nameT"
      track-by="id"
      :rules="[required]"
      :options="frecuencyList"
    >
      <template #content="{ value: frecuency }">
        <div v-if="frecuency" :key="frecuency.id" class="flex items-center gap-1 mr-4">
          {{ frecuency.nameT }}
        </div>
      </template>
    </VaSelect>

    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && saveForm()">add</VaButton>
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
