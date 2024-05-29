<script setup lang="ts">
defineProps({
  status: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <VaIcon v-if="status" name="check_circle" color="success" />
  <VaIcon v-else name="cancel" color="danger" />
</template>
