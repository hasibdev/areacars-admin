<script setup>
import { onMounted, nextTick, ref } from 'vue'
import Dropdown from 'bootstrap/js/src/dropdown'

const emit = defineEmits(['update:modelValue', 'onShow', 'onHide', 'onOk'])
const props = defineProps({
  id: { type: String },
  modelValue: {
    type: Boolean,
    required: false
  },

})

const ddRef = ref(null)

let dd = null
const handleToggle = val => val ? dd.show() : dd.hide()
onMounted(() => {
  nextTick(() => {
    if (!ddRef.value) {
      return
    }

    dd = new Dropdown()
    handleToggle(props.modelValue)

    ddRef.value.addEventListener('hide.bs.dropdown', () => {
      emit('update:modelValue', false)
      emit('onHide')
    })

    ddRef.value.addEventListener('show.bs.dropdown', () => {
      emit('update:modelValue', true)
      emit('onShow')
    })
  })
})

</script>

<template>
  <div class="dropdown dropstart d-inline-block">
    <div :id="props.id" ref="ddEl" data-bs-toggle="dropdown" aria-expanded="false" class="pointer">
      <slot name="action-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </slot>
    </div>

    <ul class="dropdown-menu border-0 shadow" :aria-labelledby="props.id">
      <slot></slot>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
</style>
