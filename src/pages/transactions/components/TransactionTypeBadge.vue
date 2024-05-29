<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  status: {
    type: String,
    required: true,
  },
})

const badgeColorMap: Record<string, string> = {
  revenue: 'success',
  spend: 'danger',
  movement: 'primary',
}
</script>

<template>
  <VaBadge square :color="badgeColorMap[$props.status]" :text="t(`transactions.type.${status}`)" />
</template>
