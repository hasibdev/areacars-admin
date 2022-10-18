<script setup>
import { reactive, ref, watch } from "vue"
import { useToast } from "vue-toastification"
import PrimaryButton from "../../components/buttons/PrimaryButton.vue"
import ImageUpload from "../../components/form/ImageUpload.vue"
import InputControl from "../../components/form/InputControl.vue"
import { api } from "../../plugins/axios"
import { useAuthStore } from "../../stores/auth"

const auth = useAuthStore()
const toast = useToast()

const profileForm = reactive(
  auth.user || {
    picture: null,
    first_name: "",
    last_name: "",
    email: "",
  }
)

watch(auth, () => {
  Object.assign(profileForm, auth.user)
}, { immediate: true })

const changeForm = reactive({
  current_password: "",
  password: "",
  password_confirmed: "",
})

const showChangeForm = ref(false)
const changeLoading = ref(false)
const changePassword = async () => {
  try {
    changeLoading.value = true

    await api.post("/admin/change-password", changeForm)
    toast.success("Aktualisierung erfolgreich")

    showChangeForm.value = false
  } catch (error) {
    toast.error("Antrag scheitert")
  } finally {
    changeLoading.value = false
  }
}

const profileLoading = ref(false)
const updateProfile = async () => {
  profileLoading.value = true
  try {
    const formData = new FormData()

    Object.keys(profileForm).forEach((key) =>
      formData.append(key, profileForm[key] ?? '')
    )

    await api.post("/admin/profile-update", formData)

    auth.authCheckout()
    toast.success("Aktualisierung erfolgreich")
  } catch (error) {
    toast.error("Antrag scheitert")
  } finally {
    profileLoading.value = false
  }
};
</script>

<template>

  <div class="card card-body">
    <div class="profile__img">
      <ImageUpload :image="getImgUrl(`public/profile/${profileForm.picture}`)" v-model="profileForm.picture" />
    </div>

    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <div class="form mb-3">
          <h3 class="title">Profil-Informationen</h3>
          <InputControl v-model="profileForm.first_name" label="Vorname" class="mt-3" errorField="first_name" />
          <InputControl v-model="profileForm.last_name" label="Nachname" class="mt-3" errorField="last_name" />
          <InputControl v-model="profileForm.email" disabled label="E-Mail" class="mt-3" errorField="email" />

          <div class="d-flex justify-content-end align-items-center mt-4">
            <PrimaryButton @click="updateProfile" :loading="profileLoading">Profil aktualisieren</PrimaryButton>
          </div>
        </div>
        <div class="form">
          <h3 class="title">Passwort ändern</h3>
          <InputControl v-model="changeForm.current_password" type="password" label="Aktuelles Passwort" errorField="current_password" />
          <InputControl v-model="changeForm.password" type="password" label="Neues Passwort" errorField="password" class="my-3" />
          <InputControl v-model="changeForm.password_confirmed" type="password" label="Passwort bestätigen" errorField="password_confirmed" class="my-3" />

          <div class="d-flex justify-content-end align-items-center mt-4">
            <PrimaryButton @click="changePassword" :loading="changeLoading">Passwort ändern</PrimaryButton>
          </div>
        </div>
        <div class="col-md-3"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  padding-bottom: 2rem;
}
.profile__img {
  width: 300px;
  margin: 0 auto;
}

.form {
  border: 1px solid #ddd;
  padding: 1.5rem;
  border-radius: 5px;

  .title {
    font-size: 1.3rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
}
</style>
