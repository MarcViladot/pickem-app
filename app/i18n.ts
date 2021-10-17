import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './src/assets/i18n/en.json';
import es from './src/assets/i18n/es.json';

const resources = {
    en: { translation: en },
    es: { translation: es }
};

i18next.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    returnObjects: true,
});


export default i18next;
