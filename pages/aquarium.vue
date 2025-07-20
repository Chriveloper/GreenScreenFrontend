<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-sky-600">My Aquarium</h1>
      <div class="flex items-center space-x-4">
        <button
          @click="toggleEditMode"
          class="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md font-medium transition"
        >
          {{ editMode ? 'Exit Edit Mode' : 'Edit Aquarium' }}
        </button>
        <div class="flex items-center bg-white rounded-lg shadow px-4 py-2 border-t-4 border-yellow-400">
          <span class="text-2xl mr-2">🐚</span>
          <span class="text-lg font-bold text-yellow-600">{{ playerPearls }}</span>
          <span class="text-sm text-gray-600 ml-1">Pearls</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Aquarium Tank -->
      <div class="lg:col-span-3">
        <div 
          class="aquarium-tank bg-gradient-to-b from-sky-300 to-sky-500 rounded-lg shadow-lg p-4 min-h-[500px] relative overflow-hidden cursor-pointer"
          :class="{ 'ring-2 ring-yellow-400': editMode }"
          @click="handleTankClick"
        >
          <div class="absolute inset-0 bg-blue-400 bg-opacity-20 rounded-lg"></div>
          
          <!-- Sand/gravel bottom -->
          <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-b-lg"></div>
          
          <!-- Placed Plants -->
          <div
            v-for="placedPlant in placedPlants"
            :key="placedPlant.id"
            class="absolute cursor-move touch-none select-none"
            :style="{ 
              left: placedPlant.x + '%', 
              top: placedPlant.y + '%',
              transform: 'translate(-50%, -100%)'
            }"
            @mousedown="startDrag(placedPlant, $event)"
            @touchstart="startDrag(placedPlant, $event)"
            @click.stop
          >
            <img 
              :src="placedPlant.img" 
              :alt="placedPlant.name"
              class="w-16 h-20 object-contain pointer-events-none"
              style="image-rendering: pixelated;"
            />
            <div v-if="editMode" class="absolute -top-2 -right-2">
              <button
                @click="removePlant(placedPlant.id)"
                class="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold pointer-events-auto"
              >
                ×
              </button>
            </div>
          </div>

          <!-- Swimming Fish -->
          <div
            v-for="fish in swimmesingFish"
            :key="fish.id"
            class="absolute transition-all duration-1000 ease-in-out"
            :style="{ 
              left: fish.x + '%', 
              top: fish.y + '%',
              transform: `translate(-50%, -50%) ${fish.direction === 'left' ? 'scaleX(-1)' : ''}`
            }"
          >
            <img 
              :src="fish.img" 
              :alt="fish.name"
              class="w-12 h-10 object-contain"
              style="image-rendering: pixelated;"
            />
          </div>

          <!-- Bubbles -->
          <div
            v-for="bubble in bubbles"
            :key="bubble.id"
            class="absolute w-2 h-2 bg-white rounded-full opacity-70 animate-bounce"
            :style="{ 
              left: bubble.x + '%', 
              bottom: bubble.y + 'px',
              animationDelay: bubble.delay + 's'
            }"
          ></div>

          <!-- Edit Mode Instructions -->
          <div v-if="editMode" class="absolute top-4 left-4 bg-white/90 rounded-lg p-3">
            <p class="text-sm font-medium text-gray-800">Edit Mode Active</p>
            <p class="text-xs text-gray-600">• Drag plants to move them</p>
            <p class="text-xs text-gray-600">• Click × to remove items</p>
            <p class="text-xs text-gray-600">• Use inventory to add new items</p>
          </div>
        </div>
      </div>

      <!-- Inventory Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-lg p-4">
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
          <div>
            <h3 class="text-md font-medium mb-3 text-green-700 flex items-center">
              <span class="text-lg mr-2">🌿</span>
              Plants & Decorations
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="plant in ownedPlants"
                :key="plant.id"
                class="bg-green-50 border border-green-200 rounded-lg p-2 text-center cursor-pointer hover:bg-green-100 transition"
                :class="{ 'opacity-50': getPlantUsageCount(plant.id) >= plant.maxQuantity }"
                @click="addPlantToTank(plant)"
              >
                <img :src="plant.img" :alt="plant.name" class="w-8 h-10 mx-auto mb-1 object-contain" style="image-rendering: pixelated;" />
                <p class="text-xs font-medium">{{ plant.name }}</p>
                <p class="text-xs text-gray-500">
                  {{ getPlantUsageCount(plant.id) }}/{{ plant.maxQuantity }} placed
                </p>
              </div>
            </div>
            <p v-if="ownedPlants.length === 0" class="text-sm text-gray-500 text-center py-4">
              No plants owned. Visit the <NuxtLink to="/shop" class="text-sky-600 hover:underline">shop</NuxtLink> to buy some!
            </p>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-white rounded-lg shadow-lg p-4 mt-4">
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
const placedPlants = ref([]);
const activeFish = ref([]);
const bubbles = ref([]);
const draggedItem = ref(null);
const dragOffset = ref({ x: 0, y: 0 });

