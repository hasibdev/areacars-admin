<script setup>
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from "vue-toastification"
import { useAxios, api } from '../../../../use/useAxios'

import BackButton from '@/components/buttons/BackButton.vue'
import InputControl from '@/components/form/InputControl.vue'
import SelectControl from '@/components/form/SelectControl.vue'
import Switcher from '@/components/form/Switcher.vue'
import ActionDropdown from '@/components/ActionDropdown.vue'
import ConfirmDialog from '@/components/modals/ConfirmDialog.vue'
import ModalControl from '@/components/modals/ModalControl.vue'
import LoadingView from '../../../../components/views/LoadingView.vue'
import PrimaryButton from '../../../../components/buttons/PrimaryButton.vue'

const { t } = useI18n({ useScope: "global" })
const toast = useToast()

const { data: countryData } = useAxios('/admin/country')
const {
  data: locationData,
  loading,
  onApiDelete,
  deleting,
  reFetch
} = useAxios('/admin/location')

const addModalStatus = ref(false)
const addForm = reactive({
  location_name: '',
  city_id: '',
  zip_code: '',
  address: '',
  country_id: '',
  lat: '',
  long: '',
  phones: '',
  emails: '',
  whatsapp: '',
  images: null,

  sunday_status: true,
  sunday_open: '10:00 AM',
  sunday_close: '08:00 PM',

  monday_status: true,
  monday_open: '10:00 AM',
  monday_close: '08:00 PM',

  tuesday_status: true,
  tuesday_open: '10:00 AM',
  tuesday_close: '08:00 PM',

  wednesday_status: true,
  wednesday_open: '10:00 AM',
  wednesday_close: '08:00 PM',

  thursday_status: true,
  thursday_open: '10:00 AM',
  thursday_close: '08:00 PM',

  friday_status: true,
  friday_open: '10:00 AM',
  friday_close: '08:00 PM',

  saturday_status: true,
  saturday_open: '10:00 AM',
  saturday_close: '08:00 PM',
})


const onFileSelect = e => {
  addForm.images = e.target.files[0]
}
const removeImageFile = () => {
  addForm.images = null
}


// Editing
const editForm = reactive({
  data: {}
})

const onEditFileSelect = e => {
  editForm.data.images = e.target.files[0]
}
const removeEditImageFile = () => {
  editForm.data.images = null
}


const editModalStatus = ref(false)
const editingState = ref(false)

const openEditModal = (data) => {
  Object.assign(editForm.data, data)
  editModalStatus.value = true
}

const onEditLocation = async () => {
  const formData = new FormData()

  for (let key in editForm.data) {
    formData.append(key, editForm.data[key] ?? '')
  }

  try {
    editingState.value = true
    await api.post(`/admin/location/update/${editForm.data.branc_id}`, formData)
    reFetch()

    toast.success('Aktualisierung erfolgreich')
    editModalStatus.value = false
  } catch (error) {
    console.error(error)
    toast.error('Antrag scheitert')
  } finally {
    editingState.value = false
  }
}
const addingState = ref(false)
const onAddLocation = async () => {
  const formData = new FormData()

  for (let key in addForm) {
    formData.append(key, addForm[key] ?? '')
  }

  try {
    addingState.value = true
    await api.post('/admin/location/store', formData)
    reFetch()

    toast.success('Erfolgreich erstellt')
    addModalStatus.value = false
  } catch (error) {
    //
    toast.error('Antrag scheitert')
  } finally {
    addingState.value = false
  }
}

const getEditImageName = computed(() => {
  if (typeof editForm.data.images === 'string') {
    return editForm.data.images
  }
  return editForm.data?.images?.name
})

// Deleting
const activeDeleteId = ref()
const showDeleteModal = ref(false)
const openDeleteModal = (id) => {
  activeDeleteId.value = id
  showDeleteModal.value = true
}
const onDelete = async () => {
  try {
    await onApiDelete(`/admin/location/delete/${activeDeleteId.value}`)
    reFetch()

    showDeleteModal.value = false
    toast.success("Erfolgreich löschen")
  } catch (error) {
    toast.error("Antrag scheitert")
  }
}
</script>

