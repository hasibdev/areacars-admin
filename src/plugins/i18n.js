import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import de from '../locales/de.json'


export default createI18n({
   legacy: false,
   locale: import.meta.env.VITE_APP_DEFAULT_LANG,
   fallbackLocale: ['de', 'en',],
   messages: { en, de }
})
