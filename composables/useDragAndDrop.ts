// composables/useDragAndDrop.ts
import { ref, onUnmounted } from 'vue';

export function useDragAndDrop(placedPlants, saveAquariumLayout) {
  const draggedItem = ref(null);
  const dragOffset = ref({ x: 0, y: 0 });

  const startDrag = (plant, event) => {
    draggedItem.value = plant;
    const rect = event.target.getBoundingClientRect();
    dragOffset.value = {
      x: (event.clientX || event.touches?.[0]?.clientX) - rect.left - rect.width / 2,
      y: (event.clientY || event.touches?.[0]?.clientY) - rect.top - rect.height / 2
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('touchend', stopDrag);
  };

  const handleDrag = (event) => {
    if (!draggedItem.value) return;

    const tankRect = document.querySelector('.aquarium-tank').getBoundingClientRect();
    const clientX = event.clientX || event.touches?.[0]?.clientX;
    const clientY = event.clientY || event.touches?.[0]?.clientY;
    
    // Calculate x position as percentage of tank width
    const newX = ((clientX - tankRect.left) / tankRect.width) * 100;
    
    // Calculate y position as percentage from bottom within ground region
    const groundHeight = tankRect.height * 0.25; // 25% of tank height
    const clickY = tankRect.bottom - clientY;
    let newY = (clickY / groundHeight) * 25; // Scale to 0-25% range
    
    // Constrain to ground region
    newY = Math.max(0, Math.min(25, newY));
    
    // Update plant position
    draggedItem.value.x = Math.max(5, Math.min(95, newX));
    draggedItem.value.y = newY;
  };

  const stopDrag = () => {
    if (draggedItem.value) {
      saveAquariumLayout();
      draggedItem.value = null;
    }
    cleanupEventListeners();
  };

  const cleanupEventListeners = () => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', stopDrag);
  };

  onUnmounted(cleanupEventListeners);

  return {
    startDrag
  };
}
