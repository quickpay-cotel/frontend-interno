<template>
  <GlobalLoadingComponent />

  <div>
    <v-app class="background">
      <router-view />
    </v-app>
  </div>
</template>

<script setup>
import { inject, watch, onMounted } from 'vue'
import { useUtilsStore } from '@/stores/useUtilsStore'
import GlobalLoadingComponent from '@/components/common/GlobalLoadingComponent.vue'
import { useTheme } from 'vuetify'

const $api = inject('api')
const utilsStore = useUtilsStore()
const theme = useTheme()

function isValidColor(color) {
  return typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color.trim())
}

function aplicarColores(config) {
  const { color_primario, color_secundario } = config;

  if (isValidColor(color_primario) && isValidColor(color_secundario)) {
    // Actualiza los colores en ambos temas
    theme.themes.value.light.colors = {
      ...theme.themes.value.light.colors,
      primary: color_primario,
      secondary: color_secundario,
    };
    theme.themes.value.dark.colors = {
      ...theme.themes.value.dark.colors,
      primary: color_primario,
      secondary: color_secundario,
    };

    console.log('🎨 Colores aplicados dinámicamente a light y dark');
  } else {
    console.warn('⚠️ Colores inválidos:', color_primario, color_secundario);
  }
}


// Al montar el componente, obtener configuración inicial
onMounted(async () => {
  try {
    const res = await $api.get('/usuario/obtener-configuracion-empresa')
    if (res.data.success) {
      utilsStore.setConfiguracionEmpresa(res.data.result)
      aplicarColores(res.data.result)
    }
  } catch (error) {
    console.error('Error al obtener configuración de empresa:', error)
  }
})

// Watch para cambios dinámicos en tiempo real
watch(
  () => utilsStore.configuracionEmpresa,
  (newConfig) => {
    if (newConfig && Object.keys(newConfig).length > 0) {
      aplicarColores(newConfig)
    }
  },
  { immediate: false }
)
</script>


<style scoped>
.background {
  position: relative;
  background: url('@/assets/fondo.jpg') no-repeat center center fixed;
  background-size: 100% 100%;
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(19, 18, 18, 0.5);
  z-index: 1;
}

.background > * {
  position: relative;
  z-index: 2;
}
</style>
