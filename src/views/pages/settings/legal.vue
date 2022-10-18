<script setup>
import BackButton from "@/components/buttons/BackButton.vue"
import { api, useAxios } from "@/use/useAxios"
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useToast } from "vue-toastification"
import { VueEditor } from "vue3-editor"
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue"

const toast = useToast()

const { t } = useI18n({ useScope: "global" })
const richText = ref("")

const { data } = useAxios("/admin/general/legal-get")

watch(data, (updatedValue) => {
  richText.value = updatedValue.descrption
})

const savingState = ref(false)
const saveForm = async () => {
  try {
    savingState.value = true

    await api.post("/admin/general/legal-update", {
      descrption: richText.value,
    })

    toast.success("Erfolgreich erstellt")
  } catch (error) {
    toast.error("Antrag scheitert")
  } finally {
    savingState.value = false
  }
};
</script>

<template>

  <BackButton :label="t('title.settings')" />

  <h5 class="mt-4 mb-3">Rechtliche Hinweise</h5>

  <div class="borderd-content legal-contaner">
    <div class="row">
      <div class="col-lg-6">
        <p class="fw-bold mb-4">Details</p>
        <p>
          Ihre Kunden sehen diese Informationen im Menüpunkt <br />
          "Datenschutz".
        </p>
      </div>

      <div class="col-lg-6">
        <div class="text-editor">
          <VueEditor v-model="richText" />
          <div class="mt-4 d-flex justify-content-end align-items-center">
            <router-link to="/settings" class="btn btn-light mx-3">Abbrechen</router-link>
            <PrimaryButton @click="saveForm()" :loading="savingState">Speichern</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-box {
  padding: 33px;
  min-height: 230px;
}

.text-editor {
  margin-top: 2rem;
}
.legal-contaner {
  min-height: 80vh;
  padding: 1.5rem;
}
</style>
