<template>
  <q-layout view="lHh Lpr lFf" class="bg-black">
    <q-page-container>
      <q-page class="flex flex-center column text-white q-pa-md">
        <h2 class="text-amber">FIN DEL JUEGO</h2>
        <div class="text-h4 q-mb-xl">Ganaste: {{ lastScore }}</div>

        <div class="row q-gutter-sm q-mb-lg">
          <q-input v-model="name" dark filled label="Tu nombre" />
          <q-btn color="amber" text-color="black" label="Guardar" @click="save" />
        </div>

        <q-list bordered dark style="width: 100%; max-width: 400px">
          <q-item v-for="(s, i) in history" :key="i">
            <q-item-section>{{ s.name }}</q-item-section>
            <q-item-section side class="text-white">{{ s.score }}</q-item-section>
          </q-item>
        </q-list>

        <q-btn flat color="white" label="Inicio" to="/" class="q-mt-xl" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const name = ref('')
const lastScore = ref(parseInt(localStorage.getItem('last_score')) || 0)
const history = ref([])

onMounted(() => {
  history.value = JSON.parse(localStorage.getItem('millionaire_scores') || '[]')
})

const save = () => {
  if (!name.value) return
  history.value.push({ name: name.value, score: lastScore.value })
  history.value.sort((a, b) => b.score - a.score)
  localStorage.setItem('ranking', JSON.stringify(history.value))
}
</script>