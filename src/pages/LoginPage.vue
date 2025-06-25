<template>
  <v-container fill-height class="d-flex align-center justify-center" style="min-height: 100vh;">
    <v-card class="pa-5" elevation="10" width="800" style="background-color: #ffffff; border-radius: 12px;">
      <v-row no-gutters>
        <v-col cols="6" class="pa-5 d-flex flex-column justify-center">

          <v-card-title class="text-center text-h5">Iniciar Sesión</v-card-title>
          <v-card-text>
            <v-form ref="loginForm" @submit.prevent="login">
              <v-text-field v-model="username" label="Usuario" variant="outlined"
                :rules="[rules.required]"></v-text-field>
              <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Contraseña"
                variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword" :rules="[rules.required]"></v-text-field>

              <v-btn :loading="loading" color="primary" block class="mt-3" type="submit" flat="true">
                Iniciar sesión
              </v-btn>
            </v-form>
          </v-card-text>
        </v-col>
        <v-col cols="6" class="pa-5 d-flex flex-column justify-center align-center"
          style="background-color: #E3F2FD; border-radius: 0 12px 12px 0;">
          <v-card-title class="text-center text-h5">Bienvenido al Sistema</v-card-title>
          <v-card-text class="text-center">
            <p>
              Este sistema te permite gestionar, monitorear y analizar datos sobre pagos de manera eficiente.
              Disfruta de una experiencia segura con nuestras herramientas avanzadas.
            </p>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>

import { inject, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const $api = inject('api');
const username = ref("");
const password = ref("");
const loginForm = ref(null);
const router = useRouter();
const loading = ref(false);
const showPassword = ref(false);
onMounted(() => {
  console.log($api); // Verifica si $api está presente
})
const rules = {
  required: (value) => !!value || "Este campo es obligatorio",
};
const login = async () => {
  const { valid } = await loginForm.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    const response = await $api.post(`/auth/login`, {
      username: username.value,
      password: password.value,
    });
    const token = response.data.result.access_token;
    localStorage.setItem("token", token); // Guardar el token en el almacenamiento local
    router.push("/pagos-entidad/cargar-deudas");
  } catch (error) {
    console.log(error);
    alert("Usuario o contraseña incorrectos");
  } finally {
    loading.value = false;
  }
};
</script>
