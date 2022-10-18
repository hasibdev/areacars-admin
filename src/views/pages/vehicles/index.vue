<script setup>
import ActionDropdown from "@/components/ActionDropdown.vue"
import DataTable from "@/components/DataTable.vue"
import Switcher from "@/components/form/Switcher.vue"
import { format } from "date-fns"
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useToast } from "vue-toastification"
// import BPagination from "../../../components/BPagination.vue";
import BPagination from "../../../components/BPagination.vue"
import ConfirmDialog from "../../../components/modals/ConfirmDialog.vue"
import PlaceholderVehicle from "../../../components/icons/PlaceholderVehicle.vue"
import { api, useAxios } from "../../../use/useAxios"
import _ from 'lodash'

const moneyFormat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

const { t } = useI18n({ useScope: "global" })
const toast = useToast()

const {
  data: productList,
  loading,
  pageCount,
  onApiDelete,
  reFetch,
  deleting,
} = useAxios("/admin/productupload")

const fields = [
  {
    field: "car_id",
    label: t("field.ID"),
  },
  {
    field: "brand_name",
    label: t("field.vehicle"),
  },
  {
    field: "location_name",
    label: t("field.location"),
  },
  {
    field: "odometer",
    label: t("field.odometer"),
  },
  {
    field: "customer_price",
    label: t("field.price"),
  },
  {
    field: "created_at",
    label: t("field.created"),
  },
  {
    field: "notes",
    label: 'Notiz',
  },
  {
    field: "status",
    label: t("field.status"),
  },
  {
    field: "actions",
    label: t("field.actions"),
    thClass: "text-right",
    tdClass: "text-right",
    hideTh: true,
  },
]

// Search and filter
const isAsc = ref(true)
const searchText = ref('')
const onSearch = _.debounce((text) => {
  searchText.value = text
  currentPage.value = 1

  reFetch(`/admin/productupload/search/?name=${text}&orderby=${isAsc.value ? 'ASC' : 'DESC'}`)
}, 500)

watch(() => isAsc.value, () => {
  reFetch(`/admin/productupload/search/?name=${searchText.value}&orderby=${isAsc.value ? 'ASC' : 'DESC'}`)
})

// Deleting
const currentPage = ref(1)
const activeDeleteId = ref()
const showDeleteModal = ref(false)
const openDeleteModal = (id) => {
  activeDeleteId.value = id
  showDeleteModal.value = true
}
const onDelete = async () => {
  try {
    await onApiDelete(`/admin/productupload/delete/${activeDeleteId.value}`)
    reFetch()

    showDeleteModal.value = false
    toast.success("Erfolgreich löschen")
  } catch (error) {
    toast.error("Antrag scheitert")
  }
}

// Change Status
const onStatusChange = async (val, row) => {
  try {
    await api.post(`/admin/productupload/status/${row.car_id}`, {
      status: val,
    })

    toast.success("Aktualisierung erfolgreich")
  } catch (error) {
    row.status = !row.status

    console.error(error)
    toast.error("Antrag scheitert")
  }
}

const formatDate = (date) => {
  const d = format(new Date(date), "dd.MM.yy")
  return d
}

// Change Page
const changePage = () => {
  reFetch(`/admin/productupload?page=${currentPage.value}&name=${searchText.value}`)
}

</script>

