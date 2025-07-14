<template>
  <v-app>
    <!-- Barra lateral (Navbar) -->
     
    <v-navigation-drawer v-model="drawer" color="primary" theme="dark" >
      <v-list-item nav>
        <template v-slot:prepend>
          <v-avatar size="48" color="blue" class="mt-3">
            <v-img
              :src="logoUrl"
              alt="Logo"
              cover
            >
              <template #placeholder>
                <v-icon color="white">mdi-account</v-icon>
              </template>
            </v-img>
          </v-avatar>
        </template>
        <v-list-item-title v-if="userData">{{ userData.datosPersona.nombres }}</v-list-item-title>
      </v-list-item>
      <v-list density="compact" nav>
        <v-list-item
          v-for="menu in datosUsuarioStore.menus"
          :key="menu"
          prepend-icon="mdi-menu-right"
          :title="menu.nombre"
          :to="menu.url_path"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenedor principal -->
    <v-main class="fondo">
      <v-app-bar app color="primary" theme="dark">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>QUICKPAY</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>
      <v-container>
        <!-- Aquí se renderiza el contenido de las rutas hijas -->
        <router-view />
      </v-container>
    </v-main>
    <!--<AppFooter />-->
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { jwtDecode } from 'jwt-decode';
import { useUtilsStore } from '@/stores/useUtilsStore';
import { inject } from 'vue';
import { useDatosUsuarioStore } from '@/stores/useDatosUsuarioStore';

const drawer = ref(true);
const userData = ref(null);
const router = useRouter();

const utilsStore = useUtilsStore();
const datosUsuarioStore = useDatosUsuarioStore();

const $api = inject('api'); // instancia global Axios

// Computed reactivo para la URL del logo, con timestamp para evitar cache
const logoUrl = computed(() => {
  const logo = utilsStore.configuracionEmpresa.logo_url || '';
  console.log(logo);
  return `${$api.defaults.baseURL}/store/logos/${logo}?t=${Date.now()}`;
});

const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};

onMounted(async () => {
  console.log("montandooo");
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No hay token disponible');
      return;
    }
    userData.value = jwtDecode(token);
    const resOptions = await $api.get(`/usuario/get-options`);
    if (resOptions.data.success) {
      datosUsuarioStore.setMenus(resOptions.data.result);
    }
  } catch (error) {
    console.error('Error al obtener opciones del usuario:', error);
  }
});
</script>

<style scoped>
.fondo {
  background-color: rgb(235, 235, 236);
  background-size: 100% 100%;
}

.horizontal-gradient {
  background-color: rgba(15, 124, 248, 0.384);
}

.vertical-gradient {
  background-color: rgba(24, 102, 248, 0.384);
}

.azul {
  background-color: rgba(24, 102, 248, 0.384);
}
</style>
