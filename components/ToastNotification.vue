<template>
  <div class="fixed bottom-4 right-4 z-50">
    <transition-group name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        :class="{
          'bg-green-100 border-green-500 text-green-700': toast.type === 'success',
          'bg-blue-100 border-blue-500 text-blue-700': toast.type === 'info',
          'bg-yellow-100 border-yellow-500 text-yellow-700': toast.type === 'warning',
          'bg-red-100 border-red-500 text-red-700': toast.type === 'error'
        }"
        class="mb-2 p-3 border-l-4 rounded-lg shadow-md max-w-xs animate-fadeIn flex items-center"
      >
        <div v-if="toast.type === 'success'" class="mr-2 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div v-else-if="toast.type === 'error'" class="mr-2 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';

const toasts = ref([]);

const showToast = (message, type = 'info', duration = 3000) => {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, duration);
};

// Provide the showToast method to all components
provide('showToast', showToast);

// Export for direct imports
defineExpose({ showToast });
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>