<template>
  <!-- <pre>{{ productList }}</pre> -->

  <DataTable filterable searchable :bordered="false" @onSearch="onSearch" :loading="loading" :fields="fields" :data="productList?.data || []" tableRootClass="borderd-content vehicle_table">
    <template #car_id="{index}">
      {{ productList?.from + index }}
    </template>

    <!-- Toolbar slot -->
    <template #toolbar-append>
      <router-link to="/vehicles/create" class="btn btn-dark ms-3">
        <svg width="20" height="18" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.85744 11.4034C6.85744 12.1442 6.25645 12.7446 5.51561 12.7446C4.77477 12.7446 4.17432 12.1442 4.17432 11.4034C4.17432 10.6625 4.77479 10.0615 5.51561 10.0615C6.25644 10.0615 6.85744 10.6625 6.85744 11.4034Z" fill="white" />
          <path d="M19.6768 11.4034C19.6768 12.1442 19.0763 12.7446 18.3355 12.7446C17.5947 12.7446 16.9937 12.1442 16.9937 11.4034C16.9937 10.6625 17.5946 10.0615 18.3355 10.0615C19.0763 10.0615 19.6768 10.6625 19.6768 11.4034Z" fill="white" />
          <path d="M20.9438 6.48411L19.7512 2.53394C19.3041 0.968511 17.8879 0 16.3225 0H7.45311C5.88769 0 4.54639 1.04341 4.02441 2.53394L2.83179 6.48411C1.19263 7.45318 0 9.24164 0 11.4033V14.3843C0 15.8748 1.19262 17.0675 2.68313 17.0675H2.83233V17.1418V19.0795C2.83233 19.6015 3.27944 20.0485 3.8014 20.0485C4.32337 20.0485 4.77046 19.6014 4.77046 19.0795V17.1418V17.0675H19.2295V17.1418V19.0795C19.2295 19.6015 19.6766 20.0485 20.1986 20.0485C20.7206 20.0485 21.1677 19.6014 21.1677 19.0795V17.1418V17.0675H21.3169C22.8074 17.0675 24 15.8748 24 14.3843V11.4033C23.8503 9.24164 22.6579 7.45315 20.9438 6.48411ZM5.06863 5.81345L5.8885 3.05591C6.11205 2.31038 6.78272 1.78894 7.52819 1.78894L16.3975 1.78842C17.1431 1.78842 17.8138 2.3104 18.0372 3.05539L18.8571 5.81293H5.66493L5.06863 5.81345ZM21.9872 14.3843C21.9872 14.8314 21.6145 15.2042 21.1674 15.2042H2.68361C2.2365 15.2042 1.86373 14.8314 1.86373 14.3843V11.4033C1.86373 9.31643 3.50342 7.67673 5.5903 7.67673H18.2605C20.273 7.67673 21.987 9.31643 21.987 11.4033L21.9872 14.3843Z" fill="white" />
        </svg>

        <span class="ms-3">{{ t("button.uploadVehicle") }}</span>
      </router-link>
    </template>

    <!-- Fahrzeug / brand_name -->
    <template #brand_name="{ row }">
      <div class="d-flex">
        <div class="car__img">
          <!-- <img v-if="row.carcopy_status == 'true'" :src="row.defaulat_images" class="rounded" style="width: 80px" /> -->
          <img v-if="row.defaulatimage_name" :src="getImgUrl(`public/thumbnail/${row.defaulatimage_name}`)" class="rounded" style="width: 80px" />

          <PlaceholderVehicle v-else />

        </div>

        <div class="ms-3">
          <p class="nowrap">{{ row.brand_name }} {{row.model_name || row.model_title}}</p>
          <p class="text-13 fst-italic nowrap">
            Interne Nr. {{ row.internal_number }}
          </p>
        </div>
      </div>
    </template>

    <!-- Price -->
    <template #customer_price="{row}">
      <p class="fw-bold nowrap">{{ moneyFormat.format(row.selling_price) }}</p>
      <p class="mb-0 nowrap">{{ moneyFormat.format(row.net_price) }} Netto</p>
    </template>

    <!-- Status -->
    <template #notes="{ row }">
      <p v-if="row.notes" class="ellipsis-2 mb-0 notes" style="width: 200px;">{{ row.notes }}</p>
      <span v-else>-</span>
    </template>

    <!-- Status -->
    <template #status="{ row }">
      <div class="status-switcher" :class="{ active: Boolean(row.status) }">
        <span class="me-1 text-13 fw-medium">{{
                  row.status ? t("field.active") : t("field.inactive")
               }}</span>
        <Switcher v-model.number="row.status" @change="onStatusChange($event.target.checked, row)" />
      </div>
    </template>

    <template #created_at="{ row }">
      {{ formatDate(row.created_at) }}
    </template>

    <!-- Action Dropdown -->
    <template #actions="{ row }">
      <ActionDropdown>
        <li>
          <router-link :to="`/vehicles/edit/${row.car_id}`" class="dropdown-item py-2 pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span class="ms-3 text-14">{{ t("button.edit") }}</span>
          </router-link>
        </li>
        <li @click="openDeleteModal(row.car_id)">
          <span class="dropdown-item py-2 pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4H3.33333H14" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M5.33301 4.00016V2.66683C5.33301 2.31321 5.47348 1.97407 5.72353 1.72402C5.97358 1.47397 6.31272 1.3335 6.66634 1.3335H9.33301C9.68663 1.3335 10.0258 1.47397 10.2758 1.72402C10.5259 1.97407 10.6663 2.31321 10.6663 2.66683V4.00016M12.6663 4.00016V13.3335C12.6663 13.6871 12.5259 14.0263 12.2758 14.2763C12.0258 14.5264 11.6866 14.6668 11.333 14.6668H4.66634C4.31272 14.6668 3.97358 14.5264 3.72353 14.2763C3.47348 14.0263 3.33301 13.6871 3.33301 13.3335V4.00016H12.6663Z" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span class="ms-3 text-14">{{ t("button.remove") }}</span>
          </span>
        </li>
      </ActionDropdown>
    </template>

    <!-- Filters -->
    <template #filters>
      <div @click="isAsc = !isAsc" class="pointer">
        <svg width="40" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 33V26" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 22V15" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M24 33V24" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M24 20V15" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M32 33V28" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M32 24V15" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M13 26H19" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M21 20H27" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M29 28H35" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <rect x="0.5" y="0.5" width="47" height="47" rx="3.5" stroke="#DDDDDD" />
        </svg>
      </div>
    </template>

    <!-- Pagination -->
    <template #pagination>
      <div class="d-flex justify-content-end pt-3">
        <BPagination v-model="currentPage" :total-pages="pageCount" @change="changePage" />
      </div>
    </template>
  </DataTable>

  <!-- Delete Modal -->
  <ConfirmDialog v-model="showDeleteModal" @onOk="onDelete" :okLoading="deleting" title="Fahrzeug löschen" message="Sind Sie sicher, dass Sie das Fahrzeug löschen wollen?"></ConfirmDialog>
</template>

<style lang="scss" scoped>
.vehicle_table {
  .notes {
    opacity: 0;
  }
  table {
    tbody {
      tr:hover {
        .notes {
          opacity: 1;
        }
      }
    }
  }
}

.status-switcher {
  display: inline-flex;
  align-items: center;
  color: #ffa42f;
  border: 1px solid #ffa42f;
  border-radius: 5px;
  padding: 2px 6px;
  min-width: 110px;
  justify-content: space-between;

  &.active {
    color: #1bce6c;
    border-color: #1bce6c;
  }
}

.car__img {
  aspect-ratio: 16/10;
  width: 90px;
  //overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
