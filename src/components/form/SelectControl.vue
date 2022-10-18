<script setup>
import { useValidationStore } from "@/stores/validation"
import _ from "lodash"
import { computed } from "vue"

const validationStore = useValidationStore()

const emit = defineEmits(["update:modelValue"])
const props = defineProps({
  id: {
    type: [String, Number],
    default: () => `select_control${_.random(100)}${_.random(100)}`,
  },
  modelValue: {
    type: [String, Number, null],
    required: true,
  },
  label: { type: String },
  options: {
    type: Array,
    required: true,
  },
  trackBy: {
    type: String,
    default: "id",
  },
  optionLabel: {
    type: String,
    default: "label",
  },
  errorField: { type: String },
  disabled: { type: Boolean, default: false },
})

const onSelect = (e) => {
  emit("update:modelValue", e.target.value)

  delete validationStore.errors[props.errorField]
}

const hasError = computed(() => {
  return props.errorField && validationStore.errors[props.errorField]
})
const errorMsg = computed(() => {
  return validationStore.errors[props.errorField] ? validationStore.errors[props.errorField][0] : ''
});
</script>

<template>
  <div class="row align-items-center">
    <div v-if="props.label" class="col-xl-4">
      <label class="label" :for="props.id">{{ label }}</label>
    </div>
    <div :class="`${props.label ? 'col-xl-8' : 'col-md-12'}`">
      <select @change="onSelect" :id="props.id" readonly :disabled="props.disabled" :value="modelValue" class="form-select" :class="{ 'border-danger has_error': hasError }">
        <option value="">Bitte wählen</option>
        <option v-for="(opt, i) in props.options" :key="i" :value="opt[props.trackBy]" :selected="opt[props.trackBy] === modelValue">
          {{ opt[props.optionLabel] }}
        </option>
      </select>

      <p v-if="hasError" class="text-danger text-13 mt-1">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
