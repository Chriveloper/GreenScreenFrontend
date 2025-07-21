<template>
  <div class="fixed top-0 left-0 right-0 z-50" v-if="isLoading">
    <div class="h-1 bg-sky-100">
      <div 
        class="h-full bg-sky-600 transition-all duration-300 ease-out"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';

const isLoading = ref(false);
const progress = ref(0);
let progressInterval = null;

const startLoading = () => {
  isLoading.value = true;
  progress.value = 0;
  
  // Simulate progress
  progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 10;
    }
  }, 300);
};

const stopLoading = () => {
  progress.value = 100;
  setTimeout(() => {
    clearInterval(progressInterval);
    isLoading.value = false;
  }, 300);
};

provide('startLoading', startLoading);
provide('stopLoading', stopLoading);

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval);
});

defineExpose({ startLoading, stopLoading });
</script>