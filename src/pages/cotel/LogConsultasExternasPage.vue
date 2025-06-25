<template>

  <BaseLayout title="REPORTE DE LOG DE CONSULTAS EXTERNAS" subtitle="Bienvenido a reporte de consultas externas" :filtersApplied="filters">

    <template #actions>
      <v-btn-group variant="outlined" divided>
        <v-btn color="primary" @click="openFilterDialog">Aplicar Filtros</v-btn>
        <v-btn color="primary" @click="mostrarTodo()">Mostrar Todos</v-btn>
      </v-btn-group>
    </template>


    <v-data-table hide-default-header :items="lstConsultasExternas" :items-per-page-options="[5, 10, 15]"
      v-model:items-per-page="itemsPerPage" v-model:page="page">
      <!-- 🔹 Personalización del encabezado -->
      <template v-slot:thead>
        <thead>
          <tr class="custom-header">
            <td>NRO</td>
            <td>METODO</td>
            <td>API</td>
            <td>SOLICITUD</td>
            <td>ESTADO RESPUESTA</td>
            <td>RESPUESTA</td>
            <td>FECHA REGISTRO</td>
          </tr>
        </thead>
      </template>

      <template v-slot:item="{ item, index }">
        <tr>
          <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
          <td>
            {{ item.method }}
          </td>
          <td>{{ item.url }}</td>
          <td>
            <span v-if="item.request_data.length <= 100">
              {{ item.request_data }}
            </span>
            <span v-else>
              {{ (item.request_data + "").substring(0, 100) }}...
              <v-btn size="x-small" variant="text"
                @click="openJsonEnDialog(JSON.stringify(item.request_data), 'SOLICITUD')">Ver más</v-btn>
            </span>
          </td>
          <td>{{ item.response_status }}</td>
          <td>
            <span v-if="item.response_data.length <= 100">
              {{ item.response_data }}
            </span>
            <span v-else>
              {{ (item.response_data + "").substring(0, 100) }}...
              <v-btn size="x-small" variant="text" @click="openJsonEnDialog(item.response_data, 'RESPUESTA')">Ver
                más</v-btn>
            </span>
          </td>
          <td>{{ item.fecha_registro }}</td>
        </tr>
      </template>
    </v-data-table>
  <!-- Componente hijo para filtros -->
  <FiltroLogConsultasExternasComponent ref="filtroComponent" @apply-filters="handleFilters" />
  </BaseLayout>

  <!-- Dialogo para ver el JSON -->
  <v-dialog v-model="verJsonDialog" max-width="800px">
    <v-card>
      <v-card-title>{{ tituloDialog }}</v-card-title>
      <v-card-text>
        <pre v-if="parsedJson">{{ parsedJson }}</pre>
        <p v-else style="color: red;">Error: No es un JSON válido</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="copyText">Copiar</v-btn>
        <v-btn color="primary" @click="verJsonDialog = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
    <!-- Snackbar (toast) en la parte inferior derecha -->
    <v-snackbar v-model="snackbar" :timeout="2000" color="success" location="bottom right">
      ¡Texto copiado al portapapeles!
    </v-snackbar>
</template>
<script setup>

import { inject } from 'vue';
const $api = inject('api');
import { ref } from "vue";
const lstConsultasExternas = ref([]);
const tituloDialog = ref('');
const verJsonDialog = ref(false);
const parsedJson = ref(null)
const page = ref(1);
const itemsPerPage = ref(5);
import BaseLayout from '@/layouts/BaseReportesLayout.vue';

import { useLoadingStore } from '@/stores/useLoadingStore'
const loadingStore = useLoadingStore()


onMounted(async () => {
  mostrarTodo()
})
const snackbar = ref(false);
const openJsonEnDialog = (json, campo) => {
  //let obj = json.toString();
  console.log(typeof json);
  try {
    parsedJson.value = JSON.stringify(JSON.parse(json), null, 2);
  } catch (error) {
    parsedJson.value = null;
  }
  verJsonDialog.value = true;
  tituloDialog.value = campo
};
const copyText = async () => {
  try {
    await navigator.clipboard.writeText(parsedJson.value);
    snackbar.value = true; // Muestra el toast
  } catch (err) {
    console.error("Error al copiar: ", err);
  }
};

// Función para abrir el diálogo desde el componente padre
const openFilterDialog = () => {
  if (filtroComponent.value) {
    filtroComponent.value.openDialog(); // Llamar al método expuesto en el hijo
  }
};

// Referencia al componente hijo
const filtroComponent = ref(null);

// Filtros recibidos desde el hijo
const filters = ref({});

// Función para manejar los filtros cuando se aplican
const handleFilters = async (newFilters) => {
  filters.value = newFilters;
  const resConsultasExternas = await $api.post(`/log/consultas-externas`,newFilters)
  lstConsultasExternas.value = resConsultasExternas.data.result

};

const mostrarTodo = async () => {
  loadingStore.startLoading('cargando logs....')
  try {
    filters.value = {};
    const resConsultasExternas = await $api.post(`/log/consultas-externas`)
    lstConsultasExternas.value = resConsultasExternas.data.result
    loadingStore.stopLoading()
  } catch (error) {
    console.log(error);
    loadingStore.stopLoading()
  }
}

</script>
