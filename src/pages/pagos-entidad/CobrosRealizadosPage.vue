<template>
  <BaseLayout title="COBROS REALIZADO" subtitle="Bienvenido a reporte de cobros realizados" :filtersApplied="filters">
    <template #actions>
      <v-btn-group variant="outlined" divided>
        <v-btn color="primary" @click="openFilterDialog">Aplicar Filtros</v-btn>
        <v-btn color="red" @click="downloadFile('pdf')" icon>
          <v-icon>mdi-file-pdf-box</v-icon>
        </v-btn>
        <v-btn color="green" @click="downloadFile('xlsx')" icon>
          <v-icon>mdi-file-excel-box</v-icon>
        </v-btn>
      </v-btn-group>
    </template>
    <v-data-table hide-default-header :items="lstPagosRealizados" :items-per-page-options="[5, 10, 15]"
      v-model:items-per-page="itemsPerPage" v-model:page="page">
      <!-- 🔹 Personalización del encabezado -->
      <template v-slot:thead>
        <thead>
          <tr class="custom-header  text-black" style="font-size: 12px; font-weight: bold;">
            <td>NRO</td>
            <td>CODIGO CLIENTE</td>
            <td>NOMBRE</td>
            <td>CI/NIT</td>

            <td>TIPO SERVICIO</td>
            <td>PERIODO</td>
            <td>PRODUCTO</td>
            <td>PRODUCTO SIN</td>
            <td>DESCRIPCIÓN</td>
            <td>CANTIDAD</td>
            <td>PRECIO UNITARIO</td>
            <td>MONTO DESCUENTO</td>
            <td>MONTO TOTAL</td>
            <td>COMISIÓN QP</td>
            <td>MONTO FINAL</td>
            <td>EMAIL / CELULAR</td>
            <td>FECHA PAGADO</td>
            <td>MEDIO DE PAGO</td>
            <td>METODO DE PAGO</td>
            <td>COMPROBANTES</td>
            <!--<td>ESTADO TRANSACCIÓN</td>-->
          </tr>
        </thead>
      </template>
      <template v-slot:item="{ item, index }">
        <tr style="color: #000; font-size: 12px;font-weight: normal;">
          <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ item.codigo_cliente }}</td>
          <td>{{ item.nombre_completo }}</td>
          <td>{{ item.tipo_documento + ' ' + item.numero_documento + ' ' + item.complemento_documento }}</td>

          <td>{{ item.tipo_pago }}</td>
          <td>{{ item.periodo }}</td>
          <td>{{ item.codigo_producto }}</td>
          <td>{{ item.codigo_producto_sin }}</td>
          <td>{{ item.descripcion }}</td>
          <td>{{ item.cantidad }}</td>
          <td>{{ item.precio_unitario }}</td>
          <td>{{ item.monto_descuento }}</td>
          <td>{{ item.monto_total }} </td>
          <td>{{ item.comision_qp }}</td>
          <td>{{ item.monto_final }}</td>
          <td>{{ item.email }}<br>{{ item.nro_celular }}</td>
          <td>{{ item.fecha_pagado }}</td>
          <td>{{ item.medio_pago }}</td>
          <td>{{ item.metodo_pago }}</td>
          <td>
            <v-tooltip text="Factura PDF" location="top">
              <template #activator="{ props }">
                <a v-if="item.url_pdf" v-bind="props" :href="item.url_pdf" target="_blank">
                  <v-icon color="green">mdi-file-pdf-box</v-icon>
                </a>
              </template>
            </v-tooltip>

            <v-tooltip text="Factura Rollo" location="top">
              <template #activator="{ props }">
                <a v-if="item.url_rollo" v-bind="props" :href="item.url_rollo" target="_blank">
                  <v-icon color="blue">mdi-file-pdf-box</v-icon>
                </a>
              </template>
            </v-tooltip>

            <v-tooltip text="Recibo" location="top">
              <template #activator="{ props }">
                <a v-if="item.ruta_pdf" v-bind="props" :href="item.ruta_pdf" target="_blank">
                  <v-icon color="orange">mdi-file-pdf</v-icon>
                </a>
              </template>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <!-- 🔹 Pie de Tabla (SUMATORIA) -->
      <template v-slot:tfoot>
        <tfoot>
          <tr style="color: #000DF8; font-size: 12px; font-weight: bold;">
            <td colspan="8" style="text-align: right;">TOTAL:</td>
            <td>{{ totalMonto.toFixed(2) }}</td>
            <td>{{ totalComisionQP.toFixed(2) }}</td>
            <td>{{ totalMontoFinal.toFixed(2) }}</td>
            <td colspan="4"></td>
          </tr>
        </tfoot>
      </template>
    </v-data-table>

    <!-- Componente hijo para filtros -->
    <FiltroCobrosRealizadosComponent ref="filtroCobroRealizadoComponent" @apply-filters="handleFilters" />
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/layouts/BaseReportesLayout.vue';
import FiltroCobrosRealizadosComponent from '@/components/pagos-entidad/CobrosRealizadosPage/FiltroCobrosRealizadosComponent.vue';
import { useLoadingStore } from '@/stores/useLoadingStore'
const loadingStore = useLoadingStore()
import { inject, ref } from 'vue';
const $api = inject('api');
const lstPagosRealizados = ref([])
const page = ref(1);
const itemsPerPage = ref(5);
import { formatFechaParaInput } from '@/utils/funcionesFechas';
// Referencia al componente hijo de filtro
const filtroCobroRealizadoComponent = ref(null);

