<template>
   <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Total Ventas</v-card-title>
              <v-card-text>
                <v-icon color="primary">mdi-currency-usd</v-icon>
                <span class="text-h5">$ 50,000</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Usuarios Activos</v-card-title>
              <v-card-text>
                <v-icon color="green">mdi-account-group</v-icon>
                <span class="text-h5">1,200</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Pedidos Pendientes</v-card-title>
              <v-card-text>
                <v-icon color="red">mdi-cart</v-icon>
                <span class="text-h5">75</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Reporte de Ventas</v-card-title>
              <v-card-text>
                <BarChart />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
</template>

<script setup>
  //
</script>
