<template>
  <div
      class="aquarium-tank rounded-lg shadow-lg p-4 relative overflow-hidden cursor-pointer pixelated-bg"
      :class="{ 'ring-2 ring-yellow-400': editMode }"
      :style="getBackgroundStyle()"
      @click="handleTankClick"
  >
    <!-- Initial Overlay -->
    <div v-if="!isReady" class="absolute inset-0 bg-grey-900 bg-opacity-80 flex items-center justify-center z-50">
      <span class="text-white text-xl font-bold animate-pulse">Loading Aquarium...</span>
    </div>

    <!-- Main Content -->
    <template v-if="isReady">
      <div class="absolute top-4 right-4 z-30">
        <button
            class="bg-sky-600/60 hover:bg-sky-600/80 disabled:bg-gray-400/50 text-white px-4 py-2 rounded-md font-medium transition"
            @click="$emit('toggle-edit-mode')"
        >
          {{ editMode ? 'Exit Edit Mode' : 'Edit Aquarium' }}
        </button>
      </div>

      <div class="absolute inset-0 bg-blue-400 bg-opacity-20 rounded-lg pointer-events-none z-5"></div>

      <!-- Floor -->
      <div
          class="absolute bottom-0 left-0 right-0 ground-region rounded-b-lg z-5 floor-tiles"
          :style="getFloorStyle()"
      ></div>

      <!-- Plants -->
      <div
          v-for="plant in placedPlants"
          :key="plant.id"
          class="absolute cursor-move group transition-transform transform-origin-bottom-center"
          :class="[
          'plant-container plant-sway',
          'z-20'
        ]"
          :style="getPlantStyle(plant)"
          @mousedown="editMode ? $emit('start-drag', plant, $event) : null"
          @touchstart="editMode ? $emit('start-drag', plant, $event) : null"
      >
        <img
            :src="plant.img"
            :alt="plant.name"
            class="plant-image"
            :style="getPlantImageStyle(plant)"
        />

        <div
            v-if="editMode"
            class="absolute -top-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-50"
        >
          <button
              class="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg hover:bg-blue-600 transition"
              title="Increase size scale"
              @click.stop="resizePlant(plant.id, 1)"
          >
            +
          </button>
          <button
              class="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg hover:bg-blue-600 transition"
              title="Decrease size scale"
              @click.stop="resizePlant(plant.id, -1)"
          >
            −
          </button>
          <button
              class="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg hover:bg-red-600 transition"
              title="Remove plant"
              @click.stop="$emit('remove-plant', plant.id)"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Fish -->
      <div
          v-for="fish in activeFish"
          :key="`${fish.id}_${fish.instanceIndex || 0}`"
          class="absolute transition-all duration-1000 ease-in-out z-15 fish-container"
          :style="getFishStyle(fish)"
      >
        <img
            :src="fish.img"
            :alt="fish.name"
            class="fish-sprite"
            :style="getFishImageStyle()"
        />
      </div>

      <!-- Bubbles -->
      <div
          v-for="bubble in bubbles"
          :key="bubble.id"
          class="absolute rounded-full opacity-70 bubble z-1"
          :class="bubble.sizeClass"
          :style="getBubbleStyle(bubble)"
      ></div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { availableBackgrounds, availableFloors } from '~/data/aquarium/items';

const props = defineProps({
  placedPlants: Array,
  activeFish: Array,
  bubbles: Array,
  selectedBackground: String,
  selectedFloor: String,
  editMode: Boolean
});

const emit = defineEmits(['start-drag', 'remove-plant', 'place-plant', 'resize-plant', 'toggle-edit-mode']);

const isReady = ref(false);

watch(
    () => [props.placedPlants, props.activeFish, props.bubbles],
    ([plants, fish, bubbles]) => {
      if (plants.length > 0 || fish.length > 0 || bubbles.length > 0) {
        isReady.value = true;
      }
    },
    { immediate: true, deep: true }
);

const getPlantStyle = (plant) => {
  const transform = [];
  if (plant.x >= 10 && plant.x <= 90) transform.push('translateX(-50%)');

  return {
    left: plant.x + '%',
    bottom: plant.y + '%',
    width: `${48 * (plant.scale || 1)}px`,
    height: `${96 * (plant.scale || 1)}px`,
    transform: transform.join(' '),
    animationDelay: (plant.id.charCodeAt(0) % 5) + 's',
  };
};

const getPlantImageStyle = () => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain'
});

const getFishStyle = (fish) => {
  const x = fish.swimX || fish.x;
  const y = fish.swimY || fish.y;
  const transform = ['translateY(-50%)'];

  if (x >= 10 && x <= 90) transform.unshift('translateX(-50%)');
  if (fish.direction === 'left') transform.push('scaleX(-1)');

  return {
    left: x + '%',
    top: y + '%',
    width: '60px',
    height: '40px',
    transform: transform.join(' '),
    zIndex: y / 100 * 40,
  };
};

const getFishImageStyle = () => ({
  width: '100%',
  height: '100%',
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
  if (bg?.image) {
    return `background-image: url('${bg.image}'); background-size: cover; background-position: center; background-repeat: no-repeat;`;
  }
  return bg?.preview || 'background: linear-gradient(to bottom, #0ea5e9, #0284c7);';
};

const getFloorStyle = () => {
  const floor = availableFloors.find(f => f.id === props.selectedFloor);
  if (floor?.image) {
    return `
      background-image: url('${floor.image}');
      background-size: calc(var(--pixel-unit) * var(--ground-tile-size)) calc(var(--pixel-unit) * var(--ground-tile-size));
      background-repeat: repeat;
    `;
  }
  return floor?.preview || 'background: linear-gradient(to top, #fbbf24, #f59e0b);';
};

const resizePlant = (plantId, scaleChange) => emit('resize-plant', plantId, scaleChange);
</script>

<style scoped>
.aquarium-tank {
  aspect-ratio: 2/3;
  width: 100%;
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  --pixel-unit: calc(min(100vw - 2rem, 800px) / 1000);
  --ground-tile-size: 60;
}

.ground-region {
  height: 25%;
}

.plant-container {
  transition: transform 0.1s ease-out;
  transform-origin: bottom center;
}

.plant-image,
.fish-sprite {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  display: block;
}

.fish-container {
  will-change: transform, left, top;
  transition: left 1s ease-in-out, top 1s ease-in-out;
  position: absolute;
  transform-origin: center;
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
  0%,
  50%,
  100% {
    transform: translateX(-50%) rotate(0deg);
  }
  25% {
    transform: translateX(-50%) rotate(2deg);
  }
  75% {
    transform: translateX(-50%) rotate(-2deg);
  }
}

.bubble {
  background: white;
  animation: float-up linear forwards;
  will-change: transform, opacity;
}

@keyframes float-up {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0.7;
  }
  25% {
    transform: translateY(-25vh) translateX(5px);
  }
  50% {
    transform: translateY(-50vh) translateX(-5px);
  }
  75% {
    transform: translateY(-75vh) translateX(5px);
  }
  100% {
    transform: translateY(-100vh) translateX(0);
    opacity: 0;
  }
}

.z-5 {
  z-index: 5;
}
.z-10 {
  z-index: 10;
}
.z-15 {
  z-index: 15;
}
.z-25 {
  z-index: 25;
}
.z-30 {
  z-index: 30;
}
.z-50 {
  z-index: 50;
}

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
</style>
