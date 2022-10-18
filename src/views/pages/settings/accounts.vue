<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import InputControl from '@/components/form/InputControl.vue'
import SelectControl from '@/components/form/SelectControl.vue'
import ConfirmDialog from "@/components/modals/ConfirmDialog.vue"
import ModalControl from "@/components/modals/ModalControl.vue"
import BackButton from '@/components/buttons/BackButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import DataTable from '@/components/DataTable.vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import { useToast } from "vue-toastification"

import { useAxios, api } from '../../../use/useAxios'
const toast = useToast()

const userRoles = [
  {
    id: 1,
    label: "Administrator",
  },
  {
    id: 2,
    label: "Editor",
  },
]

const {
  data: userList,
  loading,
  onApiDelete,
  deleting,
  reFetch,
} = useAxios("/admin/users")

const fields = [
  {
    field: 'name',
    label: 'Mitarbeiter ',
  },
  {
    field: 'email',
    label: 'E-Mail ',
  },
  {
    field: 'role_id',
    label: 'Rolle',
    handler: (row) => {
      return userRoles.find(r => r.id == row.role_id).label
    }
  },
  {
    field: 'actions',
    label: 'Aktionen',
    thClass: 'text-right',
    tdClass: 'text-right',
  }
]

const { t } = useI18n({ useScope: "global" })

// Adding
const showAddModal = ref(false)
const addingStatus = ref(false)
const addAccountFrom = reactive({
  name: '',
  email: '',
  role_id: ''
})

// Creating
const onSave = async () => {
  try {
    addingStatus.value = true
    await api.post('/admin/users/store', addAccountFrom)
    reFetch()

    showAddModal.value = false
    toast.success('Created Successfully')
  } catch (error) {
    console.error(error)
    toast.error('Antrag scheitert!')
  } finally {
    addingStatus.value = false
  }
}

// Editing
const editForm = reactive({
  data: {}
})
const editingState = ref(false)
const showEditModal = ref(false)
const openEditModal = (data) => {
  Object.assign(editForm.data, data)
  showEditModal.value = true
}

const onUpdate = async () => {
  try {
    editingState.value = true

    await api.post(`/admin/users/update/${editForm.data.users_id}`, editForm.data)
    reFetch()

    toast.success("Aktualisierung Successfuly")
    showEditModal.value = false
  } catch (error) {
    console.error(error)
    toast.error("Antrag scheitert")
  } finally {
    editingState.value = false
  }
}

// Deleting
const activeDeleteId = ref()
const showDeleteModal = ref(false)
const openDeleteModal = (id) => {
  activeDeleteId.value = id
  showDeleteModal.value = true
}
const onDelete = async () => {
  try {
    await onApiDelete(`/admin/users/delete/${activeDeleteId.value}`)
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

    <button @click="showAddModal = true" class="btn btn-dark">
      <span class="me-1 text-17">+</span> Benutzer hinzufügen
    </button>
  </div>

  <h5 class="mt-4 mb-3">Benutzer</h5>

  <div class="borderd-content my-3">
    <DataTable bordered :data="userList || []" :fields="fields" :loading="loading">
      <template #actions="{ row }">
        <EditIcon @click="openEditModal(row)" class="pointer" />
        <TrashIcon @click="openDeleteModal(row.users_id)" class="ms-3 pointer" />
      </template>

      <!-- Pagination -->
      <template #pagination>
        <div class="d-flex justify-content-end">
          <!-- <Paginate :page-count="pageCount" :page-range="3" :margin-pages="2" :click-handler="changePage" :prev-text="'Prev'" :next-text="'Weiter'" :container-class="'pagination'" :page-class="'page-item'"></Paginate> -->
        </div>
      </template>
    </DataTable>
  </div>

  <!-- Add Account -->
  <!-- ////////////////////// -->
  <ModalControl v-model="showAddModal">
    <div class="modal-header">
      <h5 class="modal-title" id="preview_image_remore_label">Benutzer hinzufügen</h5>
    </div>
    <div class="modal-body">
      <InputControl v-model="addAccountFrom.name" :label="t('field.fullname')" placeholder="Tab Name Here" />
      <InputControl v-model="addAccountFrom.email" :label="t('field.email')" type="email" class="mt-3" placeholder="Typ Kategorie" />
      <SelectControl v-model="addAccountFrom.role_id" :options="userRoles" :label="t('field.role')" class="mt-3" />
    </div>
    <div class="modal-footer border-0 mt-2">
      <button type="button" class="btn btn-light px-5 py-2 btn-sm " data-bs-dismiss="modal">Cancel</button>
      <PrimaryButton @click="onSave" :loading="addingStatus">Speichern</PrimaryButton>
    </div>
  </ModalControl>
  <!-- bearbeiten Account -->
  <!-- ////////////////////// -->
  <ModalControl v-model="showEditModal">
    <div class="modal-header">
      <h5 class="modal-title" id="preview_image_remore_label">bearbeiten Account</h5>
    </div>
    <div class="modal-body">
      <InputControl v-model="editForm.data.name" :label="t('field.fullname')" placeholder="Tab Name Here" />
      <InputControl v-model="editForm.data.email" :label="t('field.email')" type="email" class="mt-3" placeholder="Typ Kategorie" />
      <SelectControl v-model.number="editForm.data.role_id" :options="userRoles" :label="t('field.role')" class="mt-3" />
    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="showEditModal = false" class="btn btn-light px-5 py-2 btn-sm ">Cancel</button>
      <PrimaryButton @click="onUpdate" :loading="editingState">Aktualisierung</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Entfernen Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" title="Entfernen Bereich" message="Sind Sie sicher, dass Sie dies entfernen möchten Bereich?"></ConfirmDialog>
</template>

<style lang="scss" scoped>
.settings-box {
  padding: 33px;
  min-height: 230px;
}
</style>
