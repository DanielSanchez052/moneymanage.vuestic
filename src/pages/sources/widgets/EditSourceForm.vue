<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Source } from '../types'
import { SelectOption } from 'vuestic-ui'

const props = defineProps<{
  source: Source | null
  saveButtonLabel: string
  action: string
}>()

defineEmits<{
  (event: 'save', source: Source): void
  (event: 'close'): void
}>()

const defaultNewSource: Source = {
  id: '',
  description: '',
  isActive: true,
  name: '',
}

const newSource = ref({ ...defaultNewSource })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newSource.value).some((key) => {
    if (key === 'id') {
      return false
    }

    return newSource.value[key as keyof Source] !== props.source?.[key as keyof Source]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.source,
  () => {
    if (!props.source) {
      return
    }

    newSource.value = {
      ...props.source,
    }
  },
  { immediate: true },
)

const required = (v: string | SelectOption) => !!v || 'This field is required'
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newSource.name" label="Name" :rules="[required]" />
    <VaInput v-model="newSource.description" label="Descripotion" :rules="[required]" />
    <VaSwitch v-model="newSource.isActive" label="Active" />

    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newSource as Source)">{{ saveButtonLabel }}</VaButton>
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
