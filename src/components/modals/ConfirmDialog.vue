<script setup>
import { onMounted, watch, nextTick, ref } from 'vue'
import Modal from 'bootstrap/js/src/modal'
import PrimaryButton from '../buttons/PrimaryButton.vue'

const emit = defineEmits(['update:modelValue', 'onHide', 'onOk'])
const props = defineProps({
   id: { type: String },
   modelValue: {
      type: Boolean,
      required: true
   },
   title: {
      type: String,
      required: true
   },
   message: {
      type: String,
      required: true
   },
   cancleText: {
      type: String,
      default: 'Abbrechen'
   },
   okText: {
      type: String,
      default: 'Löschen'
   },
   okLoading: {
      type: Boolean,
      default: false
   }
})

const dialogRef = ref(null)

let modal = null
const handleToggle = val => val ? modal.show() : modal.hide()

onMounted(() => {
   nextTick(() => {
      if (!dialogRef.value) {
         return
      }
      modal = new Modal(dialogRef.value)
      handleToggle(props.modelValue)

      dialogRef.value.addEventListener('hidden.bs.modal', () => {
         emit('update:modelValue', false)
         emit('onHide')
      })
   })
})

watch(() => props.modelValue, (val) => {
   handleToggle(val)
})


const hideModal = () => {
   emit('update:modelValue', false)
   emit('onHide')
}

const onOk = () => emit('onOk')

</script>

<template>
   <div class="modal fade" :id="props.id" ref="dialogRef" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content">
            <div class="modal-header">
               <h5 class="modal-title">
                  <slot name="title">
                     {{title}}
                  </slot>
               </h5>
            </div>
            <div class="modal-body">
               <slot>
                  {{ props.message }}
               </slot>
            </div>
            <div class="modal-footer border-0 mt-2">
               <slot name="footer">
                  <PrimaryButton @click="hideModal" variant="light">{{ props.cancleText }}</PrimaryButton>
                  <PrimaryButton @click="onOk" :loading="okLoading" variant="danger">{{ props.okText }}</PrimaryButton>
               </slot>
            </div>
         </div>
      </div>
   </div>
</template>


<style lang="scss" scoped>
</style>
