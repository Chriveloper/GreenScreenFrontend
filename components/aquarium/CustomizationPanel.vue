<template>
  <div class="bg-white rounded-lg shadow-lg p-4 mb-4">
    <h3 class="text-md font-semibold mb-3 text-gray-800">Customize Tank</h3>

    <!-- Background Selection -->
    <div class="mb-6">
      <h4 class="text-sm font-medium mb-2 text-gray-700">Background</h4>
      <div class="relative">
        <div class="flex gap-3 overflow-x-auto overflow-y-hidden custom-scroll pb-2">
          <div
              v-for="bg in availableBackgrounds"
              :key="bg.id"
              class="min-w-[7rem] h-28 border-2 rounded-lg cursor-pointer hover:scale-105 transition overflow-hidden pixelated-bg"
              :class="{ 'border-sky-500 ring-2 ring-sky-200': selectedBackground === bg.id }"
              :style="bg.preview"
              @click="$emit('select-item', 'background', bg.id)"
          >
            <div class="w-full h-full flex items-end justify-center text-sm font-bold text-white bg-black/30 px-1 text-center">
              {{ bg.name }}
            </div>
          </div>
        </div>
        <div class="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </div>

    <!-- Floor Selection -->
    <div class="mb-6">
      <h4 class="text-sm font-medium mb-2 text-gray-700">Floor</h4>
      <div class="relative">
        <div class="flex gap-3 overflow-x-auto overflow-y-hidden custom-scroll pb-2">
          <div
              v-for="floor in availableFloors"
              :key="floor.id"
              class="min-w-[7rem] h-28 border-2 rounded-lg cursor-pointer hover:scale-105 transition overflow-hidden pixelated-bg"
              :class="{ 'border-yellow-500 ring-2 ring-yellow-200': selectedFloor === floor.id }"
              :style="floor.preview"
              @click="$emit('select-item', 'floor', floor.id)"
          >
            <div class="w-full h-full flex items-end justify-center text-sm font-bold text-white bg-black/30 px-1 text-center">
              {{ floor.name }}
            </div>
          </div>
        </div>
        <div class="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { availableBackgrounds, availableFloors } from '~/data/aquarium/items';

defineProps({
  selectedBackground: {
    type: String,
    default: 'background_1b',
  },
  selectedFloor: {
    type: String,
    default: 'tiles_10',
  },
});

defineEmits(['select-item']);
</script>

<style>
.pixelated-bg {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

/* More visible scrollbar for horizontal scroll */
.custom-scroll::-webkit-scrollbar {
  height: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.4);
  border-radius: 3px;
}
</style>

