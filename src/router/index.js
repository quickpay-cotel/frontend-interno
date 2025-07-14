import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/pages/LoginPage.vue';
import HomePage from '@/pages/HomePage.vue';
import Default from '@/layouts/default.vue';

const routes = [
  { path: '/', component: LoginPage }, // Página de Login sin Toolbar
  {
    path: '/cotel',
    component: Default, // Layout con Toolbar
    children: [
      { path: '', component: HomePage },
      { path: 'logs-consultas-externas', component: () => import('@/pages/cotel/LogConsultasExternasPage.vue'), }, // Página Home dentro del Layout
      { path: 'pagos-reservas', component: () => import('@/pages/cotel/PagosRevervasPage.vue'), }, // Página Home dentro del Layout
      { path: 'reporte-pagos', component: () => import('@/pages/cotel/ReportePagosPage.vue'), }, // Página Home dentro del Layout
      { path: 'illa-documentos-ajuste', component: () => import('@/pages/illa/DocumentosAjustePage.vue'), },
      { path: 'illa-productos', component: () => import('@/pages/illa/ProductosPage.vue'), },
    ],
  },
  {
    path: '/pagos-entidad',
    component: Default, // Puedes usar el mismo layout si deseas que comparta Toolbar, etc.
    children: [
      { path: '', component: HomePage },
      { path: 'cobros-pendientes', component: () => import('@/pages/pagos-entidad/CobrosPendientesPage.vue') },
      { path: 'configuracion-perfil', component: () => import('@/pages/pagos-entidad/ConfiguracionPerfilPage.vue') },
      { path: 'cobros-realizado', component: () => import('@/pages/pagos-entidad/ReportePagosPage.vue') },
      { path: 'cobros-caja', component: () => import('@/pages/pagos-entidad/CobrosCajaPage.vue') }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Usa historial web
  routes,
});

export default router;
