<template>
  <BaseLayout title="Configuración Perfil" subtitle="Configuración Perfil">
    <!-- Sección de Personalización de Marca -->
    <v-card class="mb-6 pa-4" elevation="0" style="border: 1px solid #ccc;">
      <v-card-title>Personalización Visual de pasarela de PAGO</v-card-title>
      <v-card-text>
        <v-row>
          <!-- Logo -->
          <v-col cols="12" md="6">
            <br />
            <div style="text-align: center;">
              <img @click="triggerFileInput" :src="logoUrl || sinLogoUrl" alt="Logo" class="logo-preview"
                style="cursor: pointer; max-width: 150px; border: 1px dashed #ccc; border-radius: 8px;" />
              <p class="mt-2" style="font-size: 0.9rem; color: gray;">
                Clic en el logo para subir o cambiar
              </p>
            </div>
            <input ref="logoInput" type="file" accept="image/*" @change="onLogoUpload" style="display: none;" />
          </v-col>

          <!-- Botón para abrir diálogo de color primario -->
          <v-col cols="12" md="6">
            <v-alert color="primary" class="mt-4" variant="tonal" border="start" prominent>
              Vista previa del color principal
            </v-alert>
            <v-btn color="primary" class="mt-4" @click="openColorDialog('primario')">
              Cambiar color principal
            </v-btn>
          </v-col>
          <!-- Botón para abrir diálogo de color secundario -->
          <v-col cols="12" md="6">
            <v-alert color="secondary" class="mt-4" variant="tonal" border="start" prominent>
              Vista previa del color secundario
            </v-alert>
            <v-btn color="primary" class="mt-4" @click="openColorDialog('secundario')">
              Cambiar color secundario
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="slugEmrepsa" color="primary" label="Slug Empresa"
              variant="underlined"></v-text-field>
            <v-btn color="primary" class="mt-4" @click="cambiarSlugEmpresa()">
              Cambiar slug empresa
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Sección de Datos de Empresa -->
    <v-card class="pa-4" elevation="0" style="border: 1px solid #ccc;">
      <v-card-title>Datos de la Empresa</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6"><strong>Nombre:</strong> {{ datosPersonaEmpresa.nombre_usuario }}</v-col>
          <v-col cols="12" sm="6"><strong>Apellido:</strong> {{ datosPersonaEmpresa.apellido_usuario }}</v-col>
          <v-col cols="12" sm="6"><strong>Empresa:</strong> {{ datosPersonaEmpresa.nombre_empresa || 'No registrado'
            }}</v-col>
          <v-col cols="12" sm="6"><strong>NIT:</strong> {{ datosPersonaEmpresa.nit_empresa || 'No registrado' }}</v-col>
          <v-col cols="12"><strong>Correo:</strong> {{ datosPersonaEmpresa.correo_usuario }}</v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Diálogo para cambiar color -->
    <v-dialog v-model="colorDialog" max-width="400">
      <v-card>
        <v-card-title>
          Selecciona un nuevo color {{ colorDialogType === 'primario' ? 'principal' : 'secundario' }}
        </v-card-title>
        <v-card-text>
          <v-color-picker v-model="tempColor" hide-canvas show-swatches flat />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="colorDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="confirmarColor">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </BaseLayout>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import BaseLayout from '@/layouts/BaseReportesLayout.vue'
import sinLogo from '@/assets/sin-logo.png'
import { useUtilsStore } from '@/stores/useUtilsStore';
const utilsStore = useUtilsStore()
const $api = inject('api')

const tempColor = ref('#1976D2')
const logoInput = ref(null)
const logoUrl = ref(null)
const sinLogoUrl = sinLogo
const datosPersonaEmpresa = ref({})
const colorDialog = ref(false)
const colorDialogType = ref('primario') // 'primario' o 'secundario'
const slugEmrepsa = ref(null);

function triggerFileInput() {
  logoInput.value?.click()
}
async function cambiarSlugEmpresa() {
  try {
    await $api.post('/usuario/guardar-slug-empresa', { slug: slugEmrepsa.value })
    alert('Slug guardado correctamente')
  } catch (error) {
    console.error('Error al guardar slug:', error)
    alert('Error al guardar Slug')
  }
}
async function onLogoUpload(event) {
  const file = event.target.files[0]
  if (!file.type.startsWith('image/')) {
    alert('Por favor sube un archivo de imagen válido.')
    return
  }
  const maxSizeMB = 2
  if (file.size > maxSizeMB * 1024 * 1024) {
    alert(`El archivo excede los ${maxSizeMB}MB permitidos.`)
    return
  }

  if (file) {
    const formData = new FormData()
    formData.append('logo', file)

    try {
      const response = await $api.post('/usuario/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const filename = response.data.result
      logoUrl.value = `${$api.defaults.baseURL}/store/logos/${filename}?t=${Date.now()}`

      // para actualizar imageen en pinia
      const resConfEmpresa = await $api.get(`/usuario/obtener-configuracion-empresa`)
      if (resConfEmpresa.data.success) {
        utilsStore.setConfiguracionEmpresa(resConfEmpresa.data.result)
      }

    } catch (error) {
      console.error('Error al subir el logo', error)
    }
  }
}

function openColorDialog(type) {
  colorDialogType.value = type
  colorDialog.value = true
}

async function confirmarColor() {
  try {
    if (colorDialogType.value === 'primario') {
      await $api.post('/usuario/guardar-color-primario', { color: tempColor.value });
    } else {
      await $api.post('/usuario/guardar-color-secundario', { color: tempColor.value });
    }
    const resConfEmpresa = await $api.get(`/usuario/obtener-configuracion-empresa`)
    if (resConfEmpresa.data.success) {
      utilsStore.setConfiguracionEmpresa(resConfEmpresa.data.result)
    }
    colorDialog.value = false
    alert('Color guardado correctamente')
  } catch (error) {
    console.error('Error al guardar el color:', error)
    alert('Error al guardar el color')
  }
}

onMounted(async () => {
  const res = await $api.get('/usuario/obtener-datos-persona-empresa')
  if (res.data.success) {
    datosPersonaEmpresa.value = res.data.result

    const res = await $api.get('/usuario/obtener-configuracion-empresa')
    if (res.data.success) {
      utilsStore.setConfiguracionEmpresa(res.data.result)
    }
  }
})
</script>
