<template>
  <teleport to="body">
    <transition name="dialog">
      <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-50" @click="cancel"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            <p class="mt-2 text-gray-600">{{ message }}</p>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition" 
              @click="cancel"
            >
              {{ cancelText }}
            </button>
            <button 
              :class="[
                'px-4 py-2 rounded-md transition',
                type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-sky-600 hover:bg-sky-700 text-white'
              ]" 
              @click="confirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, provide } from 'vue';

const isVisible = ref(false);
const title = ref('Confirm Action');
const message = ref('Are you sure you want to continue?');
const confirmText = ref('Confirm');
const cancelText = ref('Cancel');
const type = ref('primary');

let resolvePromise = null;

const showConfirm = (options = {}) => {
  title.value = options.title || 'Confirm Action';
  message.value = options.message || 'Are you sure you want to continue?';
  confirmText.value = options.confirmText || 'Confirm';
  cancelText.value = options.cancelText || 'Cancel';
  type.value = options.type || 'primary';
  isVisible.value = true;
  
  return new Promise(resolve => {
    resolvePromise = resolve;
  });
};

const confirm = () => {
  isVisible.value = false;
  if (resolvePromise) resolvePromise(true);
};

const cancel = () => {
  isVisible.value = false;
  if (resolvePromise) resolvePromise(false);
};

provide('confirm', showConfirm);

defineExpose({ showConfirm });
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>