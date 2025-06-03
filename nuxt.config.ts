// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    'nuxt-vuefire',
  ],
  app: {
    head: {
      htmlAttrs: {
        'data-bs-theme':  'dark'
      },
      link: [
        {rel:'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css'}
        ],
      script: [
        {src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js'}
      ],
    }
  },
  vuefire: {
    auth: {
      enable: true,
      sessionCookie: false
    },
    config: {
       apiKey: "AIzaSyDTuhfiCzvjAbxdwZgY0fT4BdaNVcJ183A",
        authDomain: "learnity-27666.firebaseapp.com",
        projectId: "learnity-27666",
        storageBucket: "learnity-27666.firebasestorage.app",
        messagingSenderId: "494494776959",
        appId: "1:494494776959:web:181094ff9714c746ce894a",
        measurementId: "G-MMLQ3THHQD"
    },
  }
})