<!-- components/aquarium/AquariumTank.vue -->
<template>
  <div 
    class="aquarium-tank rounded-lg shadow-lg p-4 relative overflow-hidden cursor-pointer pixelated-bg"
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
    
    <!-- Floor/substrate with fixed pixel size tiles -->
    <div 
      class="absolute bottom-0 left-0 right-0 ground-region rounded-b-lg z-10 floor-tiles"
      :style="getFloorStyle()"
    ></div>

    <!-- Placed Plants -->
    <div
      v-for="plant in placedPlants"
      :key="plant.id"
      class="absolute cursor-move z-20 plant-container group"
      :class="{ 'hover:scale-110': editMode, 'plant-sway': true }"
      :style="getPlantStyle(plant)"
      @mousedown="$emit('start-drag', plant, $event)"
      @touchstart="$emit('start-drag', plant, $event)"
    >
      <img 
        :src="plant.img" 
        :alt="plant.name"
        class="object-contain pixelated transition-transform plant-image"
        :style="getPlantImageStyle(plant)"
      />
      <!-- Plant controls in edit mode -->
      <div v-if="editMode" class="absolute -top-8 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600 transition"
          @click.stop="resizePlant(plant.id, 1)"
          title="Increase size scale"
        >
          +
        </button>
        <button
          class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600 transition"
          @click.stop="resizePlant(plant.id, -1)"
          title="Decrease size scale"
        >
          −
        </button>
        <button
          class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
          @click.stop="$emit('remove-plant', plant.id)"
          title="Remove plant"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Swimming Fish -->
    <div
      v-for="fish in activeFish"
      :key="`${fish.id}_${fish.instanceIndex || 0}`"
      class="absolute transition-all duration-1000 ease-in-out z-15 fish-container"
      :style="getFishStyle(fish)"
    >
      <img 
        :src="fish.img" 
        :alt="fish.name"
        class="object-contain pixelated fish-sprite"
        :style="getFishImageStyle(fish)"
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
      <p class="text-xs text-gray-600">• Click ground region to place plants</p>
      <p class="text-xs text-gray-600">• Hover plants for resize/remove options</p>
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

const emit = defineEmits(['start-drag', 'remove-plant', 'place-plant', 'resize-plant']);

// Plant positioning and scaling based on normalized pixel size
const getPlantStyle = (plant) => ({
  left: plant.x + '%',
  bottom: plant.y + '%',
  transform: 'translateX(-50%)',
  zIndex: 20 + Math.floor(plant.y / 5),
  animationDelay: (plant.id.charCodeAt(0) % 5) + 's',
});

// Plant image sizing - normalized pixel density with 7 scale levels
const getPlantImageStyle = (plant) => {
  // Base scaling factor for plant pixels to match ground tile pixels
  const baseScale = plant.scale || 1; // 1 = normal size, 0.3-2.0 for 7 levels
  
  return {
    width: `calc(var(--pixel-unit) * var(--plant-base-width) * ${baseScale})`,
    height: `calc(var(--pixel-unit) * var(--plant-base-height) * ${baseScale})`,
    objectFit: 'contain'
  };
};

// Fish positioning and normalized pixel sizing
const getFishStyle = (fish) => ({
  left: (fish.swimX || fish.x) + '%',
  top: (fish.swimY || fish.y) + '%',
  transform: `translate(-50%, -50%) ${fish.direction === 'left' ? 'scaleX(-1)' : ''}`,
  zIndex: Math.floor((fish.swimY || fish.y)) + 15,
});

// Fish image sizing - normalized pixel density
const getFishImageStyle = (fish) => ({
  width: `calc(var(--pixel-unit) * var(--fish-base-width))`,
  height: `calc(var(--pixel-unit) * var(--fish-base-height))`,
  objectFit: 'contain'
});

const getBubbleStyle = (bubble) => ({
  left: bubble.x + '%',
  top: bubble.y + '%',
  animationDelay: bubble.delay + 's',
  animationDuration: bubble.duration + 's',
  '--opacity': bubble.opacity
});

