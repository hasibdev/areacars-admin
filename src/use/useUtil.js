export const getImgUrl = (img) => {
   return `${import.meta.env.VITE_IMAGE_BASE_URL}/${img}`
}

export const scrollToError = () => {
   // Scroll to error
   const mainEl = document.querySelector('.scrollbar')
   const el = document.querySelector('.has_error')

   const getPageOffset = (elem) => {
      let topOffset = elem.getBoundingClientRect().top

      while (elem != document.documentElement) {
         elem = elem.parentElement
         topOffset += elem.scrollTop
      }
      return topOffset
   }

   mainEl.scrollTo({
      top: getPageOffset(el) - 200,
      left: 0,
      behavior: 'smooth'
   })

}
