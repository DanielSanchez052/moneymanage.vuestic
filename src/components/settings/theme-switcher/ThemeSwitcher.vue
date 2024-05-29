<template>
  <div>
    <VaButton
      v-if="!showText"
      id="themeButtom"
      :icon="icon"
      con
      round
      color="background-element"
      border-color="background-element"
      @click="changeTheme"
    />

    <VaButton
      v-else
      id="themeButtom"
      :icon="icon"
      con
      round
      color="background-element"
      border-color="background-element"
      @click="changeTheme"
    >
      <span>{{ text[currentPresetName] }}</span>
    </VaButton>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useColors } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '../../../stores/global-store'

const globalStore = useGlobalStore()

const { t } = useI18n()

defineProps({
  showText: {
    type: Boolean,
    default: false,
  },
})

const icon = ref('light_mode')
const { applyPreset, currentPresetName } = useColors()

onMounted(() => {
  const preset = globalStore.settings.theme
  if (preset == 'light') {
    applyPreset('light')
    icon.value = 'light_mode'
  } else {
    applyPreset('dark')
    icon.value = 'dark_mode'
  }
})

const changeTheme = () => {
  if (currentPresetName.value == 'light') {
    applyPreset('dark')
    icon.value = 'dark_mode'
    globalStore.setTheme('dark')
  } else {
    applyPreset('light')
    icon.value = 'light_mode'
    globalStore.setTheme('light')
  }
}

const text: { [id: string]: string } = {
  light: t('buttonSelect.light'),
  dark: t('buttonSelect.dark'),
}
</script>
