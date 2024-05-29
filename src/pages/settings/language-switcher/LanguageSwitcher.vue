<template>
  <div class="flex items-center justify-between">
    <p v-if="$props.text">Language</p>
    <div class="w-40">
      <VaSelect v-model="model" class="border-primary text-blue-500" :options="options" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

import { useI18n } from 'vue-i18n'
import { LanguageMap, useGlobalStore } from '../../../stores/global-store'

defineProps({
  text: {
    type: Boolean,
    default: true,
  },
})

const globalStore = useGlobalStore()

const { locale } = useI18n()

const languageName: LanguageMap = Object.fromEntries(
  Object.entries(globalStore.languageCodes).map(([key, value]) => [value, key]),
)

const options = Object.values(globalStore.languageCodes)

const model = computed({
  get() {
    return globalStore.languageCodes[locale.value]
  },
  set(value) {
    globalStore.setLang(languageName[value])
  },
})
</script>
