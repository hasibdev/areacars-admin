import { useValidationStore } from '../stores/validation'
import axios from "axios"
// import { nextTick } from 'vue'
// import { scrollToError } from '@/use/useUtil'

// let validation = null
// setTimeout(() => {
//    validation = useValidationStore()
// }, 100)

const api = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL
})

export default () => {
   const validation = useValidationStore()
   // Request handler
   api.interceptors.request.use(async function (config) {
      // Do something before request is sent
      //  Add auth token
      const token = localStorage.getItem('token')
      config.headers.common.Authorization = `Bearer ${token || ''}`

      // validation?.clearErrors()

      return config
   }, function (error) {
      return Promise.reject(error)
   })

   // Response handler
   api.interceptors.response.use(function (config) {
      return config
   }, async function (error) {
      if (error.response?.status === 422) {
         validation?.setErrors(error.response.data)

         // nextTick(() => {
         //    scrollToError()
         // })

      }

      return Promise.reject(error)
   }
   )
}
export {
   axios, api
}

