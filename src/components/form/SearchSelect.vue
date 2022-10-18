<template>
  <div class="d-form-input row mb-3">
    <div v-if="label" :class="stack ? 'col-md-12 mb-1' : 'col-md-4'">
      <div class="d-form-input__label" :class="{ 'd-form-input__label--hide': hideLabel }">
        <div class="d-form-input-label">
          <p class="d-form-input-label__text">{{ label }}</p>
          <span v-if="hints" class="d-form-input-label__hint">{{ hints }}</span>
        </div>
      </div>
    </div>

    <div :class="`${(label && !stack) ? 'col-md-8' : 'col-md-12'}`">
      <b-select v-model="value" :searching="searching" :variant="variant" :options="options" :placeholder="placeholder ? placeholder : ''" :display-property="displayProperty" :value-property="valueProperty" required outline :no-border="noBorder" :search="search" :error="error || hasError" :search-placeholder="searchPlaceholder" @search="searchHendlar" class="d-form-input__field" />
      <p v-if="hasError" class="text-danger text-13 mt-1 mb-0">{{ errorMsg }}</p>
    </div>

    <slot name="append" />
  </div>

</template>

<script>
import BSelect from "@/components/form/BSelect.vue"
import { mapState } from 'pinia'
import { useValidationStore } from '@/stores/validation'
export default {
  emits: ['update:modelValue', 'search'],
  components: {
    BSelect,
  },
  props: {
    modelValue: {
      type: [String, Number],
    },
    options: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
    hints: {
      type: String,
      default: null,
    },
    errorField: { type: String },
    stack: { type: Boolean, default: false },
    placeholder: {
      type: String,
      default: null,
    },
    displayProperty: {
      type: String,
      default: "title",
    },
    valueProperty: {
      type: String,
      default: "value",
    },
    searchPlaceholder: {
      type: String,
      default: null,
    },
    hideLabel: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Boolean,
      default: false,
    },
    searching: {
      type: Boolean,
      default: false,
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'default',
    }
  },
  data() {
    return {
      value: this.modelValue,
    }
  },
  computed: {
    ...mapState(useValidationStore, ['errors']),
    hasError() {
      return this.errorField && this.errors[this.errorField]
    },
    errorMsg() {
      return this.errors[this.errorField] && this.errors[this.errorField][0]
    }
  },
  watch: {
    modelValue() {
      this.value = this.modelValue
    },
    value() {
      this.$emit("update:modelValue", this.value)
      delete this.errors[this.errorField]
    },
  },
  methods: {
    searchHendlar(e) {
      this.$emit("search", e)
    },
  },
};
</script>

<style lang="scss" scoped>
.d-form-input {
  // display: flex;
  align-items: center;
  //   width: 100%;

  .d-form-input-label {
    // padding-right: 10px;
    &__text {
      margin-bottom: 0;
      font-weight: 500;
      color: #666;
    }
    &__hint {
      font-size: 15px;
    }
  }

  &__label {
    // margin-bottom: 1rem;
    &--hide {
      opacity: 0;
    }
  }
}
</style>
