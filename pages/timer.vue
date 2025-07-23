<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-sky-600">Focus Timer</h1>
      <div class="flex items-center bg-white rounded-lg shadow px-4 py-2 border-t-4 border-yellow-400">
        <span class="text-2xl mr-2">🦪</span>
        <span class="text-lg font-bold text-yellow-600">{{ playerPearls }}</span>
        <span class="text-sm text-gray-600 ml-1">Pearls</span>
      </div>
    </div>

    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
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
          <span class="text-4xl font-bold text-sky-800">{{ displayTime }}</span>
        </div>
      </div>

      <!-- Duration Selection -->
      <div class="mb-4">
        <h3 class="text-center text-gray-600 mb-3">Select Focus Duration</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            :disabled="isRunning"
            class="p-3 rounded-lg transition"
            :class="focusSelection === 15 ? 'bg-sky-100 border border-sky-500' : 'bg-gray-100 hover:bg-gray-200'"
            @click="setFocusTime(15)"
          >
            <div class="font-bold text-sky-700">15 min</div>
            <div class="text-xs text-yellow-600">{{ 15**2 }} pearls</div>
          </button>
          <button
            :disabled="isRunning"
            class="p-3 rounded-lg transition"
            :class="focusSelection === 25 ? 'bg-sky-100 border border-sky-500' : 'bg-gray-100 hover:bg-gray-200'"
            @click="setFocusTime(25)"
          >
            <div class="font-bold text-sky-700">25 min</div>
            <div class="text-xs text-yellow-600">{{ 25**2 }} pearls</div>
          </button>
          <button
            :disabled="isRunning"
            class="p-3 rounded-lg transition"
            :class="focusSelection === 45 ? 'bg-sky-100 border border-sky-500' : 'bg-gray-100 hover:bg-gray-200'"
            @click="setFocusTime(45)"
          >
            <div class="font-bold text-sky-700">45 min</div>
            <div class="text-xs text-yellow-600">{{ 45**2 }} pearls</div>
          </button>
          <button
            :disabled="isRunning"
            class="p-3 rounded-lg transition"
            :class="focusSelection === 'custom' ? 'bg-sky-100 border border-sky-500' : 'bg-gray-100 hover:bg-gray-200'"
            @click="setFocusTime('custom')"
          >
            <div class="font-bold text-sky-700">Custom</div>
            <div class="text-xs text-gray-500">Enter time</div>
          </button>
        </div>
      </div>

      <!-- Custom Time Input -->
      <div v-if="focusSelection === 'custom'" class="mb-6">
        <label for="custom-minutes" class="block text-sm font-medium text-gray-700 text-center">Custom Minutes</label>
        <div class="mt-1 relative rounded-md shadow-sm w-48 mx-auto">
          <input
            id="custom-minutes"
            v-model.number="customMinutes"
            type="number"
            name="custom-minutes"
            :disabled="isRunning"
            class="w-full text-center p-2 border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
            placeholder="e.g., 10"
            min="1"
            max="180"
          />
        </div>
        <p v-if="customMinutes > 0" class="text-center text-xs text-yellow-600 mt-2">
          Reward: {{ customMinutes**2 }} pearls
        </p>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-center space-x-4">
        <button class="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition" @click="resetTimer">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5M20 20v-5h-5"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 9a9 9 0 0114.13-5.12M20 15a9 9 0 01-14.13 5.12"></path></svg>
        </button>
        <button
          class="w-20 h-20 rounded-full text-white font-bold text-lg transition flex items-center justify-center"
          :class="isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-sky-600 hover:bg-sky-700'"
          @click="isRunning ? pauseTimer() : startTimer()"
        >
          {{ isRunning ? 'PAUSE' : 'START' }}
        </button>
        <button class="p-3 rounded-full bg-gray-200 invisible">
           <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 17.364a5 5 0 010-7.072m2.828 9.9a9 9 0 010-12.728"></path></svg>
        </button>
      </div>
    </div>

    <!-- Session Complete Modal -->
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
            ({{ completedSessionMinutes }} minutes)² = {{ lastPearlReward }} pearls
          </p>
        </div>
        <div class="flex space-x-4">
          <button class="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md font-medium" @click="closeCompletionModal">
            Continue
          </button>
          <NuxtLink to="/shop" class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium text-center" @click="closeCompletionModal">
            Visit Shop
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

