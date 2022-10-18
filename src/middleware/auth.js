export default async function auth({ next, router }) {
   const localtoken = localStorage.getItem('token')
   if (!localtoken) return router.replace('/login')

   return next()
}
