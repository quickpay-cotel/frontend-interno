<template>
  <BaseLayout title="DEUDAS" subtitle="Deudas que aun no fueron pagados">
    <template #actions>
      <v-btn-group variant="outlined" divided>
        <v-btn color="primary" @click="showUploader = true">CARGAR DEUDAS</v-btn>
      </v-btn-group>
    </template>
    <DeudasTableComponent :items="lstDeudas" @anular-deuda="onAnularDeuda" @modificar-deuda="onEditarDeuda" />
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

  <v-dialog v-model="showEditDialog" max-width="800">
    <v-card>
      <v-card-title class="text-h6">Modificar Deuda</v-card-title>
      <v-card-text>
        <v-container>
          <!-- Campos del formulario -->
          <v-form>
            <v-row dense>
              <v-col cols="12" sm="6" class="py-1">
                <v-text-field label="Código Cliente" v-model="deudaSeleccionada.codigoCliente" variant="outlined"
                  density="compact" />
              </v-col>

              <v-col cols="12" sm="6" class="py-1">
                <v-text-field label="Nombre Completo" v-model="deudaSeleccionada.nombreCompleto" variant="outlined"
                  density="compact" />
              </v-col>

              <v-col cols="12" sm="6" class="py-1">
                <v-text-field label="Tipo de Documento" v-model="deudaSeleccionada.tipoDocumento" variant="outlined"
                  density="compact" />
              </v-col>

              <v-col cols="12" sm="6" class="py-1">
                <v-text-field label="Número de Documento" v-model="deudaSeleccionada.numeroDocumento" variant="outlined"
                  density="compact" />
              </v-col>

              <v-col cols="12" sm="6" class="py-1">
                <v-text-field label="Complemento de Documento" v-model="deudaSeleccionada.complementoDocumento"
                  variant="outlined" density="compact" />
              </v-col>

              <v-col cols="12" sm="6" class="py-1">
                <v-autocomplete v-model="deudaSeleccionada.tipoPagoId" :items="lstDominios" item-value="dominioId"
                  item-title="descripcion" label="Tipo de Pago" variant="outlined" density="compact"
                  return-object="false" clearable />
              </v-col>

              <v-col cols="12" sm="6" class="py-1">
                <v-text-field label="Código Servicio" v-model="deudaSeleccionada.codigoServicio" variant="outlined"
                  density="compact" />
              </v-col>

              <v-col cols="12" sm="6" class="py-1">
                <v-text-field label="Descripción Servicio" v-model="deudaSeleccionada.descripcionServicio"
                  variant="outlined" density="compact" />
              </v-col>

              <v-col cols="12" sm="6" class="py-1">
                <v-text-field label="Periodo" v-model="deudaSeleccionada.periodo" variant="outlined"
                  density="compact" />
              </v-col>

              <v-col cols="12" sm="6" class="py-1">
                <v-text-field label="Monto" v-model="deudaSeleccionada.monto" type="number" variant="outlined"
                  density="compact" />
              </v-col>

              <v-col cols="12" sm="6" class="py-1">
                <v-text-field label="Monto Descuento" v-model="deudaSeleccionada.montoDescuento" type="number"
                  variant="outlined" density="compact" />
              </v-col>

              <v-col cols="12" sm="6" class="py-1">
                <v-text-field label="Email" v-model="deudaSeleccionada.email" variant="outlined" density="compact" />
              </v-col>

              <v-col cols="12" sm="6" class="py-1">
                <v-text-field label="Teléfono" v-model="deudaSeleccionada.telefono" variant="outlined"
                  density="compact" />
              </v-col>
            </v-row>

          </v-form>

        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue" @click="guardarCambiosDeuda">Guardar</v-btn>
        <v-btn text @click="showEditDialog = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { inject, ref, computed, onMounted } from 'vue'
import BaseLayout from '@/layouts/BaseReportesLayout.vue'
import ExcelUploaderComponent from '@/components/pagos-entidad/CobrosPendientesPage/ExcelUploaderComponent.vue'
import DeudasTableComponent from '@/components/pagos-entidad/CobrosPendientesPage/CobrosPendientesTableComponent.vue'
import { useLoadingStore } from '@/stores/useLoadingStore'
import { showDialog } from '@/utils/alertUtils' // ✅ Importas aquí

const $api = inject('api')
const loadingStore = useLoadingStore()

const showUploader = ref(false)
const lstDeudas = ref([])

// Para el diálogo de error largo
const showErrorDialog = ref(false)
const errorMessage = ref('')
const showFullMessage = ref(false)

const showEditDialog = ref(false)
const deudaSeleccionada = ref(null)
const lstDominios = ref([])


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
    const r = await $api.post('/cobros-pendientes/cobros-pendiente-by-persona_juridica', {})
    lstDeudas.value = r.data.result
  } catch (error) {
    errorMessage.value = 'No se pudo cargar la lista de deudas.'
    //showErrorDialog.value = true
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
const onEditarDeuda = (deuda) => {
  deudaSeleccionada.value = { ...deuda }
  showEditDialog.value = true
}
// Cargar lista de deudas al montar el componente
onMounted(async () => {
  loadDeudas()
  const res = await $api.get(`/dominios/by-dominio/tipo_pago_id`);
  lstDominios.value = res.data.result || []
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
const guardarCambiosDeuda = async () => {
  try {
    const deudaId = deudaSeleccionada.value.deudaId

    // Asegurarse que tipoPagoId sea un número (no objeto)
    const tipoPagoId = typeof deudaSeleccionada.value.tipoPagoId === 'object'
      ? deudaSeleccionada.value.tipoPagoId.dominioId
      : deudaSeleccionada.value.tipoPagoId

    // Construir el payload con la estructura exacta
    const payload = {
      codigoCliente: deudaSeleccionada.value.codigoCliente,
      nombreCompleto: deudaSeleccionada.value.nombreCompleto,
      tipoDocumento: deudaSeleccionada.value.tipoDocumento,
      numeroDocumento: deudaSeleccionada.value.numeroDocumento,
      complementoDocumento: deudaSeleccionada.value.complementoDocumento,
      tipoPagoId: tipoPagoId,
      codigoServicio: deudaSeleccionada.value.codigoServicio,
      descripcionServicio: deudaSeleccionada.value.descripcionServicio,
      periodo: deudaSeleccionada.value.periodo,
      monto: deudaSeleccionada.value.monto,
      montoDescuento: deudaSeleccionada.value.montoDescuento,
      email: deudaSeleccionada.value.email,
      telefono: deudaSeleccionada.value.telefono,
      fechaRegistro: deudaSeleccionada.value.fechaRegistro,
    }

    await $api.put(`/deudas/modificar-deuda/${deudaId}`, payload)
    showEditDialog.value = false
    await loadDeudas()
  } catch (error) {
    errorMessage.value = 'No se pudo modificar la deuda. ' +
      (error?.response?.data?.message || '')
    showFullMessage.value = false
    showErrorDialog.value = true
  }
}




</script>
