<script setup>
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import CheckBox from '@/components/form/CheckBox.vue'
// import ImageUploader from '@/components/form/ImageUploader.vue'
import InputControl from '@/components/form/InputControl.vue'
import SelectControl from '@/components/form/SelectControl.vue'
import LoadingView from '@/components/views/LoadingView.vue'
import { useAxios } from '../../../use/useAxios'

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })

const { data: areaData } = useAxios('/admin/area')
const { data: categoryData } = useAxios('/admin/category')
const { data: locationData } = useAxios('/admin/location')
const { data: gearboxData } = useAxios('/admin/gearbox')
const { data: transmissionData } = useAxios('/admin/transmission')
const { data: damageData } = useAxios('/admin/damage')
const { data: accidentData } = useAxios('/admin/accident')
const { data: drivableData } = useAxios('/admin/drivable')
const { data: pollutionData } = useAxios('/admin/pollution')
const { data: environmentalData } = useAxios('/admin/environmental')
const { data: deliverydeadlineData } = useAxios('/admin/deliverydeadline')
const { data: energyefficiencydata } = useAxios('/admin/energyefficiency')
const { data: emissionclassData } = useAxios('/admin/emissionclass')
const { data: brandData } = useAxios('/admin/brand')
const { data: conditionData } = useAxios('/admin/condition')
const { data: rimsizeData } = useAxios('/admin/rimsize')
const { data: interiormaterialData } = useAxios('/admin/interiormaterial')
const { data: upholsterycolorData } = useAxios('/admin/upholsterycolor')
const { data: fuelData } = useAxios('/admin/fuel')
const { data: colorData } = useAxios('/admin/color')
const { data: equipments } = useAxios('/admin/productupload/equipments')
const { data: countriesData } = useAxios('/admin/country')

const types = [
  { label: 'Neuwagen', id: 'Neuwagen' },
  { label: 'Gebrauchtwagen', id: 'Gebrauchtwagen' },
]

const form = reactive({
  area_id: '',
  category_id: '',
  internal_number: '',
  key_number: '',

  purchase_date: '',
  model_year: '',
  first_registration: '',
  year_of_manufacture: '',
  general_inspection_until: '',
  emission_inspection_until_date: '',
  production_date: '',
  last_service_date: '',

  vin_no: '',
  vehicle_registration_no: '',
  location_id: '',
  lot: '',
  customer_price: '',
  purchase_price: '',
  selling_price: '',

  vat_deductible: false,
  negotiation_price: false,
  genral_inspection_new: false,
  emission_inspection_new: false,

  manufacture_id: '',
  model_title: '',
  special_model: '',
  power: '',
  gearbox_id: '',
  transmission_id: '',
  condition_id: '',
  odometer: '',
  engine_capacity: '',
  type: 'Neuwagen',
  last_service_km: '',
  damaged_id: '',
  accident_vehicle_id: '',
  still_drivable_id: '',
  hsn_date: '',
  tsn: '',
  gears: '',
  seats: '',
  doorts: '',
  previous_owner: '',
  cylinder: '',

  full_service_history: false,
  non_smoker: false,
  accident_free: false,
  used_car_warranty: false,
  dekra_seal: false,
  export_vehicle: false,

  metallic: false,

  exterior_color_id: '',
  interior_color_id: '',
  rim_size_id: '',
  total_weight: '',
  empty_weight: '',
  interior_material_id: '',
  upholstery_color_id: '',
  pollution_class_id: '',
  environmental_label_id: '',
  emission_class_id: '',
  energy_efficiency_id: '',
  fuel_id: '',
  city_fuel_efficiency: '',
  combined: '',
  annual_tax: '0,00',
  highway_fuel_efficiency: '',
  co2_emissio: '',
  delivery_date: '',
  country_versoin_id: '',
  delivery_deadline_id: '',

  description: '',

  // Checkboxes
  car_equipment: [],
  car_drivebreakes: [],
  car_root: [],
  car_entertainment: [],
  car_driver_information_systems: [],
  car_windows_climate: [],
  car_interiorandseats: [],
  car_flapsanddoor: [],
  car_deficiencyandaccident: [],
  car_optics: [],
  car_securitysystems: [],
  car_lightandsight: [],
  car_other: [],
})

