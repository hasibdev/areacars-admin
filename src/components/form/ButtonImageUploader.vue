<template>
  <div class="btn-fileuploader">
    <label class="btn-fileuploader__btn" :class="{'border-danger has_error': hasError}">
      {{ label }}
      <input @input="onFileSelect" type="file" class="btn-fileuploader__input" />
    </label>

    <p v-if="selectedFile || file" class="btn-fileuploader__file">
      <span class="btn-fileuploader__name">{{
            selectedFile ? selectedFile.name : file
         }}</span>
      <span @click="removeImageFile" class="btn-fileuploader__del-btn">&#10073;</span>
    </p>

  </div>
  <p v-if="hasError" class="text-danger text-13 mt-1">{{ errorMsg }}</p>
</template>

<script setup>
import { ref, computed } from "vue"
import { useValidationStore } from '@/stores/validation'

const validationStore = useValidationStore()

const props = defineProps({
  modelValue: {
    type: [String, File, null],
    default: null,
  },
  label: {
    type: String,
    default: "Upload File",
  },
  errorField: { type: String },
  file: {
    type: [String, File, null],
    default: null,
  },
})

const emit = defineEmits(["update:modelValue"])

const selectedFile = ref(null)
const onFileSelect = (e) => {
  selectedFile.value = e.target.files[0]
  emit("update:modelValue", selectedFile.value)
}

const removeImageFile = () => {
  selectedFile.value = null
}

// Validations
const hasError = computed(() => {
  return props.errorField && validationStore.errors[props.errorField]
})
const errorMsg = computed(() => {
  return validationStore.errors[props.errorField] ? validationStore.errors[props.errorField][0] : ''
})
</script>

<style lang="scss" scoped>
.btn-fileuploader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;

  &__btn {
    padding: 0.4rem 2rem;
    border-radius: 0.25rem;
    border: 1px solid #276ef1;
    cursor: pointer;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    outline: none;
    min-width: 100px;
    font-weight: 400;
    line-height: 1.5;
    font-size: 0.9375rem;
    color: #276ef1;
    text-transform: capitalize;
    margin-right: 1rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;

    &:hover {
      color: #fff;
      background-color: #276ef1;
    }
  }

  &__input {
    visibility: hidden;
    width: 1px;
    height: 1px;
  }

  &__file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1 1 auto;
  }

  &__name {
    font-size: 1rem;
    font-weight: 400;
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333333;
    white-space: nowrap;
  }

  &__del-btn {
    color: #fff;
    background: var(--color-error);
    transform: rotate(90deg);
    width: 16px;
    height: 16px;
    font-size: 9px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-weight: 600;
    cursor: pointer;
  }
}
</style>
