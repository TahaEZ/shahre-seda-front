// module
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
// custom
import fa from './fa/fa.json'
import en from './en/en.json'

export const defaultNS = 'translation'

i18next.use(initReactI18next).init({
    lng: 'fa',
    debug: true,
    resources: {
        fa: { translation: fa },
        en: { translation: en },
    },
    defaultNS,
})
