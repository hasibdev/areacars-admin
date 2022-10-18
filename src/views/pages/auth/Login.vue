<script setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../../../stores/auth"

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false) 
const errorMsg = ref("")
const loginState = ref(false)
const hasError = ref(false)

const onLogin = async () => {
  try {
    loginState.value = true
    hasError.value = false
    errorMsg.value = ''

    await auth.login('/login', form)
    router.push('/vehicles')
  } catch (error) {
    hasError.value = true
    if (error.response?.status == 422) {
      errorMsg.value = error.response.data[0]
    }

  } finally {
    loginState.value = false
  }
};
</script>

<template>
  <div class="">
    <div class="login-header">
      <div class="container">
        <router-link to="/">
          <div class="log">
            <svg width="158" height="16" viewBox="0 0 158 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.9412 0.242188L17.575 15.8657H13.8704L10.9596 4.73754L7.89442 15.8657L4.21183 15.8878L0 0.242188H3.35182L6.10825 12.362L9.28366 0.242188H12.7678L15.7668 12.2959L18.5673 0.242188H21.9412Z" fill="white"/>
              <path d="M49.4609 15.8657L46.0209 9.78379H44.5434V15.8657H41.4121V0.242188H47.2778C48.4906 0.242188 49.505 0.440512 50.365 0.881233C51.225 1.32195 51.8424 1.87285 52.2835 2.60004C52.7024 3.32723 52.923 4.14257 52.923 5.02401C52.923 6.0597 52.6142 6.98521 52.0189 7.82258C51.4235 8.65995 50.5414 9.21086 49.3506 9.5414L53.0994 15.8657H49.4609ZM44.5434 7.42594H47.1675C48.0275 7.42594 48.645 7.22761 49.064 6.80893C49.4829 6.39024 49.6814 5.83934 49.6814 5.09012C49.6814 4.36293 49.4829 3.81203 49.064 3.41538C48.645 3.01873 48.0055 2.8204 47.1675 2.8204H44.5434C44.5434 2.84244 44.5434 7.42594 44.5434 7.42594Z" fill="white"/>
              <path d="M64.0817 15.8657L58.4145 8.90235V15.8657H55.2832V0.242188H58.4145V7.24965L64.1038 0.242188H67.8966L61.4576 7.97684L68.0951 15.8437L64.0817 15.8657Z" fill="white"/>
              <path d="M71.8667 15.4693C70.9846 15.0947 70.301 14.5658 69.7939 13.8607C69.2867 13.1555 69.0221 12.3402 69 11.3706H72.3518C72.3959 12.0096 72.6164 12.5165 73.0354 12.8911C73.4544 13.2657 74.0057 13.442 74.7334 13.442C75.4611 13.442 76.0344 13.2657 76.4534 12.9131C76.8724 12.5605 77.0708 12.0978 77.0708 11.5469C77.0708 11.0841 76.9385 10.7095 76.6519 10.401C76.3652 10.0925 76.0124 9.87215 75.5934 9.69586C75.1744 9.51957 74.579 9.34328 73.8293 9.12292C72.8149 8.81442 71.999 8.52795 71.3595 8.24148C70.72 7.95501 70.1687 7.51429 69.7277 6.91932C69.2646 6.32434 69.0441 5.55308 69.0441 4.56146C69.0441 3.63595 69.2867 2.84265 69.7497 2.1375C70.2128 1.43234 70.8744 0.925514 71.6903 0.550901C72.5282 0.176288 73.4764 0 74.557 0C76.1667 0 77.4898 0.396649 78.4821 1.16791C79.4744 1.93917 80.0478 3.04097 80.158 4.45128H76.718C76.696 3.92241 76.4534 3.48169 76.0344 3.12912C75.6154 2.77654 75.0421 2.60025 74.3365 2.60025C73.719 2.60025 73.2339 2.7545 72.8811 3.06301C72.5282 3.37151 72.3298 3.83427 72.3298 4.42924C72.3298 4.84793 72.4621 5.20051 72.7487 5.46494C73.0354 5.75141 73.3662 5.97177 73.7852 6.14806C74.2041 6.32434 74.7775 6.52267 75.5272 6.74303C76.5416 7.05153 77.3575 7.338 78.019 7.64651C78.6806 7.95501 79.2098 8.39573 79.6729 8.9907C80.136 9.58568 80.3785 10.379 80.3785 11.3265C80.3785 12.1639 80.158 12.9352 79.717 13.6403C79.276 14.3675 78.6365 14.9184 77.8206 15.3591C76.9826 15.7778 75.9903 15.9982 74.8436 15.9982C73.719 16.0202 72.7487 15.8439 71.8667 15.4693Z" fill="white"/>
              <path d="M93.3872 7.42594C92.9903 8.15312 92.3729 8.7481 91.5349 9.18882C90.697 9.62954 89.6385 9.87194 88.3375 9.87194H85.7133V15.8657H82.582V0.242188H88.3375C89.5503 0.242188 90.5647 0.440512 91.4247 0.859197C92.2847 1.27788 92.9021 1.85082 93.3431 2.57801C93.7621 3.3052 93.9826 4.14257 93.9826 5.06808C93.9826 5.92749 93.7842 6.69875 93.3872 7.42594ZM90.1236 6.74282C90.5426 6.34617 90.7411 5.79527 90.7411 5.06808C90.7411 3.54759 89.8811 2.79837 88.1831 2.79837H85.6913V7.33779H88.1831C89.0652 7.33779 89.7046 7.13947 90.1236 6.74282Z" fill="white"/>
              <path d="M103.619 12.8914H97.4002L96.3638 15.8663H93.0781L98.7012 0.220703H102.362L107.985 15.8663H104.677L103.619 12.8914ZM102.781 10.3793L100.532 3.85665L98.2823 10.3793H102.781Z" fill="white"/>
              <path d="M109.507 3.90034C110.213 2.68836 111.139 1.74081 112.352 1.05769C113.565 0.374577 114.91 0.0440369 116.387 0.0440369C118.129 0.0440369 119.673 0.484758 120.974 1.38824C122.297 2.29171 123.201 3.52573 123.73 5.11233H120.136C119.783 4.3631 119.276 3.8122 118.614 3.43759C117.953 3.06297 117.225 2.88669 116.365 2.88669C115.461 2.88669 114.645 3.08501 113.939 3.52573C113.234 3.96645 112.683 4.53939 112.286 5.33269C111.889 6.10395 111.69 7.00743 111.69 8.06516C111.69 9.10085 111.889 10.0043 112.286 10.7756C112.683 11.5689 113.234 12.1639 113.939 12.5825C114.645 13.0012 115.461 13.2216 116.365 13.2216C117.225 13.2216 117.975 13.0453 118.614 12.6487C119.276 12.274 119.761 11.7011 120.136 10.9519H123.73C123.201 12.5605 122.297 13.7945 120.996 14.676C119.695 15.5574 118.151 15.9981 116.387 15.9981C114.888 15.9981 113.543 15.6676 112.352 14.9845C111.161 14.3014 110.213 13.3538 109.507 12.1418C108.801 10.9298 108.471 9.56361 108.471 8.02108C108.471 6.5006 108.801 5.13436 109.507 3.90034Z" fill="white"/>
              <path d="M129.022 0.242188V15.8657H125.891V0.242188H129.022Z" fill="white"/>
              <path d="M141.615 0.242188V2.77633H135.11V6.78689H140.093V9.27696H135.11V15.8657H131.979V0.242188H141.615Z" fill="white"/>
              <path d="M157.072 0.242188L151.802 10.4228V15.8657H148.67V10.4228L143.334 0.242188H146.862L150.214 7.38186L153.544 0.242188C153.566 0.242187 157.072 0.242188 157.072 0.242188Z" fill="white"/>
              <path d="M34.2233 0.110352H27.7181L23.1094 4.71588V11.2165L27.7181 15.822H34.2233L38.832 11.2165V4.69385L34.2233 0.110352ZM35.6566 9.89435L32.9223 12.6489H29.0412L26.3068 9.91639V6.01601L29.0412 3.28354H32.9223L35.6566 6.01601V9.89435Z" fill="white"/>
            </svg>
          </div>
        </router-link>
      </div>
    </div>

    <div class="container">
      <div class="login-box">
        <form @submit.prevent="onLogin" class="input-box">
          <h2 class="input-box__title">Willkommen zurück</h2>

          <!-- Email -->
          <label class="input-box__label">E-Mail</label>
          <input v-model="form.email" class="input-box__input" :class="{'has__error': hasError}" type="email" name="" />

          <!-- Password -->
          <label class="input-box__label">Passwort</label>
          <div class="position-relative">
            <input v-model="form.password" class="input-box__input" :class="{'has__error': hasError}" :type="showPassword? 'text' : 'password' "  name="" />
            <div v-if="form.password.length > 0" class="position-absolute icon-append pointer" style="top: 10px; right: 10px;" >
              <svg v-if="!showPassword" @click="showPassword = !showPassword" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 10.3333C3 10.3333 5.66667 5 10.3333 5C15 5 17.6667 10.3333 17.6667 10.3333C17.6667 10.3333 15 15.6667 10.3333 15.6667C5.66667 15.6667 3 10.3333 3 10.3333Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.333 12.3334C11.4376 12.3334 12.333 11.4379 12.333 10.3334C12.333 9.2288 11.4376 8.33337 10.333 8.33337C9.22844 8.33337 8.33301 9.2288 8.33301 10.3334C8.33301 11.4379 9.22844 12.3334 10.333 12.3334Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else @click="showPassword = !showPassword" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.2933 14.2934C13.1537 15.162 11.7661 15.6433 10.3333 15.6667C5.66667 15.6667 3 10.3334 3 10.3334C3.82926 8.78795 4.97942 7.43776 6.37333 6.37335M8.93333 5.16002C9.39222 5.0526 9.86204 4.99891 10.3333 5.00002C15 5.00002 17.6667 10.3334 17.6667 10.3334C17.262 11.0904 16.7794 11.8032 16.2267 12.46M11.7467 11.7467C11.5636 11.9432 11.3428 12.1008 11.0974 12.2101C10.8521 12.3194 10.5873 12.3782 10.3187 12.3829C10.0502 12.3877 9.78344 12.3383 9.53441 12.2377C9.28537 12.1371 9.05915 11.9874 8.86923 11.7975C8.67931 11.6075 8.5296 11.3813 8.42901 11.1323C8.32842 10.8832 8.27902 10.6165 8.28376 10.348C8.28849 10.0794 8.34727 9.81458 8.45658 9.56925C8.5659 9.32392 8.7235 9.10312 8.92 8.92002" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 3L17.6667 17.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- error message -->
          <p v-if="hasError" class="text-danger mt-2">Your email or password is wrong.</p>

          <div class="btn-box">
            <button type="submit" v-if="form.email.length > 0 && form.password.length > 0" :disabled="loginState" class="btn-box__next d-flex justify-content-center align-items-center w-100 mt-3">
              <span class="me-1">Login</span>
              <div v-if="loginState">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              </div>
            </button>
            <div v-else class="btn-box__disable d-flex justify-content-center align-items-center w-100 mt-3">
              <span class="me-1">Login</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-header {
  background-color: var(--color-dark);
  padding: 1.4rem;
  &__logo {
    width: 9.688rem;
    cursor: pointer;
  }
}
.login-box {
  max-width: 476px;
  margin: 2rem auto;
  padding: 0rem 3.2rem 5.5rem 3.2rem;
  border-radius: 0.25rem;
  box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
}

