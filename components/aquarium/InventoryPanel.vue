<template>
  <div class="bg-white rounded-lg shadow-lg p-4 mb-4">
    <h2 class="text-lg font-semibold mb-4 text-gray-800">Inventory</h2>

    <!-- Fish Inventory -->
    <div class="mb-6">
      <h3 class="text-md font-medium mb-3 text-sky-700 flex items-center">
        <span class="text-lg mr-2">🐠</span>
        Fish Collection
      </h3>
      <div class="space-y-4">
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
          </div>

          <div class="grid grid-cols-3 gap-1 mb-3">
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
                <img :src="fish.img" :alt="fish.name" class="w-12 h-8 mb-1 object-contain pixelated" />
                <div class="flex items-center justify-center mt-1">
                  <div :class="fish.inTank ? 'bg-green-500' : 'bg-gray-300'" class="w-2 h-2 rounded-full"></div>
                </div>
              </div>
            </button>
          </div>

          <div class="flex justify-center space-x-4">
            <button
                @click="addNextFish(fishGroup)"
                :disabled="fishGroup.inTankCount >= fishGroup.totalCount || fishGroup.inTankCount >= fishGroup.maxQuantity"
                class="w-12 h-12 rounded-full text-3xl font-bold transition flex items-center justify-center"
                :class="[
                  fishGroup.inTankCount >= fishGroup.totalCount || fishGroup.inTankCount >= fishGroup.maxQuantity
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                ]"
                title="Add one fish"
            >
              +
            </button>
            <button
                @click="removeLastFish(fishGroup)"
                :disabled="fishGroup.inTankCount <= 0"
                class="w-12 h-12 rounded-full text-3xl font-bold transition flex items-center justify-center"
                :class="[
                  fishGroup.inTankCount <= 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                ]"
                title="Remove one fish"
            >
              −
            </button>
          </div>
        </div>
      </div>

      <p v-if="groupedFish.length === 0" class="text-sm text-gray-500 text-center py-4">
        No fish owned. Visit the <NuxtLink to="/shop" class="text-sky-600 hover:underline">shop</NuxtLink> to buy some!
      </p>
    </div>

    <!-- Grouped Plants Inventory -->
    <div class="mb-6">
      <h3 class="text-md font-medium mb-3 text-green-700 flex items-center">
        <span class="text-lg mr-2">🐚</span>
        Decoration
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <div
            v-for="plant in groupedPlants"
            :key="plant.id"
            class="bg-green-50 border border-green-200 rounded-lg p-2 text-center cursor-pointer hover:bg-green-100 transition"
            :class="{ 'opacity-50': getPlantUsageCount(plant.id) >= plant.maxQuantity }"
            @click="$emit('add-plant', plant)"
        >
          <img :src="plant.img" :alt="plant.name" class="w-8 h-8 mx-auto mb-1 object-contain pixelated" />
          <p class="text-xs font-medium">{{ plant.name }}</p>
          <p class="text-xs text-gray-500">{{ getPlantUsageCount(plant.id) }}/{{ plant.maxQuantity }}</p>
        </div>
      </div>
      <p v-if="groupedPlants.length === 0" class="text-sm text-gray-500 text-center py-4">
        No plants owned. Visit the <NuxtLink to="/shop" class="text-sky-600 hover:underline">shop</NuxtLink> to buy some!
      </p>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
  ownedFish: {type: Array, default: () => []},
  ownedPlants: {type: Array, default: () => []},
  getPlantUsageCount: {type: Function, default: () => 0},
});

const emit = defineEmits(['toggle-fish', 'add-plant']);

// Group fish by ID
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
    if (fish.inTank) groups[fish.id].inTankCount++;
  });
  return Object.values(groups);
});

// Group plants by ID
const groupedPlants = computed(() => {
  const groups = {};

  props.ownedPlants.forEach(plant => {
    if (!groups[plant.id]) {
      groups[plant.id] = {
        id: plant.id,
        name: plant.name,
        img: plant.img,
        count: 0
      };
    }
    groups[plant.id].count++;
    groups[plant.id].maxQuantity = groups[plant.id].count; // Set maxQuantity based on count
  });

  return Object.values(groups);
});


const addNextFish = (fishGroup) => {
  const next = fishGroup.instances.find(f => !f.inTank);
  if (next) emit('toggle-fish', next);
};

const removeLastFish = (fishGroup) => {
  const last = [...fishGroup.instances].reverse().find(f => f.inTank);
  if (last) emit('toggle-fish', last);
};
</script>

<style scoped>
.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>
