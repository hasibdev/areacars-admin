<script setup>
import { watch } from 'vue'
const props = defineProps({
  text: String,
  loading: Boolean,
  disabled: Boolean,
  variant: {
    type: String,
    default: 'dark',
    validator: prop => ['primary', 'light', 'transparent', 'dark', 'info', 'success', 'danger'].includes(prop)
  }
})

watch(() => props.loading, () => {
  if (props.loading) {
    document.body.style.cursor = 'progress'
  } else {
    document.body.style.cursor = 'auto'
  }
})
</script>

<template>
  <button :class="`btn btn-${variant} ${props.loading ? 'loading': ''}`" type="button" :disabled="props.disabled || props.loading">
    <div v-if="loading">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span class="ms-2">Loading...</span>
    </div>
    <span v-else>
      <slot>{{ props.text }}</slot>
    </span>
  </button>
</template>


<style lang="scss" >
</style>
