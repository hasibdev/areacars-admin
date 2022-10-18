<script setup>
import BackButton from "@/components/buttons/BackButton.vue"
import { computed, markRaw, reactive, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useToast } from "vue-toastification"
import PrimaryButton from "../../../../components/buttons/PrimaryButton.vue"
import ButtonImageUploader from "../../../../components/form/ButtonImageUploader.vue"
import InputControl from "../../../../components/form/InputControl.vue"
import SelectControl from "../../../../components/form/SelectControl.vue"
import ModalControl from "../../../../components/modals/ModalControl.vue"
import { api, useAxios } from "../../../../use/useAxios"
import { useAuthStore } from "../../../../stores/auth"
import AccidentVehicle from "./tabs/AccidentVehicle.vue"
import AreaTab from "./tabs/AreaTab.vue"
import CategoryTab from "./tabs/CategoryTab.vue"
import ConditionTab from "./tabs/ConditionTab.vue"
import CountryVersion from "./tabs/CountryVersion.vue"
import DamageTab from "./tabs/DamageTab.vue"
import DeliveryDeadline from "./tabs/DeliveryDeadline.vue"
import EmissionClass from "./tabs/EmissionClass.vue"
import EnergyEfficiency from "./tabs/EnergyEfficiency.vue"
import EquipmentFeatures from "./tabs/EquipmentFeatures.vue"
import ExteriorColorTab from "./tabs/ExteriorColorTab.vue"
import FuelTab from "./tabs/FuelTab.vue"
import GearboxTab from "./tabs/GearboxTab.vue"
import InteriorMaterialTab from "./tabs/InteriorMaterialTab.vue"
import ManufacturerTab from "./tabs/ManufacturerTab.vue"
import ModelTab from "./tabs/ModelTab.vue"
import PollutionClass from "./tabs/PollutionClass.vue"
import StillDrivable from "./tabs/StillDrivable.vue"
import TransmissionTab from "./tabs/TransmissionTab.vue"
import EnvironmentalLabel from "./tabs/EnvironmentalLabel.vue"
import RimSize from "./tabs/RimSize.vue"
import UpholsteryColorTab from "./tabs/UpholsteryColorTab.vue"
import UserFeatures from "./tabs/UserFeatures.vue"

const {
  data: brands
} = useAxios("/admin/brand")

const toast = useToast()
const auth = useAuthStore()

const { t } = useI18n({ useScope: "global" })

const form = reactive({})

const statickey = ref(1)
const savingStatus = ref(false)
const addModalStatus = ref(false)
const activeTab = ref(null)
const acitveTabObj = reactive({ tab: null })

