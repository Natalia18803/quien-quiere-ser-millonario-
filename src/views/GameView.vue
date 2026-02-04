<template>
  <q-layout view="lHh Lpr lFf" class="bg-black">
    <q-page-container>
      <q-page class="q-pa-md flex flex-center text-white">
        <div v-if="currentQuestion" style="width: 100%; max-width: 800px">
          
          <div class="text-center q-mb-xl">
            <q-chip outline color="amber" size="lg">Nivel {{ currentStep + 1 }}: ${{ levels[currentStep] }}</q-chip>
          </div>

          <q-card flat bordered class="bg-transparent border-blue q-pa-lg text-center q-mb-xl">
            <div class="text-h5">{{ currentQuestion.text }}</div>
          </q-card>

          <div class="row q-col-gutter-md">
            <div v-for="(opt, i) in currentQuestion.options" :key="i" class="col-12 col-md-6">
              <q-btn outline color="blue-4" class="full-width q-py-md btn-game" @click="checkAnswer(opt)">
                <span class="text-amber q-mr-sm">{{ ['A','B','C','D'][i] }}:</span> {{ opt }}
              </q-btn>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(0)
const levels = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000]

const questions = [
  { text: "¿Cuál es el lenguaje de Vue?", options: ["Java", "JavaScript", "C#", "Python"], answer: "JavaScript" },
  { text: "¿Qué framework usa este código?", options: ["React", "Angular", "Quasar", "Svelte"], answer: "Quasar" }
]

const currentQuestion = computed(() => questions[currentStep.value])

const checkAnswer = (choice) => {
  if (choice === currentQuestion.value.answer) {
    if (currentStep.value === questions.length - 1) finish(levels[currentStep.value])
    else currentStep.value++
  } else {
    finish(currentStep.value > 0 ? levels[currentStep.value - 1] : 0)
  }
}

const finish = (prize) => {
  localStorage.setItem('last_score', prize)
  router.push('/score')
}
</script>

<style scoped>
.border-blue { border: 2px solid #2196f3; border-radius: 40px; }
.btn-game { border-radius: 15px; text-transform: none; }
</style>