import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './plugins/i18n'
import globalComponents from '@/plugins/globalComponents.js'
import axios from './plugins/axios'
import { getImgUrl } from "./use/useUtil"


// import "bootstrap/dist/css/bootstrap.min.css"
import "vue-toastification/dist/index.css"

import "@/assets/styles/app.scss"

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(axios)
app.use(globalComponents)

app.config.globalProperties.getImgUrl = getImgUrl

router.isReady().then(() => {
   app.mount('#app')
})
