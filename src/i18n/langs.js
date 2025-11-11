export const locales = {
    en: {
        label: "English",
        dayjs: () => import('dayjs/locale/en'),
        flatpickr: null,
        i18n: () => import("./locales/en/translations.json"),
        flag: 'united-kingdom'
    },
    ru: {
        label: "Russian",
        dayjs: () => import('dayjs/locale/en'),
        flatpickr: null,
        i18n: () => import("./locales/ru/translations.json"),
        flag: 'russia'
    },
    uz: {
        label: "Uzbek",
        dayjs: () => import('dayjs/locale/en'),
        flatpickr: null,
        i18n: () => import("./locales/uz/translations.json"),
        flag: 'uzbekistan'
    }
}