.input-box {
  padding-top: 2rem;
  &__title {
    font-size: 2.25rem;
    font-weight: 500;
  }
  &__label {
    font-size: 0.813rem;
    font-weight: 400;
    padding-top: 1.3rem;
    margin-bottom: 0.5rem;
  }
  &__input {
    width: 100%;
    border: 0.125rem solid #eee;
    padding: 0.6rem;
    border-radius: 4px;
    outline: none;
    background-color: #eee;
    transition: all 0.5s ease;
    &.has__error {
      border-color: #eb9a93;
      background: #fff0ed !important;
    }
  }
  &__input:focus {
    border: 0.125rem solid var(--color-dark);
    background-color: #eee;
  }

}
.new-user {
  display: flex;
  gap: 0.2rem;
  color: #000;
  padding-top: 7rem;
  &__contact-us {
    color: var(--color-primary) !important;
  }
}
.btn-box {
  padding-top: 1rem;
  &__next {
    border: none;
    outline: none;
    border-radius: 4px;
    background-color: var(--color-dark);
    color: #fff;
    width: 6.75rem;
    height: 2.35rem;
    font-weight: 500;
    float: right;
  }
  &__disable{
    background: rgba(238, 238, 238, 0.5);
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.24);
    border-color: rgba(238, 238, 238, 0.5);
    box-shadow: none; 
    height: 2.35rem;
  }
}
</style>
