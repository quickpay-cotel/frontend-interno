<template>
  <v-container>
    <v-row>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-card-title>Pagos por mensual del año {{ anioActual }}</v-card-title>
          <v-card-text>
            <v-table  density="compact">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Total Pagado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(pago, index) in lstPagosMes" :key="index">
                  <td>{{ new Date(pago.mes).toLocaleDateString() }}</td>
                  <td>{{ pago.total_pagado +' Bs' }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-card-title>Pagos semanal del mes de {{ nombreMes }} </v-card-title>
          <v-card-text>
            <v-table  density="compact">
              <thead>
                <tr>
                  <th>Semana</th>
                  <th>Total Pagado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(pago, index) in lstPagosSemana" :key="index">
                  <td>{{ new Date(pago.semana).toLocaleDateString() }}</td>
                  <td>{{ pago.total_pagado +' Bs'}}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";

import { useLoadingStore } from '@/stores/useLoadingStore'
const loadingStore = useLoadingStore()
const $api = inject('api');

onMounted(async () => {
  console.log("montandooo");
  await mostrarDashboard();
});


const nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
const anioActual = new Date().getFullYear();


const lstPagosMes = ref([]);
const lstPagosSemana = ref([]);
const lstPagosPorestado = ref([]);
const lstPagosUltimo = ref([]);
const mostrarDashboard = async () => {
  loadingStore.startLoading('cargando indicadores....')
  try {

    const resPagoMes = await $api.get(`/transaction/pagos-mes`)
    lstPagosMes.value = resPagoMes.data.result
    const restPagoSemana = await $api.get(`/transaction/pagos-semana`)
    lstPagosSemana.value = restPagoSemana.data.result

    loadingStore.stopLoading()
  } catch (error) {
    console.log(error);
    loadingStore.stopLoading()
  }
}

</script>
