<script setup>
import { ref, markRaw } from "vue"
import { useI18n } from "vue-i18n"
import BackButton from "@/components/buttons/BackButton.vue"
import NewNotificationTab from "./tabs/NewNotificationTab.vue"
import NotificationListTab from './tabs/NotificationListTab.vue'

const { t } = useI18n({ useScope: "global" })

const tabData = [
  {
    id: 1,
    name: "Neuigkeiten",
    component: NewNotificationTab,
  },
  {
    id: 2,
    name: "Notification List",
    component: NotificationListTab,
  },
]

const activeTab = ref(null)
const changeTab = (id) => {
  const find = tabData.find((v) => v.id == id)
  activeTab.value = markRaw(find)
}
changeTab(1);
</script>

<template>

  <div class="d-flex justify-content-between align-items-center">
    <BackButton :label="t('title.settings')" />

    <!-- <button data-bs-toggle="modal" data-bs-target="#add_notification_modal" class="btn btn-dark">
            <span class="me-1 text-17">+</span> New Notification
         </button> -->
  </div>
  <h5 class="my-4">Benachrichtigung</h5>

  <div class="borderd-content">
    <div class="d-flex align-items-center">
      <div class="auto-tab-grid">
        <button v-for="(item, i) in tabData" :key="i" @click="changeTab(item.id)" :class="`${
                     item.id == activeTab.id ? 'btn-dark' : 'btn-light'
                  }`" class="btn grid-btn text-nowrap px-2">
          {{ item.name }}
        </button>

        <!-- <button data-bs-toggle="modal" data-bs-target="#add_notification_modal" class="btn btn-sm btn-outline-primary text-17 plus-btn">+</button> -->
      </div>

      <!-- <div class="d-flex ms-auto">
               <EditIcon data-bs-toggle="modal" data-bs-target="#add_notification_modal" class="pointer" />
               <TrashIcon data-bs-toggle="modal" data-bs-target="#remove_new_product" class="ms-3 pointer" />
            </div> -->
    </div>

    <component :is="activeTab.component" />
  </div>
</template>

<style lang="scss" scoped>
.auto-tab-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  .grid-btn {
    min-width: 130px;
    max-width: auto;
  }
  .plus-btn {
    padding: 7px 15px;
  }
}
</style>
