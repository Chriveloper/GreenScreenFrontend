<template>
  <div class="w-screen max-w-full overflow-x-hidden px-4 py-6">
    <AquariumHeader
        :loading="loading"
        :edit-mode="editMode"
    />

    <!-- Stack layout vertically on all screens -->
    <div class="flex flex-col gap-6">
      <!-- Aquarium Tank Section -->
      <AquariumTank
          :placed-plants="placedPlants"
          :active-fish="activeFish"
          :bubbles="bubbles"
          :selected-background="selectedBackground"
          :selected-floor="selectedFloor"
          :edit-mode="editMode"
          :loading="loading"
          @start-drag="startDrag"
          @remove-plant="handleRemovePlant"
          @place-plant="handlePlacePlant"
          @resize-plant="handleResizePlant"
          @toggle-edit-mode="toggleEditMode"
      />

      <!-- Inventory + Customization + Stats -->
      <div class="flex flex-col gap-4">
        <InventoryPanel
            :owned-fish="ownedFish"
            :owned-plants="ownedPlants"
            :get-plant-usage-count="getPlantUsageCount"
            @toggle-fish="toggleFish"
            @add-plant="handleAddPlant"
        />
        <CustomizationPanel
            :selected-background="selectedBackground"
            :selected-floor="selectedFloor"
            @select-item="selectItem"
        />
        <TankStats
            :active-fish="activeFish"
            :placed-plants="placedPlants"
        />
      </div>
    </div>

    <!-- Message Toast -->
    <div v-if="message" class="fixed bottom-4 right-4 z-50 w-[90%] max-w-sm">
      <div
          class="p-4 rounded-md shadow-lg"
          :class="{
          'bg-green-100 text-green-700 border border-green-200': messageType === 'success',
          'bg-red-100 text-red-700 border border-red-200': messageType === 'error',
          'bg-blue-100 text-blue-700 border border-blue-200': messageType === 'info'
        }"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAquarium } from '~/composables/useAquarium';
import { useAquariumAnimations } from '~/composables/useAquariumAnimations';
import { useDragAndDrop } from '~/composables/useDragAndDrop';

import AquariumHeader from '~/components/aquarium/AquariumHeader.vue';
import AquariumTank from '~/components/aquarium/AquariumTank.vue';
import InventoryPanel from '~/components/aquarium/InventoryPanel.vue';
import CustomizationPanel from '~/components/aquarium/CustomizationPanel.vue';
import TankStats from '~/components/aquarium/TankStats.vue';

definePageMeta({ ssr: false });

const userStore = useUserStore();
const editMode = ref(false);

onMounted(() => {
  watch(editMode, (isEditing) => {
    if (isEditing) {
      document.body.style.overflow = 'hidden'; // Disable scroll
    } else {
      document.body.style.overflow = ''; // Re-enable scroll
    }
  }, { immediate: true }); // Optional: run immediately with current value
})

const {
  placedPlants,
  activeFish,
  selectedBackground,
  selectedFloor,
  loading,
  message,
  messageType,
  ownedFish,
  ownedPlants,
  loadAquariumLayout,
  saveAquariumLayout,
  toggleFish,
  addPlantToTank,
  placePlantAtPosition,
  resizePlant,
  removePlant,
  getPlantUsageCount,
  selectItem,
  showMessage
} = useAquarium();

const bubbles = ref([]);
useAquariumAnimations(activeFish, bubbles);

const { startDrag } = useDragAndDrop(placedPlants, saveAquariumLayout);

const toggleEditMode = async () => {
  if (loading.value) return;
  editMode.value = !editMode.value;
  if (!editMode.value) {
    loading.value = true;
    try {
      await saveAquariumLayout();
    } catch (error) {
      showMessage('Failed to save layout', 'error');
    } finally {
      loading.value = false;
    }
  }
};

const handleAddPlant = async (plant) => {

  await addPlantToTank(plant);
};

const handlePlacePlant = async (position) => {
  await
      placePlantAtPosition(position);
};

const handleResizePlant = async (plantId, scaleChange) => {
  await resizePlant(plantId, scaleChange);
};

const handleRemovePlant = async (plantId) => {
  await removePlant(plantId);
};

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    await navigateTo('/login');
    return;
  }

  loading.value = true;
  try {
    if (!userStore.userProfile) {
      await userStore.loadUserProfile();
    }
    loadAquariumLayout();
  } catch (error) {
    showMessage('Failed to load aquarium', 'error');
  } finally {
    loading.value = false;
  }
});
</script>
