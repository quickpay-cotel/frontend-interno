// Utilities
import { defineStore } from 'pinia'
import { ref } from "vue";
export const useDatosUsuarioStore = defineStore('datos-usuario',()=> {
  const menus = ref([]);
  const setMenus = (pMenus) =>{
    menus.value = pMenus;
  }
  return { setMenus,menus };
})