// State
const focusSelection = ref(25); // 15, 25, 45, or 'custom'
const customMinutes = ref(10);
const timeLeft = ref(25 * 60);
const isRunning = ref(false);
let timerInterval = null;

// Modal State
const showCompletionModal = ref(false);
const lastPearlReward = ref(0);
const completedSessionMinutes = ref(0);

// Debug Mode
const debugMode = ref(false); // Set to true for fast testing

// Computed Properties
const playerPearls = computed(() => userStore.pearls);
const activeMinutes = computed(() => {
  if (focusSelection.value === 'custom') {
    return Math.max(1, customMinutes.value || 1); // Ensure at least 1 minute
  }
  return focusSelection.value;
});

const displayTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const circumference = 2 * Math.PI * 45;
const progressOffset = computed(() => {
  const totalSeconds = activeMinutes.value * 60;
  if (totalSeconds === 0) return circumference;
  const percentage = (totalSeconds - timeLeft.value) / totalSeconds;
  return circumference * (1 - percentage);
});

// Watch for changes in custom minutes to update the timer
watch(customMinutes, (newVal) => {
  if (focusSelection.value === 'custom' && !isRunning.value) {
    timeLeft.value = Math.max(1, newVal || 1) * 60;
  }
});

// Methods
const setFocusTime = (selection) => {
  if (isRunning.value) return;
  focusSelection.value = selection;
  timeLeft.value = activeMinutes.value * 60;
};

const calculatePearlReward = () => {
  return Math.round(Math.pow(activeMinutes.value, 2));
};

const refreshUserData = async () => {
  console.log('Refreshing user data...');
  await userStore.loadUserProfile();
  console.log('User data refreshed. Current pearls:', userStore.pearls);
};

const startTimer = async () => {
  if (isRunning.value || activeMinutes.value <= 0) return;
  isRunning.value = true;
  
  // For debugging - finish immediately
  if (debugMode.value) {
    console.log("DEBUG MODE: Completing timer immediately");
    completeTimer();
    return;
  }
  
  timerInterval = setInterval(async () => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      await completeTimer();
    }
  }, 1000);
};

// Extract timer completion logic to a separate function
const completeTimer = async () => {
  clearInterval(timerInterval);
  isRunning.value = false;
  
  // Session Complete Logic
  const pearlReward = calculatePearlReward();
  console.log(`Timer completed! Calculated reward: ${pearlReward} pearls for ${activeMinutes.value} minutes`);
  
  lastPearlReward.value = pearlReward;
  completedSessionMinutes.value = activeMinutes.value;
  
  // Add better error handling and feedback
  try {
    const success = await userStore.addFocusSession(activeMinutes.value, pearlReward);
    if (success) {
      console.log(`Successfully added ${pearlReward} pearls to account.`);
      // Force refresh user data
      await refreshUserData();
    } else {
      console.error('Failed to add focus session rewards');
    }
  } catch (error) {
    console.error('Error while adding focus session:', error);
  }
  
  showCompletionModal.value = true;
  resetTimer(false); // Reset without changing duration
};

const pauseTimer = () => {
  isRunning.value = false;
  clearInterval(timerInterval);
};

const resetTimer = (changeDuration = true) => {
  pauseTimer();
  if (changeDuration) {
    focusSelection.value = 25;
  }
  timeLeft.value = focusSelection.value * 60;
};

const closeCompletionModal = () => {
  showCompletionModal.value = false;
};

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>