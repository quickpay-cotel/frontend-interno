<template>
  <BaseLayout title="DEUDAS" subtitle="Deudas que aun no fueron pagados">
    <template #actions>
      <v-btn-group variant="outlined" divided>
        <v-btn color="primary" @click="showUploader = true">CARGAR DEUDAS</v-btn>
      </v-btn-group>
    </template>

    <DeudasTableComponent :items="lstDeudas" @anular-deuda="onAnularDeuda" />

  </BaseLayout>

  <!-- Diálogo de carga de archivos -->
  <v-dialog v-model="showUploader" max-width="600">
    <v-card>
      <v-card-title class="text-h6">Carga de Deudas</v-card-title>
      <v-card-text>
        <ExcelUploaderComponent endpoint="/cargas-excel/upload" :accept="'.xlsx,.xls'" title="CARGA DE DEUDAS"
          input-label="Selecciona archivo Excel" button-text="Enviar a servidor" @upload-success="onUploadSuccess"
          @upload-error="onUploadError" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="showUploader = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo personalizado para mostrar mensajes de error largos -->
  <v-dialog v-model="showErrorDialog" max-width="600">
    <v-card>
      <v-card-title class="text-h6 red--text">Error en la carga</v-card-title>
      <v-card-text>
        <div style="white-space: pre-wrap;">{{ visibleErrorMessage }}</div>
        <v-btn v-if="errorMessage.length > 200" size="small" variant="text" @click="toggleShowFullMessage">
          {{ showFullMessage ? 'Ver menos' : 'Ver más' }}
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="showErrorDialog = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { inject, ref, computed, onMounted } from 'vue'
import BaseLayout from '@/layouts/BaseReportesLayout.vue'
import ExcelUploaderComponent from '@/components/pagos-entidad/ExcelUploaderComponent.vue'
import DeudasTableComponent from '@/components/pagos-entidad/DeudasTableComponent.vue'
import { useLoadingStore } from '@/stores/useLoadingStore'
import { showDialog } from '@/utils/alertUtils' // ✅ Importas aquí
import { de } from 'vuetify/locale'

const $api = inject('api')
const loadingStore = useLoadingStore()

const showUploader = ref(false)
const lstDeudas = ref([])

// Para el diálogo de error largo
const showErrorDialog = ref(false)
const errorMessage = ref('')
const showFullMessage = ref(false)

const visibleErrorMessage = computed(() => {
  if (showFullMessage.value || errorMessage.value.length <= 200) {
    return errorMessage.value
  }
  return errorMessage.value.slice(0, 200) + '...'
})

function toggleShowFullMessage() {
  showFullMessage.value = !showFullMessage.value
}

// Función para cargar lista de deudas
async function loadDeudas() {
  loadingStore.startLoading('Cargando deudas...')
  try {
    const r = await $api.post('/deudas/deudas-por-usuario', {})
    lstDeudas.value = r.data.result
  } catch (error) {
    errorMessage.value = 'No se pudo cargar la lista de deudas.'
    showErrorDialog.value = true
  } finally {
    loadingStore.stopLoading()
  }
}
const onAnularDeuda = async (deudaId) => {
  try {

    console.log(deudaId);
    const { isConfirmed } = await showDialog({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: 'Esta acción anulará la deuda. ¿Deseas continuar?',
      confirmButtonText: 'Sí, anular',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    })

    if (!isConfirmed) return

    await $api.delete(`/deudas/anular-deuda/${deudaId}`)
    await loadDeudas()
  } catch (error) {
    errorMessage.value = 'No se pudo anular la deuda. ' +
      (error?.response?.data?.message || '')
    showFullMessage.value = false
    showErrorDialog.value = true
  }
}

// Cargar lista de deudas al montar el componente
onMounted(() => {
  loadDeudas()
})

const onUploadSuccess = async () => {
  showUploader.value = false
  await loadDeudas()
}

const onUploadError = (error) => {
  showUploader.value = false
  errorMessage.value =
    error?.response?.data?.message || 'Ocurrió un error inesperado al subir el archivo.'
  showFullMessage.value = false
  showErrorDialog.value = true
}
</script>
