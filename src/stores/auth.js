import { api } from '../plugins/axios'
import { defineStore } from 'pinia'


export const useAuthStore = defineStore({
   id: 'auth',
   state: () => ({
      user: null,
      loggedIn: false
   }),
   getters: {

   },
   actions: {
      async authCheckout() {
         try {
            const res = await api.get('/getuser')
            this.user = res.data
            this.loggedIn = true
            return Promise.resolve(res)
         } catch (error) {
            return Promise.reject(error)
         }
      },
      async login(url, payload) {
         try {
            const res = await api.post(url, payload)

            localStorage.setItem('token', res.data.access_token)

            this.loggedIn = true
            this.user = res.data.user

            return Promise.resolve(res)
         } catch (error) {
            return Promise.reject(error)
         }
      },
      async logout() {
         try {
            await api.post('/logout')

            localStorage.removeItem('token')

            this.user = null
            this.loggedIn = false
         } catch (error) {
            //
         }
      }
   }
})
