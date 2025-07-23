<template>
  <v-data-table hide-default-header :items="items" :items-per-page-options="[5, 10, 15]"
    v-model:items-per-page="itemsPerPage" v-model:page="page">
    <!-- Cabecera -->
    <template v-slot:thead>
      <thead>
        <tr class="custom-header  text-black" style="font-size: 12px; font-weight: bold;">
          <th>NRO</th>
          <th>CODIGO CLIENTE</th>
          <th>NOMBRE COMPLETO</th>
          <th>NUMERO DOCUMENTO</th>
          <th>TIPO DE PAGO</th>
          <th>PERIODO</th>
          <th>CODIGO PRODUCTO</th>
          <th>CODIGO PRODUCTO SIN</th>
          <th>DESCRIPCION</th>
          <th class="text-right">CANTIDAD</th>
          <th class="text-right">PRECIO UNITARIO</th>
          <th class="text-right">MONTO DESCUENTO</th>
          <th class="text-right">MONTO TOTAL</th>
          <th>EMAIL</th>
          <th>TELEFONO</th>
          <th>GENERA FACTURA?</th>
          <th>FECHA REGISTRO</th>
          <th>ACCIONES</th> <!-- Nueva columna -->
        </tr>
      </thead>
    </template>

    <!-- Filas -->
    <template v-slot:item="{ item, index }">
      <tr style=" font-size: 12px; font-weight: normal;">
        <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
        <td>{{ item.codigoCliente }}</td>
        <td>{{ item.nombreCompleto }}</td>
        <td>
          {{ item.tipoDocumento }}<br />
          {{ item.numeroDocumento }}<br />
          {{ item.complementoDocumento }}
        </td>
        <td>{{ item.tipoPago }}</td>
        <td>{{ item.periodo }}</td>
        <td>{{ item.codigoProducto }}</td>
        <td>{{ item.codigoProductoSin }}</td>
        <td>{{ item.descripcion }}</td>
        <td class="text-right">{{ item.cantidad }}</td>
        <td class="text-right">{{ item.precioUnitario }}</td>
        <td class="text-right">{{ item.montoDescuento }}</td>
        <td class="text-right">{{ item.montoTotal }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.telefono }}</td>
        <td>{{ item.generaFactura?'SI':'NO' }}</td>
        <td>{{ item.fechaRegistro }}</td>
        <td>
          <div class="d-inline-flex align-center" style="gap: 8px;">
            <v-icon size="18" color="primary" class="cursor-pointer" title="Anular deuda"
              @click="$emit('anular-deuda', item.deudaId)">
              mdi-delete
            </v-icon>

            <v-icon size="18" color="primary" class="cursor-pointer" title="Modificar deuda"
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

<style scoped>
.text-right {
  text-align: right;
}
</style>