// Animation intervals
let fishAnimationInterval = null;
let bubbleInterval = null;

const playerPearls = computed(() => userStore.pearls);

// Fish and plant data with swimming behavior
const swimmesingFish = computed(() => {
  return activeFish.value.map(fish => ({
    ...fish,
    x: fish.swimX || 20,
    y: fish.swimY || 50,
    direction: fish.direction || 'right'
  }));
});

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
const toggleEditMode = () => {
  editMode.value = !editMode.value;
  if (!editMode.value) {
    saveAquariumLayout();
  }
};

// Fish management
const toggleFish = (fish) => {
  const fishIndex = activeFish.value.findIndex(f => f.id === fish.id);
  if (fishIndex >= 0) {
    // Remove fish from tank
    activeFish.value.splice(fishIndex, 1);
  } else {
    // Add fish to tank
    const startX = Math.random() * 80 + 10;
    const startY = Math.random() * 50 + 20;
    activeFish.value.push({
      id: fish.id,
      name: fish.name,
      img: fish.img,
      color: fish.color,
      swimX: startX,
      swimY: startY,
      targetX: Math.random() * 80 + 10,
      targetY: Math.random() * 50 + 20,
      direction: Math.random() > 0.5 ? 'right' : 'left'
    });
  }
  saveAquariumLayout();
};

// Plant management
const addPlantToTank = (plant) => {
  if (!editMode.value) {
    editMode.value = true;
  }
  
  const usageCount = getPlantUsageCount(plant.id);
  if (usageCount >= plant.maxQuantity) {
    return;
  }

  const newPlant = {
    id: `${plant.id}_${Date.now()}`,
    plantId: plant.id,
    name: plant.name,
    img: plant.img,
    x: Math.random() * 80 + 10, // Random placement
    y: Math.random() * 60 + 20,
  };

  placedPlants.value.push(newPlant);
  saveAquariumLayout();
};

const removePlant = (plantInstanceId) => {
  const index = placedPlants.value.findIndex(p => p.id === plantInstanceId);
  if (index >= 0) {
    placedPlants.value.splice(index, 1);
    saveAquariumLayout();
  }
};

// Drag and drop functionality
const startDrag = (plant, event) => {
  if (!editMode.value) return;
  
  // Prevent default behavior
  event.preventDefault();
  
  draggedItem.value = plant;
  
  // Get the event position (mouse or touch)
  const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
  const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;
  
  const rect = event.currentTarget.offsetParent.getBoundingClientRect();
  dragOffset.value = {
    x: clientX - rect.left - (plant.x * rect.width / 100),
    y: clientY - rect.top - (plant.y * rect.height / 100)
  };

  // Add both mouse and touch event listeners
  document.addEventListener('mousemove', handleDrag, { passive: false });
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', handleDrag, { passive: false });
  document.addEventListener('touchend', stopDrag);
};

const handleDrag = (event) => {
  if (!draggedItem.value) return;
  
  // Prevent scrolling and default behavior
  event.preventDefault();
  
  // Get the event position (mouse or touch)
  const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
  const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
  
  const tank = document.querySelector('.aquarium-tank');
  if (!tank) return;
  
  const rect = tank.getBoundingClientRect();
  const newX = ((clientX - rect.left - dragOffset.value.x) / rect.width) * 100;
  const newY = ((clientY - rect.top - dragOffset.value.y) / rect.height) * 100;
  
  // Keep plants within tank bounds
  draggedItem.value.x = Math.max(5, Math.min(95, newX));
  draggedItem.value.y = Math.max(10, Math.min(80, newY));
};

