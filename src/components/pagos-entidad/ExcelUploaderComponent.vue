<template>
  <v-card
    class="pa-6 text-center"
    elevation="2"
    :class="{ 'bg-grey-lighten-4': isDragging }"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <v-icon size="48" color="green-darken-2">mdi-file-excel</v-icon>
    <div class="text-h6 mt-2">{{ title }}</div>
    <div class="text-caption mb-4">Formatos permitidos: {{ accept }}</div>

    <v-file-input
      v-model="selectedFile"
      :accept="accept"
      :label="inputLabel"
      prepend-icon="mdi-upload"
      show-size
    />

    <v-btn
      class="mt-4"
      color="primary"
      :disabled="!selectedFile"
      :loading="loading"
      @click="upload"
    >
      {{ buttonText }}
    </v-btn>
  </v-card>
</template>

<script setup>
import {inject, ref, computed } from 'vue'
import { showDialog } from '@/utils/alertUtils' // ✅ Importas aquí

const $api = inject('api');
// ✅ Desestructurando props directamente
const { endpoint, accept, inputLabel, buttonText, title } = defineProps({
  endpoint: { type: String, required: true },
  accept: { type: String, default: '.xlsx,.xls' },
  inputLabel: { type: String, default: 'Selecciona archivo' },
  buttonText: { type: String, default: 'Subir archivo' },
  title: { type: String, default: 'Arrastra tu archivo aquí o haz clic abajo' },
})

// Eventos emitidos
const emit = defineEmits(['upload-success', 'upload-error'])

const selectedFile = ref(null)
const isDragging = ref(false)
const loading = ref(false)


const onDragOver = () => isDragging.value = true
const onDragLeave = () => isDragging.value = false

const acceptRegex = computed(() => {
  const extensions = accept.split(',').map(ext => ext.trim().replace('.', ''))
  return new RegExp(`\\.(${extensions.join('|')})$`, 'i')
})

const onDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && acceptRegex.value.test(file.name)) {
    selectedFile.value = file

  } else {
    /*message.value = `Solo se permiten archivos con extensión: ${accept}`
    messageType.value = 'error'*/
     showDialog({
      icon: 'error',
      title: 'Cargar Archivo',
      text: `Solo se permiten archivos con extensión: ${accept}`,
    })

  }
}


const upload = async () => {
  if (!selectedFile.value) return
  const formData = new FormData()
  formData.append('file', selectedFile.value)
  loading.value = true
  try {
    await $api.post(endpoint, formData)
    emit('upload-success', selectedFile.value)
  } catch (error) {
    emit('upload-error', error)
  } finally {
    loading.value = false
  }
}
</script>
