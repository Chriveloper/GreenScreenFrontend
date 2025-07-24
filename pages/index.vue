<!-- pages/index.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <AquariumHeader
      :loading="loading"
      :edit-mode="editMode"
      @toggle-edit-mode="toggleEditMode"
    />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div class="lg:col-span-3">
        <AquariumTank
          :placed-plants="placedPlants"
          :active-fish="activeFish"
          :bubbles="bubbles"
          :selected-background="selectedBackground"
          :selected-floor="selectedFloor"
          :selected-frame="selectedFrame"
          :edit-mode="editMode"
          :loading="loading"
          @start-drag="startDrag"
          @remove-plant="handleRemovePlant"
          @place-plant="handlePlacePlant"
          @resize-plant="handleResizePlant"
        />
      </div>

      <div class="lg:col-span-1">
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
          :selected-frame="selectedFrame"
          @select-item="selectItem"
        />
        <TankStats
          :active-fish="activeFish"
          :placed-plants="placedPlants"
          :tank-health="tankHealth"
        />
      </div>
    </div>

    <div v-if="message" class="fixed bottom-4 right-4 z-50">
      <div
class="p-4 rounded-md shadow-lg max-w-sm" :class="{
        'bg-green-100 text-green-700 border border-green-200': messageType === 'success',
        'bg-red-100 text-red-700 border border-red-200': messageType === 'error',
        'bg-blue-100 text-blue-700 border border-blue-200': messageType === 'info'
      }">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

const {
  placedPlants,
  activeFish,
  selectedBackground,
  selectedFloor,
  selectedFrame,
  loading,
  message,
  messageType,
  ownedFish,
  ownedPlants,
  tankHealth,
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
      showMessage('Aquarium layout saved!', 'success');
    } catch (error) {
      showMessage('Failed to save layout', 'error');
    } finally {
      loading.value = false;
    }
  } else {
    showMessage('Edit mode activated!', 'info');
  }
};

const handleAddPlant = async (plant) => {
  if (!editMode.value) {
    editMode.value = true;
    showMessage('Edit mode activated to add plants.', 'info');
  }
  await addPlantToTank(plant);
};

const handlePlacePlant = async (position) => {
  await placePlantAtPosition(position);
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
    //showMessage('Aquarium loaded successfully!', 'success');
  } catch (error) {
    showMessage('Failed to load aquarium', 'error');
  } finally {
    loading.value = false;
  }
});
</script>
