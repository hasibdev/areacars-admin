import { ref, watch } from 'vue'
import { api } from '../plugins/axios'

const useAxios = (url, config = {}) => {
   const data = ref(null)
   const response = ref(null)
   const error = ref(null)
   const loading = ref(false)
   const deleting = ref(false)
   const pageCount = ref(1)

   const fetch = async (url, config) => {
      loading.value = true
      try {
         const result = await api.request({
            url,
            ...config
         })

         response.value = result
         data.value = result.data
      } catch (error) {
         //
         error.value = error
      } finally {
         loading.value = false
      }
   }
   !config.skip && fetch(url, config)

   // Re Fetch the data
   const reFetch = (newurl = url, newconfig = config) => {
      fetch(newurl, newconfig)
   }

   // Change Page
   const changePage = async (page) => {
      reFetch(`${url}?page=${page}`)
   }

   // on Delete
   const onApiDelete = async (url) => {
      try {
         deleting.value = true
         const res = await api.delete(url)
         return Promise.resolve(res)
      } catch (error) {
         return Promise.reject(error)
      } finally {
         deleting.value = false
      }
   }

   // Watch Data Change for page count
   watch(data, (value) => {
      if (value.total && value.per_page) {
         pageCount.value = Math.ceil(value.total / value.per_page)
      }
   })

   return { data, response, error, loading, fetch, reFetch, pageCount, changePage, onApiDelete, deleting }
}


export { useAxios, api }
