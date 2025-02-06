<template>
  <BaseLayout title="REPORTE DE LOG DE CONSULTAS EXTERNAS" subtitle="Bienvenido a reporte de consultas externas"  >
    <v-data-table hide-default-header :items="lstConsultasExternas"
      :items-per-page-options="[5, 10, 15]"
       v-model:items-per-page="itemsPerPage"
       v-model:page="page"
  >
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

    <template v-slot:item="{ item,index }">
      <tr>
        <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
        <td>
          {{ item.method }}
        </td>
        <td>{{ item.url }}</td>
        <td>
          <span v-if="item.request_data.length <= 200">
            {{ item.request_data }}
          </span>
          <span v-else>
            {{ (item.request_data + "").substring(0, 200) }}...
            <v-btn size="x-small" variant="text" @click="openJsonEnDialog(item.request_data,'SOLICITUD')">Ver más</v-btn>
          </span>
        </td>
        <td>{{ item.response_status }}</td>
        <td>
          <span v-if="item.response_data.length <= 200">
            {{ item.response_data }}
          </span>
          <span v-else>
            {{ (item.response_data + "").substring(0, 200) }}...
            <v-btn size="x-small" variant="text" @click="openJsonEnDialog(item.response_data,'RESPUESTA')">Ver más</v-btn>
          </span>
        </td>
        <td>{{ item.fecha_registro }}</td>
      </tr>
    </template>
  </v-data-table>

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
        <v-btn color="primary" @click="verJsonDialog = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
onMounted(async () => {
  const resConsultasExternas = await $api.get(`/log/consultas-externas`)
  lstConsultasExternas.value = resConsultasExternas.data.result
})

const openJsonEnDialog = (json,campo) => {
  try {
    if ((typeof json) === 'object') {
      parsedJson.value = JSON.stringify(json);;
    } else {
      parsedJson.value = JSON.stringify(JSON.parse(json), null, 2);
    }
  } catch (error) {
    parsedJson.value = null;
  }
  verJsonDialog.value = true;
  tituloDialog.value = campo
};
</script>