onMounted(async () => {
  const hoy = new Date();
  handleFilters({
    fechaInicioPago: formatFechaParaInput(hoy),
    fechaFinPago: formatFechaParaInput(hoy)
  });
})

const totalMonto = computed(() => lstPagosRealizados.value.reduce((sum, item) => parseFloat(sum) + parseFloat(item.monto), 0));
const totalComisionQP = computed(() => lstPagosRealizados.value.reduce((sum, item) => parseFloat(sum) + parseFloat(item.comision_qp), 0));
const totalMontoFinal = computed(() => lstPagosRealizados.value.reduce((sum, item) => parseFloat(sum) + parseFloat(item.monto_final), 0));

// Filtros recibidos desde el hijo
const filters = ref({});

// Función para manejar los filtros cuando se aplican
const handleFilters = async (newFilters) => {
  filters.value = newFilters;
  const resPagos = await $api.post(`/cobros-realizado/cobros-realizado`, newFilters)
  lstPagosRealizados.value = resPagos.data.result

};

// Función para abrir el diálogo desde el componente padre
const openFilterDialog = () => {
  if (filtroCobroRealizadoComponent.value) {
    filtroCobroRealizadoComponent.value.openDialog(); // Llamar al método expuesto en el hijo
  }
};
const downloadFile = async (type) => {
  loadingStore.startLoading('generando reporte....')
  try {
    // Determinar el endpoint y tipo de archivo
    const endpoints = {
      pdf: "/reportes_jasper/cobros-realizados/descargar/pdf",
      xlsx: "/reportes_jasper/cobros-realizados/descargar/xlsx"
    };

    const mimeTypes = {
      pdf: "application/pdf",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };

    if (!endpoints[type]) {
      console.error("Tipo de archivo no válido");
      return;
    }

    // Hacer la petición a la API
    const response = await $api.post(endpoints[type], filters.value, {
      responseType: "blob", // Asegurar que recibimos un archivo binario
    });

    // Crear un Blob a partir de la respuesta
    const blob = new Blob([response.data], { type: mimeTypes[type] });

    // Crear una URL para el blob
    const url = window.URL.createObjectURL(blob);

    // Crear un enlace de descarga
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte.${type}`; // Nombre dinámico según el tipo
    document.body.appendChild(a);
    a.click();

    // Liberar la URL después de la descarga
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    loadingStore.stopLoading()
  } catch (error) {
    console.error(`Error al descargar el archivo ${type}:`, error);
    loadingStore.stopLoading()
  }
};
</script>
