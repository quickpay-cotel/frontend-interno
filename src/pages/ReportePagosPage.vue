<template>
  <BaseLayout title="REPORTE DE PAGOS" subtitle="Bienvenido a reporte de pagos" :filtersApplied="filters" >
    <template #actions>
      <v-btn-group variant="outlined" divided>

        <v-btn color="primary" >Mostrar Todos</v-btn>

        <v-btn color="primary" @click="openFilterDialog">Aplicar Filtros</v-btn>

        <!-- Botón con ícono de PDF -->
        <v-btn color="red" @click="downloadPDF" icon>
          <v-icon>mdi-file-pdf-box</v-icon>
        </v-btn>
        <!-- Botón con ícono de Excel -->
        <v-btn color="green" @click="downloadExcel" icon>
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
            <td>NOMBRE COMPLETO</td>
            <td>SERVICIO</td>
            <td>TRANSACCION</td>
            <td>PERIODO</td>
            <td>CÓDIGO</td>
            <td>MONTO</td>
            <td>MENSAJE DEUDA</td>
            <td>MENSAJE CONTRATO</td>
            <td>TIPO DE DOCUMENTO</td>
            <td>NRO DE DOCUMENTO</td>
            <td>FECHA DE PAGO</td>
          </tr>
        </thead>
      </template>
      <template v-slot:item="{ item, index }">
        <tr style="color: #000; font-size: 12px;font-weight: normal;">
          <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ item.nombre_completo }}</td>
          <td>{{ item.servicio }}</td>
          <td>{{ item.id_transaccion }}</td>
          <td>{{ item.periodo }}</td>
          <td>{{ item.codigo_deuda }} </td>
          <td>{{ item.monto }}</td>
          <td>{{ item.mensaje_deuda }}</td>
          <td>{{ item.mensaje_contrato }}</td>
          <td>{{ item.tipo_documento }}</td>
          <td>{{ item.numero_documento }}</td>
          <td>{{ item.fecha_pago }}</td>
        </tr>
      </template>
    </v-data-table>

    <!-- Componente hijo para filtros -->
    <FiltroPagosComponent ref="filtroComponent" @apply-filters="handleFilters" />
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/layouts/BaseReportesLayout.vue';
import FiltroPagosComponent from '@/components/ReportePagosPage/FiltroPagosComponent.vue';
import { inject, ref } from 'vue';
const $api = inject('api');
const lstPagosRealizados = ref([])
const page = ref(1);
const itemsPerPage = ref(5);

// Referencia al componente hijo
const filtroComponent = ref(null);

onMounted(async () => {
  const resPagos = await $api.post(`/reservas/pagos-realizados`)
  lstPagosRealizados.value = resPagos.data.result
})


// Filtros recibidos desde el hijo
const filters = ref({});

// Función para manejar los filtros cuando se aplican
const handleFilters = (newFilters) => {
  console.log("filtroooo");
  filters.value = newFilters;
  console.log(filters.value.nombre_completo);
  // Aquí puedes hacer lo que necesites con los filtros, como actualizar los reportes
};

// Función para abrir el diálogo desde el componente padre
const openFilterDialog = () => {
  if (filtroComponent.value) {
    filtroComponent.value.openDialog(); // Llamar al método expuesto en el hijo
  }
};


</script>
