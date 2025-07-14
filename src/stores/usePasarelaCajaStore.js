// Utilities
import { defineStore } from 'pinia'
import { ref } from "vue";
export const usePasarelaCajaStore = defineStore('pasarela-cajas',()=> {
  const datosBusqueda = ref({});
  const datosCliente = ref({});
  const lstDeudasTodos = ref([]);
  const lstDeudasSeleccionadas = ref([]);

  return { datosBusqueda,lstDeudasSeleccionadas,datosCliente,lstDeudasTodos };
})
