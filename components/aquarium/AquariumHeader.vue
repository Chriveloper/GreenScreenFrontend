<!-- components/aquarium/AquariumHeader.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-6 mb-8 border-t-4 border-sky-400">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Aquarium</h1>
        <p class="text-gray-600 mt-1">Manage your underwater paradise</p>
      </div>
      <div class="flex items-center space-x-4">
        <button
          :disabled="loading"
          class="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition"
          @click="$emit('toggle-edit-mode')"
        >
          {{ loading ? 'Loading...' : (editMode ? 'Exit Edit Mode' : 'Edit Aquarium') }}
        </button>
        <div class="text-right">
          <div class="flex items-center text-yellow-500 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-2xl font-bold">{{ playerPearls }}</span>
          </div>
          <span class="text-sm text-gray-500">Available Pearls</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';
import { computed } from 'vue';

defineProps({
  loading: Boolean,
  editMode: Boolean,
});

defineEmits(['toggle-edit-mode']);

const userStore = useUserStore();
const playerPearls = computed(() => userStore.pearls);
</script>
