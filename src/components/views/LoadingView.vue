<script setup>
import Loading from "@/components/views/Loading.vue"

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <!-- Loading -->
  <Loading v-if="props.loading" />

  <!-- Content Slot -->
  <slot v-else />
</template>


<style lang="scss" scoped>
</style>
