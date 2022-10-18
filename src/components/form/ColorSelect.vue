<script setup>
import { useValidationStore } from "@/stores/validation"
import _ from "lodash"
import { computed, ref, onMounted, onUnmounted, reactive, watch } from "vue"
import ConfirmDialog from '@/components/modals/ConfirmDialog.vue'
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import InputControl from "@/components/form/InputControl.vue"
import { api } from '../../use/useAxios'
import { useToast } from "vue-toastification"

const emit = defineEmits(["update:modelValue", "update:options", "onSearch", "onSelect"])

const validationStore = useValidationStore()
const toast = useToast()
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

// Delete
const removeModalStatus = ref(false)
const openStatus = ref(false)
const deleting = ref(false)

const toggleOpen = () => {
  if (props.disabled) {
    return
  }
  openStatus.value = !openStatus.value

  if (!optionsData.value.length && !props.options) {
    fetchData(props.dataConfig.dataUrl)
  }
}
const close = () => openStatus.value = false
// const open = () => openStatus.value = true

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

    if (activeSelected.value && activeDeleteOpt.value[props.trackBy] == activeSelected.value[props.trackBy]) {
      activeSelected.value = null

      emit("update:modelValue", null)
    }

    toast.success("Erfolgreich löschen")
    close()

    if (props.options) {
      const newOptions = props.options.filter(opt => opt[props.trackBy] != activeDeleteOpt.value[props.trackBy])
      emit('update:options', newOptions)
    } else {
      if (props.dataConfig.dataField.trim()) {
        optionsData.value = optionsData.value.filter(opt => opt[props.trackBy] != activeDeleteOpt.value[props.trackBy])
      }
    }
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
    activeSelected.value = getOptionsData.value.find(od => od[props.trackBy] == props.modelValue)
  }
})

// Add Modal
const openAddModal = () => {
  addModalStatus.value = true
  close()
}

const imagePreview = ref(null)
const imgRef = ref()
const csRef = ref()
const previewRef = ref()

const onSelectFile = (e) => {
  const file = e.target.files[0]

  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const closeAddModal = () => {
  addModalStatus.value = false
}

const getColorFromImage = (e) => {
  let x, y

  if (e.offsetX) {
    x = e.offsetX
    y = e.offsetY
  }
  else if (e.layerX) {
    x = e.layerX
    y = e.layerY
  }

  useCanvas(csRef.value, imgRef.value, function () {

    const p = csRef.value.getContext('2d').getImageData(x, y, 1, 1).data
    const colorCode = rgbToHex(p[0], p[1], p[2])
    previewRef.value.style.background = `#${colorCode}`

    if (e.type == 'click') {
      form[props.dataConfig.colorTrack] = colorCode
    }
  })
}

function useCanvas(el, image, callback) {
  el.width = image.width
  el.height = image.height
  el.getContext('2d')
    .drawImage(image, 0, 0, image.width, image.height)
  return callback()
}

function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? "0" + hex : hex
}

