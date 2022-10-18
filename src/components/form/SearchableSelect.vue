<script setup>
import { useValidationStore } from "@/stores/validation"
import _ from "lodash"
import { computed, ref, onMounted, onUnmounted, reactive, watch } from "vue"
import ConfirmDialog from '@/components/modals/ConfirmDialog.vue'
import ModalControl from "@/components/modals/ModalControl.vue"
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import SelectControl from "@/components/form/SelectControl.vue"
import InputControl from "@/components/form/InputControl.vue"
import ButtonImageUploader from "@/components/form/ButtonImageUploader.vue"
import { api } from '../../use/useAxios'
import { useToast } from "vue-toastification"

const emit = defineEmits(["update:modelValue", "update:options", "onSearch", "onSelect", "onToggle"])

const validationStore = useValidationStore()
const toast = useToast()
const props = defineProps({
  id: {
    type: [String, Number],
    default: () => `select_control${_.random(100)}${_.random(100)}`,
  },
  modelValue: {
    type: [String, Number, null],
    required: false,
  },
  label: { type: String },
  options: { type: [Array, null], default: null },
  initialFetch: { type: Boolean, default: true },
  trackBy: {
    type: String,
    default: "id",
  },
  optionLabel: {
    type: String,
    default: "label",
  },
  errorField: { type: String },
  dataConfig: { type: Object },
  disabled: { type: Boolean, default: false },
  searching: { type: Boolean, default: false },
  canAdd: { type: Boolean, default: true },
  canSearch: { type: Boolean, default: true },
  handleSelect: { type: Function }
})

const optionsData = ref([])
const loading = ref(false)
const activeSelected = ref(null)

const fetchData = async (url) => {
  try {
    loading.value = true
    const res = await api.get(url)

    if (props.dataConfig.dataField.trim()) {
      optionsData.value = res.data[props.dataConfig.dataField]
    } else {
      optionsData.value = res.data
    }

  } catch (error) {
    //
  } finally {
    loading.value = false
  }
}
if (props.initialFetch && !props.options) {
  fetchData(props.dataConfig.dataUrl)
}


// Adding
const form = reactive({ ...props.dataConfig.form })
const addModalStatus = ref(false)
const savingStatus = ref(false)

const submitForm = async () => {
  try {
    savingStatus.value = true

    const formData = new FormData()

    for (let key in form) {
      formData.append(key, form[key] ?? '')
    }

    const res = await api.post(props.dataConfig.postUrl, formData)

    onSelect(res.data.data)

    toast.success("Erfolg anfordern")
    addModalStatus.value = false

    Object.assign(form, props.dataConfig.form)

    if (props.options) {
      const newOptions = [res.data.data, ...props.options]
      emit('update:options', newOptions)
    } else {
      if (props.dataConfig.dataField.trim()) {
        optionsData.value.unshift(res.data.data)
      }
    }

  } catch (error) {
    toast.error("Antrag scheitert")
  } finally {
    savingStatus.value = false
  }
}

// hide add modal
const hideAddModal = () => addModalStatus.value = false

// Delete
const removeModalStatus = ref(false)
const openStatus = ref(false)
const deleting = ref(false)

const toggleOpen = () => {
  if (props.disabled) {
    return
  }
  openStatus.value = !openStatus.value

  emit('onToggle', openStatus.value)

  if (!optionsData.value.length && !props.options) {
    fetchData(props.dataConfig.dataUrl)
  }
}
const close = () => openStatus.value = false

const activeDeleteOpt = ref(null)
const openDeleteModal = (opt) => {
  activeDeleteOpt.value = opt
  removeModalStatus.value = true
}

// On Delete
const onDelete = async () => {
  try {
    deleting.value = true
    removeModalStatus.value = false

    await api.delete(`${props.dataConfig.deleteUrl}/${activeDeleteOpt.value.id}`)

    if (props.options) {
      const newOptions = props.options.filter(opt => opt[props.trackBy] != activeDeleteOpt.value[props.trackBy])
      emit('update:options', newOptions)
    } else {
      optionsData.value = optionsData.value.filter(opt => opt[props.trackBy] != activeDeleteOpt.value[props.trackBy])
    }

    if (activeSelected.value && activeDeleteOpt.value[props.trackBy] == activeSelected.value[props.trackBy]) {
      activeSelected.value = null
      emit("update:modelValue", null)
    }

    toast.success("Erfolgreich löschen")
    close()

  } catch (error) {
    toast.error("Antrag scheitert")
  } finally {
    deleting.value = false
  }
}


