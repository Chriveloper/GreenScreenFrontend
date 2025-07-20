<!-- components/FishTank.vue -->
<template>
  <div ref="tank" class="fishtank">
    <div
      v-for="(fish, index) in fishes"
      :key="index"
      class="fish"
      :style="getFishStyle(fish)"
    >
      <img :src="fish.src" alt="fish" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const tank = ref(null)
const fishes = ref([])

// Zufällige Fische erzeugen
function spawnFish() {
  const directions = ['left', 'right']
  const newFish = {
    src: `/fishtank/fish${Math.ceil(Math.random() * 3)}.png`,
    top: `${Math.random() * 80}%`,
    size: `${30 + Math.random() * 50}px`,
    direction: directions[Math.floor(Math.random() * 2)],
    speed: 1 + Math.random() * 2
  }
  fishes.value.push(newFish)
}

function getFishStyle(fish) {
  return {
    top: fish.top,
    width: fish.size,
    animation: `${fish.direction === 'left' ? 'swimLeft' : 'swimRight'} ${10 / fish.speed}s linear infinite`,
    transform: fish.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
  }
}

onMounted(() => {
  for (let i = 0; i < 5; i++) spawnFish()
})
</script>

<style scoped>
.fishtank {
  position: relative;
  width: 100%;
  height: 400px;
  background: linear-gradient(to bottom, #4fd1c5, #285e61);
  overflow: hidden;
}

.fish {
  position: absolute;
  left: -100px;
}

.fish img {
  height: 100%;
  width: auto;
  image-rendering: pixelated;
}

/* Animationen */
@keyframes swimRight {
  from {
    left: -100px;
  }
  to {
    left: 100%;
  }
}

@keyframes swimLeft {
  from {
    left: 100%;
  }
  to {
    left: -100px;
  }
}
</style>