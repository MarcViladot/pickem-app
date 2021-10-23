import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
// @ts-ignore
import en from './src/assets/i18n/en.json';
// @ts-ignore
import es from './src/assets/i18n/es.json';

const resources = {
    en: { translation: en },
    es: { translation: es }
};

i18next.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    returnObjects: true,
});


export default i18next;
