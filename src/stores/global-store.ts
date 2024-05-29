import { defineStore } from 'pinia'
import { Settings } from '../data/types'
import { useI18n } from 'vue-i18n'

export type LanguageMap = Record<string, string>

export const languages: LanguageMap = {
  english: 'English',
  spanish: 'Spanish',
}

const settings: Settings =
  typeof localStorage !== 'undefined'
    ? JSON.parse(localStorage.getItem('settings') ?? '{"lang":"es","theme":"dark"}')
    : {}

export const useGlobalStore = defineStore('global', {
  state: () => {
    const { locale } = useI18n()
    locale.value = settings.lang
    return {
      locale: locale,
      isSidebarMinimized: false,
      settings: settings,
      languageCodes: {
        gb: languages.english,
        es: languages.spanish,
      },
    }
  },

  actions: {
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized
    },
    setTheme(theme: string) {
      this.settings.theme = theme
      localStorage.setItem('settings', JSON.stringify(settings))
    },
    setLang(lang: string) {
      this.settings.lang = lang
      this.locale = lang
      localStorage.setItem('settings', JSON.stringify(settings))
    },
  },
})