const vehicleData = computed(() => {
  return [
    // Bereich
    {
      id: 1,
      name: "Bereich",
      component: AreaTab,
      postEndPoint: "/admin/area/store",
      updateEndPoint: "/admin/area/update/",
      forAdmin: false,
      addTitle: "Bereich hinzufügen",
      updateTitle: "Bereich bearbeiten",
      fields: [
        {
          name: "area_name",
          image: false,
          label: "Name",
        },
      ],
    },
    //  Kategorie
    {
      id: 2,
      name: "Kategorie",
      component: CategoryTab,
      postEndPoint: "/admin/category/store",
      updateEndPoint: "/admin/category/update/",
      forAdmin: false,
      addTitle: "Kategorie hinzufügen",
      updateTitle: "Kategorie bearbeiten",
      fields: [
        {
          name: "cat_name",
          image: false,
          label: "Name",
        },
        {
          name: "icon",
          image: true,
          label: "Bild",
        },
      ],
    },
    //  Hersteller
    {
      id: 3,
      name: "Hersteller",
      component: ManufacturerTab,
      postEndPoint: "/admin/brand/store",
      updateEndPoint: "/admin/brand/update/",
      forAdmin: false,
      addTitle: "Hersteller hinzufügen",
      updateTitle: "Hersteller bearbeiten",
      fields: [
        {
          name: "brand_name",
          image: false,
          label: "Name",
        },
        {
          name: "brand_images",
          image: true,
          label: "Markenlogo",
        },
      ],
    },
    //  Model
    {
      id: 301,
      name: "Modell",
      component: ModelTab,
      postEndPoint: "/admin/model/store",
      updateEndPoint: "/admin/model/update/",
      forAdmin: false,
      addTitle: "Make Hersteller",
      updateTitle: "Modell bearbeiten",
      fields: [
        {
          name: "brand_id",
          image: false,
          label: "Hersteller",
          options: brands.value?.brans || [],
          optionLabel: "brand_name"
        },
        {
          name: "model_name",
          image: false,
          label: "Modell",
        },
      ],
    },
    //  Getriebe
    {
      id: 4,
      name: "Getriebe",
      component: GearboxTab,
      postEndPoint: "/admin/gearbox/store",
      updateEndPoint: "/admin/gearbox/update/",
      forAdmin: false,
      addTitle: "Getriebe hinzufügen",
      updateTitle: "Getriebe bearbeiten",
      fields: [
        {
          name: "gearshift_name",
          image: false,
          label: "Name",
        },
      ],
    },
    //  Farbe
    {
      id: 5,
      name: "Außenfarbe",
      component: ExteriorColorTab,
      postEndPoint: "/admin/color/store",
      updateEndPoint: "/admin/color/update/",
      forAdmin: false,
      addTitle: "Farbe hinzufügen",
      updateTitle: "Farbe bearbeiten",
      fields: [
        {
          name: "color_name",
          image: false,
          label: "Name",
        },
        {
          name: "color_code",
          image: false,
          label: "Farbcode",
        },
      ],
    },
    //  Innenmaterial
    {
      id: 6,
      name: "Innenmaterial",
      component: InteriorMaterialTab,
      postEndPoint: "/admin/interiormaterial/store",
      updateEndPoint: "/admin/interiormaterial/update/",
      forAdmin: false,
      addTitle: "innenmaterial hinzufügen",
      updateTitle: "innenmaterial bearbeiten",
      fields: [
        {
          name: "imaterial_name",
          image: false,
          label: "Name",
        },
      ],
    },
    //  Polsterfarbe
    {
      id: 7,
      name: "Polsterfarbe",
      component: UpholsteryColorTab,
      postEndPoint: "/admin/upholsterycolor/store",
      updateEndPoint: "/admin/upholsterycolor/update/",
      addTitle: "Polsterfarbe hinzufügen",
      updateTitle: "Polsterfarbe bearbeiten",
      fields: [
        {
          name: "upholsterycolors",
          image: false,
          label: "Name",
        },
        {
          name: "has_code",
          image: false,
          label: "Farbcode",
        },
      ],
      forAdmin: false,
    },
    //  Benutzerdefinierte Merkmale
    {
      id: 107,
      name: "Benutzerdefinierte Merkmale",
      component: UserFeatures,
      postEndPoint: "/admin/userfeature/store",
      updateEndPoint: "/admin/userfeature/update/",
      forAdmin: false,
      addTitle: "Benutzerdefiniertes Merkmal hinzufügen",
      updateTitle: "Benutzerdefiniertes Merkmal bearbeiten",
      fields: [
        {
          name: "equip_name",
          image: false,
          label: "Name",
        },
      ],
    },
    //  Kraftstoff
    {
      id: 8,
      name: "Kraftstoff",
      component: FuelTab,
      postEndPoint: "/admin/fuel/store",
      updateEndPoint: "/admin/fuel/update/",
      addTitle: "Kraftstoff hinzufügen",
      updateTitle: "Kraftstoff bearbeiten",
      fields: [
        {
          name: "fuel_name",
          image: false,
          label: "Name",
        },
      ],
      forAdmin: false,
    },
    //  Kraftübertragung
    {
      id: 9,
      name: "Kraftübertragung",
      component: TransmissionTab,
      postEndPoint: "/admin/transmission/store",
      updateEndPoint: "/admin/transmission/update/",
      addTitle: "Kraftübertragung hinzufügen",
      updateTitle: "Kraftübertragung bearbeiten",
      fields: [
        {
          name: "tran_name",
          image: false,
          label: "Name",
        },
      ],
      forAdmin: true,
    },
    //  Zustand
    {
      id: 10,
      name: "Zustand",
      component: ConditionTab,
      postEndPoint: "/admin/condition/store",
      updateEndPoint: "/admin/condition/update/",
      addTitle: "Zustand hinzufügen",
      updateTitle: "Zustand bearbeiten",
      fields: [
        {
          name: "terms_details",
          image: false,
          label: "Einzelheiten",
        },
      ],
      forAdmin: true,
    },
    //  Beschädigte
    {
      id: 11,
      name: "Beschädigte",
      component: DamageTab,
      postEndPoint: "/admin/damage/store",
      updateEndPoint: "/admin/damage/update/",
      addTitle: "Beschädigte hinzufügen",
      updateTitle: "Beschädigte bearbeiten",
      fields: [
        {
          name: "damaged_name",
          image: false,
          label: "Name",
        },
      ],
      forAdmin: true,
    },
    //  Unfall
    {
      id: 12,
      name: "Unfall",
      component: AccidentVehicle,
      postEndPoint: "/admin/accident/store",
      updateEndPoint: "/admin/accident/update/",
      addTitle: "Unfall hinzufügen",
      updateTitle: "Unfall bearbeiten",
      fields: [
        {
          name: "accident_name",
          image: false,
          label: "Name",
        },
      ],
      forAdmin: true,
    },
    //  Fahrtauglich
    {
      id: 13,
      name: "Fahrtauglich",
      component: StillDrivable,
      postEndPoint: "/admin/drivable/store",
      updateEndPoint: "/admin/drivable/update/",
      addTitle: "Fahrtauglich hinzufügen",
      updateTitle: "Fahrtauglich bearbeiten",
      fields: [
        {
          name: "drivable_name",
          image: false,
          label: "Name",
        },
      ],
      forAdmin: true,
    },
    //  Schadstoffklasse
    {
      id: 14,
      name: "Schadstoffklasse",
      component: PollutionClass,
      postEndPoint: "/admin/pollution/store",
      updateEndPoint: "/admin/pollution/update/",
      addTitle: "Schadstoffklasse hinzufügen",
      updateTitle: "Schadstoffklasse bearbeiten",
      fields: [
        {
          name: "pollution_name",
          image: false,
          label: "Name",
        },
      ],
      forAdmin: true,
    },
    //  Emissionsklasse
    {
      id: 15,
      name: "Emissionsklasse",
      component: EmissionClass,
      postEndPoint: "/admin/emissionclass/store",
      updateEndPoint: "/admin/emissionclass/update/",
      addTitle: "Emissionsklasse hinzufügen",
      updateTitle: "Emissionsklasse bearbeiten",
      fields: [
        {
          name: "standard_name",
          image: false,
          label: "Name",
        },
      ],
      forAdmin: true,
    },
    //  Energieeffizienz
    {
      id: 16,
      name: "Energieeffizienz",
      component: EnergyEfficiency,
      postEndPoint: "/admin/energyefficiency/store",
      updateEndPoint: "/admin/energyefficiency/update/",
      addTitle: "Energieeffizienz hinzufügen",
      updateTitle: "Energieeffizienz bearbeiten",
      fields: [
        {
          name: "energy_name",
          image: false,
          label: "Name",
        },
      ],
      forAdmin: true,
    },
    //  Landesversion
    {
      id: 17,
      name: "Landesversion",
      component: CountryVersion,
      postEndPoint: "/admin/country/store",
      updateEndPoint: "/admin/country/update/",
      addTitle: "Landesversion hinzufügen",
      updateTitle: "Landesversion bearbeiten",
      fields: [
        {
          name: "country_name",
          image: false,
          label: "Land Name",
        },
        {
          name: "dialing_code",
          image: false,
          label: "Vorwahl",
        },
      ],
      forAdmin: true,
    },
    //  Lieferfrist
    {
      id: 18,
      name: "Lieferfrist",
      component: DeliveryDeadline,
      postEndPoint: "/admin/deliverydeadline/store",
      updateEndPoint: "/admin/deliverydeadline/update/",
      addTitle: "Lieferfrist hinzufügen",
      updateTitle: "Lieferfrist bearbeiten",
      fields: [
        {
          name: "delivery_name",
          image: false,
          label: "Name",
        },
        {
          name: "del_node",
          image: false,
          label: "Hinweis",
        },
      ],
      forAdmin: true,
    },

    //  environmentalLabel / Umweltplakette
    {
      id: 180,
      name: "Umweltplakette",
      component: EnvironmentalLabel,
      postEndPoint: "/admin/environmental/store",
      updateEndPoint: "/admin/environmental/update/",
      addTitle: "Umweltplakette hinzufügen",
      updateTitle: "Umweltplakette bearbeiten",
      fields: [
        {
          name: "environmental_lavel",
          image: false,
          label: "Umweltplakette",
        }
      ],
      forAdmin: true,
    },
    //  rimsize / Alufelgengrösse
    {
      id: 190,
      name: "Alufelgengrösse",
      component: RimSize,
      postEndPoint: "/admin/rimsize/store",
      updateEndPoint: "/admin/rimsize/update/",
      addTitle: "Alufelgengrösse hinzufügen",
      updateTitle: "Alufelgengrösse bearbeiten",
      fields: [
        {
          name: "rimsize_name",
          image: false,
          label: "Name",
        }
      ],
      forAdmin: true,
    },

    //  Austattungsmerkmale
    {
      id: 19,
      name: "Austattungsmerkmale",
      component: EquipmentFeatures,
      postEndPoint: "/admin/equipmentfeature/store",
      updateEndPoint: "/admin/equipmentfeature/update/",
      addTitle: "Austattungsmerkmale hinzufügen",
      updateTitle: "Austattungsmerkmale bearbeiten",
      fields: [
        {
          name: "equip_name",
          image: false,
          label: "Name",
        },
        {
          name: "type",
          image: false,
          options: [
            { value: 1, label: "Eigene Austattungsmerkmale" },
            {
              value: 2,
              label: "Antrieb, Bremsen, Fahrwerk, Lenkung, Reifen",
            },
            { value: 3, label: "Dach" },
            { value: 4, label: "Entertainment/Kommunikation" },
            { value: 5, label: "Fahrerassistenz und informationsystem" },
            { value: 6, label: "fenster, Klima, Luft" },
            { value: 7, label: "Interieur und sitze" },
            { value: 8, label: "Klappen und Turen" },
            { value: 9, label: "Licht und sicht" },
            { value: 10, label: "Mangel und unfall" },
            { value: 11, label: "optik" },
            { value: 12, label: "Sicherheitssystem" },
            { value: 14, label: "Benutzerdefinierte Merkmale" },
            { value: 13, label: "other" },
          ],
          trackBy: "value",
          label: "Typ auswählen",
        },
      ],
      forAdmin: false,
    },
  ].filter((item) =>
    auth.loggedIn && (auth.user.user_type == 1) ? item : !item.forAdmin
  )
})

