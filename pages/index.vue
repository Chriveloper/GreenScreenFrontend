<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-blue-600 mb-6">Dashboard</h1>
    
    <!-- Featured Aquarium Section -->
    <div class="bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 mb-8 min-h-[300px] relative overflow-hidden">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-xl font-bold text-white">Your Aquarium</h2>
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
      <div class="absolute bottom-4 left-1/5">
        <div class="w-12 h-16 bg-pink-400 rounded-t-full relative">
          <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-5 bg-pink-300 rounded-full"></div>
        </div>
      </div>
      
      <div class="absolute bottom-4 right-1/5">
        <div class="w-8 h-12 bg-green-400 rounded-t-full relative">
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-10 h-5 bg-green-300 rounded-full"></div>
        </div>
      </div>

      <!-- Bubbles -->
      <div class="absolute bottom-6 left-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-70 animate-bounce"></div>
      <div class="absolute bottom-8 left-1/2 w-1 h-1 bg-white rounded-full opacity-50 animate-bounce" style="animation-delay: 0.5s;"></div>
      
      <!-- Sand/gravel bottom -->
      <div class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-b-lg"></div>
      
      <!-- Progress indicator overlay -->
      <div class="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3">
        <p class="text-xs font-medium text-gray-700 mb-1">Next Fish Progress</p>
        <div class="w-32 bg-gray-200 rounded-full h-2">
          <div class="bg-green-500 h-2 rounded-full" style="width: 65%"></div>
        </div>
        <p class="text-xs text-gray-600 mt-1">2 more sessions to unlock!</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Stats Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Focus Stats</h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Sessions Today</span>
            <span class="text-2xl font-bold text-blue-500">3</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total Hours</span>
            <span class="text-2xl font-bold text-blue-500">5.4</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Fish Earned</span>
            <span class="text-2xl font-bold text-blue-500">6</span>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul class="space-y-3">
          <li class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-sm">Completed 25-min focus session</span>
          </li>
          <li class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-sm">Added Clownfish to aquarium</span>
          </li>
          <li class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span class="text-sm">Set new focus goal</span>
          </li>
        </ul>
      </div>

      <!-- Quick Fish Collection Preview -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Fish Collection</h2>
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg p-2 text-center">
            <div class="w-8 h-8 bg-orange-400 rounded-full mx-auto mb-1"></div>
            <p class="text-xs text-gray-600">Goldfish</p>
          </div>
          <div class="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-2 text-center">
            <div class="w-8 h-8 bg-yellow-300 rounded-full mx-auto mb-1"></div>
            <p class="text-xs text-gray-600">Angelfish</p>
          </div>
          <div class="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-2 text-center">
            <div class="w-8 h-8 bg-purple-400 rounded-full mx-auto mb-1"></div>
            <p class="text-xs text-gray-600">Gramma</p>
          </div>
        </div>
        <NuxtLink to="/terrarium" class="block text-center text-blue-600 hover:text-blue-700 text-sm mt-3 font-medium">
          View All Fish →
        </NuxtLink>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NuxtLink to="/focus" class="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-center transition transform hover:scale-105">
        🎯 Start Focus Session
      </NuxtLink>
      <NuxtLink to="/terrarium" class="block bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-lg text-center transition transform hover:scale-105">
        🐠 Visit Aquarium
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const { $supabase } = useNuxtApp();

const router = useRouter();

// check for existing session
onMounted(async () => {
  const {data} = await $supabase.auth.getSession();
  if (!data.session) {
    navigateTo('/signup');
  }
});
</script>