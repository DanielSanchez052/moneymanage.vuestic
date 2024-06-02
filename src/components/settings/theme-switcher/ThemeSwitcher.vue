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
import { ref, onMounted, watch } from 'vue'
import { useColors } from 'vuestic-ui'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '../../../stores/global-store'
import { useAuthStore } from '../../../stores/auth'

const authStore = useAuthStore()
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
  setThemeConfig()
})

const setThemeConfig = () => {
  const preset = globalStore.settings.theme
  if (preset == 'light') {
    applyPreset('light')
    icon.value = 'light_mode'
  } else {
    applyPreset('dark')
    icon.value = 'dark_mode'
  }
}

const changeTheme = () => {
  if (currentPresetName.value == 'light') {
    applyPreset('dark')
    icon.value = 'dark_mode'
    globalStore.setTheme('dark', authStore.user)
  } else {
    applyPreset('light')
    icon.value = 'light_mode'
    globalStore.setTheme('light', authStore.user)
  }
}

const text: { [id: string]: string } = {
  light: t('buttonSelect.light'),
  dark: t('buttonSelect.dark'),
}

watch(globalStore.settings, () => {
  setThemeConfig()
})

</script>
