import { ref, computed } from 'vue';
import { useUserStore } from '~/stores/user';
import { fishData, plantData, availableBackgrounds, availableFloors, availableFrames } from '~/data/aquarium/items';

export function useAquarium() {
  const userStore = useUserStore();

  // Reactive state
  const placedPlants = ref([]);
  const activeFish = ref([]);
  const selectedBackground = ref('default');
  const selectedFloor = ref('sand');
  const selectedFrame = ref('none');
  const loading = ref(false);
  const message = ref('');
  const messageType = ref('success');

  // Show message helper
  const showMessage = (text, type = 'success') => {
    message.value = text;
    messageType.value = type;
    setTimeout(() => {
      message.value = '';
    }, 3000);
  };

  // Save layout
  const saveAquariumLayout = async () => {
    const layout = {
      plants: placedPlants.value.map(p => ({
        ...p,
        y: p.y || p.bottomOffset || 0,
        scale: p.scale || 1
      })),
      fish: activeFish.value.map(f => ({
        id: f.id,
        swimX: f.swimX || 50,
        swimY: f.swimY || 50,
        targetX: f.targetX || Math.random() * 80 + 10,
        targetY: f.targetY || Math.random() * 50 + 20,
        direction: f.direction || 'right',
        instanceIndex: f.instanceIndex || 0
      })),
      background: selectedBackground.value,
      floor: selectedFloor.value,
      frame: selectedFrame.value
    };

    try {
      const success = await userStore.updateAquariumLayout(layout);
      if (!success) throw new Error('Failed to save layout');
      return true;
    } catch (error) {
      console.error('Failed to save aquarium layout:', error);
      showMessage('Failed to save aquarium layout', 'error');
      throw error;
    }
  };

  // Load layout
  const loadAquariumLayout = () => {
    const layout = userStore.aquariumLayout;
    if (layout && Object.keys(layout).length > 0) {
      placedPlants.value = layout.plants?.map(p => ({
        ...p,
        y: p.y !== undefined ? p.y : (p.bottomOffset || Math.floor(Math.random() * 20)),
        scale: p.scale || 1
      })) || [];
      selectedBackground.value = layout.background || 'default';
      selectedFloor.value = layout.floor || 'sand';
      selectedFrame.value = layout.frame || 'none';
      activeFish.value = layout.fish?.map(savedFish => {
        const fishTemplate = fishData.find(f => f.id === savedFish.id);
        return { ...fishTemplate, ...savedFish };
      }).filter(f => f.name) || [];
    }
  };

  // Inventory Management
  const countOwnedItems = (itemId, collection) => collection.filter(id => id === itemId).length;

  const ownedFish = computed(() => {
    const result = [];
    const userFishIds = [...new Set(userStore.fish || [])];
    userFishIds.forEach(fishId => {
      const fishTemplate = fishData.find(f => f.id === fishId);
      if (fishTemplate) {
        const count = countOwnedItems(fishId, userStore.fish);
        for (let i = 0; i < count; i++) {
          const inTankList = activeFish.value.filter(f => f.id === fishId);
          result.push({ 
            ...fishTemplate, 
            instanceIndex: i, 
            inTank: i < inTankList.length,
            uniqueKey: `${fishId}_${i}`
          });
        }
      }
    });
    return result;
  });

  const ownedPlants = computed(() => {
    const result = [];
    const userPlantIds = [...new Set(userStore.decorations || [])];
    userPlantIds.forEach(plantId => {
      const plantTemplate = plantData.find(p => p.id === plantId);
      if (plantTemplate) {
        const count = countOwnedItems(plantId, userStore.decorations);
        for (let i = 0; i < count; i++) {
          result.push({ 
            ...plantTemplate, 
            instanceIndex: i,
            uniqueKey: `${plantId}_${i}`
          });
        }
      }
    });
    return result;
  });

  const getPlantUsageCount = (plantId) => placedPlants.value.filter(p => p.plantId === plantId).length;

  // Tank Health
  const tankHealth = computed(() => {
    const fishCount = activeFish.value.length;
    const plantCount = placedPlants.value.length;
    if (fishCount === 0) return 100;
    const ratio = plantCount / fishCount;
    return Math.min(100, Math.max(60, Math.round(75 + (ratio * 25))));
  });

  // Item Interactions
  const toggleFish = async (fish) => {
    if (loading.value) return;
    loading.value = true;
    try {
      const fishIndex = activeFish.value.findIndex(f => 
        f.id === fish.id && (f.instanceIndex || 0) === (fish.instanceIndex || 0)
      );
      
      if (fishIndex >= 0) {
        activeFish.value.splice(fishIndex, 1);
        showMessage(`${fish.name} removed from tank`, 'info');
      } else {
        const sameTypeCount = activeFish.value.filter(f => f.id === fish.id).length;
        if (sameTypeCount >= fish.maxQuantity) {
          showMessage(`Maximum number of ${fish.name} already in tank (${fish.maxQuantity})`, 'info');
          return;
        }
        const startX = Math.random() * 60 + 20;
        const startY = Math.random() * 50 + 15;
        activeFish.value.push({ 
          ...fish, 
          swimX: startX, 
          swimY: startY, 
          targetX: startX, 
          targetY: startY, 
          direction: 'right' 
        });
        showMessage(`${fish.name} added to tank`, 'success');
      }
      await saveAquariumLayout();
    } catch (error) {
      showMessage('Failed to update fish', 'error');
    } finally {
      loading.value = false;
    }
  };

  const addPlantToTank = async (plant) => {
    if (loading.value) return;
    if (getPlantUsageCount(plant.id) >= plant.maxQuantity) {
      showMessage(`Maximum ${plant.name} already placed`, 'info');
      return;
    }
    loading.value = true;
    try {
      const newPlant = {
        id: `${plant.id}_${Date.now()}`,
        plantId: plant.id,
        name: plant.name,
        img: plant.img,
        x: Math.random() * 90 + 5,
        y: Math.random() * 20 + 2,
        scale: 1
      };
      placedPlants.value.push(newPlant);
      await saveAquariumLayout();
      showMessage(`${plant.name} added to tank`, 'success');
    } catch (error) {
      showMessage('Failed to add plant', 'error');
    } finally {
      loading.value = false;
    }
  };

  const placePlantAtPosition = async (position, plant = null) => {
    if (loading.value) return;
    
    // If no plant specified, use the first available plant
    if (!plant) {
      const availablePlant = ownedPlants.value.find(p => 
        getPlantUsageCount(p.id) < p.maxQuantity
      );
      if (!availablePlant) {
        showMessage('No available plants to place', 'info');
        return;
      }
      plant = availablePlant;
    }

    if (getPlantUsageCount(plant.id) >= plant.maxQuantity) {
      showMessage(`Maximum ${plant.name} already placed`, 'info');
      return;
    }

    loading.value = true;
    try {
      const newPlant = {
        id: `${plant.id}_${Date.now()}`,
        plantId: plant.id,
        name: plant.name,
        img: plant.img,
        x: Math.max(5, Math.min(95, position.x)),
        y: Math.max(0, Math.min(25, position.y)), // Allow full range of ground region
        scale: 1
      };
      placedPlants.value.push(newPlant);
      await saveAquariumLayout();
      showMessage(`${plant.name} placed`, 'success');
    } catch (error) {
      showMessage('Failed to place plant', 'error');
    } finally {
      loading.value = false;
    }
  };

  const resizePlant = async (plantId, scaleChange) => {
    if (loading.value) return;
    
    const plant = placedPlants.value.find(p => p.id === plantId);
    if (!plant) return;

    const newScale = Math.max(0.5, Math.min(2.0, (plant.scale || 1) + scaleChange));
    plant.scale = newScale;
    
    try {
      await saveAquariumLayout();
      showMessage(`${plant.name} resized`, 'info');
    } catch (error) {
      showMessage('Failed to resize plant', 'error');
    }
  };

  const removePlant = async (plantId) => {
    if (loading.value) return;
    loading.value = true;
    try {
      const plantName = placedPlants.value.find(p => p.id === plantId)?.name || 'Plant';
      placedPlants.value = placedPlants.value.filter(p => p.id !== plantId);
      await saveAquariumLayout();
      showMessage(`${plantName} removed`, 'info');
    } catch (error) {
      showMessage('Failed to remove plant', 'error');
    } finally {
      loading.value = false;
    }
  };

  // Customization
  const selectItem = async (type, id) => {
    if (loading.value) return;
    loading.value = true;
    try {
      let itemName = 'Item';
      if (type === 'background') {
        selectedBackground.value = id;
        itemName = availableBackgrounds.find(b => b.id === id)?.name || 'Background';
      } else if (type === 'floor') {
        selectedFloor.value = id;
        itemName = availableFloors.find(f => f.id === id)?.name || 'Floor';
      } else if (type === 'frame') {
        selectedFrame.value = id;
        itemName = availableFrames.find(f => f.id === id)?.name || 'Frame';
      }
      await saveAquariumLayout();
      showMessage(`${itemName} selected`, 'success');
    } catch (error) {
      showMessage(`Failed to change ${type}`, 'error');
    } finally {
      loading.value = false;
    }
  };

  return {
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
  };
}