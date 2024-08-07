<script setup lang="ts">
defineProps({
  statusName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
})

const badgeColorMap: Record<string, string> = {
  revenue: 'success',
  spend: 'danger',
  movement: 'primary',
  undefined: 'secondary',
}
</script>

<template>
  <VaBadge square :color="badgeColorMap[$props.status]" :text="statusName" />
</template>
