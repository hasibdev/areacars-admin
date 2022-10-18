<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { DatePicker } from 'v-calendar'
import CalenderIcon from '@/components/icons/CalenderIcon.vue'
import { useI18n } from 'vue-i18n'
import { useValidationStore } from '@/stores/validation'

import 'v-calendar/dist/style.css'

const validationStore = useValidationStore()
const { locale } = useI18n({ useScope: 'global' })

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [Object, Date, String, Number, null],
    required: true
  },
  label: { type: String },
  errorField: { type: String },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
})

const date = ref()
onMounted(() => {
  if (props.modelValue) {
    date.value = props.modelValue
  }
})
watch(date, (val) => {
  emit('update:modelValue', val)

  delete validationStore.errors[props.errorField]
})
watch(() => props.modelValue, (val) => {
  date.value = val
})
const masks = {
  input: ['DD MMM YYYY', 'L']
}
const modelConfig = {
  type: 'string',
  mask: 'DD/MM/YYYY',
}


const hasError = computed(() => {
  return props.errorField && validationStore.errors[props.errorField]
})
const errorMsg = computed(() => {
  return validationStore.errors[props.errorField] ? validationStore.errors[props.errorField][0] : ''
})

</script>

<template>
  <div class="row align-items-center">
    <div v-if="props.label" class="col-xl-4">
      <label class="label">{{ label }}</label>
    </div>

    <div :class="`${props.label ? 'col-xl-8' : 'col-12'}`">
      <DatePicker v-model="date" :popover="{visibility: 'click'}" :masks="masks" :model-config="modelConfig" :locale="locale">

        <template v-slot="{ inputValue, inputEvents, togglePopover }">
          <div class="input-wrapper">
            <input :disabled="disabled" :readonly="props.readonly" placeholder="DD/MM/YYYY" :value="inputValue || ''" v-on="inputEvents" class="form-control pointer pr-2rem" :class="{'border-danger has_error': hasError}" />
            <span class="icon-wrapper">
              <CalenderIcon @click="togglePopover()" />
            </span>
          </div>
        </template>

      </DatePicker>

      <p v-if="hasError" class="text-danger text-13 mt-1">{{ errorMsg }}</p>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.pr-2rem {
  padding-right: 2rem;
}
.input-wrapper {
  position: relative;
  .icon-wrapper {
    position: absolute;
    right: 10px;
    top: 6px;
  }
}
</style>
