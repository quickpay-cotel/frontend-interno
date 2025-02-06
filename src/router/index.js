import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/pages/LoginPage.vue';
import HomePage from '@/pages/HomePage.vue';
import Default from '@/layouts/default.vue';

const routes = [
  { path: '/', component: LoginPage }, // Página de Login sin Toolbar
  {
    path: '/home',
    component: Default, // Layout con Toolbar
    children: [
      { path: '', component: HomePage },
      { path: 'logs-consultas-externas', component: () => import('@/pages/LogConsultasExternasPage.vue'), }, // Página Home dentro del Layout
      { path: 'pagos-reservas', component: () => import('@/pages/PagosRevervasPage.vue'), }, // Página Home dentro del Layout
      { path: 'reporte-pagos', component: () => import('@/pages/ReportePagosPage.vue'), }, // Página Home dentro del Layout
    ],
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Usa historial web
  routes,
});

export default router;
