<!-- FiltroComponent.vue (Componente Hijo) -->
<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title class="headline">Aplicar Filtros</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.empresa" label="Empresa" variant="outlined"  density="comfortable" hide-details clearable  ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.api" label="End Point" variant="outlined"  density="comfortable" hide-details clearable></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.status" label="Status" variant="outlined"  density="comfortable" hide-details clearable></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.fechaInicio" label="Fecha Inicio " type="date" variant="outlined"  density="comfortable" hide-details clearable></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.fechaFin" label="Fecha Fin" type="date" variant="outlined"  density="comfortable" hide-details clearable></v-text-field>
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

// Define el estado para el diálogo
const dialog = ref(false);
// Filtros
const filters = ref({
  empresa: '',
  api: '',
  status: '',
  fechaInicio: '',
  fechaFin: ''
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