const getBackgroundStyle = () => {
  const bg = availableBackgrounds.find(b => b.id === props.selectedBackground);
  if (bg && bg.image) {
    return `background-image: url('${bg.image}'); background-size: cover; background-position: center; background-repeat: no-repeat;`;
  }
  return bg?.preview || 'background: linear-gradient(to bottom, #0ea5e9, #0284c7);';
};

const getFloorStyle = () => {
  const floor = availableFloors.find(f => f.id === props.selectedFloor);
  if (floor && floor.image) {
    // Ground tiles use the base pixel unit for consistent tile sizing
    return `
      background-image: url('${floor.image}'); 
      background-size: calc(var(--pixel-unit) * var(--ground-tile-size)) calc(var(--pixel-unit) * var(--ground-tile-size)); 
      background-repeat: repeat;
    `;
  }
  return floor?.preview || 'background: linear-gradient(to top, #fbbf24, #f59e0b);';
};

const getFrameStyle = () => {
  const frame = availableFrames.find(f => f.id === props.selectedFrame);
  if (frame && frame.image) return `background-image: url('${frame.image}'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center;`;
  return '';
};

const handleTankClick = (event) => {
  if (!props.editMode) return;
  
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  
  // Calculate y relative to the bottom of the tank (for ground region)
  const groundHeight = rect.height * 0.25; // 25% of tank height
  const clickY = rect.bottom - event.clientY;
  const y = (clickY / groundHeight) * 25; // Convert to percentage within ground region
  
  // Only allow placement if click is in ground region
  if (clickY <= groundHeight && clickY >= 0) {
    emit('place-plant', { x, y });
  }
};

const resizePlant = (plantId, scaleChange) => {
  emit('resize-plant', plantId, scaleChange);
};
</script>

<style scoped>
.cursor-move { cursor: move; }
.cursor-move:active { cursor: grabbing; }
.pixelated, .pixelated-bg { image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; }

.aquarium-tank { 
  aspect-ratio: 2/3; 
  width: 100%; 
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  
  /* Base pixel unit - the fundamental pixel size for the aquarium */
  --pixel-unit: calc(min(100vw - 2rem, 800px) / 1000); /* 1 pixel = 1/1000th of tank width */

  /* Ground tile pixel dimensions (e.g., if ground tiles are 32x32 pixels in the image) */
  --ground-tile-size: 60;
  
  /* Fish pixel dimensions (e.g., if fish sprites are 48x32 pixels) */
  --fish-base-width: 60;
  --fish-base-height: 40;
  
  /* Plant base pixel dimensions (e.g., if plants are 24x48 pixels on average) */
  --plant-base-width: 48;
  --plant-base-height: 96;
}

.ground-region { 
  height: 25%; 
}

.plant-container { 
  transition: transform 0.1s ease-out; 
  transform-origin: bottom center;
}

.plant-image, .fish-sprite {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.fish-container {
  will-change: transform, left, top;
  transition: left 1s ease-in-out, top 1s ease-in-out;
}

.plant-sway { 
  animation: sway 5s ease-in-out infinite; 
}

.floor-tiles { 
  background-attachment: local;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

@keyframes sway {
  0%, 50%, 100% { transform: translateX(-50%) rotate(0deg); }
  25% { transform: translateX(-50%) rotate(2deg); }
  75% { transform: translateX(-50%) rotate(-2deg); }
}

.bubble { 
  background: white; 
  animation: float-up linear forwards; 
  will-change: transform, opacity; 
}

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

/* Responsive adjustments - maintain pixel density */
@media (max-width: 768px) {
  .aquarium-tank {
    --pixel-unit: calc((100vw - 1rem) / 400);
  }
}

@media (max-width: 480px) {
  .aquarium-tank {
    --pixel-unit: calc((100vw - 0.5rem) / 400);
  }
}

/* High DPI display adjustments */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .pixelated, .pixelated-bg, .floor-tiles {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
}
</style>
