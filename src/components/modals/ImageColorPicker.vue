<script setup>
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import InputControl from "@/components/form/InputControl.vue"
import { useToast } from "vue-toastification"

import { defineProps, reactive, ref } from 'vue'
import { api } from "../../plugins/axios"

const props = defineProps({
  whenSelect: Function,
  hideModal: Function,
  dataConfig: { type: Object },
})

const toast = useToast()

const imagePreview = ref(null)
const imgRef = ref()
const csRef = ref()
const previewRef = ref()
const colorSelected = ref(false)

const form = reactive({ ...props.dataConfig.form })

const onSelectFile = (e) => {
  const file = e.target.files[0]

  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const onImageClick = (e) => {
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

    const p = csRef.value.getContext('2d')
      .getImageData(x, y, 1, 1).data

    const colorCode = rgbToHex(p[0], p[1], p[2])

    previewRef.value.style.background = `#${colorCode}`


    if (e.type == 'click') {
      form[props.dataConfig.colorTrack] = colorCode

      colorSelected.value = true
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


// On Cancle
const onCancle = () => {
  colorSelected.value = false
  Object.assign(form, props.dataConfig.form)
  props.hideModal()
}

const savingStatus = ref(false)
const saveForm = async () => {
  try {
    savingStatus.value = true
    const res = await api.post(props.dataConfig.postUrl, form)

    props.whenSelect(res.data.data)

    onCancle()

    toast.success("Erfolg anfordern")
  } catch (error) {
    toast.error("Antrag scheitert")
  } finally {
    savingStatus.value = false
  }
}
</script>

<template>
  <!-- <div class="modal-header">
    <h5 class="modal-title">
      Pick Color
    </h5>
  </div> -->
  <div class="modal-body">
    <div v-if="!colorSelected">
      <!-- Upload file button -->
      <div class="d-flex flex-column justify-content-center align-items-center ">
        <label class="btn btn-dark px-100px">
          Upload picture
          <input @input="onSelectFile" type="file" accept="image/*" class="d-none" />
        </label>
      </div>
      <!-- Image preview -->
      <div v-show="imagePreview" class="mt-3 position-relative">
        <div ref="previewRef" class="color__preview"></div>
        <img :src="imagePreview" @click="onImageClick" @mousemove="onImageClick" ref="imgRef" class="img__ref">

        <!-- <img src="@/assets/svg/eye-dropper.svg" alt=""> -->
      </div>
    </div>

    <div v-else>
      <template v-for="(feild, i) in props.dataConfig.fields" :key="i">
        <InputControl class="mt-3" v-model="form[feild.name]" :label="feild.label" :placeholder="`${feild.label}`" :errorField="feild.name" />
      </template>
    </div>

  </div>
  <div v-if="colorSelected" class="modal-footer border-0 mt-2">
    <button @click="onCancle" type="button" class="btn btn-light px-5 py-2 btn-sm">
      Abbrechen
    </button>
    <PrimaryButton @click="saveForm" :loading="savingStatus">Speichern</PrimaryButton>
  </div>

  <canvas ref="csRef" class="d-none"></canvas>
</template>


<style lang="scss" scoped>
.px-100px {
  padding-left: 100px;
  padding-right: 100px;
}

.img__ref {
  cursor: url("@/assets/svg/eyedropper-svgrepo-com.svg"), auto;
}
.color__preview {
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  height: 50px;
  z-index: 9;
}
</style>
