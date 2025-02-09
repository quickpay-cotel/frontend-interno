<template>
  <GlobalLoadingComponent></GlobalLoadingComponent>
  <div >
    <v-app class="background">
      <router-view />
    </v-app>
  </div>
</template>

<script setup>
import GlobalLoadingComponent from '@/components/common/GlobalLoadingComponent.vue'
</script>
<style scoped>
.background {
  position: relative;
  background: url('@/assets/fondo.jpg') no-repeat center center fixed;
  background-size: 100% 100%;
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(19, 18, 18, 0.5); /* Opacidad blanca */
  z-index: 1;
}

.background > * {
  position: relative;
  z-index: 2;
}
</style>
