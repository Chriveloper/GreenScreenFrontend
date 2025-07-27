<template>
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Focus Timer -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-sky-700">Focus Timer</h2>
          <div class="flex items-center bg-white rounded-lg shadow px-4 py-2 border-t-4 border-yellow-400">
            <span class="text-2xl mr-2">🦪</span>
            <span class="text-lg font-bold text-yellow-600">{{ playerPearls }}</span>
            <span class="text-sm text-gray-600 ml-1">Pearls</span>
          </div>
        </div>

        <!-- Timer Display -->
        <div class="relative w-48 h-48 mx-auto mb-6">
          <svg class="w-full h-full" viewBox="0 0 100 100">
            <circle class="text-gray-200" stroke-width="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
            <circle
                class="text-sky-600 transition-all duration-1000"
                stroke-width="8"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="progressOffset"
                stroke-linecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <p class="text-3xl font-bold text-sky-700">{{ displayTime }}</p>
              <p class="text-sm text-gray-500">{{ isBreak ? 'Break' : 'Focus' }}</p>
            </div>
          </div>
        </div>

        <!-- Duration Buttons -->
        <div class="mb-4">
          <h3 class="text-center text-gray-600 mb-3">Select Focus Duration</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button :disabled="isRunning" class="p-3 rounded-lg transition" :class="focusSelection === 15 ? 'bg-sky-100 border border-sky-500' : 'bg-gray-100 hover:bg-gray-200'" @click="setFocusTime(15)">
              <div class="font-bold text-sky-700">15 min</div>
              <div class="text-xs text-yellow-600">{{ calculatePearlReward(15) }} pearls</div>
            </button>
            <button :disabled="isRunning" class="p-3 rounded-lg transition" :class="focusSelection === 25 ? 'bg-sky-100 border border-sky-500' : 'bg-gray-100 hover:bg-gray-200'" @click="setFocusTime(25)">
              <div class="font-bold text-sky-700">25 min</div>
              <div class="text-xs text-yellow-600">{{ calculatePearlReward(25) }} pearls</div>
            </button>
            <button :disabled="isRunning" class="p-3 rounded-lg transition" :class="focusSelection === 45 ? 'bg-sky-100 border border-sky-500' : 'bg-gray-100 hover:bg-gray-200'" @click="setFocusTime(45)">
              <div class="font-bold text-sky-700">45 min</div>
              <div class="text-xs text-yellow-600">{{ calculatePearlReward(45) }} pearls</div>
            </button>
            <button :disabled="isRunning" class="p-3 rounded-lg transition" :class="focusSelection === 'custom' ? 'bg-sky-100 border border-sky-500' : 'bg-gray-100 hover:bg-gray-200'" @click="setFocusTime('custom')">
              <div class="font-bold text-sky-700">Custom</div>
              <div class="text-xs text-gray-500">Enter time</div>
            </button>
          </div>
        </div>

        <!-- Custom Input -->
        <div v-if="focusSelection === 'custom'" class="mb-6">
          <label for="custom-minutes" class="block text-sm font-medium text-gray-700 text-center">Custom Minutes</label>
          <div class="mt-1 relative rounded-md shadow-sm w-48 mx-auto">
            <input id="custom-minutes" v-model.number="customMinutes" type="number" :disabled="isRunning" class="w-full text-center p-2 border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., 10" min="1" max="180" />
          </div>
          <p v-if="customMinutes > 0" class="text-center text-xs text-yellow-600 mt-2">
            Reward: {{ calculatePearlReward(customMinutes) }} pearls
          </p>
        </div>

        <!-- Session Goal -->
        <div class="mb-6">
          <label for="session-goal" class="block text-sm font-medium text-gray-700 mb-2">Session Goal (optional)</label>
          <input id="session-goal" v-model="sessionGoal" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" :disabled="isRunning" />
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center space-x-4">
          <button class="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition" @click="resetTimer">
            Reset
          </button>
          <button class="w-20 h-20 rounded-full text-white font-bold text-lg transition flex items-center justify-center" :class="isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-sky-600 hover:bg-sky-700'" @click="isRunning ? pauseTimer() : startTimer()">
            {{ isRunning ? 'PAUSE' : 'START' }}
          </button>
        </div>
      </div>

      <!-- Completion Modal -->
      <div v-if="showCompletionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold mb-4 text-sky-600">Session Complete!</h3>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div class="flex items-center justify-center mb-2">
              <span class="text-3xl mr-2">🦪</span>
              <span class="text-2xl font-bold text-yellow-600">+{{ lastPearlReward }}</span>
            </div>
            <p class="text-sm text-yellow-700">Pearls earned for your focus!</p>
            <p class="text-xs text-gray-500 mt-1">
              ({{ completedSessionMinutes }} minutes) → {{ calculatePearlReward(completedSessionMinutes) }} pearls
            </p>
          </div>
          <div class="flex space-x-4">
            <button class="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md font-medium" @click="closeCompletionModal">
              Continue
            </button>
            <router-link to="/shop" class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium text-center" @click="closeCompletionModal">
              Visit Shop
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

