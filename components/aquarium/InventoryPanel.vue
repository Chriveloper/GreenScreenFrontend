<!-- components/aquarium/InventoryPanel.vue -->
<template>
  <div class="bg-white rounded-lg shadow-lg p-4 mb-4">
    <h2 class="text-lg font-semibold mb-4 text-gray-800">Inventory</h2>
    
    <!-- Fish Inventory -->
    <div class="mb-6">
      <h3 class="text-md font-medium mb-3 text-sky-700 flex items-center">
        <span class="text-lg mr-2">🐠</span>
        Fish Collection
      </h3>
      <div class="space-y-2">
        <div
          v-for="fishGroup in groupedFish"
          :key="fishGroup.id"
          class="bg-sky-50 border border-sky-200 rounded-lg p-3"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <img :src="fishGroup.img" :alt="fishGroup.name" class="w-8 h-6 mr-2 object-contain pixelated" />
              <div>
                <p class="font-medium text-sm">{{ fishGroup.name }}</p>
                <p class="text-xs text-gray-500">{{ fishGroup.inTankCount }}/{{ fishGroup.totalCount }} in tank</p>
              </div>
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-xs bg-sky-200 text-sky-800 px-2 py-1 rounded">
                {{ fishGroup.totalCount }}
              </span>
            </div>
          </div>
          
          <!-- Individual fish instances -->
          <div class="grid grid-cols-3 gap-1">
            <button
              v-for="fish in fishGroup.instances"
              :key="fish.uniqueKey"
              class="aspect-square border-2 rounded-lg p-1 text-center cursor-pointer hover:scale-105 transition text-xs"
              :class="{
                'border-green-500 bg-green-100 text-green-700': fish.inTank,
                'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100': !fish.inTank
              }"
              @click="$emit('toggle-fish', fish)"
              :title="fish.inTank ? 'Remove from tank' : 'Add to tank'"
            >
              <div class="flex flex-col items-center">
                <img :src="fish.img" :alt="fish.name" class="w-6 h-4 mb-1 object-contain pixelated" />
                <span class="text-xs font-medium">#{{ fish.instanceIndex + 1 }}</span>
                <div class="flex items-center justify-center mt-1">
                  <div 
                    v-if="fish.inTank" 
                    class="w-2 h-2 bg-green-500 rounded-full"
                    title="In tank"
                  ></div>
                  <div 
                    v-else 
                    class="w-2 h-2 bg-gray-300 rounded-full"
                    title="Available"
                  ></div>
                </div>
              </div>
            </button>
          </div>
          
          <!-- Quick toggle buttons -->
          <div class="flex space-x-2 mt-2 pt-2 border-t border-sky-200">
            <button
              v-if="fishGroup.inTankCount < fishGroup.totalCount && fishGroup.inTankCount < fishGroup.maxQuantity"
              @click="addNextFish(fishGroup)"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-2 rounded transition"
            >
              Add Next
            </button>
            <button
              v-if="fishGroup.inTankCount > 0"
              @click="removeLastFish(fishGroup)"
              class="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded transition"
            >
              Remove Last
            </button>
          </div>
        </div>
      </div>
      <p v-if="groupedFish.length === 0" class="text-sm text-gray-500 text-center py-4">
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
          :key="`${plant.id}_${plant.instanceIndex}`"
          class="bg-green-50 border border-green-200 rounded-lg p-2 text-center cursor-pointer hover:bg-green-100 transition"
          :class="{ 'opacity-50': getPlantUsageCount(plant.id) >= plant.maxQuantity }"
          @click="$emit('add-plant', plant)"
        >
          <img :src="plant.img" :alt="plant.name" class="w-8 h-8 mx-auto mb-1 object-contain pixelated" />
          <p class="text-xs font-medium">{{ plant.name }}</p>
          <p class="text-xs text-gray-500">{{ getPlantUsageCount(plant.id) }}/{{ plant.maxQuantity }}</p>
        </div>
      </div>
      <p v-if="ownedPlants.length === 0" class="text-sm text-gray-500 text-center py-4">
        No plants owned. Visit the <NuxtLink to="/shop" class="text-sky-600 hover:underline">shop</NuxtLink> to buy some!
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  ownedFish: {
    type: Array,
    default: () => [],
  },
  ownedPlants: {
    type: Array,
    default: () => [],
  },
  getPlantUsageCount: {
    type: Function,
    default: () => 0,
  },
});

const emit = defineEmits(['toggle-fish', 'add-plant']);

// Group fish by type
const groupedFish = computed(() => {
  const groups = {};
  
  props.ownedFish.forEach(fish => {
    if (!groups[fish.id]) {
      groups[fish.id] = {
        id: fish.id,
        name: fish.name,
        img: fish.img,
        color: fish.color,
        maxQuantity: fish.maxQuantity,
        instances: [],
        totalCount: 0,
        inTankCount: 0
      };
    }
    
    groups[fish.id].instances.push(fish);
    groups[fish.id].totalCount++;
    if (fish.inTank) {
      groups[fish.id].inTankCount++;
    }
  });
  
  return Object.values(groups);
});

// Helper functions for quick toggle
const addNextFish = (fishGroup) => {
  const nextFish = fishGroup.instances.find(fish => !fish.inTank);
  if (nextFish) {
    emit('toggle-fish', nextFish);
  }
};

const removeLastFish = (fishGroup) => {
  const lastFish = [...fishGroup.instances].reverse().find(fish => fish.inTank);
  if (lastFish) {
    emit('toggle-fish', lastFish);
  }
};
</script>

<style scoped>
.pixelated { 
  image-rendering: pixelated; 
  image-rendering: -moz-crisp-edges; 
  image-rendering: crisp-edges; 
}
</style>