const { data, loading } = useAxios(`/admin/productupload/edit/${route.params.id}`)
watch(data, (updatedData) => {
  if (updatedData?.carinfo) {
    const newObj = {
      ...updatedData.carinfo,
      car_equipment: updatedData.carinfo.car_equipment?.split(',').map(x => Number(x)),
      car_drivebreakes: updatedData.carinfo.car_drivebreakes?.split(',').map(x => Number(x)),
      car_root: updatedData.carinfo.car_root?.split(',').map(x => Number(x)),
      car_entertainment: updatedData.carinfo.car_entertainment?.split(',').map(x => Number(x)),
      car_driver_information_systems: updatedData.carinfo.car_driver_information_systems?.split(',').map(x => Number(x)),
      car_windows_climate: updatedData.carinfo.car_windows_climate?.split(',').map(x => Number(x)),
      car_interiorandseats: updatedData.carinfo.car_interiorandseats?.split(',').map(x => Number(x)),
      car_flapsanddoor: updatedData.carinfo.car_flapsanddoor?.split(',').map(x => Number(x)),
      car_deficiencyandaccident: updatedData.carinfo.car_deficiencyandaccident?.split(',').map(x => Number(x)),
      car_optics: updatedData.carinfo.car_optics?.split(',').map(x => Number(x)),
      car_securitysystems: updatedData.carinfo.car_securitysystems?.split(',').map(x => Number(x)),
      car_lightandsight: updatedData.carinfo.car_lightandsight?.split(',').map(x => Number(x)),
      car_other: updatedData.carinfo.car_other?.split(',').map(x => Number(x)),
    }

    Object.assign(form, newObj)
  }

})

</script>