// Searching
const searchText = ref('')

watch(() => searchText.value, _.debounce(async () => {
  if (props.options) {
    return emit('onSearch', searchText.value)
  }
  try {
    fetchData(`${props.dataConfig.dataUrl}?name=${searchText.value}`)
  } catch (error) {
    //
  }
}, 500))

function onSelect(opt) {
  if (props.handleSelect) {
    activeSelected.value = props.handleSelect(opt)
  } else {
    activeSelected.value = opt
  }

  emit("update:modelValue", opt[props.trackBy])
  emit("onSelect", opt)

  delete validationStore.errors[props.errorField]

  close()
}

const searchSelectWrapkper = ref()

const onKeyup = (e) => {
  if (e.key === 'Escape' && openStatus.value) {
    close()
  }
}
// Mounted
onMounted(() => {
  searchSelectWrapkper.value.addEventListener('keyup', onKeyup)
})

onUnmounted(() => {
  searchSelectWrapkper.value?.removeEventListener('keyup', onKeyup)
})

// Validations
const hasError = computed(() => {
  return props.errorField && validationStore.errors[props.errorField]
})
const errorMsg = computed(() => {
  return validationStore.errors[props.errorField] ? validationStore.errors[props.errorField][0] : ''
})

const getOptionsData = computed(() => {
  if (props.options) {
    return props.options
  }

  return optionsData.value || []
})

