<template>
  <BaseLayout title="REPORTE DE PAGOS" subtitle="Bienvenido a reporte de pagos" :filtersApplied="filters">
    <template #actions>
      <v-btn-group variant="outlined" divided>

        <!--<v-btn color="primary" @click="mostrarTodo()">Mostrar Todos</v-btn>-->

        <v-btn color="primary" @click="openFilterDialog">Aplicar Filtros</v-btn>

        <!-- Botón con ícono de PDF -->
        <v-btn color="red" @click="downloadFile('pdf')" icon>
          <v-icon>mdi-file-pdf-box</v-icon>
        </v-btn>
        <!-- Botón con ícono de Excel -->
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
          <tr class="custom-header" style="color: #000DF8; font-size: 12px;font-weight: bold;">
            <td>NRO</td>
            <td>CONTRATO/TELEFONO</td>
            <td>NOMBRE</td>
            <td>CI/NIT</td>
            <td>EMAIL / CELULAR</td>
            <td>TIPO SERVICIO</td>
            <td>SERVICIO</td>
            <td>PERIODO</td>
            <td>MONTO (Bs)</td>
            <td>COMISIÓN QP (Bs)</td>
            <td>MONTO FINAL (Bs)</td>
            <td>FECHA Y HORA DE PAGO</td>
            <td>ID TRANSACCION</td>
            <td>CÓDIGO DEUDA</td>
            <td>METODO PAGO</td>
            <td>ENTIDAD COBRO</td>
            <!--<td>ESTADO TRANSACCIÓN</td>-->
          </tr>
        </thead>
      </template>
      <template v-slot:item="{ item, index }">
        <tr style="color: #000; font-size: 12px;font-weight: normal;">
          <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ item.contrato_telefono }}</td>
          <td>{{ item.nombre_completo }}</td>
          <td>{{ item.numero_documento }}</td>
          <td>{{ item.email }}<br>{{ item.nro_celular }}</td>

          <td>{{ item.servicio }}</td>
          <td>{{ item.mensaje_deuda }}</td>
          <td>{{ item.periodo }}</td>
          <td>{{ item.monto }}</td>
          <td>{{ item.comision_qp }}</td>
          <td>{{ item.monto_final }}</td>
          <td>{{ item.fecha_pago }}</td>
          <td>{{ item.id_transaccion }}</td>
          <td>{{ item.codigo_deuda }} </td>
          <td>{{ item.metodo_pago }}</td>
          <td>{{ item.entidad_cobro }}</td>
          <!--<td>{{ item.estado_transaccion	 }}</td>-->
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
    <FiltroPagosComponent ref="filtroComponent" @apply-filters="handleFilters" />
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/layouts/BaseReportesLayout.vue';
import FiltroPagosComponent from '@/components/ReportePagosPage/FiltroPagosComponent.vue';
import { useLoadingStore } from '@/stores/useLoadingStore'
const loadingStore = useLoadingStore()
import { inject, ref } from 'vue';
const $api = inject('api');
const lstPagosRealizados = ref([])
const page = ref(1);
const itemsPerPage = ref(5);

// Referencia al componente hijo
const filtroComponent = ref(null);

/*onMounted(async () => {
  mostrarTodo();
})*/

const totalMonto = computed(() => lstPagosRealizados.value.reduce((sum, item) => parseFloat(sum) + parseFloat(item.monto), 0));
const totalComisionQP = computed(() => lstPagosRealizados.value.reduce((sum, item) => parseFloat(sum) + parseFloat(item.comision_qp), 0));
const totalMontoFinal = computed(() => lstPagosRealizados.value.reduce((sum, item) => parseFloat(sum) + parseFloat(item.monto_final), 0));

// Filtros recibidos desde el hijo
const filters = ref({});

// Función para manejar los filtros cuando se aplican
const handleFilters = async (newFilters) => {
  filters.value = newFilters;
  const resPagos = await $api.post(`/reservas/pagos-realizados`, newFilters)
  lstPagosRealizados.value = resPagos.data.result

};

// Función para abrir el diálogo desde el componente padre
const openFilterDialog = () => {
  if (filtroComponent.value) {
    filtroComponent.value.openDialog(); // Llamar al método expuesto en el hijo
  }
};
const downloadFile = async (type) => {
  loadingStore.startLoading('generando reporte....')
  try {
    // Determinar el endpoint y tipo de archivo
    const endpoints = {
      pdf: "/reservas/pagos-realizados/descargar/pdf",
      xlsx: "/reservas/pagos-realizados/descargar/xlsx"
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
/*const mostrarTodo = async () => {
  loadingStore.startLoading('cargando pagos....')
  try {
    filters.value = {};
    const resPagos = await $api.post(`/reservas/pagos-realizados`, filters.value)
    lstPagosRealizados.value = resPagos.data.result;
    loadingStore.stopLoading()
  } catch (error) {
    console.log(error);
    loadingStore.stopLoading()
  }
}*/
</script>
