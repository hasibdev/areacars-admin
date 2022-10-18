<template>
  <div>
    <!-- Upload box -->
    <div v-bind="getRootProps()">

      <div class="upload-wrapper" :class="{'border-danger has_error': getError || hasError}">
        <input v-bind="getInputProps()">
        <UploadCloudIcon />

        <button @click="onClick" class="btn btn-dark btn-sm px-4 mt-3">{{ t('button.chooseFiles') }}</button>
        <p v-if="isDragActive" class="text-dark mt-2 fw-medium">Drop the files here ...</p>
        <p v-else class="text-dark mt-2 fw-medium">{{ t('paragraph.drag&DropHier') }}</p>
      </div>

    </div>

    <p v-if="getError || hasError" class="text-danger text-13 mt-1">{{ getError || errorMsg }}</p>

    <!-- Select all and delete Files -->
    <div v-if="files.length" class="row mt-4 mb-2">
      <div class="col">
        <CheckBoxRound v-model="allFilesSelected" @update:model-value="onSelectAllFiles" label="Alle auswählen" />
      </div>
      <div v-if="selectedFiles.length" class="col">
        <span @click="openRemoveModal" class="d-flex justify-content-end pointer">
          <svg class="me-2" width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5H3H19" stroke="#F56C6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M17 5V19C17 19.5304 16.7893 20.0391 16.4142 20.4142C16.0391 20.7893 15.5304 21 15 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5M6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5" stroke="#F56C6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 10V16" stroke="#F56C6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 10V16" stroke="#F56C6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Löschen
        </span>
      </div>
    </div>

    <!-- Preview row -->
    <div class="row align-items-center">

      <!-- File List Images -->
      <Draggable v-model="files" item-key="dId" class="row">
        <template #item="{element}">
          <div class="col-md-4 mb-4 position-relative">
            <a v-if="!carcopy" :href="getImgUrl(`public/thumbnail/${element.medium}`)" target="_blank">
              <img :src="getImgUrl(`public/thumbnail/${element.medium}`)" alt="Preview" class="rounded preview__img c-move">
            </a>

            <a v-else :href="element.medium" target="_blank">
              <img :src="element.medium" alt="Preview" class="rounded preview__img c-move">
            </a>

            <CheckBoxRound v-model="selectedFiles" @update:model-value="onSelectSingleFile" :value="element.dId" class="remove-icon" />
            <!-- <span @click="openRemoveModal(index)" class="remove-icon">&#10073;</span> -->
          </div>
        </template>
      </Draggable>

      <div v-if="uploading" class="my-4 d-flex flex-column align-items-center justify-content-center">
        <div class="spinner-border" role="status" aria-hidden="true"></div>
        <p>Uploading...</p>
      </div>
      <div v-if="deleting" class="my-4 d-flex flex-column align-items-center justify-content-center">
        <div class="spinner-border" role="status" aria-hidden="true"></div>
        <p>Deleting...</p>
      </div>

    </div>

    <ConfirmDialog v-model="removeModalStatus" :title="`${t('heading.cancelUpload')}?`" :message="`${t('paragraph.cancleUpload')}?`" @onOk="confirmedRemove" :okLoading="deleting" />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, computed, watch } from "vue"
import { useDropzone } from "vue3-dropzone"
import UploadCloudIcon from '@/components/icons/UploadCloudIcon.vue'
import ConfirmDialog from '@/components/modals/ConfirmDialog.vue'
import { useI18n } from 'vue-i18n'
import { useValidationStore } from '@/stores/validation'
import Draggable from 'vuedraggable'
import CheckBoxRound from './CheckBoxRound.vue'
import { api } from '../../plugins/axios'