<template>

  <LoadingView :loading="loading">
    <!-- <div class="mb-4 mt-2 d-flex justify-content-end align-items-center">
         <PrimaryButton @click="saveForm()" :loading="savingState">Speichern</PrimaryButton>
         <router-link to="/vehicles" class="btn btn-light mx-3">Cancel</router-link>
      </div> -->

    <!-- Upload reservation -->
    <div class="borderd-content">
      <h5 class="mb-4">{{ t('heading.uploadVehicle') }}</h5>

      <div class="row">
        <div class="col-lg-6">
          <h6 class="mb-4">{{ t('title.generalInfo') }}</h6>

          <SelectControl v-model.number="form.area_id" :options="areaData?.areas || []" :label="`${t('field.area')}:`" optionLabel="area_name" errorField="area_id" />
          <SelectControl v-model.number="form.category_id" :options="categoryData || []" :label="`${t('field.category')}:`" optionLabel="cat_name" class="mt-3" errorField="category_id" />

          <InputControl readonly v-model.number="form.internal_number" :label="`${t('field.internalNumber')}:`" type="number" errorField="internal_number" class="mt-3" />
          <InputControl readonly v-model="form.key_number" :label="`${t('field.keyNumber')}:`" errorField="key_number" class="mt-3" />

          <CalenderControl readonly v-model="form.purchase_date" :label="`${t('field.purchaseDate')}:`" class="mt-3" errorField="purchase_date" />

          <InputControl readonly v-model="form.vin_no" :label="`${t('field.vinNo')}:`" class="mt-3" errorField="vin_no" />
          <InputControl readonly v-model="form.vehicle_registration_no" :label="`${t('field.vehicleRegNo')}:`" class="mt-3" errorField="vehicle_registration_no" />

          <SelectControl v-model.number="form.location_id" trackBy="branc_id" :options="locationData?.locations || []" :label="`${t('field.location')}:`" optionLabel="location_name" class="mt-3" errorField="location_id" />

          <InputControl readonly v-model="form.lot" :label="`${t('field.lot')}:`" class="mt-3" errorField="lot" />
          <InputControl readonly v-model.number="form.customer_price" :label="`${t('field.customerPrice')}:`" type="number" class="mt-3" errorField="customer_price" />
          <InputControl readonly v-model.number="form.purchase_price" :label="`${t('field.purchasePrice')}:`" type="number" class="mt-3" errorField="purchase_price" />
          <InputControl readonly v-model.number="form.selling_price" :label="`${t('field.sellingPrice')}:`" type="number" class="mt-3" errorField="selling_price" />

          <div class="row mt-4">
            <div class="col-md-8 offset-md-4">
              <CheckBox disabled v-model="form.vat_deductible" :label="`${t('field.vatDeductible')}`" />
              <CheckBox disabled v-model.number="form.negotiation_price" type="number" :label="`${t('field.negotiationPrice')}`" />
            </div>
          </div>
        </div>

        <div class="col-lg-4 offset-lg-1 ">
          <p class="label mb-3">Standardbild</p>
          <!-- <ImageUploader v-model="files.defaulatimage" :multiple="false" errorField="defaulatimage" /> -->

          <p class="label my-3">{{ t('field.uploadfiles') }}</p>
          <!-- <ImageUploader v-model="files.files" errorField="files" /> -->
        </div>

      </div>
    </div>

    <!-- Fahrzeug information -->
    <div class="borderd-content mt-4">
      <h6 class="mb-4">{{ t('title.vehicleInformation') }}</h6>

      <div class="row">
        <div class="col-md-6">
          <SelectControl v-model.number="form.manufacture_id" :options="brandData?.brans || []" :label="`${t('field.manufacturer')}:`" optionLabel="brand_name" errorField="manufacture_id" />

          <InputControl v-model="form.model_title" :label="`${t('field.model')}:`" class="mt-3" errorField="model_title" />
          <InputControl v-model="form.special_model" :label="`${t('field.specialModel')}:`" placeholder="Max. 48 characters " class="mt-3" errorField="special_model" />

          <SelectControl v-model.number="form.type" :options="types" :label="`${t('field.type')}:`" class="mt-3" errorField="type" />

          <InputControl v-model="form.engine_capacity" :label="`${t('field.engineCapacity')}:`" class="mt-3" errorField="engine_capacity" />
          <InputControl v-model.number="form.power" :label="`${t('field.power')}:`" type="number" class="mt-3" errorField="power" />

          <SelectControl v-model.number="form.gearbox_id" :options="gearboxData?.gearboxs || []" :label="`${t('field.gearBox')}:`" optionLabel="gearshift_name" class="mt-3" errorField="gearbox_id" />
          <SelectControl v-model.number="form.transmission_id" :options="transmissionData?.transmission || []" :label="`${t('field.transmission')}:`" optionLabel="tran_name" class="mt-3" errorField="transmission_id" />
          <SelectControl v-model.number="form.condition_id" :options="conditionData?.conditions || []" :label="`${t('field.condition')}:`" optionLabel="terms_details" class="mt-3" errorField="condition_id" />

          <InputControl v-model="form.odometer" :label="`${t('field.odometer')}:`" class="mt-3" errorField="odometer" />

          <CalenderControl v-model="form.model_year" :label="`${t('field.modelYear')}:`" class="mt-3" errorField="model_year" />
          <CalenderControl v-model="form.first_registration" :label="`${t('field.firstRegistration')}:`" class="mt-3" errorField="first_registration" />
          <CalenderControl v-model="form.year_of_manufacture" :label="`${t('field.yearOfManufacture')}:`" class="mt-3" errorField="year_of_manufacture" />
          <CalenderControl v-model="form.general_inspection_until" :label="`${t('field.generalInspectionUnit')}:`" class="mt-3" errorField="general_inspection_until" />

          <div class="row mt-4">
            <div class="col-md-8 offset-md-4">
              <CheckBox v-model="form.genral_inspection_new" :label="`${t('field.generalInspectionNew')}:`" />
            </div>
          </div>

          <CalenderControl v-model="form.emission_inspection_until_date" :label="`${t('field.emissionInspectionUntil')}:`" class="mt-3" errorField="emission_inspection_until_date" />

          <div class="row mt-4">
            <div class="col-md-8 offset-md-4">
              <CheckBox v-model="form.emission_inspection_new" :label="`${t('field.emissionInspectionNew')}:`" />
            </div>
          </div>

          <CalenderControl v-model="form.production_date" :label="`${t('field.productionDate')}:`" class="mt-3" errorField="production_date" />
          <CalenderControl v-model="form.last_service_date" :label="`${t('field.lastService')}:`" class="mt-3" errorField="last_service_date" />

          <InputControl v-model="form.last_service_km" :label="`${t('field.lastServiceKm')}:`" class="mt-3" errorField="last_service_km" />

          <SelectControl v-model.number="form.damaged_id" :options="damageData?.damaged || []" :label="`${t('field.damaged')}:`" optionLabel="damaged_name" class="mt-3" errorField="damaged_id" />
          <SelectControl v-model.number="form.accident_vehicle_id" :options="accidentData?.accidents || []" :label="`${t('field.accidentVehicle')}:`" optionLabel="accident_name" class="mt-3" errorField="accident_vehicle_id" />
          <SelectControl v-model.number="form.still_drivable_id" :options="drivableData?.drivables || []" :label="`${t('field.stillDrivable')}:`" optionLabel="drivable_name" class="mt-3" errorField="still_drivable_id" />
        </div>
        <div class="col-md-5  offset-md-1">
          <CalenderControl v-model="form.hsn_date" :label="`${t('field.odometer')}:`" errorField="hsn_date" />

          <InputControl v-model="form.tsn" :label="`${t('field.tsn')}:`" class="mt-3" errorField="tsn" />
          <InputControl v-model="form.gears" :label="`${t('field.gears')}:`" class="mt-3" errorField="gears" />
          <InputControl v-model="form.seats" :label="`${t('field.seats')}:`" class="mt-3" errorField="seats" />
          <InputControl v-model="form.doorts" :label="`${t('field.doorts')}:`" class="mt-3" errorField="doorts" />
          <InputControl v-model="form.previous_owner" :label="`${t('field.previousOwner')}:`" class="mt-3" errorField="previous_owner" />
          <InputControl v-model="form.cylinder" :label="`${t('field.cylinder')}:`" class="mt-3" errorField="cylinder" />

          <div class="row mt-4">
            <div class="col-md-8 offset-md-4">
              <CheckBox v-model="form.full_service_history" :label="`${t('field.fullServiceHistory')}`" class="mt-2" />
              <CheckBox v-model="form.non_smoker" :label="`${t('field.nonSmoker')}`" class="mt-2" />
              <CheckBox v-model="form.accident_free" :label="`${t('field.accidentFree')}`" class="mt-2" />
              <CheckBox v-model="form.used_car_warranty" :label="`${t('field.usedCarWarranty')}`" class="mt-2" />
              <CheckBox v-model="form.dekra_seal" :label="`${t('field.dekraSeal')}`" class="mt-2" />
              <CheckBox v-model="form.export_vehicle" :label="`${t('field.exportVehicle')}`" class="mt-2" />
            </div>
          </div>

          <SelectControl v-model.number="form.exterior_color_id" :options="colorData?.colors || []" :label="`${t('field.exteriorColor')}:`" optionLabel="color_name" class="mt-4" errorField="exterior_color_id" />

          <div class="row mt-4">
            <div class="col-md-8 offset-md-4">
              <CheckBox v-model="form.metallic" :label="`${t('field.metallic')}:`" class="mt-2" />
            </div>
          </div>

          <SelectControl v-model.number="form.interior_color_id" :options="colorData?.colors || []" :label="`${t('field.interiorColor')}:`" optionLabel="color_name" class="mt-4" errorField="interior_color_id" />
          <SelectControl v-model.number="form.rim_size_id" :options="rimsizeData?.rimsize || []" :label="`${t('field.rimSize')}:`" optionLabel="rimsize_name" class="mt-4" errorField="rim_size_id" />

          <InputControl v-model.number="form.total_weight" :label="`${t('field.totalWeight')}:`" class="mt-3" type="number" errorField="total_weight" />
          <InputControl v-model.number="form.empty_weight" :label="`${t('field.emptyWeight')}:`" class="mt-3" type="number" errorField="empty_weight" />

          <SelectControl v-model.number="form.interior_material_id" :options="interiormaterialData?.interiormaterial || []" :label="`${t('field.interiorMaterial')}:`" optionLabel="imaterial_name" class="mt-4" errorField="interior_material_id" />
          <SelectControl v-model.number="form.upholstery_color_id" :options="upholsterycolorData?.upholsterycolor || []" :label="`${t('field.UpholsteryColor')}:`" optionLabel="upholsterycolors" class="mt-4" errorField="upholstery_color_id" />
        </div>
      </div>
    </div>

    <!-- Emission levels -->
    <div class="borderd-content mt-4">
      <h6 class="mb-4">{{ t('title.emissionLevels') }}</h6>

      <div class="row">
        <div class="col-md-6">
          <SelectControl v-model.number="form.pollution_class_id" :options="pollutionData?.pollutions || []" :label="`${t('field.pollutionClass')}:`" optionLabel="pollution_name" class="mt-4" errorField="pollution_class_id" />
          <SelectControl v-model.number="form.environmental_label_id" :options="environmentalData?.environmental || []" :label="`${t('field.environmentalLabel')}:`" optionLabel="environmental_lavel" class="mt-4" errorField="environmental_label_id" />

          <p class="text-muted fw-medium my-3" style="font-size: 14px;">{{ t('paragraph.fuelConsumption') }}</p>

          <SelectControl v-model.number="form.fuel_id" :options="fuelData?.fuels || []" :label="`${t('field.fuel')}:`" optionLabel="fuel_name" class="mt-4" errorField="fuel_id" />

          <InputControl v-model="form.city_fuel_efficiency" :label="`${t('field.cityFuelEfficiency')}:`" class="mt-3" errorField="city_fuel_efficiency" />
          <InputControl v-model="form.combined" :label="`${t('field.combined')}:`" class="mt-3" errorField="combined" />
          <InputControl v-model="form.annual_tax" :label="`${t('field.annualTax')}:`" class="mt-3" errorField="annual_tax" />
        </div>

        <div class="col-md-5 offset-md-1 ">
          <SelectControl v-model.number="form.emission_class_id" :options="emissionclassData?.emissions || []" :label="`${t('field.emissionClass')}:`" optionLabel="standard_name" class="mt-4" errorField="emission_class_id" />
          <SelectControl v-model.number="form.energy_efficiency_id" :options="energyefficiencydata?.energyefficiency || []" :label="`${t('field.energyEfficiency')}:`" optionLabel="energy_name" class="mt-4" errorField="energy_efficiency_id" />

          <div class="empty-space"></div>

          <InputControl v-model="form.highway_fuel_efficiency" :label="`${t('field.highwayFuelEfficiency')}:`" class="mt-3" errorField="highway_fuel_efficiency" />
          <InputControl v-model="form.co2_emissio" :label="`${t('field.CO2Emission')}:`" class="mt-3" errorField="co2_emissio" />
        </div>
      </div>
    </div>

    <!-- Delivery date, delivery period and country version -->
    <div class="borderd-content mt-4">
      <h6 class="mb-4">{{ t('title.deliveryDatePeriodContryVersion') }}</h6>

      <div class="row">
        <div class="col-md-6">
          <CalenderControl v-model="form.delivery_date" :label="`${t('field.deliveryDate')}:`" errorField="delivery_date" />

          <SelectControl v-model.number="form.country_versoin_id" :options="countriesData?.countrys || []" :label="`${t('field.countryVersion')}:`" optionLabel="country_name" class="mt-4" errorField="country_versoin_id" />
        </div>

        <div class="col-md-5 offset-md-1 ">
          <SelectControl v-model.number="form.delivery_deadline_id" :options="deliverydeadlineData?.deliverydeadlines || []" :label="`${t('field.deliveryDeadline')}:`" optionLabel="delivery_name" errorField="delivery_deadline_id" />
        </div>
      </div>
    </div>

    <!-- Equipment features -->
    <div v-if="equipments" class="borderd-content mt-4">
      <h6 class="mb-4">{{ t('title.equipmentFeatures') }}</h6>

      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Eigene Austattungsmerkmale</p>

            <CheckBox v-for="(eq, i) in equipments['own-equipment'].slice(0, 5)" :key="i" :value="eq.id" v-model="form.car_equipment" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['own-equipment'].slice(5)" :key="i" :value="eq.id" v-model="form.car_equipment" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>

      <hr class="mx-5 my-4">

      <!-- Drive, brakes, chassis, steering, tires -->
      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Antrieb, Bremsen, Fahrwerk, Lenkung, Reifen</p>

            <CheckBox v-for="(eq, i) in equipments['drive-brakes'].slice(0,17)" :key="i" :value="eq.id" v-model="form.car_drivebreakes" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['drive-brakes'].slice(17)" :key="i" :value="eq.id" v-model="form.car_drivebreakes" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>

      <hr class="mx-5 my-4">

      <!-- Roof -->
      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Dach</p>

            <CheckBox v-for="(eq, i) in equipments['roofs'].slice(0,12)" :key="i" :value="eq.id" v-model="form.car_root" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['roofs'].slice(12)" :key="i" :value="eq.id" v-model="form.car_root" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>

      <hr class="mx-5 my-4">

      <!-- Entertainment/Kommunikation -->
      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Entertainment/Kommunikation</p>

            <CheckBox v-for="(eq, i) in equipments['entertainment'].slice(0, 16)" :key="i" :value="eq.id" v-model="form.car_entertainment" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['entertainment'].slice(16)" :key="i" :value="eq.id" v-model="form.car_entertainment" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>

      <hr class="mx-5 my-4">

      <!-- Fahrerassistenz und Informationssysteme -->
      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Fahrerassistenz und Informationssysteme</p>

            <CheckBox v-for="(eq, i) in equipments['fahrerassistenz'].slice(0,24)" :key="i" :value="eq.id" v-model="form.car_driver_information_systems" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['fahrerassistenz'].slice(24)" :key="i" :value="eq.id" v-model="form.car_driver_information_systems" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>

      <hr class="mx-5 my-4">

      <!-- Fenster, Klima, Luft -->
      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Fenster, Klima, Luft</p>

            <CheckBox v-for="(eq, i) in equipments['fenster-klima'].slice(0,12)" :key="i" :value="eq.id" v-model="form.car_windows_climate" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['fenster-klima'].slice(12)" :key="i" :value="eq.id" v-model="form.car_windows_climate" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>

      <hr class="mx-5 my-4">

      <!-- Interieur und Sitze -->
      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Interieur und Sitze</p>

            <CheckBox v-for="(eq, i) in equipments['interieur-und-sitze'].slice(0,23)" :key="i" :value="eq.id" v-model="form.car_interiorandseats" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['interieur-und-sitze'].slice(23)" :key="i" :value="eq.id" v-model="form.car_interiorandseats" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>

      <hr class="mx-5 my-4">

      <!-- Klappen und Türen -->
      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Klappen und Türen</p>

            <CheckBox v-for="(eq, i) in equipments['klappen-und-turen'].slice(0,9)" :key="i" :value="eq.id" v-model="form.car_flapsanddoor" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['klappen-und-turen'].slice(9)" :key="i" :value="eq.id" v-model="form.car_flapsanddoor" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>

      <hr class="mx-5 my-4">

      <!-- Licht und Sicht -->
      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Licht und Sicht</p>

            <CheckBox v-for="(eq, i) in equipments['licht-und-sicht'].slice(0,25)" :key="i" :value="eq.id" v-model="form.car_lightandsight" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['licht-und-sicht'].slice(25)" :key="i" :value="eq.id" v-model="form.car_lightandsight" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>

      <hr class="mx-5 my-4">

      <!-- Mangel und Unfall -->
      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Mangel und Unfall</p>

            <CheckBox v-for="(eq, i) in equipments['mangel-und-unfall'].slice(0,1)" :key="i" :value="eq.id" v-model="form.car_deficiencyandaccident" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['mangel-und-unfall'].slice(1)" :key="i" :value="eq.id" v-model="form.car_deficiencyandaccident" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>

      <hr class="mx-5 my-4">

      <!-- Optik -->
      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Optik</p>

            <CheckBox v-for="(eq, i) in equipments['optik'].slice(0,6)" :key="i" :value="eq.id" v-model="form.car_optics" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['optik'].slice(6)" :key="i" :value="eq.id" v-model="form.car_optics" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>

      <hr class="mx-5 my-4">

      <!-- Sicherheitssysteme -->
      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Sicherheitssysteme</p>

            <CheckBox v-for="(eq, i) in equipments['sicherheitssysteme'].slice(0,14)" :key="i" :value="eq.id" v-model="form.car_securitysystems" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['sicherheitssysteme'].slice(14)" :key="i" :value="eq.id" v-model="form.car_securitysystems" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>

      <hr class="mx-5 my-4">

      <!-- Other -->
      <div class="row">
        <div class="col-md-6">
          <div class="ms-5">
            <p class="text-muted fw-medium" style="font-size: 14px;">Other</p>

            <CheckBox v-for="(eq, i) in equipments['others'].slice(0,17)" :key="i" :value="eq.id" v-model="form.car_other" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>

        <div class="col-md-5 offset-md-1 ">
          <div class="me-5 mt-4">
            <CheckBox v-for="(eq, i) in equipments['others'].slice(17)" :key="i" :value="eq.id" v-model="form.car_other" :label="eq.equip_name" class="mt-2" />
          </div>
        </div>
      </div>
    </div>

    <!-- Free Text -->
    <div class="borderd-content mt-4">
      <!-- <h6>Freitext</h6>

            <div class="mt-4">
               <textarea v-model="form.description" class="form-control noresize" rows="12" placeholder="Schreiben Sie über die Reservierung, Max. 3000 Zeichen"></textarea>
            </div> -->

      <!-- <div class="mt-4 d-flex justify-content-end align-items-center">
               <router-link to="/vehicles" class="btn btn-light mx-3">Abbrechen</router-link>
               <PrimaryButton @click="saveForm()" :loading="savingState">Speichern</PrimaryButton>
            </div> -->
    </div>

  </LoadingView>
</template>

<style lang="scss" scoped>
.borderd-content {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 5px;
}

.empty-space {
  height: 140px;
}
</style>
