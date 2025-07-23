<!-- components/aquarium/TankStats.vue -->
<template>
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
</template>

<script setup>
defineProps({
  activeFish: {
    type: Array,
    default: () => [],
  },
  placedPlants: {
    type: Array,
    default: () => [],
  },
  tankHealth: {
    type: Number,
    default: 100,
  },
});
</script>
