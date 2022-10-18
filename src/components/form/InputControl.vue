<script setup>
import { computed, ref, watch } from 'vue'
import { useValidationStore } from '@/stores/validation'

const validationStore = useValidationStore()

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    required: true
  },
  label: { type: String },
  pattern: { type: String, default: '' },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: { type: String },
  errorField: { type: String },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  hideLabel: { type: Boolean, default: false },
  maxlength: { type: Number, default: 524288 },
  stack: { type: Boolean, default: false },
  replaceCommaOnBlur: { type: Boolean, default: false },
  errors: {
    type: Object,
    default: () => { }
  }
})

const input = ref(props.modelValue)

const onChange = () => {
  emit('update:modelValue', input.value)

  delete validationStore.errors[props.errorField]
}

watch(() => input.value, () => {
  onChange()
})

watch(() => props.modelValue, (val) => {
  input.value = val
})

// Validations
const hasError = computed(() => {
  return props.errorField && validationStore.errors[props.errorField]
})
const errorMsg = computed(() => {
  return validationStore.errors[props.errorField] ? validationStore.errors[props.errorField][0] : ''
})

const getError = computed(() => {
  if (props.errors?.$errors?.length) {
    const find = props.errors?.$errors?.find(err => err.$property == props.errorField)
    if (find) {
      return find.$message
    }
  }
  return ''
})

const onBlur = () => {
  if (props.replaceCommaOnBlur) {
    emit('update:modelValue', props.modelValue.replace(/,/g, '.'))
  }
}

</script>

<template>
  <div class="row align-items-center">
    <div v-if="props.label" :class="props.stack ? 'col-md-12 mb-1' : 'col-xl-4'">
      <label class="label" :class="{'hide_label': props.hideLabel}">{{ label }}</label>
    </div>

    <div :class="`${(props.label && !props.stack) ? 'col-xl-8' : 'col-md-12'}`">
      <!-- @input="onChange" :value="props.modelValue" -->
      <input v-model="input" :type="props.type" @blur="onBlur" :maxlength="maxlength" :pattern="pattern" :readonly="props.readonly" class="form-control" :class="{'border-danger has_error': getError || hasError}" :disabled="props.disabled" :placeholder="placeholder">

      <p v-if="getError || hasError" class="text-danger text-13 mt-1">{{ getError || errorMsg }}</p>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.hide_label {
  opacity: 0;
}
</style>
