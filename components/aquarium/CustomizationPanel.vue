<!-- components/aquarium/CustomizationPanel.vue -->
<template>
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
          @click="$emit('select-item', 'background', bg.id)"
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
          @click="$emit('select-item', 'floor', floor.id)"
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
          @click="$emit('select-item', 'frame', frame.id)"
        >
          <div
v-if="frame.preview" 
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
</template>

<script setup>
import { availableBackgrounds, availableFloors, availableFrames } from '~/data/aquarium/items';

defineProps({
  selectedBackground: {
    type: String,
    default: 'default',
  },
  selectedFloor: {
    type: String,
    default: 'sand',
  },
  selectedFrame: {
    type: String,
    default: 'none',
  },
});

defineEmits(['select-item']);
</script>
