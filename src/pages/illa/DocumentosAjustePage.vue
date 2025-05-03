<template>
  <BaseLayout title="DCUMENTOS AJUSTE" subtitle="Bienvenido a reporte de pagos reservados"  >
    <template #actions>

    </template>
    <v-data-table hide-default-header :items="lstAjustesTodos" :items-per-page-options="[5, 10, 15]"
      v-model:items-per-page="itemsPerPage" v-model:page="page">
      <!-- 🔹 Personalización del encabezado -->
      <template v-slot:thead>
        <thead>
          <tr class="custom-header" style="color: #000DF8; font-size: 12px;font-weight: bold;">
            <td>NRO</td>
            <td>IDENTIFICADOR</td>
            <td>DOC SECTOR</td>
            <td>PUNTO VENTA</td>
            <td>COD SUCURSAL</td>
            <td>MUNICIPIO</td>
            <td>TELEFONO</td>
            <td>NRO NOTA</td>
            <td>RAZON SOCIAL</td>
            <td>NRO DOCUMENTO</td>
            <td>COD CLIENTE</td>
            <td>CORREO ELECTRONICO</td>
            <td>NRO FACTURA</td>
            <td>CUF</td>
            <td>FECHA EMISIÓN FACTURA</td>
            <td>MONTO ORIGINAL</td>
          </tr>
        </thead>
      </template>
      <template v-slot:item="{ item, index }">
        <tr style="color: #000; font-size: 12px;font-weight: normal;">
          <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ item.identificador }}</td>
          <td>{{ item.codigoDocumentoSector }}</td>
          <td>{{ item.codigoPuntoVenta }}</td>
          <td>{{ item.codigoSucursal }}</td>
          <td>{{ item.municipio }}</td>
          <td>{{ item.telefono }}</td>
          <td>{{ item.numeroNota }}</td>
          <td>{{ item.nombreRazonSocial }}</td>
          <td>{{ item.numeroDocumento }}</td>
          <td>{{ item.codigoCliente }}</td>
          <td>{{ item.correoElectronico }}</td>
          <td>{{ item.numeroFactura }}</td>
          <td>{{ item.numeroAutorizacionCuf }} </td>
          <td>{{ item.fechaEmisionFactura }}</td>
          <td>{{ item.montoTotalOriginal }}</td>
        </tr>
      </template>
    </v-data-table>
    <!-- Componente hijo para filtros -->
    <FiltroPagosComponent ref="filtroComponent" @apply-filters="handleFilters" />
  </BaseLayout>
</template>
<script setup>
import BaseLayout from '@/layouts/BaseReportesLayout.vue';
const $api = inject('api');
import { useLoadingStore } from '@/stores/useLoadingStore'
const loadingStore = useLoadingStore()
const lstAjustesTodos = ref([])
onMounted(async () => {
  mostrarTodo();
})
const mostrarTodo = async () => {
  loadingStore.startLoading('cargando ajustes....')
  try {
    const resAjustes = await $api.post(`/illa/documentos-ajuste`, {
        businessId: 155,
        fechaInicio: "01/03/2025 00:01",
        fechaFin: "06/04/2025 00:05",
        codigoDocumentoSector: 47,
        estadoDocumentoId: 45
})
    lstAjustesTodos.value = resAjustes.data.result;
    loadingStore.stopLoading()
  } catch (error) {
    console.log(error);
    loadingStore.stopLoading()
  }
}
</script>
