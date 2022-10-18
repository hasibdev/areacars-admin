<script setup>
import { ref, reactive } from 'vue'
import { useAxios, api } from "../../../../../use/useAxios"
import ActionDropdown from "@/components/ActionDropdown.vue"
import DataTable from "../../../../../components/DataTable.vue"
import ConfirmDialog from "@/components/modals/ConfirmDialog.vue"
import ModalControl from "@/components/modals/ModalControl.vue"
import { useToast } from "vue-toastification"
import InputControl from "@/components/form/InputControl.vue"
import TextControl from "@/components/form/TextControl.vue"
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import { modelWiseVehicle } from '../../../../../use/useSearchableConfig'
import SearchableSelect from "@/components/form/SearchableSelect.vue"

const { data: notificationList, loading, onApiDelete, reFetch, deleting } = useAxios('admin/push_notifactions')


const toast = useToast()
const fields = [
  {
    field: "title",
    label: 'Titel der Benachrichtigung',
  },
  {
    field: "description",
    label: 'Nachricht',
  },
  {
    field: "brand_name",
    label: 'Fahrzeug',
  },
  {
    field: "actions",
    label: 'Aktionen',
    thClass: "text-right",
    tdClass: "text-right",
    hideTh: true,
  }
]

// Deleting
const activeDeleteId = ref()
const showDeleteModal = ref(false)
const openDeleteModal = (id) => {
  activeDeleteId.value = id
  showDeleteModal.value = true
}

const onDelete = async () => {
  try {
    await onApiDelete(`/admin/push_notifactions/delete/${activeDeleteId.value}`)
    reFetch()

    showDeleteModal.value = false
    toast.success("Erfolgreich löschen")
  } catch (error) {
    toast.error("Antrag scheitert")
  }
}

// Editing
const editForm = reactive({
  data: {
    id: '',
    title: '',
    description: '',
    car_id: ''
  }
})

const activeEditId = ref()
const getEditData = async () => {
  const res = await api.get(`/admin/push_notifactions/edit/${activeEditId.value}`)
  // console.log(res?.data)

  Object.assign(editForm.data, res.data.notifaction)

  showEditModal.value = true
}

const showEditModal = ref(false)
const editingStatus = ref(false)
const openEditModal = (row) => {
  activeEditId.value = row.id
  getEditData()
}

const onUpdate = async () => {
  try {
    editingStatus.value = true

    await api.post(`/admin/push_notifactions/update/${activeEditId.value}`, editForm.data)
    toast.success('Erfolgreich erstellt')
    showEditModal.value = false
    reFetch()
  } catch (error) {
    toast.error('Antrag scheitert')
  } finally {
    editingStatus.value = false
  }
}

// Custom select
const customSelect = opt => {
  return {
    ...opt,
    brand_name: `${opt.brand_name} - ${opt.model_name} - ${opt.internal_number}`
  }
}

</script>
<template>
  <div class="border-top mt-4">
    <!-- <pre>{{notificationList}}</pre> -->
    <DataTable :data="notificationList?.notifactions || []" :fields="fields" :loading="loading">
      <!-- Car Id -->
      <template #brand_name="{row}">
        <p>{{row.brand_name}} - {{ row.model_name }} - {{ row.internal_number }}</p>
      </template>

      <!-- Action Dropdown -->
      <template #actions="{ row }">
        <ActionDropdown>
          <li @click="openEditModal(row)" class="dropdown-item py-2 pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span class="ms-3 text-14">Bearbeiten</span>
          </li>
          <li @click="openDeleteModal(row.id)" class="dropdown-item py-2 pointer">
            <span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H3.33333H14" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.33301 4.00016V2.66683C5.33301 2.31321 5.47348 1.97407 5.72353 1.72402C5.97358 1.47397 6.31272 1.3335 6.66634 1.3335H9.33301C9.68663 1.3335 10.0258 1.47397 10.2758 1.72402C10.5259 1.97407 10.6663 2.31321 10.6663 2.66683V4.00016M12.6663 4.00016V13.3335C12.6663 13.6871 12.5259 14.0263 12.2758 14.2763C12.0258 14.5264 11.6866 14.6668 11.333 14.6668H4.66634C4.31272 14.6668 3.97358 14.5264 3.72353 14.2763C3.47348 14.0263 3.33301 13.6871 3.33301 13.3335V4.00016H12.6663Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span class="ms-3 text-14">Löschen</span>
            </span>
          </li>
        </ActionDropdown>
      </template>
    </DataTable>
  </div>

  <!-- Entfernen Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" title="Fahrzeug löschen" message="Sind Sie sicher, dass Sie das Fahrzeug löschen wollen?"></ConfirmDialog>

  <!-- Edit Modal -->
  <ModalControl v-model="showEditModal" dialogClass="modal-lg">
    <div class="modal-header">
      <h5 class="modal-title"> Benachrichtigung bearbeiten </h5>
    </div>

    <div class="modal-body">
      <InputControl v-model="editForm.data.title" label="Titel der Benachrichtigung" class="mt-3" errorField="title" />
      <TextControl v-model="editForm.data.description" label="Nachricht" class="mt-3" errorField="description" />

      <SearchableSelect v-model="editForm.data.car_id" :handleSelect="customSelect" trackBy="car_id" label="Fahrzeug" :canAdd="false" optionLabel="brand_name" :dataConfig="modelWiseVehicle" errorField="car_id" class="mt-3">
        <template #text="{option}">
          <p>{{ option.brand_name }} - {{ option.model_name }} - {{ option.internal_number }}</p>
        </template>
        <template #append>{{' '}}</template>
      </SearchableSelect>

    </div>

    <div class="modal-footer border-0 mt-2">
      <button @click="showEditModal = false" type="button" class="btn btn-light px-5 py-2 btn-sm">
        Abbrechen
      </button>
      <PrimaryButton @click="onUpdate" :loading="editingStatus">Speichern</PrimaryButton>
    </div>

  </ModalControl>
</template>


<style lang="scss" scoped>
</style>
