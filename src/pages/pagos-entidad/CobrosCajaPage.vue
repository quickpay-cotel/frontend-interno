<template>
    <BaseLayout title="DEUDAS" subtitle="Deudas que aun no fueron pagados">
        <template #actions>

        </template>
        <form-wizard  :color="wizardColor" ref="wizard" shape="circle" nextButtonText="Siguiente" backButtonText="Atras" 
            @on-change="handleStepChange" @on-complete="resetWizard" finishButtonText="Finalizar">
            <tab-content title="Buscar Cliente">
                <v-card class="mx-auto my-8 rounded-card">
                    <BuscarDeudaComponent></BuscarDeudaComponent>
                </v-card>
            </tab-content>
            <tab-content title="Seleccionar Deudas">
                <v-card class="mx-auto my-8 rounded-card pa-4" max-width="100%">
                    <SeleccionarPagoComponent ref="seleccionarPagoRef" />
                </v-card>
            </tab-content>
            <tab-content title="Pagar">
                <v-card class="mx-auto my-8 rounded-card pa-4" max-width="100%">
                    <PagarComponent />
                </v-card>
            </tab-content>
        </form-wizard>
    </BaseLayout>
</template>

<script setup>
import { showCustomAlert } from '@/utils/alertUtils';
import { ref } from 'vue';
import BaseLayout from '@/layouts/BaseReportesLayout.vue'
import BuscarDeudaComponent from '@/components/pagos-entidad/CobrosCajaPage/BuscarDeudaComponent.vue';
import SeleccionarPagoComponent from '@/components/pagos-entidad/CobrosCajaPage/SeleccionarPagoComponent.vue';
import PagarComponent from '@/components/pagos-entidad/CobrosCajaPage/PagarComponent.vue';
import { usePasarelaCajaStore } from '@/stores/usePasarelaCajaStore';

import { useTheme } from 'vuetify';
const { current } = useTheme();
const wizardColor = computed(() => current.value.colors.primary);


const pasarelaCajaStore = usePasarelaCajaStore();
const seleccionarPagoRef = ref(null);
const wizard = ref(null);
const handleStepChange = async (prevIndex, nextIndex) => {
    if (nextIndex === 1 && seleccionarPagoRef.value) {
        await seleccionarPagoRef.value.buscaDeudas();
    }
}
const resetWizard = async () => {

    let result = await showCustomAlert('Finalizar', 'Esta seguro de finalizar?');
    if (result.isConfirmed) {
      pasarelaCajaStore.datosBusqueda = {};
      pasarelaCajaStore.datosCliente = {};
      pasarelaCajaStore.lstDeudasTodos = [];
      pasarelaCajaStore.lstDeudasSeleccionadas = [];
      wizard.value?.reset();
    }
};
</script>

<style scoped>
.wizard-progress-bar {
  background-color: var(--v-theme-primary) !important;
  height: 4px !important;
}
</style>