<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-sky-600">Dashboard</h1>
      <div class="flex items-center bg-white rounded-lg shadow px-4 py-2 border-t-4 border-yellow-400">
        <span class="text-2xl mr-2">🦪</span>
        <span class="text-lg font-bold text-yellow-600">{{ playerPearls }}</span>
        <span class="text-sm text-gray-600 ml-1">Pearls</span>
      </div>
    </div>
    
    <!-- Featured Aquarium Section -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-sky-400">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">My Aquarium</h2>
        <NuxtLink to="/aquarium" class="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm transition font-medium">
          View Aquarium →
        </NuxtLink>
      </div>
      
      <!-- Aquarium Tank Preview -->
      <div 
        class="rounded-lg shadow-inner p-4 h-48 sm:h-64 relative overflow-hidden pixelated-bg"
        :style="getAquariumPreviewStyle()"
      >
        <!-- Water overlay effect -->
        <div class="absolute inset-0 bg-blue-400 bg-opacity-30 rounded-lg"></div>
        
        <!-- Floor -->
        <div 
          class="absolute bottom-0 left-0 right-0 h-8 sm:h-12 rounded-b-lg pixelated-bg"
          :style="getFloorPreviewStyle()"
        ></div>
        
        <!-- Tank frame overlay -->
        <div 
          v-if="getFramePreviewStyle()"
          class="absolute inset-0 pointer-events-none z-40 pixelated-bg"
          :style="getFramePreviewStyle()"
        ></div>
        
        <!-- User's Plants from aquarium layout -->
        <div
          v-for="plant in previewPlants.slice(0, 3)"
          :key="plant.id"
          class="absolute z-20"
          :style="{ 
            left: plant.x + '%', 
            bottom: (plant.bottomOffset || 0) + 'px',
            transform: 'translateX(-50%)'
          }"
        >
          <img 
            :src="plant.img" 
            :alt="plant.name"
            class="w-6 h-8 sm:w-8 sm:h-12 object-contain opacity-90 pixelated"
          />
        </div>

        <!-- User's Fish from aquarium layout -->
        <div
          v-for="(fish, index) in previewFish.slice(0, 3)"
          :key="fish.id + (fish.instanceIndex || 0)"
          class="absolute animate-pulse z-15"
          :style="{ 
            left: (fish.swimX || fish.x) + '%', 
            top: (fish.swimY || fish.y) + '%',
            transform: `translate(-50%, -50%) ${fish.direction === 'left' ? 'scaleX(-1)' : ''}`,
            animationDelay: (index * 0.5) + 's'
          }"
        >
          <img 
            :src="fish.img" 
            :alt="fish.name"
            class="w-6 h-5 sm:w-8 sm:h-6 object-contain animate-pulse pixelated"
          />
        </div>

        <!-- Default decorative elements if no user items -->
        <div v-if="previewFish.length === 0 && previewPlants.length === 0" class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="text-4xl sm:text-6xl mb-2">🐠</div>
            <p class="text-white font-medium text-sm sm:text-base">Your aquarium is empty</p>
            <p class="text-white/80 text-xs sm:text-sm">Visit the shop to add fish and plants!</p>
          </div>
        </div>

        <!-- Animated Bubbles -->
        <div class="absolute bottom-12 sm:bottom-16 left-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full opacity-60 animate-bounce" style="animation-duration: 3s;"></div>
        <div class="absolute bottom-14 sm:bottom-20 left-1/3 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full opacity-70 animate-bounce" style="animation-delay: 1s; animation-duration: 2.5s;"></div>
        <div class="absolute bottom-10 sm:bottom-14 right-1/3 w-1 h-1 bg-white rounded-full opacity-50 animate-bounce" style="animation-delay: 2s; animation-duration: 2s;"></div>
        
        <!-- Tank stats overlay -->
        <div class="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/95 rounded-lg p-2 sm:p-3 shadow-sm">
          <p class="text-xs font-medium text-gray-700 mb-1 sm:mb-2">Tank Status</p>
          <div class="grid grid-cols-2 gap-1 sm:gap-2 text-xs">
            <div class="flex items-center">
              <span class="text-blue-500 mr-1">🐠</span>
              <span class="font-medium">{{ userFishCount }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-green-500 mr-1">🌿</span>
              <span class="font-medium">{{ userPlantsCount }}</span>
            </div>
          </div>
          <div class="mt-1 sm:mt-2 flex items-center">
            <div class="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2 mr-1 sm:mr-2">
              <div 
                class="h-1.5 sm:h-2 rounded-full transition-all duration-500"
                :class="tankHealth >= 80 ? 'bg-green-500' : tankHealth >= 60 ? 'bg-yellow-500' : 'bg-red-500'"
                :style="{ width: tankHealth + '%' }"
              ></div>
            </div>
            <span class="text-xs font-medium">{{ tankHealth }}%</span>
          </div>
        </div>

        <!-- Light reflection effect -->
        <div class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/20 to-transparent rounded-t-lg"></div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Today's Screen Time -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-green-400">
        <div class="flex justify-between">
          <span class="text-gray-600">Today's Screen Time</span>
          <span class="text-2xl font-bold text-green-500">{{ formatUsageTime(todayScreenTime) }}</span>
        </div>
      </div>
      
      <!-- Apps Used Today -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-purple-400">
        <div class="flex justify-between">
          <span class="text-gray-600">Apps Used Today</span>
          <span class="text-2xl font-bold text-purple-500">{{ todayAppsUsed }}</span>
        </div>
      </div>
      
      <!-- Current Pearls -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-400">
        <div class="flex justify-between">
          <span class="text-gray-600">Current Pearls</span>
          <span class="text-2xl font-bold text-yellow-500">{{ playerPearls }}</span>
        </div>
      </div>

      <!-- Tank Health -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-sky-400">
        <div class="flex justify-between">
          <span class="text-gray-600">Tank Health</span>
          <span class="text-2xl font-bold" :class="tankHealth >= 80 ? 'text-green-500' : tankHealth >= 60 ? 'text-yellow-500' : 'text-red-500'">{{ tankHealth }}%</span>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- User's Fish Collection Preview -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-sky-400">
        <h2 class="text-lg font-semibold mb-4 text-sky-700">Fish Collection</h2>
        <div v-if="ownedFish.length > 0" class="grid grid-cols-3 gap-2">
          <div
            v-for="fish in ownedFish.slice(0, 6)"
            :key="fish.id + fish.instanceIndex"
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
        <NuxtLink to="/shop" class="block text-center bg-sky-50 text-sky-600 hover:bg-sky-100 py-2 rounded-md text-sm font-medium transition mt-3">
          Visit Shop →
        </NuxtLink>
      </div>

      <!-- Recent Usage Stats -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-green-400">
        <h2 class="text-lg font-semibold mb-4 text-green-700">Recent Usage</h2>
        <div v-if="recentUsageData.length > 0" class="space-y-2">
          <div v-for="app in recentUsageData.slice(0, 3)" :key="app.package" class="flex justify-between text-sm">
            <span class="text-gray-600 truncate">{{ app.name || app.package }}</span>
            <span class="font-medium">{{ formatUsageTime(app.usage) }}</span>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-4">
          <p class="text-sm">No usage data available</p>
          <p class="text-xs">Connect your Android device to track usage</p>
        </div>
        <NuxtLink to="/focus" class="block text-center bg-green-50 text-green-600 hover:bg-green-100 py-2 rounded-md text-sm font-medium transition mt-3">
          View Focus Stats →
        </NuxtLink>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-purple-400">
        <h2 class="text-lg font-semibold mb-4 text-purple-700">Quick Actions</h2>
        <div class="space-y-3">
          <NuxtLink to="/timer" class="w-full bg-green-100 hover:bg-green-200 text-green-700 py-3 px-4 rounded-md text-center font-medium transition block">
            🎯 Start Focus Session
          </NuxtLink>
          <NuxtLink to="/aquarium" class="w-full bg-sky-100 hover:bg-sky-200 text-sky-700 py-3 px-4 rounded-md text-center font-medium transition block">
            🐠 Manage Aquarium
          </NuxtLink>
          <NuxtLink to="/shop" class="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-3 px-4 rounded-md text-center font-medium transition block">
            🛒 Visit Shop
          </NuxtLink>
          <NuxtLink to="/friends" class="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-3 px-4 rounded-md text-center font-medium transition block">
            👥 View Friends
          </NuxtLink>
        </div>
      </div>
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
import { fishData, plantData, availableBackgrounds, availableFloors, availableFrames } from '~/data/aquarium/items';

const userStore = useUserStore();

// Reactive data
const todayScreenTime = ref(0);
const todayAppsUsed = ref(0);
const recentUsageData = ref([]);

// Computed properties
const playerPearls = computed(() => userStore.pearls || 0);

// Fish collection with proper instances
const ownedFish = computed(() => {
  const result = [];
  const userFishIds = [...new Set(userStore.fish || [])];
  
  userFishIds.forEach(fishId => {
    const fishTemplate = fishData.find(f => f.id === fishId);
    if (fishTemplate) {
      const countOwned = (userStore.fish || []).filter(id => id === fishId).length;
      for (let i = 0; i < countOwned; i++) {
        result.push({
          ...fishTemplate,
          instanceIndex: i,
          inTank: false // Will be updated based on aquarium layout
        });
      }
    }
  });
  
  return result;
});

const previewFish = computed(() => {
  const layout = userStore.aquariumLayout;
  if (layout && layout.fish) {
    return layout.fish.map(savedFish => {
      const fishTemplate = fishData.find(f => f.id === savedFish.id);
      return {
        ...fishTemplate,
        ...savedFish
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

// Style getters for aquarium preview
const getAquariumPreviewStyle = () => {
  const layout = userStore.aquariumLayout;
  const backgroundId = layout?.background || 'default';
  
  const bg = availableBackgrounds.find(b => b.id === backgroundId);
  if (bg && bg.image) {
    return `background-image: url('${bg.image}'); background-size: cover; background-position: center; background-repeat: no-repeat;`;
  }
  
  // Default gradient background
  return 'background: linear-gradient(to bottom, #0ea5e9, #0284c7);';
};

const getFloorPreviewStyle = () => {
  const layout = userStore.aquariumLayout;
  const floorId = layout?.floor || 'sand';
  
  const floor = availableFloors.find(f => f.id === floorId);
  if (floor && floor.image) {
    return `background-image: url('${floor.image}'); background-size: cover; background-position: center bottom; background-repeat: no-repeat;`;
  }
  
  // Default sand gradient
  return 'background: linear-gradient(to top, #fbbf24, #f59e0b);';
};

const getFramePreviewStyle = () => {
  const layout = userStore.aquariumLayout;
  const frameId = layout?.frame || 'none';
  
  if (frameId === 'none') return null;
  
  const frame = availableFrames.find(f => f.id === frameId);
  if (frame && frame.image) {
    return `background-image: url('${frame.image}'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center;`;
  }
  
  return null;
};

// Format usage time helper
const formatUsageTime = (seconds) => {
  if (!seconds || seconds === 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Load usage data (similar to focus page)
const loadUsageData = async () => {
  try {
    // Try to fetch from Android companion app
    const response = await fetch('http://localhost:8080/data');
    
    if (response.ok) {
      const data = await response.json();
      
      if (!data.error && data.usageData) {
        todayScreenTime.value = data.totalScreenTime || 0;
        todayAppsUsed.value = data.totalAppsUsed || 0;
        recentUsageData.value = data.usageData
          .sort((a, b) => (b.foregroundSeconds || b.usageSeconds || 0) - (a.foregroundSeconds || a.usageSeconds || 0))
          .map(app => ({
            ...app,
            usage: app.foregroundSeconds || app.usageSeconds || 0
          }));
      }
    }
  } catch (error) {
    console.log('Android companion app not available, using default values');
    // Set default values when companion app is not available
    todayScreenTime.value = 0;
    todayAppsUsed.value = 0;
    recentUsageData.value = [];
  }
};

onMounted(async () => {
  try {
    // Load user profile if not already loaded
    if (!userStore.userProfile && userStore.isLoggedIn) {
      await userStore.loadUserProfile();
    }
    
    // Load usage data
    await loadUsageData();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
});
</script>

<style scoped>
/* Pixelated rendering for preview backgrounds and tiles */
.pixelated-bg {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>