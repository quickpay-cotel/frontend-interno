// plugins/vuetify.js

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',   // azul Vuetify por defecto
          secondary: '#424242', // gris oscuro por defecto
        },
      },
    },
  },
})

export default vuetify
