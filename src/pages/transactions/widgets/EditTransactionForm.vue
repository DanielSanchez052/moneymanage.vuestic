<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Transaction } from '../types'
import { TypeProp } from '../../../data/types'
import { SelectOption } from 'vuestic-ui'
import { useAuthStore } from '../../../stores/auth'
import { Source } from '../../sources/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const authStore = useAuthStore()

const props = defineProps<{
  transaction: Transaction | null
  saveButtonLabel: string
  action: string
  sources: Source[]
  types: TypeProp[]
}>()

defineEmits<{
  (event: 'save', transaction: Transaction): void
  (event: 'close'): void
}>()

const defaultNewTransaction: Transaction = {
  id: '',
  accountId: authStore.user?.accountId ?? '',
  ammount: 0,
  source: props.sources[0],
  type: props.types[0],
  isActive: true,
  transactionDate: new Date().toISOString(),
  transactionExtendedProperties: [
    {
      displayName: 'name',
      key: 'prop',
      value: 'value',
    },
  ],
}

const newTransaction = ref({ ...defaultNewTransaction })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newTransaction.value).some((key) => {
    return newTransaction.value[key as keyof Transaction] !== props.transaction?.[key as keyof Transaction]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

const removeExtendedProperty = (index: number) => {
  newTransaction.value.transactionExtendedProperties = newTransaction.value.transactionExtendedProperties.filter(
    (prop, idx) => idx != index,
  )
}

const addExtendedProperty = () => {
  newTransaction.value.transactionExtendedProperties.push({
    displayName: '',
    key: '',
    value: '',
  })
}

watch(
  () => props.transaction,
  () => {
    if (!props.transaction) {
      return
    }

    newTransaction.value = {
      ...props.transaction,
      accountId: authStore.user?.accountId ?? '',
    }
  },
  { immediate: true },
)

const required = (v: string | SelectOption) => !!v || 'This field is required'
const uniqueKeyField = (v: string) =>
  newTransaction.value.transactionExtendedProperties.filter((t) => t.key == v).length == 1 ||
  'this field must be unique'
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newTransaction.ammount" label="Ammount" :rules="[required]" mask="numeral" />
    <VaDateInput
      v-model="newTransaction.transactionDate"
      label="Transaction Date"
      :disabled="props.action == 'update'"
    />
    <VaSelect
      v-model="newTransaction.source"
      :label="t('menu.sources')"
      text-by="name"
      track-by="id"
      :rules="[required]"
      :options="sources"
      :disabled="props.action == 'update'"
    >
      <template #content="{ value: user }">
        <div v-if="user" :key="user.id" class="flex items-center gap-1 mr-4">
          {{ user.name }}
        </div>
      </template>
    </VaSelect>
    <VaSelect
      v-model="newTransaction.type"
      :label="t('transactions.typeFilter')"
      text-by="name"
      track-by="id"
      :rules="[required]"
      :options="types"
      :disabled="props.action == 'update'"
    >
      <template #content="{ value: user }">
        <div v-if="user" :key="user.id" class="flex items-center gap-1 mr-4">
          {{ user.name }}
        </div>
      </template>
    </VaSelect>
    <section class="my-2 p-2">
      <h3 class="text-md text-center text-white">{{ t('transactions.moreInfo') }}</h3>
      <div class="overflow-y-auto max-h-72">
        <div
          v-for="(field, index) in newTransaction.transactionExtendedProperties"
          :key="index"
          class="grid grid-cols-1 sm:grid-cols-10 gap-2 my-2"
        >
          <div class="col-span-3">
            <VaInput
              v-model="newTransaction.transactionExtendedProperties[index].displayName"
              :disabled="props.action == 'update'"
              label="DisplayName"
              :rules="[required]"
            />
          </div>
          <div class="col-span-3">
            <VaInput
              v-model="newTransaction.transactionExtendedProperties[index].key"
              :disabled="props.action == 'update'"
              label="Key"
              :rules="[required, uniqueKeyField]"
            />
          </div>
          <div class="col-span-3">
            <VaInput
              v-model="newTransaction.transactionExtendedProperties[index].value"
              :disabled="props.action == 'update'"
              label="DisplayName"
              :rules="[required]"
            />
          </div>
          <div class="flex items-end justify-center">
            <VaButton
              :disabled="props.action == 'update'"
              color="danger"
              icon="playlist_remove"
              @click="() => removeExtendedProperty(index)"
            ></VaButton>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-10">
          <div class="sm:col-start-10 flex items-end justify-center sm:ml-4 mr-4">
            <VaButton
              :disabled="props.action == 'update'"
              size="medium"
              color="success"
              icon="playlist_add"
              @click="addExtendedProperty"
            ></VaButton>
          </div>
        </div>
      </div>
    </section>
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newTransaction as Transaction)">{{ saveButtonLabel }}</VaButton>
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