const changeTab = (item) => {
  acitveTabObj.tab = item

  const find = vehicleData.value.find((v) => v.id == item.id)
  activeTab.value = markRaw(find)
}
changeTab(vehicleData.value[0])

watch(addModalStatus, () => {
  if (!addModalStatus.value) {
    Object.keys(form).forEach((key) => {
      delete form[key]
    })
  }
})

const resetForm = () => {
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
}

const submitForm = async () => {
  const formData = new FormData()

  for (let key in form) {
    formData.append(key, form[key] ?? '')
  }

  try {
    savingStatus.value = true
    await api.post(acitveTabObj.tab.postEndPoint, formData)

    toast.success("Erfolgreich erstellt")
    // addModalStatus.value = false;
    resetForm()
    statickey.value = ++statickey.value
  } catch (error) {
    toast.error("Antrag scheitert")
  } finally {
    savingStatus.value = false
  }
}

const onAddModalClose = () => {
  isUpdate.value = false
}

const isUpdate = ref(false)
const onSubmitUpdate = async () => {
  const formData = new FormData()

  for (let key in form) {
    formData.append(key, form[key] ?? '')
  }

  try {
    savingStatus.value = true
    await api.post(`${acitveTabObj.tab.updateEndPoint}${form.id}`, formData)

    toast.success("Erfolgreich erstellt")
    addModalStatus.value = false
    statickey.value = ++statickey.value
  } catch (error) {
    toast.error("Antrag scheitert")
  } finally {
    savingStatus.value = false
  }
}

