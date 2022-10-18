import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import pipeline from '../middleware/pipeline'

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
   scrollBehavior() {
      window.scrollTo(0, 0)
   }
})

// Befor Route
router.beforeEach((to, from, next) => {
   if (!to.meta.middleware) {
      return next()
   }
   const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware]

   const context = {
      to,
      from,
      next,
      router
   }

   return middleware[0]({
      ...context,
      next: pipeline(context, middleware, 1),
   })

})


export default router
