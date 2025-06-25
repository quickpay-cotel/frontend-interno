/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import axios from './plugins/axios'; // Importa Axios directamente

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import './assets/styles.css' // ← importa tus estilos
const app = createApp(App)

registerPlugins(app)
app.provide('api', axios); // Inyecta 'axios' con la clave 'api'
app.mount('#app')


