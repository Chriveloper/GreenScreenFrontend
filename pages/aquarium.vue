<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header with consistent pearl display -->
    <div class="bg-white rounded-lg shadow p-6 mb-8 border-t-4 border-sky-400">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Aquarium</h1>
          <p class="text-gray-600 mt-1">Manage your underwater paradise</p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="toggleEditMode"
            :disabled="loading"
            class="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition"
          >
            {{ loading ? 'Loading...' : (editMode ? 'Exit Edit Mode' : 'Edit Aquarium') }}
          </button>
          <div class="text-right">
            <div class="flex items-center text-yellow-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-2xl font-bold">{{ playerPearls }}</span>
            </div>
            <span class="text-sm text-gray-500">Available Pearls</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Aquarium Tank -->
      <div class="lg:col-span-3">
        <div 
          class="aquarium-tank rounded-lg shadow-lg p-4 min-h-[500px] relative overflow-hidden cursor-pointer pixelated-bg"
          :class="{ 'ring-2 ring-yellow-400': editMode }"
          :style="getBackgroundStyle()"
          @click="handleTankClick"
        >
          <!-- Tank frame overlay -->
          <div 
            v-if="selectedFrame !== 'none'"
            class="absolute inset-0 pointer-events-none z-40 pixelated-bg"
            :style="getFrameStyle()"
          ></div>
          
          <!-- Water overlay effect -->
          <div class="absolute inset-0 bg-blue-400 bg-opacity-20 rounded-lg pointer-events-none z-5"></div>
          
          <!-- Floor/substrate -->
          <div 
            class="absolute bottom-0 left-0 right-0 h-20 rounded-b-lg pixelated-bg z-10"
            :style="getFloorStyle()"
          ></div>

          <!-- Placed Plants -->
          <div
            v-for="plant in placedPlants"
            :key="plant.id"
            class="absolute cursor-move z-20 plant-container"
            :class="{ 'hover:scale-110': editMode }"
            :style="getPlantStyle(plant)"
            @mousedown="startDrag(plant, $event)"
            @touchstart="startDrag(plant, $event)"
          >
            <img 
              :src="plant.img" 
              :alt="plant.name"
              class="w-16 h-20 object-contain pixelated"
            />
            <div v-if="editMode" 
                 class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600 transition"
                 @click.stop="removePlant(plant.id)">
              ×
            </div>
          </div>

          <!-- Swimming Fish -->
          <div
            v-for="fish in activeFish"
            :key="fish.id"
            class="absolute transition-all duration-1000 ease-in-out z-15 fish-container"
            :style="getFishStyle(fish)"
          >
            <img 
              :src="fish.img" 
              :alt="fish.name"
              class="w-12 h-10 object-contain pixelated"
            />
          </div>

          <!-- Bubbles -->
          <div
            v-for="bubble in bubbles"
            :key="bubble.id"
            class="absolute w-2 h-2 bg-white rounded-full opacity-70 animate-bounce z-25"
            :style="getBubbleStyle(bubble)"
          ></div>

          <!-- Edit Mode Instructions -->
          <div v-if="editMode" class="absolute top-4 left-4 bg-white/90 rounded-lg p-3 z-30">
            <p class="text-sm font-medium text-gray-800">Edit Mode Active</p>
            <p class="text-xs text-gray-600">• Drag plants to move them</p>
            <p class="text-xs text-gray-600">• Click × to remove items</p>
            <p class="text-xs text-gray-600">• Use inventory to add new items</p>
            <p class="text-xs text-gray-600">• Customize background & floor</p>
          </div>

          <!-- Loading overlay -->
          <div v-if="loading" class="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
            <div class="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>

      <!-- Inventory Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h2 class="text-lg font-semibold mb-4 text-gray-800">Inventory</h2>
          
          <!-- Fish Inventory -->
          <div class="mb-6">
            <h3 class="text-md font-medium mb-3 text-sky-700 flex items-center">
              <span class="text-lg mr-2">🐠</span>
              Fish Collection
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="fish in ownedFish"
                :key="fish.id"
                class="bg-sky-50 border border-sky-200 rounded-lg p-2 text-center cursor-pointer hover:bg-sky-100 transition"
                :class="{ 'opacity-50': fish.inTank }"
                @click="toggleFish(fish)"
              >
                <img :src="fish.img" :alt="fish.name" class="w-8 h-6 mx-auto mb-1 object-contain" style="image-rendering: pixelated;" />
                <p class="text-xs font-medium">{{ fish.name }}</p>
                <p class="text-xs text-gray-500">{{ fish.inTank ? 'In Tank' : 'Available' }}</p>
              </div>
            </div>
            <p v-if="ownedFish.length === 0" class="text-sm text-gray-500 text-center py-4">
              No fish owned. Visit the <NuxtLink to="/shop" class="text-sky-600 hover:underline">shop</NuxtLink> to buy some!
            </p>
          </div>

          <!-- Plants Inventory -->
          <div class="mb-6">
            <h3 class="text-md font-medium mb-3 text-green-700 flex items-center">
              <span class="text-lg mr-2">🌿</span>
              Plant Collection
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="plant in ownedPlants"
                :key="plant.id"
                class="bg-green-50 border border-green-200 rounded-lg p-2 text-center cursor-pointer hover:bg-green-100 transition"
                :class="{ 'opacity-50': getPlantUsageCount(plant.id) >= plant.maxQuantity }"
                @click="addPlantToTank(plant)"
              >
                <img :src="plant.img" :alt="plant.name" class="w-8 h-8 mx-auto mb-1 object-contain" style="image-rendering: pixelated;" />
                <p class="text-xs font-medium">{{ plant.name }}</p>
                <p class="text-xs text-gray-500">{{ getPlantUsageCount(plant.id) }}/{{ plant.maxQuantity }}</p>
              </div>
            </div>
            <p v-if="ownedPlants.length === 0" class="text-sm text-gray-500 text-center py-4">
              No plants owned. Visit the <NuxtLink to="/shop" class="text-sky-600 hover:underline">shop</NuxtLink> to buy some!
            </p>
          </div>
        </div>

        <!-- Customization Panel -->
        <div class="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h3 class="text-md font-semibold mb-3 text-gray-800">Customize Tank</h3>
          
          <!-- Background Selection -->
          <div class="mb-4">
            <h4 class="text-sm font-medium mb-2 text-gray-700">Background</h4>
            <div class="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              <div
                v-for="bg in availableBackgrounds"
                :key="bg.id"
                class="aspect-square border-2 rounded-lg cursor-pointer hover:scale-105 transition overflow-hidden pixelated-bg"
                :class="{ 'border-sky-500 ring-2 ring-sky-200': selectedBackground === bg.id }"
                :style="bg.preview"
                @click="selectBackground(bg.id)"
              >
                <div class="w-full h-full flex items-end justify-center text-xs font-bold text-white bg-black/20">
                  {{ bg.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- Floor Selection -->
          <div class="mb-4">
            <h4 class="text-sm font-medium mb-2 text-gray-700">Floor</h4>
            <div class="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              <div
                v-for="floor in availableFloors"
                :key="floor.id"
                class="aspect-square border-2 rounded-lg cursor-pointer hover:scale-105 transition overflow-hidden pixelated-bg"
                :class="{ 'border-yellow-500 ring-2 ring-yellow-200': selectedFloor === floor.id }"
                :style="floor.preview"
                @click="selectFloor(floor.id)"
              >
                <div class="w-full h-full flex items-end justify-center text-xs font-bold text-white bg-black/20">
                  {{ floor.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- Frame Selection -->
          <div class="mb-4">
            <h4 class="text-sm font-medium mb-2 text-gray-700">Frame</h4>
            <div class="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              <div
                v-for="frame in availableFrames"
                :key="frame.id"
                class="aspect-square border-2 rounded-lg cursor-pointer hover:scale-105 transition overflow-hidden"
                :class="{ 'border-purple-500 ring-2 ring-purple-200': selectedFrame === frame.id }"
                @click="selectFrame(frame.id)"
              >
                <div v-if="frame.preview" 
                     class="w-full h-full pixelated-bg"
                     :style="frame.preview">
                </div>
                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span class="text-xs font-medium text-gray-500">{{ frame.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tank Stats -->
        <div class="bg-white rounded-lg shadow-lg p-4">
          <h3 class="text-md font-semibold mb-3 text-gray-800">Tank Stats</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Fish:</span>
              <span class="font-medium">{{ activeFish.length }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Plants:</span>
              <span class="font-medium">{{ placedPlants.length }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Tank Health:</span>
              <span class="font-medium text-green-600">{{ tankHealth }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="fixed bottom-4 right-4 z-50">
      <div class="p-4 rounded-md shadow-lg max-w-sm" :class="{
        'bg-green-100 text-green-700 border border-green-200': messageType === 'success',
        'bg-red-100 text-red-700 border border-red-200': messageType === 'error',
        'bg-blue-100 text-blue-700 border border-blue-200': messageType === 'info'
      }">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useUserStore } from '~/stores/user';

definePageMeta({
  ssr: false,
});

const userStore = useUserStore();

// Reactive state
const editMode = ref(false);
const loading = ref(false);
const message = ref('');
const messageType = ref('success');
const placedPlants = ref([]);
const activeFish = ref([]);
const bubbles = ref([]);
const draggedItem = ref(null);
const dragOffset = ref({ x: 0, y: 0 });
const selectedBackground = ref('default');
const selectedFloor = ref('sand');
const selectedFrame = ref('none');

// Animation intervals
let fishAnimationInterval = null;
let bubbleInterval = null;

const playerPearls = computed(() => userStore.pearls);

// Show message helper
const showMessage = (text, type = 'success') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

// Available backgrounds, floors, and frames
const availableBackgrounds = ref([
  { 
    id: 'default', 
    name: 'Deep Blue',
    preview: 'background: linear-gradient(to bottom, #0ea5e9, #0284c7);'
  },
  { 
    id: 'background_1a', 
    name: 'Ocean Deep',
    image: '/resources/backgrounds/background_1a.png',
    preview: 'background-image: url("/resources/backgrounds/background_1a.png"); background-size: cover;'
  },
  { 
    id: 'background_1b', 
    name: 'Ocean Medium',
    image: '/resources/backgrounds/background_1b.png',
    preview: 'background-image: url("/resources/backgrounds/background_1b.png"); background-size: cover;'
  },
  { 
    id: 'background_1c', 
    name: 'Ocean Light',
    image: '/resources/backgrounds/background_1c.png',
    preview: 'background-image: url("/resources/backgrounds/background_1c.png"); background-size: cover;'
  },
  { 
    id: 'background_2a', 
    name: 'Coral Deep',
    image: '/resources/backgrounds/background_2a.png',
    preview: 'background-image: url("/resources/backgrounds/background_2a.png"); background-size: cover;'
  },
  { 
    id: 'background_2b', 
    name: 'Coral Medium',
    image: '/resources/backgrounds/background_2b.png',
    preview: 'background-image: url("/resources/backgrounds/background_2b.png"); background-size: cover;'
  },
  { 
    id: 'background_2c', 
    name: 'Coral Light',
    image: '/resources/backgrounds/background_2c.png',
    preview: 'background-image: url("/resources/backgrounds/background_2c.png"); background-size: cover;'
  },
  { 
    id: 'background_3a', 
    name: 'Tropical Deep',
    image: '/resources/backgrounds/background_3a.png',
    preview: 'background-image: url("/resources/backgrounds/background_3a.png"); background-size: cover;'
  },
  { 
    id: 'background_3b', 
    name: 'Tropical Medium',
    image: '/resources/backgrounds/background_3b.png',
    preview: 'background-image: url("/resources/backgrounds/background_3b.png"); background-size: cover;'
  },
  { 
    id: 'background_3c', 
    name: 'Tropical Light',
    image: '/resources/backgrounds/background_3c.png',
    preview: 'background-image: url("/resources/backgrounds/background_3c.png"); background-size: cover;'
  }
]);

const availableFloors = ref([
  { 
    id: 'sand', 
    name: 'Sand',
    preview: 'background: linear-gradient(to top, #fbbf24, #f59e0b);'
  },
  { 
    id: 'tiles_1', 
    name: 'Blue Tiles',
    image: '/resources/floor_tiles/tiles_1.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_1.png"); background-size: cover;'
  },
  { 
    id: 'tiles_10', 
    name: 'Stone Tiles',
    image: '/resources/floor_tiles/tiles_10.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_10.png"); background-size: cover;'
  },
  { 
    id: 'tiles_10b', 
    name: 'Stone Tiles Alt',
    image: '/resources/floor_tiles/tiles_10b.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_10b.png"); background-size: cover;'
  },
  { 
    id: 'tiles_10c', 
    name: 'Stone Tiles Light',
    image: '/resources/floor_tiles/tiles_10c.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_10c.png"); background-size: cover;'
  },
  { 
    id: 'tiles_11', 
    name: 'Dark Tiles',
    image: '/resources/floor_tiles/tiles_11.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_11.png"); background-size: cover;'
  },
  { 
    id: 'tiles_11b', 
    name: 'Dark Tiles Alt',
    image: '/resources/floor_tiles/tiles_11b.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_11b.png"); background-size: cover;'
  },
  { 
    id: 'tiles_11c', 
    name: 'Dark Tiles Light',
    image: '/resources/floor_tiles/tiles_11c.png',
    preview: 'background-image: url("/resources/floor_tiles/tiles_11c.png"); background-size: cover;'
  }
]);

const availableFrames = ref([
  { 
    id: 'none', 
    name: 'No Frame',
    preview: 'background: transparent;'
  },
  { 
    id: 'fishtank_1', 
    name: 'Classic Frame',
    image: '/resources/fishtank_1.png',
    preview: 'background-image: url("/resources/fishtank_1.png"); background-size: contain; background-repeat: no-repeat; background-position: center;'
  },
  { 
    id: 'fishtank_2', 
    name: 'Modern Frame',
    image: '/resources/fishtank_2.png',
    preview: 'background-image: url("/resources/fishtank_2.png"); background-size: contain; background-repeat: no-repeat; background-position: center;'
  },
  { 
    id: 'fishtank_3', 
    name: 'Elegant Frame',
    image: '/resources/fishtank_3.png',
    preview: 'background-image: url("/resources/fishtank_3.png"); background-size: contain; background-repeat: no-repeat; background-position: center;'
  }
]);

// Plant sizing and positioning functions
const getPlantImageClass = (plantId) => {
  // Categorize plants by size for consistent sizing
  const longPlants = ['plant_long_1', 'plant_long_2', 'plant_long_3', 'plant_long_4'];
  const mediumPlants = ['plant1', 'plant2', 'plant3', 'plant4', 'plant5', 'plant6', 'plant7', 'plant8'];
  const smallPlants = ['plant9', 'plant10', 'plant11', 'plant12', 'plant13', 'plant14', 'plant15'];
  const decorations = ['shell_1'];
  
  if (longPlants.includes(plantId)) {
    return 'w-16 h-24'; // Tall plants
  } else if (mediumPlants.includes(plantId)) {
    return 'w-12 h-16'; // Medium plants
  } else if (smallPlants.includes(plantId)) {
    return 'w-10 h-12'; // Small plants
  } else if (decorations.includes(plantId)) {
    return 'w-8 h-8'; // Decorations
  }
  
  return 'w-12 h-16'; // Default size
};

const getPlantStyle = (plant) => {
  return { 
    left: plant.x + '%', 
    top: plant.y + '%',
    transform: 'translate(-50%, -100%)', // Anchor at bottom center
    zIndex: Math.floor(plant.y) + 20 // Dynamic z-index based on y position for depth
  };
};

const getFishStyle = (fish) => {
  return { 
    left: (fish.swimX || fish.x) + '%', 
    top: (fish.swimY || fish.y) + '%',
    transform: `translate(-50%, -50%) ${fish.direction === 'left' ? 'scaleX(-1)' : ''}`,
    zIndex: Math.floor((fish.swimY || fish.y)) + 15 // Dynamic z-index for depth
  };
};

const getBubbleStyle = (bubble) => {
  return { 
    left: bubble.x + '%', 
    bottom: bubble.y + 'px',
    animationDelay: bubble.delay + 's',
    zIndex: 25
  };
};

// Style getters with improved sizing
const getBackgroundStyle = () => {
  const bg = availableBackgrounds.value.find(b => b.id === selectedBackground.value);
  if (bg && bg.image) {
    return `
      background-image: url('${bg.image}'); 
      background-size: cover; 
      background-position: center; 
      background-repeat: no-repeat;
      min-height: 500px;
    `;
  }
  return 'background: linear-gradient(to bottom, #0ea5e9, #0284c7); min-height: 500px;';
};

const getFloorStyle = () => {
  const floor = availableFloors.value.find(f => f.id === selectedFloor.value);
  if (floor && floor.image) {
    return `
      background-image: url('${floor.image}'); 
      background-size: cover; 
      background-position: center bottom; 
      background-repeat: no-repeat;
    `;
  }
  return 'background: linear-gradient(to top, #fbbf24, #f59e0b);';
};

const getFrameStyle = () => {
  const frame = availableFrames.value.find(f => f.id === selectedFrame.value);
  if (frame && frame.image) {
    return `
      background-image: url('${frame.image}'); 
      background-size: 100% 100%; 
      background-repeat: no-repeat; 
      background-position: center;
    `;
  }
  return '';
};

// Get owned items from store
const ownedFish = computed(() => {
  const fishData = [
    { id: 'goldfish', name: 'Goldfish', img: '/resources/fish/fish_1.gif', color: '#FFA726', maxQuantity: 3 },
    { id: 'angelfish', name: 'Angelfish', img: '/resources/fish/fish_2.gif', color: '#FFD54F', maxQuantity: 2 },
    { id: 'clownfish', name: 'Clownfish', img: '/resources/fish/fish_3.gif', color: '#FF7043', maxQuantity: 2 },
    { id: 'blue_tang', name: 'Blue Tang', img: '/resources/fish/fish_4.gif', color: '#42A5F5', maxQuantity: 2 },
    { id: 'royal_gramma', name: 'Royal Gramma', img: '/resources/fish/fish_5.gif', color: '#AB47BC', maxQuantity: 1 },
  ];
  
  return fishData.filter(fish => (userStore.fish || []).includes(fish.id))
    .map(fish => ({
      ...fish,
      inTank: activeFish.value.some(active => active.id === fish.id)
    }));
});

const ownedPlants = computed(() => {
  const plantData = [
    { id: 'plant1', name: 'Java Moss', img: '/resources/plants/plant_1.png', maxQuantity: 5 },
    { id: 'plant2', name: 'Amazon Sword', img: '/resources/plants/plant_2.png', maxQuantity: 3 },
    { id: 'plant3', name: 'Anubias', img: '/resources/plants/plant_3.png', maxQuantity: 4 },
    { id: 'plant4', name: 'Water Wisteria', img: '/resources/plants/plant_4.png', maxQuantity: 3 },
    { id: 'plant5', name: 'Hornwort', img: '/resources/plants/plant_5.png', maxQuantity: 4 },
    { id: 'plant6', name: 'Cryptocoryne', img: '/resources/plants/plant_6.png', maxQuantity: 3 },
    { id: 'plant7', name: 'Duckweed', img: '/resources/plants/plant_7.png', maxQuantity: 6 },
    { id: 'plant8', name: 'Bucephalandra', img: '/resources/plants/plant_8.png', maxQuantity: 4 },
    { id: 'plant9', name: 'Vallisneria', img: '/resources/plants/plant_9.png', maxQuantity: 4 },
    { id: 'plant10', name: 'Rotala', img: '/resources/plants/plant_10.png', maxQuantity: 5 },
    { id: 'plant11', name: 'Ludwigia', img: '/resources/plants/plant_11.png', maxQuantity: 3 },
    { id: 'plant12', name: 'Dwarf Hairgrass', img: '/resources/plants/plant_12.png', maxQuantity: 8 },
    { id: 'plant13', name: 'Marimo Moss Ball', img: '/resources/plants/plant_13.png', maxQuantity: 2 },
    { id: 'plant14', name: 'Red Tiger Lotus', img: '/resources/plants/plant_14.png', maxQuantity: 2 },
    { id: 'plant15', name: 'Java Fern', img: '/resources/plants/plant_15.png', maxQuantity: 3 },
    { id: 'plant_long_1', name: 'Tall Lotus', img: '/resources/plants/plant_long_1.png', maxQuantity: 2 },
    { id: 'plant_long_2', name: 'Reed Grass', img: '/resources/plants/plant_long_2.png', maxQuantity: 3 },
    { id: 'plant_long_3', name: 'Large Amazon Sword', img: '/resources/plants/plant_long_3.png', maxQuantity: 1 },
    { id: 'plant_long_4', name: 'Weeping Moss', img: '/resources/plants/plant_long_4.png', maxQuantity: 2 },
    { id: 'shell_1', name: 'Shell', img: '/resources/plants/shell_1.png', maxQuantity: 3 },
    { id: 'sponge_1', name: 'Sponge', img: '/resources/plants/sponge_1.png', maxQuantity: 2 },
  ];
  
  return plantData.filter(plant => (userStore.decorations || []).includes(plant.id));
});

const tankHealth = computed(() => {
  const fishCount = activeFish.value.length;
  const plantCount = placedPlants.value.length;
  
  // Simple health calculation based on fish to plant ratio
  if (fishCount === 0) return 100;
  const ratio = plantCount / fishCount;
  return Math.min(100, Math.max(60, Math.round(75 + (ratio * 25))));
});

// Plant usage count
const getPlantUsageCount = (plantId) => {
  return placedPlants.value.filter(p => p.plantId === plantId).length;
};

// Toggle edit mode
const toggleEditMode = async () => {
  if (loading.value) return;
  
  loading.value = true;
  try {
    editMode.value = !editMode.value;
    if (!editMode.value) {
      await saveAquariumLayout();
      showMessage('Aquarium layout saved!', 'success');
    } else {
      showMessage('Edit mode activated - drag plants to rearrange!', 'info');
    }
  } catch (error) {
    console.error('Toggle edit mode error:', error);
    showMessage('Failed to toggle edit mode', 'error');
  } finally {
    loading.value = false;
  }
};

// Enhanced save function with feedback
const saveAquariumLayout = async () => {
  const layout = JSON.parse(JSON.stringify({
    plants: placedPlants.value,
    fish: activeFish.value.map(f => ({ 
      id: f.id, 
      swimX: f.swimX || 50, 
      swimY: f.swimY || 50, 
      targetX: f.targetX || Math.random() * 80 + 10,
      targetY: f.targetY || Math.random() * 50 + 20,
      direction: f.direction || 'right' 
    })),
    background: selectedBackground.value,
    floor: selectedFloor.value,
    frame: selectedFrame.value
  }));
  
  try {
    const success = await userStore.updateAquariumLayout(layout);
    if (!success) {
      throw new Error('Failed to save layout');
    }
    return true;
  } catch (error) {
    console.error('Failed to save aquarium layout:', error);
    showMessage('Failed to save aquarium layout', 'error');
    throw error;
  }
};

// Enhanced fish toggle with feedback
const toggleFish = async (fish) => {
  if (loading.value) return;
  
  loading.value = true;
  try {
    const fishIndex = activeFish.value.findIndex(f => f.id === fish.id);
    if (fishIndex >= 0) {
      // Remove fish from tank
      activeFish.value.splice(fishIndex, 1);
      showMessage(`${fish.name} removed from tank`, 'info');
    } else {
      // Add fish to tank
      const startX = Math.random() * 60 + 20;
      const startY = Math.random() * 50 + 15;
      activeFish.value.push({
        id: fish.id,
        name: fish.name,
        img: fish.img,
        color: fish.color,
        swimX: startX,
        swimY: startY,
        targetX: Math.random() * 60 + 20,
        targetY: Math.random() * 50 + 15,
        direction: Math.random() > 0.5 ? 'right' : 'left'
      });
      showMessage(`${fish.name} added to tank`, 'success');
    }
    await saveAquariumLayout();
  } catch (error) {
    console.error('Toggle fish error:', error);
    showMessage('Failed to update fish', 'error');
  } finally {
    loading.value = false;
  }
};

// Enhanced plant management with feedback
const addPlantToTank = async (plant) => {
  if (loading.value) return;
  
  const usageCount = getPlantUsageCount(plant.id);
  if (usageCount >= plant.maxQuantity) {
    showMessage(`Maximum ${plant.name} already placed (${plant.maxQuantity})`, 'info');
    return;
  }

  loading.value = true;
  try {
    if (!editMode.value) {
      editMode.value = true;
    }
    
    const newPlant = {
      id: `${plant.id}_${Date.now()}`,
      plantId: plant.id,
      name: plant.name,
      img: plant.img,
      x: Math.random() * 60 + 20,
      y: Math.random() * 40 + 40
    };
    
    placedPlants.value.push(newPlant);
    await saveAquariumLayout();
    showMessage(`${plant.name} added to tank`, 'success');
  } catch (error) {
    console.error('Add plant error:', error);
    showMessage('Failed to add plant', 'error');
  } finally {
    loading.value = false;
  }
};

// Enhanced remove plant with feedback
const removePlant = async (plantId) => {
  if (loading.value) return;
  
  loading.value = true;
  try {
    const plant = placedPlants.value.find(p => p.id === plantId);
    const plantName = plant?.name || 'Plant';
    
    placedPlants.value = placedPlants.value.filter(p => p.id !== plantId);
    await saveAquariumLayout();
    showMessage(`${plantName} removed`, 'info');
  } catch (error) {
    console.error('Remove plant error:', error);
    showMessage('Failed to remove plant', 'error');
  } finally {
    loading.value = false;
  }
};

// Enhanced customization functions with feedback
const selectBackground = async (backgroundId) => {
  if (loading.value) return;
  
  loading.value = true;
  try {
    selectedBackground.value = backgroundId;
    await saveAquariumLayout();
    const bgName = availableBackgrounds.value.find(b => b.id === backgroundId)?.name || 'Background';
    showMessage(`${bgName} selected`, 'success');
  } catch (error) {
    console.error('Select background error:', error);
    showMessage('Failed to change background', 'error');
  } finally {
    loading.value = false;
  }
};

const selectFloor = async (floorId) => {
  if (loading.value) return;
  
  loading.value = true;
  try {
    selectedFloor.value = floorId;
    await saveAquariumLayout();
    const floorName = availableFloors.value.find(f => f.id === floorId)?.name || 'Floor';
    showMessage(`${floorName} selected`, 'success');
  } catch (error) {
    console.error('Select floor error:', error);
    showMessage('Failed to change floor', 'error');
  } finally {
    loading.value = false;
  }
};

const selectFrame = async (frameId) => {
  if (loading.value) return;
  
  loading.value = true;
  try {
    selectedFrame.value = frameId;
    await saveAquariumLayout();
    const frameName = availableFrames.value.find(f => f.id === frameId)?.name || 'Frame';
    showMessage(`${frameName} selected`, 'success');
  } catch (error) {
    console.error('Select frame error:', error);
    showMessage('Failed to change frame', 'error');
  } finally {
    loading.value = false;
  }
};

// Fish swimming and bubble generation logic
const animateFish = () => {
  activeFish.value.forEach(fish => {
    // Initialize target positions if not set
    if (!fish.targetX || !fish.targetY) {
      fish.targetX = Math.random() * 60 + 20; // 20-80% range
      fish.targetY = Math.random() * 50 + 15; // 15-65% range
    }
    
    // Calculate distance to target
    const deltaX = fish.targetX - fish.swimX;
    const deltaY = fish.targetY - fish.swimY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // If close to target, pick a new random target
    if (distance < 3) {
      fish.targetX = Math.random() * 60 + 20;
      fish.targetY = Math.random() * 50 + 15;
    } else {
      // Move towards target with consistent speed
      const speed = 0.4;
      const moveX = (deltaX / distance) * speed;
      const moveY = (deltaY / distance) * speed;
      
      fish.swimX += moveX;
      fish.swimY += moveY;
      
      // Update direction based on movement
      fish.direction = moveX > 0 ? 'right' : 'left';
    }
    
    // Keep fish within proper bounds
    fish.swimX = Math.max(15, Math.min(85, fish.swimX));
    fish.swimY = Math.max(10, Math.min(70, fish.swimY));
    
    // Occasional random direction change
    if (Math.random() < 0.008) {
      fish.targetX = Math.random() * 60 + 20;
      fish.targetY = Math.random() * 50 + 15;
    }
  });
};

const generateBubbles = () => {
  if (bubbles.value.length < 6) {
    bubbles.value.push({
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10, // Keep bubbles away from edges
      y: Math.random() * 30 + 10,
      delay: Math.random() * 3
    });
  }
  
  // Remove old bubbles that have floated up
  bubbles.value = bubbles.value.filter((bubble, index) => index < 8);
};

const loadAquariumLayout = () => {
  const layout = userStore.aquariumLayout;
  console.log('Loading aquarium layout:', layout);
  
  if (layout && Object.keys(layout).length > 0) {
    if (layout.plants) {
      placedPlants.value = layout.plants;
      console.log('Loaded plants:', placedPlants.value.length);
    }
    
    if (layout.background) {
      selectedBackground.value = layout.background;
    }
    
    if (layout.floor) {
      selectedFloor.value = layout.floor;
    }
    
    if (layout.frame) {
      selectedFrame.value = layout.frame;
    }
    
    if (layout.fish) {
      const fishData = [
        { id: 'goldfish', name: 'Goldfish', img: '/resources/fish/fish_1.gif', color: '#FFA726' },
        { id: 'angelfish', name: 'Angelfish', img: '/resources/fish/fish_2.gif', color: '#FFD54F' },
        { id: 'clownfish', name: 'Clownfish', img: '/resources/fish/fish_3.gif', color: '#FF7043' },
        { id: 'blue_tang', name: 'Blue Tang', img: '/resources/fish/fish_4.gif', color: '#42A5F5' },
        { id: 'royal_gramma', name: 'Royal Gramma', img: '/resources/fish/fish_5.gif', color: '#AB47BC' },
      ];
      
      activeFish.value = layout.fish.map(savedFish => {
        const fishTemplate = fishData.find(f => f.id === savedFish.id);
        return {
          ...fishTemplate,
          ...savedFish,
          targetX: savedFish.targetX || Math.random() * 80 + 10,
          targetY: savedFish.targetY || Math.random() * 50 + 20
        };
      }).filter(fish => fish.name); // Filter out invalid fish
      console.log('Loaded fish:', activeFish.value.length);
    }
  } else {
    console.log('No layout found or empty layout');
  }
};

// Handle tank click for adding items
const handleTankClick = (event) => {
  // Only handle clicks in edit mode
  if (!editMode.value) return;
  
  // This function can be extended to handle tank interactions
};

// Drag functionality for moving plants (basic implementation)
const startDrag = (plant, event) => {
  if (!editMode.value) return;
  
  draggedItem.value = plant;
  
  // Calculate offset from mouse/touch to element center
  const rect = event.target.getBoundingClientRect();
  const tankRect = event.target.closest('.aquarium-tank').getBoundingClientRect();
  
  dragOffset.value = {
    x: (event.clientX || event.touches?.[0]?.clientX) - rect.left - rect.width / 2,
    y: (event.clientY || event.touches?.[0]?.clientY) - rect.top - rect.height / 2
  };
  
  // Add event listeners for drag
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', handleDrag);
  document.addEventListener('touchend', stopDrag);
};

const handleDrag = (event) => {
  if (!draggedItem.value) return;
  
  const tankRect = document.querySelector('.aquarium-tank').getBoundingClientRect();
  const clientX = event.clientX || event.touches?.[0]?.clientX;
  const clientY = event.clientY || event.touches?.[0]?.clientY;
  
  const newX = ((clientX - tankRect.left - dragOffset.value.x) / tankRect.width) * 100;
  const newY = ((clientY - tankRect.top - dragOffset.value.y) / tankRect.height) * 100;
  
  // Keep within bounds
  draggedItem.value.x = Math.max(5, Math.min(95, newX));
  draggedItem.value.y = Math.max(10, Math.min(90, newY));
};

const stopDrag = () => {
  if (draggedItem.value) {
    saveAquariumLayout();
    draggedItem.value = null;
  }
  
  // Remove event listeners
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('touchend', stopDrag);
};

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    await navigateTo('/login');
    return;
  }
  
  loading.value = true;
  try {
    if (!userStore.userProfile) {
      await userStore.loadUserProfile();
    }
    
    loadAquariumLayout();
    
    // Start animations
    fishAnimationInterval = setInterval(animateFish, 100);
    bubbleInterval = setInterval(generateBubbles, 3000);
    generateBubbles();
    
    showMessage('Aquarium loaded successfully!', 'success');
  } catch (error) {
    console.error('Failed to initialize aquarium:', error);
    showMessage('Failed to load aquarium', 'error');
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (fishAnimationInterval) {
    clearInterval(fishAnimationInterval);
  }
  if (bubbleInterval) {
    clearInterval(bubbleInterval);
  }
  
  // Clean up drag event listeners
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('touchend', stopDrag);
});
</script>

<style scoped>
.cursor-move {
  cursor: move;
}

.cursor-move:active {
  cursor: grabbing;
}

/* Pixelated rendering for all pixel art elements */
.pixelated, .pixelated-bg {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

/* Container positioning and sizing */
.aquarium-tank {
  aspect-ratio: 16/10;
  max-width: 100%;
  position: relative;
}

.plant-container {
  transition: transform 0.1s ease-out;
}

.fish-container {
  will-change: transform, left, top;
}

/* Consistent z-index layers */
.z-5 { z-index: 5; }
.z-10 { z-index: 10; }
.z-15 { z-index: 15; }
.z-20 { z-index: 20; }
.z-25 { z-index: 25; }
.z-30 { z-index: 30; }
.z-40 { z-index: 40; }

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .aquarium-tank {
    min-height: 300px;
    aspect-ratio: 4/3;
  }
  
  .plant-container img {
    transform: scale(0.8);
  }
  
  .fish-container img {
    transform: scale(0.8);
  }
}

/* Mobile touch improvements */
@media (hover: none) and (pointer: coarse) {
  .cursor-move {
    cursor: default;
  }
  
  .cursor-move:active {
    cursor: default;
  }
}

/* Prevent text selection during drag */
.touch-none {
  touch-action: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Smooth animations */
.fish-container {
  transition: left 1s ease-in-out, top 1s ease-in-out;
}

@keyframes float-up {
  from {
    transform: translateY(0) scale(0.5);
    opacity: 0.7;
  }
  to {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

.animate-bounce {
  animation: float-up 4s linear infinite;
}
</style>