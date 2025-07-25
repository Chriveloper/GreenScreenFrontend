<!-- components/aquarium/AquariumHeader.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-6 mb-8 border-t-4 border-sky-400">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Aquarium</h1>
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <div class="flex items-center text-yellow-500 mb-1">
            🦪
            <span class="text-2xl font-bold ml-1">{{ playerPearls }}</span>
          </div>
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
