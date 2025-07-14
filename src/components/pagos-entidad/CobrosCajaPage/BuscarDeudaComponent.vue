<template>
  <v-container>
    <v-form ref="formBusquedaDeuda">
      <v-row>
        <v-col cols="12" md="3">
          <v-sheet class="pa-2 ma-2">
            <v-select variant="outlined" v-model="pasarelaCajaStore.datosBusqueda.tipoPago" item-title="descripcion"
              item-value="dominioId" :items="lstTipoPagos" label="Seleccione Tipo de Pago"
              :rules="[v => !!v || 'Valor requerido']" hidden>
            </v-select>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="5">
          <v-sheet class="pa-2 ma-2">
            <v-text-field variant="outlined" v-model="pasarelaCajaStore.datosBusqueda.parametroBusqueda"
              :label="'Ingrese parametro de búsqueda'" :rules="[v => !!v || 'Valor requerido']" hidden></v-text-field>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet class="pa-2 ma-2">
            <v-btn class="text-none mb-4 text-secondary" color="primary" size="x-large" variant="flat" hidden
              @click="buscarDeudas()">Buscar
            </v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
  <v-row v-if="pasarelaCajaStore.datosCliente && Object.keys(pasarelaCajaStore.datosCliente).length > 0" class="pl-10">
    <v-col cols="12" md="3">
      <h5>Codigo Cliente</h5>
      {{ pasarelaCajaStore.datosCliente.codigoCliente }}
    </v-col>
    <v-col cols="12" md="5">
      <h5>Nombre Completo</h5>
      {{ pasarelaCajaStore.datosCliente.nombreCompleto }}
    </v-col>
    <v-col cols="12" md="4">
      <h5>Numero Documento</h5>
      {{ pasarelaCajaStore.datosCliente.tipoDocumento + ' ' + pasarelaCajaStore.datosCliente.numeroDocumento + ' ' +
        pasarelaCajaStore.datosCliente.complementoDocumento }}
    </v-col>
  </v-row>

  <br>
</template>
<script setup>
import { basicMessage } from '@/utils/alertUtils';
import { ref } from 'vue';
import { usePasarelaCajaStore } from '@/stores/usePasarelaCajaStore';

import { useLoadingStore } from '@/stores/useLoadingStore'
const loadingStore = useLoadingStore()



const pasarelaCajaStore = usePasarelaCajaStore();
const lstTipoPagos = ref([]);
const formBusquedaDeuda = ref(null);
const $api = inject('api')
onMounted(async () => {
  let response = await $api.get('/dominios/by-dominio/tipo_pago_id')
  lstTipoPagos.value = response.data.result
})

const buscarDeudas = async () => {
  if (formBusquedaDeuda.value) {
    const isValid = await formBusquedaDeuda.value.validate();
    if (isValid.valid) {
      loadingStore.startLoading('buscando deudas ..')
      let request = {
        tipoPago: pasarelaCajaStore.datosBusqueda.tipoPago,
        parametroBusqueda: pasarelaCajaStore.datosBusqueda.parametroBusqueda.trim()
      }
      try {
        let response = await $api.post('/cobros-caja/datos-pendiente-cliente', request);
        pasarelaCajaStore.datosCliente = response.data.result;
        loadingStore.stopLoading()
      } catch (error) {
        pasarelaCajaStore.datosCliente = null;
        pasarelaCajaStore.lstDeudasTodos = [];
        pasarelaCajaStore.lstDeudasSeleccionadas = [];
        basicMessage(error.response?.data?.message || 'Error al buscar deudas. Intente nuevamente.');
        loadingStore.stopLoading()
      }
    } else {
      basicMessage('Los datos de busqueda son obligatorios');
    }
  }
}
</script>
