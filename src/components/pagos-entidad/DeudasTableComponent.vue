<template>
  <v-data-table hide-default-header :items="items" :items-per-page-options="[5, 10, 15]"
    v-model:items-per-page="itemsPerPage" v-model:page="page">
    <!-- Cabecera -->
    <template v-slot:thead>
      <thead>
        <tr class="custom-header" style="color: #000DF8; font-size: 12px; font-weight: bold;">
          <td>NRO</td>
          <td>CODIGO CLIENTE</td>
          <td>NOMBRE COMPLETO</td>
          <td>NUMERO DOCUMENTO</td>
          <td>TIPO DE PAGO</td>
          <td>CODIGO SERVICIO</td>
          <td>DESCRIPCION SERVICIO</td>
          <td>PERIODO</td>
          <td>MONTO</td>
          <td>MONTO DESCUENTO</td>
          <td>EMAIL</td>
          <td>TELEFONO</td>
          <td>FECHA REGISTRO</td>
          <td>ACCIONES</td> <!-- Nueva columna -->
        </tr>
      </thead>
    </template>

    <!-- Filas -->
    <template v-slot:item="{ item, index }">
      <tr style="color: #000; font-size: 12px; font-weight: normal;">
        <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
        <td>{{ item.codigoCliente }}</td>
        <td>{{ item.nombreCompleto }}</td>
        <td>
          {{ item.tipoDocumento }}<br />
          {{ item.numeroDocumento }}<br />
          {{ item.complementoDocumento }}
        </td>
        <td>{{ item.tipoPago }}</td>
        <td>{{ item.codigoServicio }}</td>
        <td>{{ item.descripcionServicio }}</td>
        <td>{{ item.periodo }}</td>
        <td>{{ item.monto }}</td>
        <td>{{ item.montoDescuento }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.telefono }}</td>
        <td>{{ item.fechaRegistro }}</td>
        <td>
          <div class="d-inline-flex align-center" style="gap: 8px;">
            <v-icon size="18" color="pink" class="cursor-pointer" title="Anular deuda"
              @click="$emit('anular-deuda', item.deudaId)">
              mdi-delete
            </v-icon>

            <v-icon size="18" color="blue" class="cursor-pointer" title="Modificar deuda"
              @click="$emit('modificar-deuda', item)">
              mdi-pencil
            </v-icon>
          </div>


        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, defineProps } from 'vue'

defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const page = ref(1)
const itemsPerPage = ref(5)
</script>