const updateEventHandler = (event) => {
  Object.assign(form, event)
  isUpdate.value = true
  addModalStatus.value = true
};
</script>

<template>

  <div class="d-flex justify-content-between align-items-center">
    <BackButton :label="t('title.settings')" />

    <button @click="addModalStatus = true" class="btn btn-dark">
      <span class="me-1 text-17">+</span>
      {{ acitveTabObj.tab.name }} hinzufügen
    </button>
  </div>
  <h5 class="mt-4">Fahrzeugdaten</h5>

  <div class="borderd-content">
    <div class="auto-tab-grid">
      <button v-for="(item, i) in vehicleData" :key="i" @click="changeTab(item)" :class="`${
                  item.id == activeTab.id ? 'btn-dark' : 'btn-light'
               }`" class="btn text-nowrap px-4">
        {{ item.name }}
      </button>
    </div>

    <component @update="updateEventHandler" :is="activeTab.component" :key="statickey" />
  </div>

  <!-- Add / Edit model form -->
  <ModalControl v-model="addModalStatus" @onHide="onAddModalClose">
    <div class="modal-header">
      <h5 v-if="isUpdate" class="modal-title">
        {{ acitveTabObj.tab.updateTitle }}
      </h5>
      <h5 v-else class="modal-title">
        {{ acitveTabObj.tab.addTitle }}
      </h5>
    </div>
    <div class="modal-body">
      <template v-for="(feild, i) in acitveTabObj.tab.fields" :key="i">
        <div v-if="feild.image" class="image__input mt-3">
          <p class="label">{{ feild.label }}</p>
          <div class="vehicle__input-file">
            <ButtonImageUploader v-model="form[feild.name]" label="Upload Datei" :file="form[feild.name] ? form[feild.name] : null" />
          </div>
        </div>
        <div v-else-if="feild.options" class="mt-3">
          <SelectControl v-model="form[feild.name]" :options="feild.options" :trackBy="feild.trackBy" :optionLabel="feild.optionLabel" :label="feild.label" :errorField="feild.name" />
        </div>
        <template v-else>
          <InputControl class="mt-3" v-model="form[feild.name]" :label="feild.label" :placeholder="`${feild.label}`" :errorField="feild.name" />
        </template>
      </template>
    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="addModalStatus = false" type="button" class="btn btn-light px-5 py-2 btn-sm">
        Abbrechen
      </button>
      <PrimaryButton v-if="isUpdate" @click="onSubmitUpdate" :loading="savingStatus">Aktualisierung</PrimaryButton>
      <PrimaryButton v-else @click="submitForm" :loading="savingStatus">Speichern</PrimaryButton>
    </div>
  </ModalControl>
</template>

<style lang="scss" scoped>
.auto-tab-grid {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  scrollbar-width: thin;
  padding-bottom: 1rem;

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 16px rgba(0, 0, 0, 0.041);
    -webkit-box-shadow: inset 0 0 16px rgba(0, 0, 0, 0.041);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 16px rgba(228, 217, 217, 0.041);
    -webkit-box-shadow: inset 0 0 16px rgba(228, 217, 217, 0.041);
    background-color: #dadce0;
  }
}
</style>

<style lang="scss">
.image__input {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .label {
    width: 38%;
    margin: 0;
    padding: 0;
  }

  .select-label {
    width: 38%;
  }

  .vehicle__input-file {
    width: 70%;
  }

  .upload-wrapper {
    height: 150px !important;
    width: 100% !important;
  }
}
</style>
