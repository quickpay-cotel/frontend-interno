// Utilities
import { defineStore } from "pinia";
import { ref } from "vue";
export const useUtilsStore = defineStore("utils", () => {
  const configuracionEmpresa = ref({});

const setConfiguracionEmpresa = (config) => {
  configuracionEmpresa.value = { ...config }
}

  return { configuracionEmpresa,setConfiguracionEmpresa };
});
