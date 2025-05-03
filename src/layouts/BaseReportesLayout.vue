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

      <!-- Contenido dinámico -->
      <v-card-text>
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>




</script>
