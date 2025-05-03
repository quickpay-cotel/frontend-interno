<template>
  <v-container>
    <v-card class="pa-5">
      <!-- Encabezado con título y acciones -->
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <h1 class="text-h5">{{ title }}</h1>
          <p v-if="subtitle" class="text-caption text-grey-darken-1">{{ subtitle }}</p>
        </div>
        <div>
          <slot name="actions"></slot> <!-- Espacio para botones o iconos -->
        </div>
      </v-card-title>
      <!-- Línea divisoria -->
      <v-divider class="my-2"></v-divider>
      <!-- Nueva sección para mostrar los filtros aplicados -->
      <v-card-text v-if="filtersApplied ">
        <h3 class="text-h6">Filtros Aplicados</h3>
        <v-row>
          <v-col v-for="(value, key) in filteredFilters" :key="key" cols="12" md="3" >
            <span class="filter-text">
              [<strong>{{ formatLabel(key) }}:</strong> {{ value }}]
            </span>
          </v-col>
        </v-row>
      </v-card-text>
      <!-- Contenido dinámico -->
      <v-card-text>
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: String,     // Título de la página
  subtitle: String,  // Subtítulo opcional
  filtersApplied: null
});

// Computed para filtrar los valores vacíos
const filteredFilters = computed(() => {
  let obj  = Object.fromEntries(
    Object.entries(props.filtersApplied).filter(([key, value]) => value !== null && value !== "")
  );
  return obj;
});

// Formatear la clave de los filtros para mostrarla de manera más legible
const formatLabel = (label) => {
  const formatted = label
    .replace(/([A-Z])/g, ' $1') // Añadir espacios antes de mayúsculas
    .replace(/^./, str => str.toUpperCase()); // Capitalizar la primera letra
  return formatted;
};

const objetoEsvacio = (obj) => {
  // Iterar sobre las propiedades del objeto
  for (let key in obj) {
    // Verificar si la propiedad no es vacía (considera: string vacío, null, undefined, etc.)
    if (obj.hasOwnProperty(key) && obj[key] !== "" && obj[key] !== null && obj[key] !== undefined) {
      return false; // Si hay al menos una propiedad con valor, no está vacío
    }
  }
  return true; // Si todas las propiedades son vacías
}
</script>