// Select previous data
watch(() => [props.modelValue, optionsData.value], () => {
  if (activeSelected.value == null && props.modelValue && optionsData.value) {
    const find = getOptionsData.value?.find(od => od[props.trackBy] == props.modelValue)
    if (find) {
      if (props.handleSelect) {
        activeSelected.value = props.handleSelect(find)
      } else {
        activeSelected.value = find
      }
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="row align-items-center">
    <div v-if="props.label" class="col-xl-4">
      <label class="label" :for="props.id">{{ label }}</label>
    </div>

    <div :class="`${props.label ? 'col-xl-8' : 'col-md-12'}`">
      <div v-click-outside="close" tabindex="0" class="search_select__wrapper" ref="searchSelectWrapkper">
        <div @click="toggleOpen" class="clickable_box form-control" :class="{ 'border-danger has_error': hasError, 'disabled': props.disabled, 'pointer': !props.disabled }">
          <span class="w-100">
            <span v-if="activeSelected !== null">
              {{ activeSelected[props.optionLabel] }}
            </span>
            <span v-else>Bitte wählen</span>
          </span>
          <svg width="12" height="7" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.57589 1.0102C1.8102 0.775887 2.1901 0.775887 2.42441 1.0102L7.57589 6.16167C7.8102 6.39599 8.1901 6.39599 8.42442 6.16167L13.5759 1.0102C13.8102 0.775887 14.1901 0.775887 14.4244 1.0102L14.9901 1.57589C15.2244 1.8102 15.2244 2.1901 14.9901 2.42442L8.70726 8.70726C8.31673 9.09778 7.68357 9.09778 7.29304 8.70726L1.0102 2.42442C0.775887 2.1901 0.775887 1.8102 1.0102 1.57589L1.57589 1.0102Z" fill="#666666" />
          </svg>
        </div>

        <!-- Options Wrapper -->
        <div v-if="openStatus" class="options__wrapper">
          <!-- Searching -->
          <div v-if="canSearch" class="search__wrapper m-3">
            <!-- Search input -->
            <input v-model="searchText" type="text" class="px-3 py-2" placeholder="Suche">
            <!-- Add Button -->
            <div v-if="props.canAdd" @click="addModalStatus = true" class="py-2 px-3 border-start pointer">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM15 11H11V15H9V11H5V9H9V5H11V9H15V11Z" fill="black" fill-opacity="0.58" />
              </svg>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="searching || loading" class="mb-3 d-flex flex-column justify-content-center align-items-center w-100">
            <div class="spinner-border text-primary spinner-border-sm" role="status" aria-hidden="true"></div>
          </div>

          <!-- Options list -->
          <ul class="options__ul">
            <li v-for="(opt, i) in getOptionsData" :key="i" :tabindex="i" @click="onSelect(opt)" class="options__li" :class="{active: activeSelected && opt[props.trackBy] == activeSelected[props.trackBy]}">
              <slot name="prepend" :option="opt" />

              <slot name="text" :option="opt">
                <span class="w-100">{{ opt[props.optionLabel] }}</span>
              </slot>

              <slot name="append" :option="opt">
                <svg @click.stop="openDeleteModal(opt)" class="delete__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="black" fill-opacity="0.66" />
                </svg>
              </slot>
            </li>
          </ul>
          <p v-if="!loading && !props.searching && !getOptionsData.length" class="ms-3 mb-3">No Data Found!</p>
        </div>
      </div>

      <p v-if="hasError" class="text-danger text-13 mt-1">{{ errorMsg }}</p>
    </div>
    <ConfirmDialog v-model="removeModalStatus" :title="props.dataConfig.deleteTitle" :message="props.dataConfig.deleteMessage" @onOk="onDelete" :okLoading="deleting" />

    <!-- Add  model form -->
    <ModalControl v-model="addModalStatus">
      <slot name="add-modal" :hideModal="hideAddModal" :dataConfig="dataConfig" :whenSelect="onSelect">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ props.dataConfig.name }} hinzufügen
          </h5>
        </div>
        <div class="modal-body">
          <template v-for="(feild, i) in props.dataConfig.fields" :key="i">
            <div v-if="feild.image" class="image__input mt-3">
              <p class="label">{{ feild.label }}</p>
              <div class="vehicle__input-file">
                <ButtonImageUploader v-model="form[feild.name]" label="Upload Datei" :file="form[feild.name] ? form[feild.name] : null" :errorField="feild.name" />
              </div>
            </div>
            <div v-else-if="feild.options" class="mt-3">
              <SelectControl v-model="form[feild.name]" :options="feild.options" :trackBy="feild.trackBy" :optionLabel="feild.optionLabel" :label="feild.label" :errorField="feild.name" />
            </div>
            <template v-else>
              <InputControl class="mt-3" v-model="form[feild.name]" :label="feild.label" :placeholder="`${feild.label}`" :errorField="feild.name" />
            </template>
          </template>
        </div>
        <div class="modal-footer border-0 mt-2">
          <button @click="addModalStatus = false" type="button" class="btn btn-light px-5 py-2 btn-sm">
            Abbrechen
          </button>
          <PrimaryButton @click="submitForm" :loading="savingStatus">Speichern</PrimaryButton>
        </div>
      </slot>
    </ModalControl>
  </div>
</template>

<style lang="scss" scoped>
.search_select__wrapper {
  position: relative;
  &:focus {
    .form-control {
      border-color: #86b7fe;
    }
  }
  &:focus-visible {
    outline: none;
  }

  .search__wrapper {
    background: #f2f2f2;
    border-radius: 4px;
    display: flex;
    input[type="text"] {
      background: transparent;
      border: 0;
      width: 100%;
      &:focus {
        border: 0;
        outline: 0;
      }
    }
  }
  .options__wrapper {
    box-shadow: 0px 0px 10px #ddd;
    position: absolute;
    top: 100%;
    width: 100%;
    z-index: 99;
    background: #fff;
  }
  .options__ul {
    max-height: 205px;
    overflow-y: auto;
    overflow-x: hidden;

    scrollbar-width: thin;

    &::-webkit-scrollbar {
      width: 0.25rem;
    }
    &::-webkit-scrollbar-track {
      background-color: #fff;
      -webkit-border-radius: 0.625rem;
      border-radius: 0.625rem;
    }
    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 0.625rem;
      border-radius: 0.625rem;
      background: #dadce0;
    }

    .options__li {
      display: flex;
      padding: 10px 15px;
      cursor: pointer;
      transition: all 0.2s ease;
      &:hover,
      &.active {
        background: #eee;
      }
    }

    .delete__icon {
      &:hover {
        path {
          fill: red;
        }
      }
    }
  }

  .clickable_box {
    display: flex;
    width: 100%;
    align-items: center;
    &.disabled {
      background: #e9ecef;
    }
  }
}
</style>