function rgbToHex(r, g, b) {
  return "" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

</script>

<template>
  <div class="row align-items-center">
    <div v-if="props.label" class="col-xl-4">
      <label class="label" :for="props.id">
        <slot name="label-text">{{ label }}</slot>
      </label>
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
          <div class="search__wrapper m-3">
            <!-- Search input -->
            <input v-model="searchText" type="text" class="px-3" placeholder="Suche">
            <!-- Add Button -->
            <div @click="openAddModal" class="py-2 px-3 border-start pointer">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM15 11H11V15H9V11H5V9H9V5H11V9H15V11Z" fill="black" fill-opacity="0.58" />
              </svg>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="searching || loading" class="d-flex flex-column justify-content-center align-items-center w-100">
            <div class="spinner-border text-primary spinner-border-sm" role="status" aria-hidden="true"></div>
          </div>

          <!-- Options list -->
          <ul class="options__ul">
            <li v-for="(opt, i) in getOptionsData" :key="i" :tabindex="i" @click="onSelect(opt)" class="options__li" :class="{active: activeSelected && opt[props.trackBy] == activeSelected[props.trackBy]}">
              <slot name="prepend" :option="opt" />
              <slot name="text" :option="opt">
                <div class="color-box me-3" :style="`background-color: #${opt[props.dataConfig.colorTrack]};`"></div>

                <span class="w-100">{{ opt[props.optionLabel] }}</span>
              </slot>

              <slot name="append" :option="opt">
                <svg @click.stop="openDeleteModal(opt)" class="delete__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="black" fill-opacity="0.66" />
                </svg>
              </slot>
            </li>
          </ul>
          <p v-if="!loading && !getOptionsData.length" class="ms-3 mb-3">No Data Found!</p>
        </div>
      </div>

      <p v-if="hasError" class="text-danger text-13 mt-1">{{ errorMsg }}</p>
    </div>

    <ConfirmDialog v-model="removeModalStatus" :title="`${props.dataConfig.name} Löschen`" :message="`Möchten Sie diese ${props.dataConfig.name} wirklich entfernen?`" @onOk="onDelete" :okLoading="deleting" />

    <div v-if="addModalStatus" v-click-outside="closeAddModal" class="add__modal">
      <h6 class="mb-3">Polsterfarbe hinzufügen</h6>

      <!-- Upload file button -->
      <div class="d-flex flex-column justify-content-center align-items-center mb-3">
        <label class="btn btn-dark w-100">
          Upload picture
          <input @input="onSelectFile" type="file" accept="image/*" class="d-none" />
        </label>
      </div>

      <!-- Image -->
      <div v-show="imagePreview" class="mb-3 position-relative">
        <div ref="previewRef" class="color__preview"></div>
        <img :src="imagePreview" @click="getColorFromImage" @mousemove="getColorFromImage" ref="imgRef" class="img__ref img-fluid rounded">
      </div>

      <div class="d-flex mb-3">
        <p class="text-14">Farbanzeige</p>
        <div class="color-box ms-3" :style="`background-color: #${form[props.dataConfig.colorTrack]};`"></div>
      </div>

      <!-- form -->
      <div>
        <InputControl v-model="form[props.dataConfig.colorTrack]" stack label="Farbcode" class="mt-3" :errorField="props.dataConfig.colorTrack" :data-field="props.dataConfig.colorTrack" />
        <InputControl v-model="form[props.dataConfig.colorNameTrack]" stack label="Name" class="mt-3" :errorField="props.dataConfig.colorNameTrack" :data-field="props.dataConfig.colorNameTrack" />
      </div>

      <!-- Footer buttons -->
      <div class="mt-3 d-flex justify-content-end">
        <button @click="addModalStatus = false" type="button" class="btn btn-light px-4 me-3 py-2 btn-sm">
          Abbrechen
        </button>
        <PrimaryButton @click="submitForm" :loading="savingStatus">Speichern</PrimaryButton>
      </div>
    </div>

    <canvas ref="csRef" class="d-none"></canvas>
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
    overflow-y: scroll;
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
.add__modal {
  position: absolute;
  right: 0;
  top: 100%;

  padding: 15px;
  width: 444px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  z-index: 99;
}

.img__ref {
  cursor: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjciIHZpZXdCb3g9IjAgMCAyMiAyNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF8xNTgzXzI0KSI+CjxwYXRoIGQ9Ik0xMC4zMDE4IDEwLjAxNjZMMTMuMTI5NiAxMS42NDkzTDcuODIzNDcgMjAuODM5N0w2Ljk2MjIzIDIwLjk3MDlMNS40ODM4NiAyMy4yNTk0TDQuMzA1NiAyMi41NzkxTDUuNTQ4MzEgMjAuMTU0Nkw0Ljk5NTY0IDE5LjIwNzFMMTAuMzAxOCAxMC4wMTY2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE3LjA0NzIgNS40Nzk5OEMxNy41MzgxIDQuNjI5NzQgMTcuMjQ2OCAzLjU0MjM3IDE2LjM5NjUgMy4wNTE0OUMxNS41NDYzIDIuNTYwNiAxNC40NTg5IDIuODUxOTYgMTMuOTY4IDMuNzAyMkwxMS43NDU4IDcuNTUxMkwxNC44MjUgOS4zMjg5OEwxNy4wNDcyIDUuNDc5OThaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNOC42MDczMSA2Ljc2NTY1TDguMTYyODcgNy41MzU0NUM3LjkxNzQzIDcuOTYwNTcgOC4wNjMxMSA4LjUwNDI1IDguNDg4MjIgOC43NDk2OUwxNS40MTY0IDEyLjc0OTdDMTUuODQxNSAxMi45OTUxIDE2LjM4NTIgMTIuODQ5NSAxNi42MzA3IDEyLjQyNDNMMTcuMDc1MSAxMS42NTQ1QzE3LjMyMDYgMTEuMjI5NCAxNy4xNzQ5IDEwLjY4NTcgMTYuNzQ5OCAxMC40NDAzTDkuODIxNTYgNi40NDAyOUM5LjM5NjQ0IDYuMTk0ODUgOC44NTI3NiA2LjM0MDUzIDguNjA3MzEgNi43NjU2NVoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xNi45NzE4IDEwLjA1NTNMMTUuNDMyMiA5LjE2NjM4TDE3LjQzMjIgNS43MDIyOEMxOC4wNDU4IDQuNjM5NDggMTcuNjgxNiAzLjI4MDI3IDE2LjYxODggMi42NjY2N0MxNS41NTYgMi4wNTMwNiAxNC4xOTY4IDIuNDE3MjYgMTMuNTgzMiAzLjQ4MDA2TDExLjU4MzIgNi45NDQxNkwxMC4wNDM2IDYuMDU1MjdDOS40MDU5MSA1LjY4NzExIDguNTkwMzkgNS45MDU2MiA4LjIyMjIyIDYuNTQzM0w3Ljc3Nzc4IDcuMzEzMUM3LjQwOTYxIDcuOTUwNzggNy42MjgxMyA4Ljc2NjMxIDguMjY1ODEgOS4xMzQ0N0w5LjgwNTQxIDEwLjAyMzRMNC45MTY1MiAxOC40OTEyQzQuNjM0NjQgMTguOTgwNyA0LjY5MTEzIDE5LjU5NDcgNS4wNTc2MyAyMC4wMjQ1TDQuMTMwNzcgMjEuNjI5OUMzLjc2MjYgMjIuMjY3NiAzLjk4MTEyIDIzLjA4MzEgNC42MTg4IDIzLjQ1MTNDNS4yNTY0OCAyMy44MTk0IDYuMDcyIDIzLjYwMDkgNi40NDAxNyAyMi45NjMyTDcuMzY3MDMgMjEuMzU3OUM3LjkyMjU2IDIxLjQ2MDMgOC40ODI1MiAyMS4yMDIzIDguNzY1NTIgMjAuNzEzNEwxMy42NTQ0IDEyLjI0NTZMMTUuMTk0IDEzLjEzNDVDMTUuODMxNyAxMy41MDI2IDE2LjY0NzIgMTMuMjg0MSAxNy4wMTU0IDEyLjY0NjRMMTcuNDU5OCAxMS44NzY2QzE3LjgyOCAxMS4yMzkgMTcuNjA5NSAxMC40MjM0IDE2Ljk3MTggMTAuMDU1M1pNMTQuMzUzIDMuOTI0NUMxNC43MjEyIDMuMjg2ODIgMTUuNTM2NyAzLjA2ODMgMTYuMTc0NCAzLjQzNjQ3QzE2LjgxMiAzLjgwNDYzIDE3LjAzMDYgNC42MjAxNSAxNi42NjI0IDUuMjU3ODNMMTQuNjYyNCA4LjcyMTk0TDEyLjM1MyA3LjM4ODZMMTQuMzUzIDMuOTI0NVpNNy45OTU3MiAyMC4yNjg5QzcuODczIDIwLjQ4MTUgNy42MDExNiAyMC41NTQzIDcuMzg4NiAyMC40MzE2QzcuMTc2MDQgMjAuMzA4OSA2LjkwNDIgMjAuMzgxNyA2Ljc4MTQ4IDIwLjU5NDNMNS42NzAzNyAyMi41MTg4QzUuNTQ3NjUgMjIuNzMxNCA1LjI3NTgxIDIyLjgwNDIgNS4wNjMyNSAyMi42ODE1QzQuODUwNjkgMjIuNTU4OCA0Ljc3Nzg1IDIyLjI4NjkgNC45MDA1NyAyMi4wNzQ0TDYuMDExNjggMjAuMTQ5OUM2LjEzNDQgMTkuOTM3MyA2LjA2MTU2IDE5LjY2NTUgNS44NDkgMTkuNTQyN0M1LjYzNjQ0IDE5LjQyIDUuNTYzNiAxOS4xNDgyIDUuNjg2MzIgMTguOTM1NkwxMC41NzUyIDEwLjQ2NzhMMTIuODg0NiAxMS44MDExTDcuOTk1NzIgMjAuMjY4OVpNMTYuMjQ1NiAxMi4yMDJDMTYuMTIyOSAxMi40MTQ2IDE1Ljg1MSAxMi40ODc0IDE1LjYzODUgMTIuMzY0N0w4LjcxMDI2IDguMzY0NjdDOC40OTc3IDguMjQxOTUgOC40MjQ4NiA3Ljk3MDExIDguNTQ3NTggNy43NTc1NUw4Ljk5MjAyIDYuOTg3NzVDOS4xMTQ3NCA2Ljc3NTE5IDkuMzg2NTkgNi43MDIzNSA5LjU5OTE0IDYuODI1MDdMMTYuNTI3MyAxMC44MjUxQzE2LjczOTkgMTAuOTQ3OCAxNi44MTI3IDExLjIxOTYgMTYuNjkgMTEuNDMyMkwxNi4yNDU2IDEyLjIwMloiIGZpbGw9ImJsYWNrIi8+CjwvZz4KPGRlZnM+CjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZF8xNTgzXzI0IiB4PSIxLjk1MjE1IiB5PSIxLjM2ODY1IiB3aWR0aD0iMTcuNzc4MyIgaGVpZ2h0PSIyNS4yNjE1IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQgZHk9IjEiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjQgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18xNTgzXzI0Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzE1ODNfMjQiIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+Cg==")
      5 25,
    auto;
  //   cursor: crosshair;
}

.color__preview {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  z-index: 9;
  border-radius: 50%;
  border: 3px solid #fff;
}
</style>
