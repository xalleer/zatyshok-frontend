// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:3000'
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: {enabled: true},
  app: {
    head: {
      title: 'Zatyshok',
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=', crossorigin: '' },
      ],
    },
    pageTransition: {
      name: 'rotate',
      mode: 'out-in',
    },
    layoutTransition: {
      name: 'rotate',
      mode: 'out-in',
    },
  },
  routeRules: {
    '/auth/*': {appLayout: 'auth'},
    '/admin/**': {appLayout: 'admin'},
  },
  modules: ['shadcn-nuxt', '@nuxtjs/tailwindcss', [
    '@vee-validate/nuxt',
    {
      autoImports: true,
      componentNames: {
        Form: 'VeeForm',
        Field: 'VeeField',
        FieldArray: 'VeeFieldArray',
        ErrorMessage: 'VeeErrorMessage',
      },
    },
  ], '@pinia/nuxt', '@nuxt/icon'],
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  },
})