const calculatePearlReward = (minutes) => Math.round(minutes * 5);

const focusSelection = ref(25);
const customMinutes = ref(10);
const focusMinutes = ref(25);
const breakMinutes = ref(5);
const timeLeft = ref(25 * 60);
const isRunning = ref(false);
const isBreak = ref(false);
const sessionGoal = ref('');
const timerInterval = ref(null);

const showCompletionModal = ref(false);
const lastPearlReward = ref(0);
const completedSessionMinutes = ref(0);

const playerPearls = computed(() => userStore.pearls);

const activeMinutes = computed(() => focusSelection.value === 'custom' ? Math.max(1, customMinutes.value || 1) : focusSelection.value);

const displayTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const circumference = 2 * Math.PI * 45;
const progressOffset = computed(() => {
  const totalSeconds = activeMinutes.value * 60;
  const percentage = (totalSeconds - timeLeft.value) / totalSeconds;
  return circumference * (1 - percentage);
});

watch(customMinutes, (newVal) => {
  if (focusSelection.value === 'custom' && !isRunning.value) {
    timeLeft.value = Math.max(1, newVal || 1) * 60;
    focusMinutes.value = Math.max(1, newVal || 1);
  }
});

const setFocusTime = (selection) => {
  if (isRunning.value) return;
  focusSelection.value = selection;
  const minutes = selection === 'custom' ? Math.max(1, customMinutes.value || 1) : selection;
  timeLeft.value = minutes * 60;
  focusMinutes.value = minutes;
};

const startTimer = () => {
  if (isRunning.value || activeMinutes.value <= 0) return;
  isRunning.value = true;
  timerInterval.value = setInterval(async () => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      await completeTimer();
    }
  }, 1000);
};

const completeTimer = async () => {
  clearInterval(timerInterval.value);
  isRunning.value = false;
  if (isBreak.value) {
    isBreak.value = false;
    timeLeft.value = focusMinutes.value * 60;
  } else {
    const reward = calculatePearlReward(activeMinutes.value);
    lastPearlReward.value = reward;
    completedSessionMinutes.value = activeMinutes.value;
    await userStore.addFocusSession(activeMinutes.value, reward);
    showCompletionModal.value = true;
    if (focusSelection.value !== 'custom') {
      isBreak.value = true;
      timeLeft.value = breakMinutes.value * 60;
    } else {
      resetTimer(false);
    }
  }
};

const pauseTimer = () => {
  isRunning.value = false;
  clearInterval(timerInterval.value);
};

const resetTimer = (changeDuration = true) => {
  pauseTimer();
  isBreak.value = false;
  if (changeDuration) {
    focusSelection.value = 25;
    focusMinutes.value = 25;
    timeLeft.value = 25 * 60;
  } else {
    timeLeft.value = activeMinutes.value * 60;
  }
};

const closeCompletionModal = () => {
  showCompletionModal.value = false;
};

const handleVisibilityChange = () => {
  if (document.visibilityState === 'hidden' && isRunning.value) {
    pauseTimer();
    console.log('Timer paused because app is not visible');
  } else if (document.visibilityState === 'visible' && !isRunning.value && timeLeft.value > 0) {
    startTimer();
    console.log('Timer resumed because app is visible');
  }
};

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  if (timerInterval.value) clearInterval(timerInterval.value);
});
</script>
