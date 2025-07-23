<!-- components/aquarium/AquariumTank.vue -->
<template>
  <div 
    class="aquarium-tank rounded-lg shadow-lg p-4 relative overflow-hidden cursor-pointer pixelated-bg"
    :class="{ 'ring-2 ring-yellow-400': editMode }"
    :style="getBackgroundStyle()"
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
      class="absolute bottom-0 left-0 right-0 ground-region rounded-b-lg pixelated-bg z-10"
      :style="getFloorStyle()"
    ></div>

    <!-- Placed Plants -->
    <div
      v-for="plant in placedPlants"
      :key="plant.id"
      class="absolute cursor-move z-20 plant-container"
      :class="{ 'hover:scale-110': editMode, 'plant-sway': true }"
      :style="getPlantStyle(plant)"
      @mousedown="$emit('start-drag', plant, $event)"
      @touchstart="$emit('start-drag', plant, $event)"
    >
      <img 
        :src="plant.img" 
        :alt="plant.name"
        class="w-16 h-20 object-contain pixelated"
      />
      <div
v-if="editMode" 
           class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600 transition"
           @click.stop="$emit('remove-plant', plant.id)">
        ×
      </div>
    </div>

    <!-- Swimming Fish -->
    <div
      v-for="fish in activeFish"
      :key="fish.id + fish.instanceIndex"
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
      class="absolute rounded-full opacity-70 bubble z-25"
      :class="bubble.sizeClass"
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
</template>

<script setup>
import { availableBackgrounds, availableFloors, availableFrames } from '~/data/aquarium/items';

const props = defineProps({
  placedPlants: {
    type: Array,
    default: () => [],
  },
  activeFish: {
    type: Array,
    default: () => [],
  },
  bubbles: {
    type: Array,
    default: () => [],
  },
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
  editMode: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['start-drag', 'remove-plant']);

const getPlantStyle = (plant) => ({
  left: plant.x + '%',
  bottom: plant.bottomOffset + 'px',
  transform: 'translateX(-50%)',
  zIndex: 20 + Math.floor(plant.x / 10),
  animationDelay: (plant.id.charCodeAt(0) % 5) + 's'
});

const getFishStyle = (fish) => ({
  left: (fish.swimX || fish.x) + '%',
  top: (fish.swimY || fish.y) + '%',
  transform: `translate(-50%, -50%) ${fish.direction === 'left' ? 'scaleX(-1)' : ''}`,
  zIndex: Math.floor((fish.swimY || fish.y)) + 15
});

const getBubbleStyle = (bubble) => ({
  left: bubble.x + '%',
  bottom: bubble.y + 'px',
  animationDuration: bubble.duration + 's',
  animationDelay: bubble.delay + 's',
  opacity: bubble.opacity
});

const getBackgroundStyle = () => {
  const bg = availableBackgrounds.find(b => b.id === props.selectedBackground);
  if (bg && bg.image) return `background-image: url('${bg.image}'); background-size: cover; background-position: center; background-repeat: no-repeat;`;
  return 'background: linear-gradient(to bottom, #0ea5e9, #0284c7);';
};

const getFloorStyle = () => {
  const floor = availableFloors.find(f => f.id === props.selectedFloor);
  if (floor && floor.image) return `background-image: url('${floor.image}'); background-size: cover; background-position: center bottom; background-repeat: no-repeat;`;
  return 'background: linear-gradient(to top, #fbbf24, #f59e0b);';
};

const getFrameStyle = () => {
  const frame = availableFrames.find(f => f.id === props.selectedFrame);
  if (frame && frame.image) return `background-image: url('${frame.image}'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center;`;
  return '';
};
</script>

<style scoped>
.cursor-move { cursor: move; }
.cursor-move:active { cursor: grabbing; }
.pixelated, .pixelated-bg { image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; }
.aquarium-tank { aspect-ratio: 3/2; width: 100%; position: relative; }
.ground-region { height: calc(100% / 6); }
.plant-container { transition: transform 0.1s ease-out; transform-origin: bottom center; }
.plant-sway { animation: sway 5s ease-in-out infinite; }
@keyframes sway {
  0%, 50%, 100% { transform: translateX(-50%) rotate(0deg); }
  25% { transform: translateX(-50%) rotate(2deg); }
  75% { transform: translateX(-50%) rotate(-2deg); }
}
.fish-container { will-change: transform, left, top; transition: left 1s ease-in-out, top 1s ease-in-out; }
.bubble { background: white; animation: float-up linear forwards; will-change: transform, opacity; }
@keyframes float-up {
  0% { transform: translateY(0) translateX(0); opacity: var(--opacity, 0.7); }
  25% { transform: translateY(-25vh) translateX(5px); }
  50% { transform: translateY(-50vh) translateX(-5px); }
  75% { transform: translateY(-75vh) translateX(5px); }
  100% { transform: translateY(-100vh) translateX(0); opacity: 0; }
}
.z-5 { z-index: 5; }
.z-10 { z-index: 10; }
.z-15 { z-index: 15; }
.z-20 { z-index: 20; }
.z-25 { z-index: 25; }
.z-30 { z-index: 30; }
.z-40 { z-index: 40; }
@media (max-width: 768px) {
  .plant-container img, .fish-container img { transform: scale(0.8); }
}
</style>
