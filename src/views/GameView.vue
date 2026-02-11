<template>
  <q-layout fullscreen class="bg-black">
    <div v-if="currentQuestion" style="width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;" class="text-white">

          <div class="text-center q-mb-xl q-pa-lg">
            <q-chip outline color="amber" size="xl" class="q-pa-md">Nivel {{ currentStep + 1 }}: ${{ levels[currentStep] }}</q-chip>
            <q-linear-progress :value="timeLeft / 30" color="red" size="40px" class="q-mt-lg" />
            <div class="text-h4 q-mt-lg">{{ timeLeft }}s</div>
          </div>

          <div class="row q-col-gutter-lg q-mb-xl">
            <div class="col-12 col-sm-4">
              <q-btn
                :disable="!lifelines.fiftyFifty"
                color="orange"
                label="50/50"
                @click="useFiftyFifty"
                class="full-width q-py-xl q-mb-lg btn-large"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-btn
                :disable="!lifelines.audienceHelp"
                color="green"
                label="público"
                @click="useAudienceHelp"
                class="full-width q-py-xl q-mb-lg btn-large"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-btn
                :disable="!lifelines.changeQuestion"
                color="purple"
                label="Cambiar"
                @click="useChangeQuestion"
                class="full-width q-py-xl q-mb-lg btn-large"
              />
            </div>
          </div>

          <q-card flat bordered class="bg-transparent border-blue q-pa-xl text-center q-mb-xl">
            <div class="text-h3 text-sm-h4">{{ currentQuestion.text }}</div>
          </q-card>

          <div class="row q-col-gutter-xl">
            <div v-for="opt in visibleOptions" :key="opt.text" class="col-12 col-sm-6">
              <q-btn :outline="!showResults" :color="getButtonColor(opt.text)" class="full-width q-py-xl btn-game-large q-mb-lg" :disable="showResults" @click="checkAnswer(opt.text)">
                <span class="text-amber q-mr-lg text-h5">{{ opt.letter }}:</span> {{ opt.text }}
              </q-btn>
            </div>
          </div>

          <!-- Para Ayuda del Público -->
          <div v-if="audienceVotes" class="q-mb-xl text-center">
            <q-card flat class="bg-grey-9 text-white q-pa-xl">
              <div class="text-h4 q-mb-lg">Ayuda del Público:</div>
              <div v-for="(vote, i) in audienceVotes" :key="i" class="text-h5">
                {{ ['A','B','C','D'][i] }}: {{ vote }}%
              </div>
            </q-card>
          </div>
        </div>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(0)
const levels = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000]

