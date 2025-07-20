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
        <h2 class="text-xl font-bold text-white">My Aquarium</h2>
        <NuxtLink to="/aquarium" class="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm transition">
          View Full Aquarium
        </NuxtLink>
      </div>
      
      <!-- User's Fish from aquarium layout -->
      <div
        v-for="(fish, index) in previewFish.slice(0, 3)"
        :key="fish.id"
        class="absolute animate-pulse"
        :style="{ 
          left: fish.x + '%', 
          top: fish.y + '%',
          animationDelay: (index * 0.8) + 's'
        }"
      >
        <img 
          :src="fish.img" 
          :alt="fish.name"
          class="w-5 h-4 object-contain"
          style="image-rendering: pixelated;"
        />
      </div>

      <!-- User's Plants from aquarium layout -->
      <div
        v-for="plant in previewPlants.slice(0, 2)"
        :key="plant.id"
        class="absolute"
        :style="{ 
          left: plant.x + '%', 
          top: plant.y + '%',
          transform: 'translate(-50%, -100%)'
        }"
      >
        <img 
          :src="plant.img" 
          :alt="plant.name"
          class="w-8 h-10 object-contain opacity-90"
          style="image-rendering: pixelated;"
        />
      </div>

      <!-- Default decorative elements if no user items -->
      <div v-if="previewFish.length === 0 && previewPlants.length === 0">
        <!-- Default fish -->
        <div class="absolute top-16 left-1/4 animate-pulse">
          <div class="w-6 h-4 bg-orange-400 rounded-full relative">
            <div class="absolute -right-1 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-2 border-l-orange-400 border-t-1 border-t-transparent border-b-1 border-b-transparent"></div>
          </div>
        </div>
        
        <!-- Default coral -->
        <div class="absolute bottom-8 left-1/5">
          <div class="w-8 h-12 bg-pink-400 rounded-t-full relative">
            <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-pink-300 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Bubbles -->
      <div class="absolute bottom-12 left-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-70 animate-bounce"></div>
      <div class="absolute bottom-16 left-1/2 w-1 h-1 bg-white rounded-full opacity-50 animate-bounce" style="animation-delay: 0.5s;"></div>
      
      <!-- Sand/gravel bottom -->
      <div class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-b-full"></div>
      
      <!-- Tank stats overlay -->
      <div class="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3">
        <p class="text-xs font-medium text-gray-700 mb-1">Tank Status</p>
        <div class="flex items-center space-x-2">
          <span class="text-xs text-gray-600">🐠 {{ userFishCount }}</span>
          <span class="text-xs text-gray-600">🌿 {{ userPlantsCount }}</span>
        </div>
        <p class="text-xs text-green-600 mt-1">Health: {{ tankHealth }}%</p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Stats Card -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-sky-400">
        <h2 class="text-lg font-semibold mb-4 text-sky-700">Focus Stats</h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Sessions Today</span>
            <span class="text-2xl font-bold text-sky-500">{{ todaySessions }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total Hours</span>
            <span class="text-2xl font-bold text-sky-500">{{ totalHours }}</span>
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
          <li v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-2">
            <div class="w-2 h-2 rounded-full" :class="activity.color"></div>
            <span class="text-sm">{{ activity.text }}</span>
          </li>
        </ul>
      </div>

      <!-- User's Fish Collection Preview -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-sky-400">
        <h2 class="text-lg font-semibold mb-4 text-sky-700">Fish Collection</h2>
        <div v-if="ownedFish.length > 0" class="grid grid-cols-3 gap-2">
          <div
            v-for="fish in ownedFish.slice(0, 6)"
            :key="fish.id"
            class="bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg p-2 text-center"
          >
            <img 
              :src="fish.img" 
              :alt="fish.name"
              class="w-6 h-5 mx-auto mb-1 object-contain"
              style="image-rendering: pixelated;"
            />
            <p class="text-xs text-gray-600">{{ fish.name }}</p>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-4">
          <p class="text-sm">No fish yet!</p>
          <p class="text-xs">Visit the shop to start your collection</p>
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
      <NuxtLink to="/aquarium" class="block bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-6 rounded-lg text-center transition transform hover:scale-105">
        🐠 Visit Aquarium
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Prevent any server-side rendering issues by deferring all dynamic content
definePageMeta({
  ssr: false, // Disable SSR for this page
});

import { onMounted, ref, computed } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

// Initialize with default values
const playerPearls = ref(0);
const totalPearlsEarned = ref(0);
const todaySessions = ref(0);
const totalHours = ref(0);

// Fish and plant data for preview
const fishData = [
  { id: 'goldfish', name: 'Goldfish', img: '/resources/fish/fish_1.gif' },
  { id: 'angelfish', name: 'Angelfish', img: '/resources/fish/fish_2.gif' },
  { id: 'clownfish', name: 'Clownfish', img: '/resources/fish/fish_3.gif' },
  { id: 'blue_tang', name: 'Blue Tang', img: '/resources/fish/fish_4.gif' },
  { id: 'royal_gramma', name: 'Royal Gramma', img: '/resources/fish/fish_5.gif' },
];

const plantData = [
  { id: 'plant1', name: 'Java Moss', img: '/resources/plants/plant_1.png' },
  { id: 'plant2', name: 'Amazon Sword', img: '/resources/plants/plant_2.png' },
  { id: 'plant3', name: 'Anubias', img: '/resources/plants/plant_3.png' },
  { id: 'plant4', name: 'Water Wisteria', img: '/resources/plants/plant_4.png' },
  { id: 'plant5', name: 'Hornwort', img: '/resources/plants/plant_5.png' },
];

// Computed properties for user data
const ownedFish = computed(() => {
  return fishData.filter(fish => (userStore.fish || []).includes(fish.id));
});

const previewFish = computed(() => {
  const layout = userStore.aquariumLayout;
  if (layout && layout.fish) {
    return layout.fish.map(savedFish => {
      const fishTemplate = fishData.find(f => f.id === savedFish.id);
      return {
        ...fishTemplate,
        x: savedFish.swimX || 30,
        y: savedFish.swimY || 40,
        id: savedFish.id
      };
    }).filter(fish => fish.name);
  }
  return [];
});

const previewPlants = computed(() => {
  const layout = userStore.aquariumLayout;
  if (layout && layout.plants) {
    return layout.plants.map(plant => {
      const plantTemplate = plantData.find(p => p.id === plant.plantId);
      return {
        ...plant,
        img: plantTemplate?.img || plant.img,
        name: plantTemplate?.name || plant.name
      };
    });
  }
  return [];
});

const userFishCount = computed(() => previewFish.value.length);
const userPlantsCount = computed(() => previewPlants.value.length);

const tankHealth = computed(() => {
  const fishCount = userFishCount.value;
  const plantCount = userPlantsCount.value;
  
  if (fishCount === 0) return 100;
  const ratio = plantCount / fishCount;
  return Math.min(100, Math.max(60, Math.round(75 + (ratio * 25))));
});

const recentActivities = ref([
  { id: 1, color: 'bg-green-500', text: 'Completed 25-min focus session' },
  { id: 2, color: 'bg-yellow-500', text: 'Earned 25 pearls' },
  { id: 3, color: 'bg-sky-500', text: 'Added new fish to aquarium' },
]);

onMounted(async () => {
  try {
    // Only access user store on client after mounting
    if (userStore.isLoggedIn && !userStore.userProfile) {
      await userStore.loadUserProfile();
    }
    // Update reactive refs after mounting
    playerPearls.value = userStore.pearls;
    totalPearlsEarned.value = userStore.pearls;
    
    // TODO: Load actual session data from database
    todaySessions.value = 3;
    totalHours.value = 5.4;
  } catch (error) {
    console.error('Error loading user data on index page:', error);
    // Keep default values on error
    playerPearls.value = 0;
    totalPearlsEarned.value = 0;
  }
});
</script>