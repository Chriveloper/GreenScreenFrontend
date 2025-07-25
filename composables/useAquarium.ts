import { ref, computed } from 'vue';
import { useUserStore } from '~/stores/user';
import { fishData, plantData, availableBackgrounds, availableFloors } from '~/data/aquarium/items';

interface Plant {
  id: string;
  plantId: string;
  name: string;
  img: string;
  x: number;
  y: number;
  scale: number; // Scale multiplier for the plant size (0.3 to 2.0)
}

interface Fish {
  id: string;
  name: string;
  img: string;
  color: string;
  maxQuantity: number;
  swimX?: number;
  swimY?: number;
  targetX?: number;
  targetY?: number;
  direction?: 'left' | 'right';
  instanceIndex?: number;
}

interface Position {
  x: number;
  y: number;
}

export function useAquarium() {
  const userStore = useUserStore();

  // Reactive state
  const placedPlants = ref<Plant[]>([]);
  const activeFish = ref<Fish[]>([]);
  const selectedBackground = ref('default');
  const selectedFloor = ref('sand');
  const loading = ref(false);
  const message = ref('');
  const messageType = ref<'success' | 'error' | 'info'>('success');

  // Plant scale levels - 7 discrete scaling levels for consistent sizing
  const PLANT_SCALE_LEVELS = [0.3, 0.5, 0.7, 1.0, 1.3, 1.6, 2.0];
  const DEFAULT_SCALE_INDEX = 3; // Index for 1.0 scale

  // Show message helper
  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
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
        y: p.y || 0,
        scale: p.scale || PLANT_SCALE_LEVELS[DEFAULT_SCALE_INDEX]
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
      floor: selectedFloor.value
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
      placedPlants.value =
          layout.plants?.map((p: any) => ({
            ...p,
            y: p.y !== undefined ? p.y : Math.floor(Math.random() * 20),
            scale: p.scale || PLANT_SCALE_LEVELS[DEFAULT_SCALE_INDEX]
          })) || [];
      selectedBackground.value = layout.background || 'default';
      selectedFloor.value = layout.floor || 'sand';
      activeFish.value =
          layout.fish
              ?.map((savedFish: any) => {
                const fishTemplate = fishData.find(f => f.id === savedFish.id);
                return { ...fishTemplate, ...savedFish };
              })
              .filter((f: any) => f.name) || [];
    }
  };

  // Inventory Management
  const countOwnedItems = (itemId: string, collection: string[]) =>
      collection.filter(id => id === itemId).length;

  const ownedFish = computed(() => {
    const result: any[] = [];
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
    const result: any[] = [];
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

  const getPlantUsageCount = (plantId: string) =>
      placedPlants.value.filter(p => p.plantId === plantId).length;

  // Tank Health
  const tankHealth = computed(() => {
    const fishCount = activeFish.value.length;
    const plantCount = placedPlants.value.length;
    if (fishCount === 0) return 100;
    const ratio = plantCount / fishCount;
    return Math.min(100, Math.max(60, Math.round(75 + ratio * 25)));
  });

  // Item Interactions
  const toggleFish = async (fish: any) => {
    if (loading.value) return;
    loading.value = true;
    try {
      const fishIndex = activeFish.value.findIndex(
          f => f.id === fish.id && (f.instanceIndex || 0) === (fish.instanceIndex || 0)
      );

      if (fishIndex >= 0) {
        activeFish.value.splice(fishIndex, 1);
        //showMessage(`${fish.name} removed from tank`, 'info');
      } else {
        const sameTypeCount = activeFish.value.filter(f => f.id === fish.id).length;
        if (sameTypeCount >= fish.maxQuantity) {
          showMessage(
              `Maximum number of ${fish.name} already in tank (${fish.maxQuantity})`,
              'info'
          );
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

  const addPlantToTank = async (plant: any) => {
    if (loading.value) return;
    if (getPlantUsageCount(plant.id) >= plant.maxQuantity) {
      showMessage(`Maximum ${plant.name} already placed`, 'info');
      return;
    }
    loading.value = true;
    try {
      const newPlant: Plant = {
        id: `${plant.id}_${Date.now()}`,
        plantId: plant.id,
        name: plant.name,
        img: plant.img,
        x: Math.random() * 90 + 5,
        y: Math.random() * 20 + 2,
        scale: PLANT_SCALE_LEVELS[DEFAULT_SCALE_INDEX]
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

  const placePlantAtPosition = async (position: Position, plant: any = null) => {
    if (loading.value) return;

    // If no plant specified, use the first available plant
    if (!plant) {
      const availablePlant = ownedPlants.value.find(
          p => getPlantUsageCount(p.id) < p.maxQuantity
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
      const newPlant: Plant = {
        id: `${plant.id}_${Date.now()}`,
        plantId: plant.id,
        name: plant.name,
        img: plant.img,
        x: Math.max(5, Math.min(95, position.x)),
        y: Math.max(0, Math.min(25, position.y)),
        scale: PLANT_SCALE_LEVELS[DEFAULT_SCALE_INDEX]
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

  const resizePlant = async (plantId: string, scaleDirection: number) => {
    if (loading.value) return;

    const plant = placedPlants.value.find(p => p.id === plantId);
    if (!plant) return;

    const currentScale = plant.scale || PLANT_SCALE_LEVELS[DEFAULT_SCALE_INDEX];
    const currentIndex = PLANT_SCALE_LEVELS.findIndex(
        scale => Math.abs(scale - currentScale) < 0.05
    );

    let newIndex;
    if (scaleDirection > 0) {
      newIndex = Math.min(PLANT_SCALE_LEVELS.length - 1, currentIndex + 1);
    } else {
      newIndex = Math.max(0, currentIndex - 1);
    }

    const newScale = PLANT_SCALE_LEVELS[newIndex];
    plant.scale = newScale;

    try {
      await saveAquariumLayout();
    } catch (error) {
      showMessage('Failed to resize plant', 'error');
    }
  };

  const removePlant = async (plantId: string) => {
    if (loading.value) return;
    loading.value = true;
    try {
      const plantName = placedPlants.value.find(p => p.id === plantId)?.name || 'Plant';
      placedPlants.value = placedPlants.value.filter(p => p.id !== plantId);
      await saveAquariumLayout();
      //showMessage(`${plantName} removed`, 'info');
    } catch (error) {
      showMessage('Failed to remove plant', 'error');
    } finally {
      loading.value = false;
    }
  };

  // Customization
  const selectItem = async (type: string, id: string) => {
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
    showMessage,
    PLANT_SCALE_LEVELS
  };
}