const stopDrag = () => {
  draggedItem.value = null;
  dragOffset.value = { x: 0, y: 0 };
  
  // Remove all event listeners
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('touchend', stopDrag);
  
  saveAquariumLayout();
};

// Tank click handler for edit mode
const handleTankClick = (event) => {
  if (!editMode.value || draggedItem.value) return;
  // Could implement click-to-place functionality here
};

// Fish swimming animation
const animateFish = () => {
  activeFish.value.forEach(fish => {
    // Initialize target positions if not set
    if (!fish.targetX || !fish.targetY) {
      fish.targetX = Math.random() * 80 + 10;
      fish.targetY = Math.random() * 60 + 20;
    }
    
    // Calculate distance to target
    const deltaX = fish.targetX - fish.swimX;
    const deltaY = fish.targetY - fish.swimY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // If close to target, pick a new random target
    if (distance < 5) {
      fish.targetX = Math.random() * 80 + 10;
      fish.targetY = Math.random() * 60 + 20;
    } else {
      // Move towards target
      const speed = 0.3 + Math.random() * 0.4;
      const moveX = (deltaX / distance) * speed;
      const moveY = (deltaY / distance) * speed;
      
      fish.swimX += moveX;
      fish.swimY += moveY;
      
      // Update direction based on movement
      fish.direction = moveX > 0 ? 'right' : 'left';
    }
    
    // Keep fish within bounds
    fish.swimX = Math.max(10, Math.min(90, fish.swimX));
    fish.swimY = Math.max(20, Math.min(75, fish.swimY));
    
    // Occasional random direction change (for more natural movement)
    if (Math.random() < 0.01) {
      fish.targetX = Math.random() * 80 + 10;
      fish.targetY = Math.random() * 60 + 20;
    }
  });
};

// Bubble generation
const generateBubbles = () => {
  if (bubbles.value.length < 5) {
    bubbles.value.push({
      id: Date.now(),
      x: Math.random() * 100,
      y: Math.random() * 20,
      delay: Math.random() * 2
    });
  }
  
  // Remove old bubbles
  bubbles.value = bubbles.value.filter((bubble, index) => index < 8);
};

// Save and load aquarium layout
const saveAquariumLayout = async () => {
  const layout = {
    plants: placedPlants.value,
    fish: activeFish.value.map(f => ({ 
      id: f.id, 
      swimX: f.swimX || 50, 
      swimY: f.swimY || 50, 
      targetX: f.targetX || Math.random() * 80 + 10,
      targetY: f.targetY || Math.random() * 50 + 20,
      direction: f.direction || 'right' 
    }))
  };
  
  console.log('Saving aquarium layout:', layout);
  
  try {
    const success = await userStore.updateAquariumLayout(layout);
    if (success) {
      console.log('Layout saved successfully');
    } else {
      console.error('Failed to save layout');
    }
  } catch (error) {
    console.error('Failed to save aquarium layout:', error);
  }
};

const loadAquariumLayout = () => {
  const layout = userStore.aquariumLayout;
  console.log('Loading aquarium layout:', layout);
  
  if (layout && Object.keys(layout).length > 0) {
    if (layout.plants) {
      placedPlants.value = layout.plants;
      console.log('Loaded plants:', placedPlants.value.length);
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

onMounted(async () => {
  try {
    if (!userStore.isLoggedIn) {
      await navigateTo('/login');
      return;
    }
    
    // Make sure user profile is loaded before trying to load layout
    if (!userStore.userProfile) {
      console.log('Loading user profile...');
      await userStore.loadUserProfile();
    }
    
    // Load the aquarium layout after profile is ready
    loadAquariumLayout();
    
    // Start animations
    fishAnimationInterval = setInterval(animateFish, 100);
    bubbleInterval = setInterval(generateBubbles, 3000);
    
    // Generate initial bubbles
    generateBubbles();
  } catch (error) {
    console.error('Failed to initialize aquarium:', error);
  }
});

onUnmounted(() => {
  if (fishAnimationInterval) {
    clearInterval(fishAnimationInterval);
  }
  if (bubbleInterval) {
    clearInterval(bubbleInterval);
  }
});
</script>

<style scoped>
.cursor-move {
  cursor: move;
}

.cursor-move:active {
  cursor: grabbing;
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
</style>