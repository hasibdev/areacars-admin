<script setup>
import { useValidationStore } from "@/stores/validation"
import _ from "lodash"
import { computed, ref, onMounted, onUnmounted, watch } from "vue"
import ConfirmDialog from '@/components/modals/ConfirmDialog.vue'
import PlaceholderVehicle from "@/components/icons/PlaceholderVehicle.vue"
import moment from 'moment'

import { api } from '../../use/useAxios'
import { useToast } from "vue-toastification"

const emit = defineEmits(["update:modelValue", "update:options", "onSearch", "onSelect", "onToggle"])

const validationStore = useValidationStore()
const toast = useToast()
const moneyFormat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

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
const addModalStatus = ref(false)


// hide add modal

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
  activeSelected.value = opt

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

  return optionsData.value
})

// Select previous data
watch(() => [props.modelValue, optionsData.value], () => {
  if (activeSelected.value == null && props.modelValue && optionsData.value) {
    const find = getOptionsData.value.find(od => od[props.trackBy] == props.modelValue)
    if (find) {
      activeSelected.value = find
    }
  }
})
</script>

<template>
  <div class="row align-items-center">
    <div v-if="props.label" class="col-md-4">
      <label class="label" :for="props.id">{{ label }}</label>
    </div>

    <div :class="`${props.label ? 'col-md-8' : 'col-md-12'}`">
      <div v-click-outside="close" tabindex="0" class="search_select__wrapper" ref="searchSelectWrapkper">
        <div @click="toggleOpen" class="clickable_box form-control bg-black text-white" :class="{ 'border-danger has_error': hasError, 'disabled': props.disabled, 'pointer': !props.disabled }">
          <span class="w-100">
            <span v-if="activeSelected !== null">
              {{ activeSelected.model_name }}
            </span>
            <span v-else>Vorlage wählen</span>
          </span>
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.22508 1.19603C1.4653 0.886759 1.93259 0.886759 2.1728 1.19603L5.88528 5.97584C6.12549 6.28512 6.59279 6.28512 6.833 5.97584L10.5455 1.19603C10.7857 0.886759 11.253 0.886759 11.4932 1.19603L11.8319 1.63211C12.0001 1.84865 12.0001 2.15166 11.8319 2.3682L6.90835 8.70726C6.60503 9.09778 6.11325 9.09778 5.80993 8.70726L0.886386 2.3682C0.718198 2.15165 0.718198 1.84865 0.886386 1.63211L1.22508 1.19603Z" fill="white" />
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

          <h6 class="px-3 pt-3 d-flex justify-content-between">
            <span>Vorlage auswählen</span>
            <svg @click="close" class="pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6 6L18 18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </h6>

          <!-- Loading -->
          <div v-if="searching || loading" class="mb-3 d-flex flex-column justify-content-center align-items-center w-100">
            <div class="spinner-border text-primary spinner-border-sm" role="status" aria-hidden="true"></div>
          </div>

          <!-- Options list -->
          <div class="options__ul">
            <div v-for="(opt, i) in getOptionsData" :key="i" :tabindex="i" class="options__li" :class="{active: activeSelected && opt[props.trackBy] == activeSelected[props.trackBy]}">
              <div @click="onSelect(opt)" class="d-flex align-items-start w-100 p-3 rounded-8 me-3 pointer" style="background: #F3F3F3; border: 1px solid #EEEEEE;">
                <div class="me-3">
                  <img v-if="opt.defaulat_images" :src="getImgUrl(`public/thumbnail/${opt.defaulat_images}`)" class="car__photo" alt="Car Photo">

                  <PlaceholderVehicle v-else />
                </div>

                <div class="w-100">
                  <h6 v-if="opt.template_name" class="mb-1">{{ opt.template_name }}</h6>
                  <h6 class="mb-1">{{ opt.model_name }}</h6>
                  <p v-if="opt.special_model" class="text-12px mb-1">{{ opt.special_model }}</p>

                  <div class="d-flex w-100 justify-content-between align-items-end">
                    <div class="text-11px" style="line-height: 14px;">
                      <p v-if="opt.first_registration">EZ {{ moment(opt.first_registration).format('DD/YYYY') }}</p>
                      <p v-if="opt.odometer">{{ opt.odometer }}</p>
                      <p v-if="opt.fuel_name">{{ opt.fuel_name }}</p>
                      <p v-if="opt.gearshift_name">{{ opt.gearshift_name }}</p>
                      <p v-if="opt.power">{{ (opt.power * 1.36).toFixed(0) }} PS</p>
                    </div>
                    <div>
                      <p class="fw-bold">{{ moneyFormat.format(opt.selling_price) }}</p>
                      <p class="text-13px">{{ moneyFormat.format(opt.net_price) }} / Netto</p>
                    </div>
                  </div>

                </div>
              </div>
              <slot name="append" :option="opt">
                <svg @click.stop="openDeleteModal(opt)" class="delete__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="red" fill-opacity="0.66" />
                </svg>
              </slot>
            </div>
          </div>
          <p v-if="!loading && !props.searching && !getOptionsData.length" class="ms-3 mb-3">No Data Found!</p>
        </div>
      </div>

      <p v-if="hasError" class="text-danger text-13 mt-1">{{ errorMsg }}</p>
    </div>
    <ConfirmDialog v-model="removeModalStatus" title="Vorlage löschen" message="Möchten Sie diese Vorlage wirklich entfernen?" @onOk="onDelete" :okLoading="deleting" />

  </div>
</template>

<style lang="scss" scoped>
.text-11px {
  font-size: 11px;
}
.text-12px {
  font-size: 12px;
}
.text-13px {
  font-size: 13px;
}

.rounded-8 {
  border-radius: 8px;
}
.car__photo {
  width: 220px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  aspect-ratio: 16/10;
}

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
    top: calc(100% + 10px);
    min-width: 500px;
    max-width: 600px;
    z-index: 99;
    background: #fff;
  }
  .options__ul {
    max-height: 500px;
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
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      transition: all 0.2s ease;
    }

    .delete__icon {
      cursor: pointer;
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
