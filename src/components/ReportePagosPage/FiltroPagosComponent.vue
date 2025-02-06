<!-- FiltroComponent.vue (Componente Hijo) -->
<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title class="headline">Aplicar Filtros</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.nombre_completo" label="Nombre Completo" variant="outlined"  density="comfortable" hide-details></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.servicio" label="Servicio" variant="outlined"  density="comfortable" hide-details></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.id_transaccion" label="ID Transacción" variant="outlined"  density="comfortable" hide-details></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.periodo" label="Periodo" variant="outlined" density="comfortable" hide-details></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.codigo_deuda" label="Código Deuda" variant="outlined"  density="comfortable" hide-details></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.mensaje_deuda" label="Mensaje Deuda" variant="outlined"  density="comfortable" hide-details></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.mensaje_contrato" label="Mensaje Contrato" variant="outlined"  density="comfortable" hide-details></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.tipo_documento" label="Tipo Documento" variant="outlined"  density="comfortable" hide-details></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.numero_documento" label="Nro Documento" variant="outlined"  density="comfortable" hide-details></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.fecha_inicio_pago" label="Fecha Inicio Pago" type="date" variant="outlined"  density="comfortable" hide-details></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="filters.fecha_fin_pago" label="Fecha Fin Pago" type="date" variant="outlined"  density="comfortable" hide-details></v-text-field>
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
  nombre_completo: '',
  servicio: '',
  id_transaccion: '',
  periodo: '',
  codigo_deuda: '',
  mensaje_deuda: '',
  mensaje_contrato: '',
  tipo_documento: '',
  numero_documento: '',
  fecha_inicio_pago: '',
  fecha_fin_pago: ''
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
