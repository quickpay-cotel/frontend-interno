<template>
    <BaseLayout title="PRODUCTOS" subtitle="Bienvenido a reporte de productos registrados en SIAT">
        <template #actions>
            
        </template>
        <v-data-table hide-default-header :items="lstProductos" :items-per-page-options="[5, 10, 15]"
            v-model:items-per-page="itemsPerPage" v-model:page="page">
            <!-- 🔹 Personalización del encabezado -->
            <template v-slot:thead>
                <thead>
                    <tr class="custom-header" style="color: #000DF8; font-size: 12px;font-weight: bold;">
                        <td>NRO</td>
                        <td>empresaProductoId</td>
                        <td>empresaId</td>
                        <td>estadoProductoId</td>
                        <td>estadoProductoDescripcion</td>
                        <td>actividadEconomica</td>
                        <td>codProductoSin</td>
                        <td>codProductoEmpresa</td>
                        <td>descripcion</td>
                        <td>precioUnitario</td>
                        <td>precioPorMayor</td>
                        <td>descuentoPrecioUnitario</td>
                        <td>descuentoPrecioPorMayor</td>
                        <td>cantidadInicial</td>
                        <td>codUnidadMedida</td>
                        <td>unidadMedida</td>
                    </tr>
                </thead>
            </template>
            <template v-slot:item="{ item, index }">
                <tr style="color: #000; font-size: 12px;font-weight: normal;">
                    <td>{{ (page - 1) * itemsPerPage + index + 1 }}</td>
                    <td>{{ item.empresaProductoId }}</td>
                    <td>{{ item.empresaId }}</td>
                    <td>{{ item.estadoProductoId }}</td>
                    <td>{{ item.estadoProductoDescripcion }}</td>
                    <td>{{ item.actividadEconomica }}</td>
                    <td>{{ item.codProductoSin }}</td>
                    <td>{{ item.codProductoEmpresa }}</td>
                    <td>{{ item.descripcion }}</td>
                    <td>{{ item.precioUnitario }}</td>
                    <td>{{ item.precioPorMayor }}</td>
                    <td>{{ item.descuentoPrecioUnitario }}</td>
                    <td>{{ item.descuentoPrecioPorMayor }}</td>
                    <td>{{ item.cantidadInicial }} </td>
                    <td>{{ item.codUnidadMedida }}</td>
                    <td>{{ item.unidadMedida }}</td>
                </tr>
            </template>
        </v-data-table>
    </BaseLayout>
</template>
<script setup>
import BaseLayout from '@/layouts/BaseReportesLayout.vue';
const $api = inject('api');
import { useLoadingStore } from '@/stores/useLoadingStore';
const loadingStore = useLoadingStore()
const lstProductos = ref([]);
const page = ref(1);
const itemsPerPage = ref(5);
onMounted(async () => {
  mostrarTodo();
})
const mostrarTodo = async () => {
  loadingStore.startLoading('cargando productos....')
  try {
    const resProductos = await $api.get(`/illa/obtiene-productos-todos`)
    lstProductos.value = resProductos.data.result;
    loadingStore.stopLoading()
  } catch (error) {
    console.log(error);
    loadingStore.stopLoading()
  }
}

</script>