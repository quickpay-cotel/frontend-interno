<template>
  <v-app>
    <!-- Barra lateral (Navbar) -->
    <v-navigation-drawer v-model="drawer" style="background-color: #0D47A1;" theme="dark">
      <v-list-item nav>
        <template v-slot:prepend>
          <v-avatar size="48" color="blue" class="mt-3">
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>
        </template>
        <v-list-item-title v-if="userData">{{ userData.datosPersona.nombres }}</v-list-item-title>
      </v-list-item>
      <v-list density="compact" nav>
        <v-list-item v-for="menu in datosUsuarioStore.menus" :key="menu" prepend-icon="mdi-menu-right" :title="menu.nombre" :to="menu.url_path"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenedor principal -->
    <v-main class="fondo">
      <v-app-bar app  style="background-color: #0D47A1;" theme="dark">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>QUICKPAY</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>

      <v-container >
        <!-- Aquí se renderiza el contenido de las rutas hijas -->
        <router-view />
      </v-container>
    </v-main>
    <!--<AppFooter />-->
  </v-app>
</template>

<script setup>
import { ref, resolveComponent } from "vue";
import { useRouter } from "vue-router";
import {jwtDecode} from 'jwt-decode';
import axios from "axios";
const drawer = ref(true); // Controla la visibilidad de la barra lateral
const userData = ref(null); // Controla la visibilidad de la barra lateral
const router = useRouter();

import { inject } from 'vue';
const $api = inject('api'); // Accede a la instancia global de Axios

import { useDatosUsuarioStore } from '@/stores/useDatosUsuarioStore';
const datosUsuarioStore = useDatosUsuarioStore();

const goToHome = () => {
  router.push("/home");
};

const logout = () => {
  localStorage.removeItem("token"); // Elimina el token y cierra la sesión
  router.push("/"); // Redirige al login
};

// obetenr menus
onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No hay token disponible')
      return
    }
    userData.value = jwtDecode(token);
    const resOptions = await $api.get(`/usuario/get-options`)
    if (resOptions.data.success) {
      datosUsuarioStore.setMenus(resOptions.data.result)
    }

  } catch (error) {
    console.error('Error al obtener opciones del usuario:', error)
  }
})
// ===============


</script>
<style scoped>
.fondo {
  /*background: url('@/assets/fondo2.jpg') no-repeat center center fixed;*/
  background-color: rgb(235, 235, 236);
  background-size: 100% 100%
}
.horizontal-gradient {
  /*background: linear-gradient(to right, blue, rgb(30, 68, 240));*/
  background-color: rgba(15, 124, 248, 0.384);
}
.vertical-gradient {
  /*background: linear-gradient( blue, rgb(230, 217, 48));*/
  background-color: rgba(24, 102, 248, 0.384);
}
.azul {
  background-color: rgba(24, 102, 248, 0.384);
}
</style>
