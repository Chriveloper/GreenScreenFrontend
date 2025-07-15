<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-sky-600">Dashboard</h1>
      <div class="flex items-center bg-white rounded-lg shadow px-4 py-2 border-t-4 border-yellow-400">
        <span class="text-2xl mr-2">🐚</span>
        <span class="text-lg font-bold text-yellow-600">{{ playerPearls }}</span>
        <span class="text-sm text-gray-600 ml-1">Pearls</span>
      </div>
    </div>
    
    <!-- Featured Aquarium Section -->
    <div class="bg-gradient-to-b from-sky-300 to-sky-500 rounded-full shadow-lg p-8 mb-8 min-h-[300px] max-w-[400px] mx-auto relative overflow-hidden aspect-square">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-xl font-bold text-white">Agua</h2>
        <NuxtLink to="/terrarium" class="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm transition">
          View Full Aquarium
        </NuxtLink>
      </div>
      
      <!-- Fish swimming in the aquarium -->
      <div class="absolute top-16 left-1/4 animate-pulse">
        <div class="w-6 h-4 bg-orange-400 rounded-full relative">
          <div class="absolute -right-1 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-2 border-l-orange-400 border-t-1 border-t-transparent border-b-1 border-b-transparent"></div>
        </div>
      </div>
      
      <div class="absolute top-24 right-1/3 animate-pulse" style="animation-delay: 1s;">
        <div class="w-5 h-3 bg-yellow-300 rounded-full relative">
          <div class="absolute -right-1 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-2 border-l-yellow-300 border-t-1 border-t-transparent border-b-1 border-b-transparent"></div>
        </div>
      </div>

      <div class="absolute top-20 left-1/2 animate-pulse" style="animation-delay: 2s;">
        <div class="w-4 h-3 bg-purple-400 rounded-full relative">
          <div class="absolute -right-1 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-2 border-l-purple-400 border-t-1 border-t-transparent border-b-1 border-b-transparent"></div>
        </div>
      </div>

      <!-- Coral and sea plants -->
      <div class="absolute bottom-8 left-1/5">
        <div class="w-12 h-16 bg-pink-400 rounded-t-full relative">
          <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-5 bg-pink-300 rounded-full"></div>
        </div>
      </div>
      
      <div class="absolute bottom-8 right-1/5">
        <div class="w-8 h-12 bg-green-400 rounded-t-full relative">
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-10 h-5 bg-green-300 rounded-full"></div>
        </div>
      </div>

      <!-- Bubbles -->
      <div class="absolute bottom-12 left-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-70 animate-bounce"></div>
      <div class="absolute bottom-16 left-1/2 w-1 h-1 bg-white rounded-full opacity-50 animate-bounce" style="animation-delay: 0.5s;"></div>
      
      <!-- Sand/gravel bottom -->
      <div class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-b-full"></div>
      
      <!-- Progress indicator overlay -->
      <div class="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3">
        <p class="text-xs font-medium text-gray-700 mb-1">Next Fish Progress</p>
        <div class="w-32 bg-gray-200 rounded-full h-2">
          <div class="bg-sky-500 h-2 rounded-full" style="width: 65%"></div>
        </div>
        <p class="text-xs text-gray-600 mt-1">2 more sessions to unlock!</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Stats Card -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-sky-400">
        <h2 class="text-lg font-semibold mb-4 text-sky-700">Focus Stats</h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Sessions Today</span>
            <span class="text-2xl font-bold text-sky-500">3</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total Hours</span>
            <span class="text-2xl font-bold text-sky-500">5.4</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Pearls Earned</span>
            <span class="text-2xl font-bold text-yellow-500">{{ totalPearlsEarned }}</span>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-sky-400">
        <h2 class="text-lg font-semibold mb-4 text-sky-700">Recent Activity</h2>
        <ul class="space-y-3">
          <li class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-sm">Completed 25-min focus session</span>
          </li>
          <li class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span class="text-sm">Earned 25 pearls</span>
          </li>
          <li class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-sky-500 rounded-full"></div>
            <span class="text-sm">Added Clownfish to aquarium</span>
          </li>
        </ul>
      </div>

      <!-- Quick Fish Collection Preview -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-sky-400">
        <h2 class="text-lg font-semibold mb-4 text-sky-700">Fish Collection</h2>
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg p-2 text-center">
            <div class="w-8 h-8 bg-orange-400 rounded-full mx-auto mb-1"></div>
            <p class="text-xs text-gray-600">Goldfish</p>
          </div>
          <div class="bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg p-2 text-center">
            <div class="w-8 h-8 bg-yellow-300 rounded-full mx-auto mb-1"></div>
            <p class="text-xs text-gray-600">Angelfish</p>
          </div>
          <div class="bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg p-2 text-center">
            <div class="w-8 h-8 bg-purple-400 rounded-full mx-auto mb-1"></div>
            <p class="text-xs text-gray-600">Gramma</p>
          </div>
        </div>
        <NuxtLink to="/shop" class="block text-center text-sky-600 hover:text-sky-700 text-sm mt-3 font-medium">
          Visit Shop →
        </NuxtLink>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NuxtLink to="/focus" class="block bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 px-6 rounded-lg text-center transition transform hover:scale-105">
        🎯 Start Focus Session
      </NuxtLink>
      <NuxtLink to="/shop" class="block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg text-center transition transform hover:scale-105">
        🛒 Visit Shop
      </NuxtLink>
      <NuxtLink to="/terrarium" class="block bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-6 rounded-lg text-center transition transform hover:scale-105">
        🐠 Visit Aquarium
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

// Use computed properties to access store data
const playerPearls = computed(() => userStore.pearls);
const totalPearlsEarned = computed(() => userStore.pearls); // This should be a proper calculation from focus sessions

// Check if we need to load user data
onMounted(async () => {
  if (userStore.isLoggedIn && !userStore.userProfile) {
    await userStore.loadUserProfile();
  }
});
</script>