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
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="fish in ownedFish"
          :key="`${fish.id}_${fish.instanceIndex}`"
          class="bg-sky-50 border border-sky-200 rounded-lg p-2 text-center cursor-pointer hover:bg-sky-100 transition"
          :class="{
            'bg-sky-100 border-sky-400': fish.inTank,
            'bg-sky-50 border-sky-200': !fish.inTank
          }"
          @click="$emit('toggle-fish', fish)"
        >
          <div class="relative">
            <img :src="fish.img" :alt="fish.name" class="w-8 h-6 mx-auto mb-1 object-contain pixelated" />
            <span v-if="fish.inTank" class="absolute -top-2 -right-2 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>
          <p class="text-xs font-medium">{{ fish.name }}</p>
          <p class="text-xs" :class="{'text-green-600 font-medium': fish.inTank, 'text-gray-500': !fish.inTank}">
            {{ fish.inTank ? 'In Tank' : 'Available' }}
          </p>
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
          :key="`${plant.id}_${plant.instanceIndex}`"
          class="bg-green-50 border border-green-200 rounded-lg p-2 text-center cursor-pointer hover:bg-green-100 transition"
          :class="{ 'opacity-50': getPlantUsageCount(plant.id) >= plant.maxQuantity }"
          @click="$emit('add-plant', plant)"
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
</template>

<script setup>
defineProps({
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

defineEmits(['toggle-fish', 'add-plant']);
</script>

<style scoped>
.pixelated { 
  image-rendering: pixelated; 
  image-rendering: -moz-crisp-edges; 
  image-rendering: crisp-edges; 
}
</style>
