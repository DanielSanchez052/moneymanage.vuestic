<template>
  <div class="flex items-center justify-between">
    <p v-if="$props.text">Loan Source</p>
    <div class="w-40">
      <VaSelect
        v-model="sourceSelected"
        class="border-primary text-blue-500"
        :options="sources"
        text-by="name"
        track-by="id"
        :disabled="isLoading"
        @update:modelValue="selectSource"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useGlobalStore } from '../../../stores/global-store'
import { useAuthStore } from '../../../stores/auth'
import { useSources } from '../../sources/composables/useSources'
import { Source } from '../../sources/types'

defineProps({
  text: {
    type: Boolean,
    default: true,
  },
})

const authStore = useAuthStore()
const globalStore = useGlobalStore()

const authParams = reactive({
  token: authStore.user?.token ?? '',
  accountId: authStore.user?.accountId ?? '',
})

const defaultSource: Source = {
  id: '0',
  description: '--Select--',
  name: '--Select--',
  isActive: true,
}

const selectSource = async (selected: Source) => {
  await globalStore.setLoanSource(selected, authStore.user)
}

onMounted(() => {
  if (globalStore.settings.loanSource) {
    sourceSelected.value = globalStore.settings.loanSource
  }
})

const { sources, isLoading } = useSources({ authParams })
const sourceSelected = ref<Source>(defaultSource)

watch(globalStore.settings, () => {
  sourceSelected.value = globalStore.settings.loanSource ?? defaultSource
})
</script>
