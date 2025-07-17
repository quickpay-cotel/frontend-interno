<!-- FiltroComponent.vue (Componente Hijo) -->
<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title class="headline">Aplicar Filtros</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.fechaInicioPago" label="Fecha Inicio Pago" type="date" variant="outlined"  density="comfortable" hide-details clearable></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.fechaFinPago" label="Fecha Fin Pago" type="date" variant="outlined"  density="comfortable" hide-details clearable></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="applyFilters">Aplicar</v-btn>
        <v-btn @click="closeDialog">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineEmits, defineExpose } from 'vue';
import { formatFechaParaInput } from '@/utils/funcionesFechas';
// Define el estado para el diálogo
const dialog = ref(false);

const hoy = new Date();

const filters = ref({
  fechaInicioPago:formatFechaParaInput(hoy),
  fechaFinPago: formatFechaParaInput(hoy)
});

// Emitir evento de filtros aplicados
const emit = defineEmits();

// Función para aplicar filtros y emitir al padre
const applyFilters = () => {
  emit('apply-filters', filters.value);
  dialog.value = false; // Cerrar el diálogo
};

// Función para cerrar el diálogo
const closeDialog = () => {
  dialog.value = false;
};

// Exponer el ref para que el componente padre pueda controlarlo
defineExpose({
  openDialog: () => {
    dialog.value = true;
  }
});


</script>