const questions = [
  { text: "¿Cuál es el lenguaje de Vue?", options: ["Java", "JavaScript", "C#", "Python"], answer: "JavaScript" },
  { text: "¿Qué framework usa este código?", options: ["React", "Angular", "Quasar", "Svelte"], answer: "Quasar" },
  { text: "¿Cuál es la capital de España?", options: ["Madrid", "Barcelona", "Sevilla", "Valencia"], answer: "Madrid" },
  { text: "¿En qué año llegó el hombre a la luna?", options: ["1969", "1957", "1972", "1961"], answer: "1969" },
  { text: "¿Quién escribió Don Quijote?", options: ["Miguel de Cervantes", "Lope de Vega", "Calderón", "Quevedo"], answer: "Miguel de Cervantes" },
  { text: "¿Cuál es el río más largo del mundo?", options: ["Nilo", "Amazonas", "Yangtsé", "Mississippi"], answer: "Nilo" },
  { text: "¿Cuál es el planeta más cercano al sol?", options: ["Mercurio", "Venus", "Tierra", "Marte"], answer: "Mercurio" },
  { text: "¿Qué gas respiramos principalmente?", options: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Hidrógeno"], answer: "Oxígeno" },
  { text: "¿Cuál es el océano más grande?", options: ["Pacífico", "Atlántico", "Índico", "Ártico"], answer: "Pacífico" },
  { text: "¿Quién fue el primer presidente de Estados Unidos?", options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"], answer: "George Washington" },
  { text: "¿Cuál es la moneda de Japón?", options: ["Yen", "Won", "Yuan", "Rupia"], answer: "Yen" },
  { text: "¿En qué continente está Egipto?", options: ["África", "Asia", "Europa", "América"], answer: "África" },
  { text: "¿Cuál es el animal más grande del mundo?", options: ["Ballena azul", "Elefante", "Jirafa", "Rinoceronte"], answer: "Ballena azul" },
  { text: "¿Qué idioma se habla en Brasil?", options: ["Portugués", "Español", "Inglés", "Francés"], answer: "Portugués" },
  { text: "¿Quién pintó El grito?", options: ["Edvard Munch", "Vincent van Gogh", "Pablo Picasso", "Salvador Dalí"], answer: "Edvard Munch" },
  { text: "¿Cuál es la montaña más alta del mundo?", options: ["Everest", "K2", "Kangchenjunga", "Lhotse"], answer: "Everest" },
  { text: "¿Qué significa WWW en internet?", options: ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"], answer: "World Wide Web" },
  { text: "¿Cuál es el país más poblado del mundo?", options: ["China", "India", "Estados Unidos", "Indonesia"], answer: "China" },
  { text: "¿Quién inventó la bombilla?", options: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Benjamin Franklin"], answer: "Thomas Edison" },
  { text: "¿Cuál es el símbolo químico del oro?", options: ["Au", "Ag", "Fe", "Cu"], answer: "Au" },
  { text: "¿En qué año terminó la Segunda Guerra Mundial?", options: ["1945", "1939", "1950", "1940"], answer: "1945" },
  { text: "¿Cuál es la capital de Italia?", options: ["Roma", "Milán", "Venecia", "Florencia"], answer: "Roma" },
  { text: "¿Qué fruta es conocida como la reina de las frutas?", options: ["Mango", "Piña", "Manzana", "Plátano"], answer: "Mango" },
  { text: "¿Quién fue el primer hombre en orbitar la Tierra?", options: ["Yuri Gagarin", "Neil Armstrong", "John Glenn", "Alan Shepard"], answer: "Yuri Gagarin" },
  { text: "¿Cuál es el desierto más grande del mundo?", options: ["Sahara", "Gobi", "Kalahari", "Atacama"], answer: "Sahara" },
  { text: "¿Qué deporte se juega en Wimbledon?", options: ["Tenis", "Fútbol", "Baloncesto", "Golf"], answer: "Tenis" },
  { text: "¿Cuál es el hueso más largo del cuerpo humano?", options: ["Fémur", "Tibia", "Húmero", "Radio"], answer: "Fémur" },
  { text: "¿Quién escribió Romeo y Julieta?", options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"], answer: "William Shakespeare" },
  { text: "¿Cuál es la capital de México?", options: ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla"], answer: "Ciudad de México" },
  { text: "¿Qué gas es responsable del efecto invernadero?", options: ["Dióxido de carbono", "Oxígeno", "Nitrógeno", "Hidrógeno"], answer: "Dióxido de carbono" },
  { text: "¿En qué continente está Australia?", options: ["Oceanía", "Asia", "Europa", "África"], answer: "Oceanía" },
  { text: "¿Cuál es el libro sagrado del Islam?", options: ["Corán", "Biblia", "Torah", "Vedas"], answer: "Corán" },
  { text: "¿Quién fue el primer emperador romano?", options: ["Augusto", "Julio César", "Nerón", "Trajano"], answer: "Augusto" },
  { text: "¿Cuál es el metal más abundante en la corteza terrestre?", options: ["Aluminio", "Hierro", "Cobre", "Zinc"], answer: "Aluminio" },
  { text: "¿Qué significa FIFA?", options: ["Fédération Internationale de Football Association", "Federation of International Football Associations", "Football International Federation Association", "International Football Federation Association"], answer: "Fédération Internationale de Football Association" },
  { text: "¿Cuál es la capital de Argentina?", options: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"], answer: "Buenos Aires" },
  { text: "¿Quién descubrió la penicilina?", options: ["Alexander Fleming", "Louis Pasteur", "Robert Koch", "Edward Jenner"], answer: "Alexander Fleming" },
  { text: "¿Cuál es el país más pequeño del mundo?", options: ["Vaticano", "Mónaco", "San Marino", "Liechtenstein"], answer: "Vaticano" },
  { text: "¿Qué instrumento mide la presión atmosférica?", options: ["Barómetro", "Termómetro", "Higrómetro", "Anemómetro"], answer: "Barómetro" },
  { text: "¿En qué año se fundó Facebook?", options: ["2004", "2006", "2008", "2010"], answer: "2004" },
  { text: "¿Cuál es la capital de Canadá?", options: ["Ottawa", "Toronto", "Vancouver", "Montreal"], answer: "Ottawa" },
  { text: "¿Quién escribió La Odisea?", options: ["Homero", "Virgilio", "Dante", "Ovidio"], answer: "Homero" },
  { text: "¿Cuál es el océano más profundo?", options: ["Pacífico", "Atlántico", "Índico", "Ártico"], answer: "Pacífico" },
  { text: "¿Qué vitamina se obtiene del sol?", options: ["Vitamina D", "Vitamina C", "Vitamina A", "Vitamina B"], answer: "Vitamina D" },
  { text: "¿Cuál es la capital de Colombia?", options: ["Bogotá", "Medellín", "Cali", "Cartagena"], answer: "Bogotá" },
  { text: "¿Quién fue el primer hombre en caminar en la luna?", options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "John Glenn"], answer: "Neil Armstrong" },
  { text: "¿Cuál es el río más largo de Europa?", options: ["Volga", "Danubio", "Rin", "Sena"], answer: "Volga" },
  { text: "¿Qué significa ONU?", options: ["Organización de las Naciones Unidas", "Organización Nacional Unida", "Naciones Unidas Organización", "United Nations Organization"], answer: "Organización de las Naciones Unidas" },
  { text: "¿Cuál es la capital de Chile?", options: ["Santiago", "Valparaíso", "Concepción", "Antofagasta"], answer: "Santiago" },
  { text: "¿Quién inventó el teléfono?", options: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"], answer: "Alexander Graham Bell" },
  { text: "¿Cuál es el país más grande del mundo por área?", options: ["Rusia", "Canadá", "China", "Estados Unidos"], answer: "Rusia" },
  { text: "¿Qué significa GPS?", options: ["Global Positioning System", "Global Position Satellite", "Geographic Positioning System", "General Positioning System"], answer: "Global Positioning System" },
];

const shuffledQuestions = ref([...questions].sort(() => Math.random() - 0.5).slice(0, levels.length))

const currentQuestion = computed(() => shuffledQuestions.value[currentStep.value])
const visibleOptions = ref([...currentQuestion.value.options.map((opt, index) => ({ letter: ['A','B','C','D'][index], text: opt }))])
const audienceVotes = ref(null)
const timeLeft = ref(30)
const timerId = ref(null)
const selectedAnswer = ref(null)
const showResults = ref(false)

const checkAnswer = (choice) => {
  selectedAnswer.value = choice
  showResults.value = true
  // Stop the timer
  if (timerId.value) clearInterval(timerId.value)
  // Wait 2 seconds to show results, then proceed
  setTimeout(() => {
    if (choice === currentQuestion.value.answer) {
      if (currentStep.value === shuffledQuestions.value.length - 1) finish(levels[currentStep.value])
      else {
        currentStep.value++
        visibleOptions.value = [...currentQuestion.value.options]
        audienceVotes.value = null
        selectedAnswer.value = null
        showResults.value = false
        startTimer()
      }
    } else {
      finish(currentStep.value > 0 ? levels[currentStep.value - 1] : 0)
    }
  }, 2000)
}

const finish = (prize) => {
  localStorage.setItem('last_score', prize)
  router.push('/score')
}

const lifelines = ref({
  fiftyFifty: true,      // Disponible inicialmente,  50/50
  audienceHelp: true,    // Disponible inicialmente, ayuda del público
  changeQuestion: true   // Disponible inicialmente, cambiar pregunta
});

const useFiftyFifty = () => {
  if (!lifelines.fiftyFifty) return;
  lifelines.fiftyFifty = false;  // Marcar como usado
  const incorrectOptions = visibleOptions.value.filter(opt => opt.text !== currentQuestion.value.answer);
  // Eliminar aleatoriamente dos opciones incorrectas
  const shuffledIncorrect = [...incorrectOptions].sort(() => Math.random() - 0.5);
  const toRemove = shuffledIncorrect.slice(0, 2);
  visibleOptions.value = visibleOptions.value.filter(opt => !toRemove.some(removeOpt => removeOpt.text === opt.text));
};

const useAudienceHelp = () => {
  if (!lifelines.audienceHelp) return;
  lifelines.audienceHelp = false;  // Marcar como usado
  const correctIndex = visibleOptions.value.indexOf(currentQuestion.value.answer);
  const votes = [10, 10, 10, 10]; // base 10% cada una
  votes[correctIndex] += 60; // El público favorece la respuesta correcta
  audienceVotes.value = votes;
};

const startTimer = () => {
  if (timerId.value) clearInterval(timerId.value)
  timeLeft.value = 30
  timerId.value = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timerId.value)
      timeout()
    }
  }, 1000)
}

const timeout = () => {
  finish(currentStep.value > 0 ? levels[currentStep.value - 1] : 0)
}

const useChangeQuestion = () => {
  if (!lifelines.changeQuestion) return;
  lifelines.changeQuestion = false;
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * shuffledQuestions.value.length);
  } while (newIndex === currentStep.value);
  currentStep.value = newIndex;
  visibleOptions.value = [...currentQuestion.value.options.map((opt, index) => ({ letter: ['A','B','C','D'][index], text: opt }))]
  audienceVotes.value = null;
  startTimer()
};

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timerId.value) clearInterval(timerId.value)
})

const getButtonColor = (opt) => {
  if (!showResults.value) return 'blue-4'
  if (opt === currentQuestion.value.answer) return 'green'
  if (opt === selectedAnswer.value) return 'red'
  return 'blue-4'
}

watch(currentStep, () => {
  startTimer()
})

</script>

<style scoped>
.border-blue { border: 4px solid #2196f3; border-radius: 50px; }
.btn-game { border-radius: 15px; text-transform: none; }
.btn-large {
  height: 100px;
  font-size: 28px;
  border-radius: 20px;
}
.btn-game-large {
  height: 120px;
  font-size: 32px;
  border-radius: 25px;
}
</style>
