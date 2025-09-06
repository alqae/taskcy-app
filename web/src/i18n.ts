import i18next from 'i18next'

import es from '@/translations/es.json'
import en from '@/translations/en.json'

const DETECTION_OPTIONS = {
  order: ['localStorage', 'navigator'],
  caches: ['localStorage']
}

i18next.init({
  fallbackLng: 'en',
  lng: localStorage.getItem('lng') || 'en',
  detection: DETECTION_OPTIONS,
  debug: import.meta.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false
  },
  resources: {
    en: {
      translation: en
    },
    es: {
      translation: es
    }
  }
})

export default i18next