export default defineComponent({
  name: "ImageUploader",
  props: {
    modelValue: {
      type: [File, Array, null],
      required: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    errorField: { type: String },
    accept: {
      type: Array,
      default: () => [".jpg", ".jpeg", ".png", ".svg"]
    },
    previousImages: {
      type: Array,
      default: () => []
    },
    preview: String,
    errors: {
      type: Object,
      default: () => { }
    },
    carcopy: {
      type: Boolean,
      default: false,
    },
    uniqueId: { type: String }
  },
  emits: ['update:modelValue', 'update:previousImages'],

  components: {
    UploadCloudIcon, ConfirmDialog, Draggable, CheckBoxRound
  },
  methods: {
    onClick() {
      if (this.open) {
        this.open()
      }
    }
  },
  setup(props, ctx) {
    const validationStore = useValidationStore()
    const { t } = useI18n({ useScope: 'global' })
    const files = ref([...props.modelValue])
    const uploading = ref(false)
    const deleting = ref(false)

    const onDrop = async (acceptedFiles) => {
      const formData = new FormData()
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        formData.append(`files[${i}]`, file ?? '')
      }
      formData.append('unique_id', props.uniqueId)

      try {
        uploading.value = true
        const res = await api.post('admin/productupload/imagesuploads', formData)
        files.value = [...props.previousImages, ...res.data.car_images.map(img => ({ ...img, dId: img.dId }))]

        ctx.emit('update:modelValue', files.value)
      } catch {
        //
      } finally {
        uploading.value = false
      }

      delete validationStore.errors[props.errorField]
    }

    const options = reactive({
      multiple: props.multiple,
      onDrop,
      accept: props.accept,
    })

    // Modal
    //  const activeRemoveIndex = ref()
    const removeModalStatus = ref(false)
    const openRemoveModal = () => {
      removeModalStatus.value = true
    }

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

    //  Selection
    const allFilesSelected = ref(false)
    const selectedFiles = ref([])

    const onSelectAllFiles = (val) => {
      if (val) selectedFiles.value = files.value.map(f => f.dId)
      else selectedFiles.value = []
    }
    const onSelectSingleFile = () => {
      allFilesSelected.value = selectedFiles.value.length == files.value.length
    }

    const confirmedRemove = async () => {
      try {
        deleting.value = true
        const prevIds = props.previousImages.map(p => p.id)
        const deleteAbleIds = selectedFiles.value.filter(id => !prevIds.includes(id))

        await api.post('admin/productupload/multipleimagedelete', {
          images_id: deleteAbleIds.join()
        })

        const deleteAblePreviousImg = props.previousImages.filter(img => !selectedFiles.value.includes(img.dId))

        ctx.emit('update:previousImages', deleteAblePreviousImg)

        files.value = files.value.filter(file => !selectedFiles.value.includes(file.dId))
        selectedFiles.value = []
        removeModalStatus.value = false
      } catch (err) {
        console.log(err)
      } finally {
        deleting.value = false
      }
    }

    watch(() => files.value, (newFiles) => {
      ctx.emit('update:modelValue', newFiles)
    })

    const { getRootProps, getInputProps, ...rest } = useDropzone(options)
    return {
      t,
      // previewImages,
      options,
      openRemoveModal,
      confirmedRemove,
      getRootProps,
      getInputProps,
      removeModalStatus,
      files,
      hasError,
      errorMsg,
      getError,
      allFilesSelected,
      selectedFiles,
      onSelectAllFiles,
      onSelectSingleFile,
      deleting,
      uploading,
      ...rest,
    }
  },
});
</script>


<style lang="scss" scoped>
.c-move {
  cursor: move;
}

.upload-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f1edf3;
  padding: 20px;
  height: 340px;
  border: 1px dashed;
  border-color: #808080;
  border-radius: 5px;
  cursor: pointer;
}
.remove-icon {
  position: absolute;
  top: 2px;
  left: 18px;
}

.default_img_wrap {
  .default_image_change {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    text-align: center;
    width: 100%;
    height: 100%;
    color: #fff;
    background: #0000007a;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;
  }
  &:hover {
    .default_image_change {
      opacity: 1;
    }
  }
}
img.preview__img {
  aspect-ratio: 16/10;
  object-fit: cover;
}
</style>
