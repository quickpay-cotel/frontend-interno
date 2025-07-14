<template>
  <v-data-table :headers="headers" :items="pasarelaCajaStore.lstDeudas">
    <template v-slot:item.seleccionado="{ index, item }">
      <v-checkbox @click="actualizarSeleccionados(index, item)" v-model="item.seleccionado" readonly></v-checkbox>
    </template>
    <template v-slot:no-data>
      <div class="text-center pa-4">No hay deudas disponibles</div>
    </template>
  </v-data-table>
</template>
<script setup>
import { usePasarelaCajaStore } from '@/stores/usePasarelaCajaStore';
import { useLoadingStore } from '@/stores/useLoadingStore'
const loadingStore = useLoadingStore()
const pasarelaCajaStore = usePasarelaCajaStore();
const $api = inject('api')
const buscaDeudas = async () => {
  try {
    loadingStore.startLoading('cargando deudas....')
    let request = {
      tipoPago: pasarelaCajaStore.datosBusqueda.tipoPago,
      parametroBusqueda: pasarelaCajaStore.datosBusqueda.parametroBusqueda.trim()
    }
    let response = await $api.post('/cobros-caja/cobros-pendiente-cliente', request);
    // Mantener seleccionados previos
    const seleccionadosIds = pasarelaCajaStore.lstDeudasSeleccionadas.map(d => d.id);
    pasarelaCajaStore.lstDeudas = response.data.result.map(deuda => ({
      ...deuda,
      seleccionado: seleccionadosIds.includes(deuda.id)
    }));
    pasarelaCajaStore.lstDeudasSeleccionadas = pasarelaCajaStore.lstDeudas.filter(r => r.seleccionado);
    loadingStore.stopLoading()
  } catch (error) {
    pasarelaCajaStore.lstDeudasTodos = [];
    pasarelaCajaStore.lstDeudasSeleccionadas = [];
    loadingStore.stopLoading()
  }
};

const actualizarSeleccionados = (index, item) => {
  let datosDeudas = pasarelaCajaStore.lstDeudas;
  datosDeudas = datosDeudas.map((obj, i) => ({
    ...obj,
    seleccionado: i <= index ? true : false
  }));
  pasarelaCajaStore.lstDeudas = datosDeudas;
  pasarelaCajaStore.lstDeudasSeleccionadas = datosDeudas.filter(r => r.seleccionado);
}


defineExpose({
  buscaDeudas
});
// =============

const headers = [
  { key: "seleccionado", title: "SELECCIONAR", align: "start", },
  { key: "descripcion", title: "DESCRIPCIÓN", align: "start", },
  { key: "periodo", title: "PERIODO", align: "start", },
  { key: "cantidad", title: "CANTIDAD", align: "end", },
  { key: "precioUnitario", title: "PRECIO UNITARIO", align: "end", },
  { key: "montoDescuento", title: "MONTO DESCUENTO", align: "start", },
  { key: "montoTotal", title: "MONTO TOTAL", align: "start", },
];
</script>