<template>

  <div class="d-flex justify-content-between align-items-center">
    <BackButton :label="t('title.settings')" />

    <button @click="addModalStatus = true" class="btn btn-dark">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <span class="ms-3">Standort hinzufügen</span>
    </button>
  </div>
  <h5 class="mt-4">Standort</h5>

  <p v-if="!loading && !locationData?.locations.length">No Data found!</p>

  <LoadingView :loading="loading">
    <div v-for="(loc, i) in locationData?.locations || []" :key="i" class="borderd-content position-relative mt-3">
      <div class="row">
        <div class="col-xl-3 col-lg-4 col-md-6">
          <img :src="getImgUrl(`public/images/${loc.images}`)" class="rounded location__img">
        </div>

        <div class="col-xl-3 col-lg-4 col-md-6">
          <h5 class="locaton_item_title">{{ loc.location_name }}</h5>

          <ul class="mt-4">
            <li class="mt-2 d-flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.0004 16.9201V19.9201C22.0016 20.1986 21.9445 20.4743 21.8329 20.7294C21.7214 20.9846 21.5577 21.2137 21.3525 21.402C21.1473 21.5902 20.905 21.7336 20.6412 21.8228C20.3773 21.912 20.0978 21.9452 19.8204 21.9201C16.7433 21.5857 13.7874 20.5342 11.1904 18.8501C8.77425 17.3148 6.72576 15.2663 5.19042 12.8501C3.5004 10.2413 2.44866 7.27109 2.12042 4.1801C2.09543 3.90356 2.1283 3.62486 2.21692 3.36172C2.30555 3.09859 2.44799 2.85679 2.63519 2.65172C2.82238 2.44665 3.05023 2.28281 3.30421 2.17062C3.5582 2.05843 3.83276 2.00036 4.11042 2.0001H7.11042C7.59573 1.99532 8.06621 2.16718 8.43418 2.48363C8.80215 2.80008 9.0425 3.23954 9.11042 3.7201C9.23704 4.68016 9.47187 5.62282 9.81042 6.5301C9.94497 6.88802 9.97408 7.27701 9.89433 7.65098C9.81457 8.02494 9.62928 8.36821 9.36042 8.6401L8.09042 9.9101C9.51398 12.4136 11.5869 14.4865 14.0904 15.9101L15.3604 14.6401C15.6323 14.3712 15.9756 14.1859 16.3495 14.1062C16.7235 14.0264 17.1125 14.0556 17.4704 14.1901C18.3777 14.5286 19.3204 14.7635 20.2804 14.8901C20.7662 14.9586 21.2098 15.2033 21.527 15.5776C21.8441 15.9519 22.0126 16.4297 22.0004 16.9201Z" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="ms-3 text-14">{{ loc.phones }}</span>
            </li>
            <li class="mt-2 d-flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span class="ms-3 text-14">{{ loc.address }} <br> {{ loc.zip_code }} {{ loc.city_id }}</span>
            </li>
            <li class="mt-2 d-flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22 6L12 13L2 6" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span class="ms-3 text-14">{{ loc.emails }}</span>
            </li>
            <li v-if="loc.whatsapp" class="mt-2 d-flex">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62812 20.1933L6.99114 20.4074C8.51573 21.3082 10.2637 21.7846 12.0463 21.7855H12.0501C17.5245 21.7855 21.9799 17.3511 21.9821 11.9007C21.9831 9.25955 20.951 6.77588 19.0757 4.90762C17.2004 3.03935 14.707 2.00997 12.0539 2.00886C6.5753 2.00886 2.11992 6.44278 2.11791 11.8927C2.11702 13.7603 2.64207 15.5793 3.63623 17.1533L3.87258 17.5271L2.86902 21.1745L6.62812 20.1933ZM0 24L1.69536 17.8375C0.649719 16.0341 0.0995952 13.988 0.100267 11.892C0.102954 5.33474 5.46319 0 12.0501 0C15.2466 0.00155219 18.2467 1.23994 20.5032 3.48787C22.759 5.7358 24.0011 8.72369 24 11.9016C23.9971 18.4585 18.636 23.7941 12.0501 23.7941C12.0497 23.7941 12.0506 23.7941 12.0501 23.7941H12.045C10.0452 23.7933 8.0802 23.2939 6.33471 22.3463L0 24Z" fill="#808080" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.92385 6.79297C8.69292 6.28602 8.44998 6.27575 8.23059 6.26685C8.05093 6.25931 7.8454 6.25977 7.6401 6.25977C7.43457 6.25977 7.10088 6.33601 6.81868 6.64072C6.53625 6.94544 5.74023 7.682 5.74023 9.18024C5.74023 10.6785 6.84431 12.1261 6.99811 12.3294C7.15215 12.5326 9.12938 15.7053 12.261 16.9257C14.8634 17.9401 15.3929 17.7383 15.958 17.6876C16.5229 17.637 17.7807 16.9511 18.0373 16.2401C18.2941 15.5291 18.2941 14.9199 18.2172 14.7925C18.1401 14.6653 17.9348 14.5893 17.6265 14.4371C17.3184 14.2849 15.8037 13.5481 15.5213 13.4465C15.2389 13.3449 15.0336 13.2942 14.8281 13.599C14.6228 13.9037 14.0327 14.5893 13.8528 14.7925C13.6732 14.9959 13.4935 15.0212 13.1852 14.8689C12.8772 14.7162 11.8848 14.3951 10.7078 13.3577C9.79192 12.5506 9.17371 11.5538 8.99382 11.2491C8.81416 10.9444 8.97465 10.7796 9.12914 10.6278C9.26747 10.4913 9.43721 10.2722 9.59147 10.0944C9.74504 9.91658 9.79653 9.78968 9.89907 9.58676C10.0018 9.38339 9.95057 9.20558 9.87343 9.05334C9.79654 8.90109 9.19773 7.39509 8.92385 6.79297Z" fill="#808080" />
              </svg>

              <span class="ms-3 text-14">{{ loc.whatsapp }}</span>
            </li>
          </ul>
        </div>

        <div class="col-xl-3 col-lg-4 col-md-6">
          <p class="text-13 mt-4 mb-0 fw-medium">Öffnungszeiten</p>
          <ul class="">
            <li class="d-flex justify-content-between mt-2 text-14">
              <span class="text-muted">Montag</span>
              <span class="fw-medium" v-if="loc.monday_status">{{ loc.monday_open }} - {{ loc.monday_close
                        }}</span>
              <span v-else class="fw-medium">Geschlossen</span>
            </li>

            <li class="d-flex justify-content-between mt-2 text-14">
              <span class="text-muted">Dienstag</span>
              <span class="fw-medium" v-if="loc.tuesday_status">{{ loc.tuesday_open }} - {{ loc.tuesday_close
                        }}</span>
              <span v-else class="fw-medium">Geschlossen</span>
            </li>

            <li class="d-flex justify-content-between mt-2 text-14">
              <span class="text-muted">Mittwoch</span>
              <span class="fw-medium" v-if="loc.wednesday_status">{{ loc.wednesday_open }} - {{
                              loc.wednesday_close
                        }}</span>
              <span v-else class="fw-medium">Geschlossen</span>
            </li>

            <li class="d-flex justify-content-between mt-2 text-14">
              <span class="text-muted">Donnerstag</span>
              <span class="fw-medium" v-if="loc.thursday_status">{{ loc.thursday_open }} - {{
                              loc.thursday_close
                        }}</span>
              <span v-else class="fw-medium">Geschlossen</span>
            </li>

            <li class="d-flex justify-content-between mt-2 text-14">
              <span class="text-muted">Freitag</span>
              <span class="fw-medium" v-if="loc.friday_status">{{ loc.friday_open }} - {{ loc.friday_close
                        }}</span>
              <span v-else class="fw-medium">Geschlossen</span>
            </li>

            <li class="d-flex justify-content-between mt-2 text-14">
              <span class="text-muted">Samstag</span>
              <span class="fw-medium" v-if="loc.saturday_status">{{ loc.saturday_open }} - {{
                              loc.saturday_close
                        }}</span>
              <span v-else class="fw-medium">Geschlossen</span>
            </li>

            <li class="d-flex justify-content-between mt-2 text-14">
              <span class="text-muted">Sonntag</span>
              <span class="fw-medium" v-if="loc.sunday_status">{{ loc.sunday_open }} - {{ loc.sunday_close
                        }}</span>
              <span v-else class="fw-medium">Geschlossen</span>
            </li>

          </ul>
        </div>
      </div>

      <!-- Menu Icon / Dropdown -->
      <div class="floating-menu-icon">
        <ActionDropdown>
          <li @click="openEditModal(loc)">
            <span class="dropdown-item py-2 pointer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span class="ms-3 text-14">Bearbeiten</span>
            </span>
          </li>
          <li @click="openDeleteModal(loc.branc_id)">
            <span class="dropdown-item py-2 pointer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H3.33333H14" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.33301 4.00016V2.66683C5.33301 2.31321 5.47348 1.97407 5.72353 1.72402C5.97358 1.47397 6.31272 1.3335 6.66634 1.3335H9.33301C9.68663 1.3335 10.0258 1.47397 10.2758 1.72402C10.5259 1.97407 10.6663 2.31321 10.6663 2.66683V4.00016M12.6663 4.00016V13.3335C12.6663 13.6871 12.5259 14.0263 12.2758 14.2763C12.0258 14.5264 11.6866 14.6668 11.333 14.6668H4.66634C4.31272 14.6668 3.97358 14.5264 3.72353 14.2763C3.47348 14.0263 3.33301 13.6871 3.33301 13.3335V4.00016H12.6663Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span class="ms-3 text-14">Löschen</span>
            </span>
          </li>
        </ActionDropdown>
      </div>
    </div>
  </LoadingView>

  <!-- Entfernen Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" title="Standort löschen" message="Möchten Sie den Standort löschen?"></ConfirmDialog>

  <!-- Edit Modal -->
  <ModalControl v-model="editModalStatus" dialogClass="modal-lg">
    <div class="modal-header">
      <p>Standort bearbeiten</p>
    </div>
    <div v-if="editForm.data" class="modal-body">
      <p>Infos zum Standort des Shops</p>

      <InputControl v-model="editForm.data.location_name" label="Name des Geschäfts" class="mt-3" />
      <InputControl v-model="editForm.data.address" label="Straße" class="mt-3" />
      <InputControl v-model="editForm.data.zip_code" label="PLZ" class="mt-3" />
      <InputControl v-model="editForm.data.city_id" label="Stadt" class="mt-3" />

      <SelectControl v-model="editForm.data.country_id" :options="countryData?.countrys || []" optionLabel="country_name" label="Land" class="mt-3" />

      <InputControl v-model="editForm.data.phones" label="Telefon" type="tel" class="mt-3" />
      <InputControl v-model="editForm.data.emails" label="E-Mail" type="email" placeholder="example@mail.com" class="mt-3" />

      <InputControl v-model="editForm.data.lat" label="Breitengrad" placeholder="Breitengrad" class="mt-3" errorField="lat" />
      <InputControl v-model="editForm.data.long" label="Längengrad" placeholder="Längengrad" class="mt-3" errorField="long" />
      <InputControl v-model="editForm.data.whatsapp" label="Whatsapp" placeholder="Whatsapp" class="mt-3" errorField="whatsapp" />

      <div class="row mt-3">
        <div class="col-md-4">
          <p class="label location_modal_title">Öffnungszeiten</p>
        </div>
        <div class="col-md-8">
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Montag</div>
            <div class="col-3">
              <input v-model="editForm.data.monday_open" :disabled="!editForm.data.monday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.monday_close" :disabled="!editForm.data.monday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.monday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.monday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Dienstag</div>
            <div class="col-3">
              <input v-model="editForm.data.tuesday_open" :disabled="!editForm.data.tuesday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.tuesday_close" :disabled="!editForm.data.tuesday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.tuesday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.tuesday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Mittwoch</div>
            <div class="col-3">
              <input v-model="editForm.data.wednesday_open" :disabled="!editForm.data.wednesday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.wednesday_close" :disabled="!editForm.data.wednesday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.wednesday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.wednesday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Donnerstag</div>
            <div class="col-3">
              <input v-model="editForm.data.thursday_open" :disabled="!editForm.data.thursday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.thursday_close" :disabled="!editForm.data.thursday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.thursday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.thursday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Freitag</div>
            <div class="col-3">
              <input v-model="editForm.data.friday_open" :disabled="!editForm.data.friday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.friday_close" :disabled="!editForm.data.friday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.friday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.friday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Samstag</div>
            <div class="col-3">
              <input v-model="editForm.data.saturday_open" :disabled="!editForm.data.saturday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.saturday_close" :disabled="!editForm.data.saturday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.saturday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.saturday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Sonntag</div>
            <div class="col-3">
              <input v-model="editForm.data.sunday_open" :disabled="!editForm.data.sunday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="editForm.data.sunday_close" :disabled="!editForm.data.sunday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="editForm.data.sunday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ editForm.data.sunday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-4">
          <p class="label">Bild</p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-between">
            <label class="btn btn-outline-primary">
              Upload Datei
              <input @input="onEditFileSelect" type="file" class="visually-hidden" />
            </label>

            <p v-if="editForm.data.images" class="ms-2 text-truncate d-flex align-items-center">
              <span class="me-2">{{ getEditImageName }}</span>
              <span @click="removeEditImageFile()" class="remove-icon">&#10073;</span>
            </p>
          </div>
        </div>
      </div>

    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="editModalStatus = false" type="button" class="btn btn-light px-5 py-2 btn-sm ">Abbrechen</button>
      <PrimaryButton @click="onEditLocation" :loading="editingState">Speichern</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Add Modal -->
  <ModalControl v-model="addModalStatus" dialogClass="modal-lg">
    <div class="modal-header">
      <p class="">Standort hinzufügen</p>
    </div>
    <div class="modal-body">
      <p class="location_modal_title">Infos zum Standort des Shops</p>

      <InputControl v-model="addForm.location_name" label="Name des Geschäfts" class="mt-3" errorField="location_name" />
      <InputControl v-model="addForm.address" label="Straße" class="mt-3" errorField="address" />
      <InputControl v-model="addForm.zip_code" label="PLZ" class="mt-3" errorField="zip_code" />
      <InputControl v-model="addForm.city_id" label="Stadt" class="mt-3" errorField="city_id" />

      <SelectControl v-model="addForm.country_id" :options="countryData?.countrys || []" optionLabel="country_name" label="Land" class="mt-3" errorField="country_id" />

      <InputControl v-model="addForm.phones" label="Telefon" type="tel" class="mt-3" errorField="phones" />
      <InputControl v-model="addForm.emails" label="E-Mail" type="email" placeholder="example@mail.com" class="mt-3" errorField="emails" />

      <InputControl v-model="addForm.lat" label="Breitengrad" placeholder="Breitengrad" class="mt-3" errorField="lat" />
      <InputControl v-model="addForm.long" label="Längengrad" placeholder="Längengrad" class="mt-3" errorField="long" />
      <InputControl v-model="addForm.whatsapp" label="Whatsapp" placeholder="Whatsapp" class="mt-3" errorField="whatsapp" />

      <div class="row mt-3">
        <div class="col-md-4">
          <p class="label">Öffnungszeiten</p>
        </div>
        <div class="col-md-8">
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Montag</div>
            <div class="col-3">
              <input v-model="addForm.monday_open" :disabled="!addForm.monday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="addForm.monday_close" :disabled="!addForm.monday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.monday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.monday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Dienstag</div>
            <div class="col-3">
              <input v-model="addForm.tuesday_open" :disabled="!addForm.tuesday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="addForm.tuesday_close" :disabled="!addForm.tuesday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.tuesday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.tuesday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Mittwoch</div>
            <div class="col-3">
              <input v-model="addForm.wednesday_open" :disabled="!addForm.wednesday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="addForm.wednesday_close" :disabled="!addForm.wednesday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.wednesday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.wednesday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Donnerstag</div>
            <div class="col-3">
              <input v-model="addForm.thursday_open" :disabled="!addForm.thursday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="addForm.thursday_close" :disabled="!addForm.thursday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.thursday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.thursday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Freitag</div>
            <div class="col-3">
              <input v-model="addForm.friday_open" :disabled="!addForm.friday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="addForm.friday_close" :disabled="!addForm.friday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.friday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.friday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Samstag</div>
            <div class="col-3">
              <input v-model="addForm.saturday_open" :disabled="!addForm.saturday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="addForm.saturday_close" :disabled="!addForm.saturday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.saturday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.saturday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
          <div class="row mt-3 align-items-center">
            <div class="col-4 text-muted">Sonntag</div>
            <div class="col-3">
              <input v-model="addForm.sunday_open" :disabled="!addForm.sunday_status" type="text" class="form-control" placeholder="Geöffnet">
            </div>
            <div class="col-3">
              <input v-model="addForm.sunday_close" :disabled="!addForm.sunday_status" type="text" class="form-control" placeholder="Geschlossen">
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center flex-column">
              <Switcher v-model="addForm.sunday_status" activeColor="#276EF1" activeBackground="#D5E4FF" />
              <p class="text-13">{{ addForm.sunday_status ? 'Geöffnet' : 'Geschlossen' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-4">
          <p class="label">Bild</p>
        </div>

        <div class="col-md-8">
          <div class="d-flex justify-content-between">
            <label class="btn btn-outline-primary">
              Upload Datei
              <input @input="onFileSelect" type="file" class="visually-hidden" />
            </label>

            <p v-if="addForm.images" class="ms-2 text-truncate d-flex align-items-center">
              <span class="me-2">{{ addForm.images.name }}</span>
              <span @click="removeImageFile" class="remove-icon">&#10073;</span>
            </p>
          </div>

          <!-- Notice -->
          <p class="mt-4 ">Unterstütztes Format PNG oder JPG</p>
        </div>
      </div>

    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="addModalStatus = false" type="button" class="btn btn-light px-5 py-2 btn-sm ">Abbrechen</button>
      <PrimaryButton @click="onAddLocation" :loading="addingState">Speichern</PrimaryButton>
    </div>
  </ModalControl>
</template>

<style lang="scss">
#location_edit_modal {
  @media (min-width: 1200px) {
    .modal-dialog {
      max-width: 720px !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.fw-medium {
  color: #333;
}

.location_modal_title {
  font-weight: 600;
  font-size: 16px;
}

.locaton_item_title {
  font-size: 20px;
  font-weight: 600;
}

.remove-icon {
  color: white;
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

.floating-menu-icon {
  position: absolute;
  right: 15px;
  top: 15px;

  @media (min-width: 1200px) {
    top: 50%;
    transform: translateY(-50%);
  }
}

.location__img {
  aspect-ratio: 16/10;
  object-fit: cover;
}
</style>
