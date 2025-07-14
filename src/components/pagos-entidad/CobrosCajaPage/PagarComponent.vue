<template>
  <v-container v-if="pasarelaCajaStore.datosCliente">
    <v-card class="pa-5" border="opacity-40 sm" rounded="xl" variant="text">
      <h2 style="text-align: center;">Datos para facturación</h2><br>
      <div>
        <v-row align="center" justify="center">
          <v-col cols="12" align="center"><span class="font-weight-bold">Nombre</span>&nbsp;&nbsp;<span
              class="font-weight-thin">
              {{ pasarelaCajaStore.datosCliente.nombreCompleto }}</span>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" md="3"> <v-text-field color="primary" label="Correo Electrónico" variant="underlined"
              v-model="pasarelaCajaStore.datosCliente.email"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field color="primary" label="Nro Celular" variant="underlined"
              v-model="pasarelaCajaStore.datosCliente.telefono" type="text" maxlength="20"></v-text-field>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>

  <v-container v-if="pasarelaCajaStore.lstDeudasSeleccionadas">
    <v-card border="opacity-40 sm" class="pa-5" rounded="xl" variant="text">
      <h2 class="text-center">Detalle de Pago</h2><br />

      <v-table density="comfortable" class="mb-4">
        <thead>
          <tr>
            <th>Descripcion</th>
            <th>Periodo</th>
            <th class="text-end">Cantidad</th>
            <th class="text-end">Precio Unitario</th>
            <th class="text-end">Monto Descuento</th>
            <th class="text-end">Monto Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(deuda, index) in pasarelaCajaStore.lstDeudasSeleccionadas" :key="index">
            <td>{{ deuda.descripcion }}</td>
            <td>{{ deuda.periodo }}</td>
            <td class="text-end">{{ Number(deuda.cantidad).toFixed(2) }}</td>
            <td class="text-end">Bs {{ Number(deuda.precioUnitario).toFixed(2) }}</td>
            <td class="text-end">Bs {{ Number(deuda.montoDescuento).toFixed(2) }}</td>
            <td class="text-end font-weight-bold">Bs {{ Number(deuda.montoTotal).toFixed(2) }}</td>
          </tr>
        </tbody>
      </v-table>

      <v-row justify="end">
        <v-col cols="12" md="4" class="text-end">
          <strong>Total: </strong>
          <span class="text-h6 font-weight-bold">Bs {{ Number(totalMontoSeleccionado).toFixed(2) }}</span>
        </v-col>
      </v-row>
      <v-row v-if="pasarelaCajaStore.lstDeudasSeleccionadas.length" justify="end" class="mt-4">

        <div v-if="!pagado" class="text-center" >
          <v-btn class="text-none mb-2 text-secondary" color="primary" variant="flat" width="100%" rounded
            @click="realizarPago()">
            Pagar ahora
          </v-btn>
        </div>
        <div v-else class="text-center" style="border: 1px solid #1976d2; border-radius: 16px; padding: 24px;">
          <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="50"></v-icon>
          <h4 class="text-h6 mb-6">La transacción se ha realizado con éxito</h4>
          <v-btn class="text-none mb-2" color="blue-darken-1" variant="flat" width="100%" rounded
            @click="clickDescargarFactura()">
            Descargar Factura
          </v-btn>
          <v-btn class="text-none" color="green" variant="flat" width="100%" rounded
            @click="clickDescargarRecibo()">
            Descargar Recibo
          </v-btn>
        </div>
      </v-row>
    </v-card>
  </v-container>
</template>
<script setup>
import { basicMessage } from '@/utils/alertUtils';
import { useLoadingStore } from '@/stores/useLoadingStore'
const loadingStore = useLoadingStore()
const $api = inject('api')
const pagado = ref(false);
const facturaNombre = ref(null);
import { usePasarelaCajaStore } from '@/stores/usePasarelaCajaStore';
const pasarelaCajaStore = usePasarelaCajaStore();
const totalMontoSeleccionado = computed(() => {
  if (pasarelaCajaStore.lstDeudasSeleccionadas) {
    let total = pasarelaCajaStore.lstDeudasSeleccionadas.reduce((suma, objeto) => suma + parseFloat(objeto.montoTotal), 0);
    return total ? parseFloat(total.toFixed(2)) : 0;
  }
  else return 0;
});

const realizarPago = async () => {
  if (!pasarelaCajaStore.datosCliente.email) {
    basicMessage("Correo es requerido");
    return;
  }
  pasarelaCajaStore.datosCliente.email = pasarelaCajaStore.datosCliente.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(pasarelaCajaStore.datosCliente.email)) {
    basicMessage("Ingrese un correo válido");
    return;
  }
  pagado.value = false;
  facturaNombre.value = null;
  try {
    loadingStore.startLoading('Realizando el cobro ..')
    // Obtener solo los deudas_id en un array
    const deudasIds = pasarelaCajaStore.lstDeudasSeleccionadas.map(deuda => deuda.deudaId);
    let response = await $api.post('/cobros-caja/confirma-pago-caja', deudasIds);
    if (response.data.success === true) {
      pagado.value = true;
      facturaNombre.value = response.data.result[0];
      basicMessage("Pago realizado con éxito");
    } else {
      basicMessage(response.data.message || "Error al realizar el pago");
    }
    loadingStore.stopLoading()
  } catch (error) {
    basicMessage(error.response?.data?.message || 'Error al buscar deudas. Intente nuevamente.');
    loadingStore.stopLoading()
  }
};
const clickDescargarFactura = () => {
  if (!facturaNombre.value) {
    basicMessage("No hay factura disponible para descargar");
    return;
  }
  loadingStore.startLoading('descargando factura ..')
  const fileUrl = `${$api.defaults.baseURL}/store/facturas/${facturaNombre.value}`;
  console.log(fileUrl);
  window.open(fileUrl, '_blank');
   loadingStore.stopLoading()
};
</script>
<style lang="css" scoped>
/* Cada elemento de detalle */
.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
}

/* Total */
.total {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  padding-top: 10px;
  margin-top: 10px;
  color: #e74c3c;
}
</style>