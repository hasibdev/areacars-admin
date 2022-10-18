<script setup>
import { reactive, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useAxios, api } from '../../../use/useAxios'
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue'

import BackButton from '@/components/buttons/BackButton.vue'
import InputControl from '@/components/form/InputControl.vue'

const toast = useToast()
const { t } = useI18n({ useScope: "global" })

const { data, reFetch } = useAxios('/admin/general')
const form = reactive({
  data: {
    compnay_name: '',
    account_email: '',
    customer_email: '',
    store_currency: '',
    tax_rates: '',
    legal_name_of_the_company: '',
    street: '',
    postcode: '',
    city: '',
    country: '',
    mobile_number: '',
  }
})


watch(data, (value) => {
  if (value) {
    form.data = {
      ...value,
      // tax_rates: value.tax_rates.split(',')
    }
  }
})

const savingState = ref(false)
const saveSettings = async () => {
  try {
    savingState.value = true
    await api.post('/admin/general/update', {
      ...form.data,
    })

    toast.success('Aktualisierung Successfully')
    reFetch('/admin/general')
  } catch (error) {
    toast.error('Antrag scheitert!')
  } finally {
    savingState.value = false
  }
}

</script>

<template>

  <BackButton :label="t('title.settings')" />
  <h5 class="mt-4 mb-3">Allgemein</h5>

  <div class="row">
    <div class="col-md-6">
      <div class="borderd-content">
        <h6 class="mb-3">Einzelheiten zum Geschäft</h6>
        <p class="text-muted text-14 mb-4 pb-2">Workspacify und Ihre Kunden werden diese Informationen nutzen, um Sie zu kontaktieren.</p>

        <InputControl v-model="form.data.compnay_name" label="Name des Unternehmens" placeholder="Name des Unternehmens" errorField="compnay_name" />
        <InputControl v-model="form.data.account_email" label="Konto E-Mail" placeholder="example@mail.com" type="email" errorField="account_email" class="mt-3" />

        <div class="row my-2">
          <div class="col-md-8 offset-md-4">
            <p class="text-muted text-14">Wir werden diese E-Mail verwenden, wenn wir Sie wegen Ihres Kontos kontaktieren müssen.</p>
          </div>
        </div>

        <InputControl v-model="form.data.customer_email" label="Kunden E-Mail" placeholder="example@mail.com" errorField="customer_email" type="email" class="mt-3" />

        <div class="row my-2">
          <div class="col-md-8 offset-md-4">
            <p class="text-muted text-14">Ihre Kunden werden diese E-Mail sehen, wenn sie Sie über Workspacify kontaktieren.</p>
          </div>
        </div>

        <InputControl v-model="form.data.mobile_number" label="Mobile Number" placeholder="Mobile Number" errorField="mobile_number" type="tel" class="mt-3" />
      </div>

      <div class="borderd-content mt-4">
        <h6 class="mb-3">Ladenwährung und Steuersätze</h6>
        <p class="text-muted text-14 mb-3 pb-2">Manage your currency and how your store charges taxes.</p>

        <InputControl disabled v-model="form.data.store_currency" label="Ladenwährung" placeholder="EUR" errorField="store_currency" class="mt-3" />
        <div>
          <InputControl v-model="form.data.tax_rates" label="Steuersätze" errorField="tax_rates" placeholder="19%" class="mt-3" :hideLabel="i !== 0" />
        </div>

        <!-- <p @click="addTaxField" class="text-primary mb-0 text-13 pointer">+ Hinzufügen</p> -->

        <!-- <div class="row my-2">
                  <div class="col-md-8 offset-md-4">
                     <InputControl v-model="form.data.accountEmail" placeholder="VAT not deductible" />
                  </div>
               </div> -->

        <div class="py-3"></div>

      </div>
    </div>
    <div class="col-md-6">
      <div class="borderd-content">
        <h6 class="mb-3">Adresse des Geschäfts</h6>
        <p class="text-14 text-muted mb-5">Diese Adresse wird auf Ihren Kommunikationsmitteln erscheinen.</p>

        <InputControl v-model="form.data.legal_name_of_the_company" label="Rechtlicher Name des Unternehmens" errorField="legal_name_of_the_company" />
        <InputControl v-model="form.data.street" label="Straße" class="mt-3" errorField="street" />
        <InputControl v-model="form.data.postcode" label="PLZ" class="mt-3" errorField="postcode" />
        <InputControl v-model="form.data.city" label="Stadt" class="mt-3" errorField="city" />
        <InputControl v-model="form.data.country" label="Land" class="mt-3" errorField="country" />
      </div>
    </div>
  </div>

  <div class="d-flex justify-content-end mb-3">
    <router-link to="/settings" class="btn btn-light me-3">Abbrechen</router-link>
    <PrimaryButton @click="saveSettings" :loading="savingState">Speichern</PrimaryButton>
  </div>
</template>


<style lang="scss" scoped>
h6 {
  font-weight: 600;
}
</style>
