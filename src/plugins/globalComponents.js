import { SetupCalendar } from 'v-calendar'
import Toast from "vue-toastification"
import vClickOutside from "click-outside-vue3"

const toastConfig = {
   timeout: 1000,
   containerClassName: 'toast__container',
   hideProgressBar: true
}

export default app => {
   app.use(SetupCalendar, {})
   app.use(Toast, toastConfig)
   app.use(vClickOutside)
}
