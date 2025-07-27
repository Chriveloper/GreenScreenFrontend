import { ref, onUnmounted } from 'vue';
import type { Ref } from 'vue';

interface Plant {
  id: string;
  x: number;
  y: number;
  [key: string]: any;
}

export function useDragAndDrop(placedPlants: Ref<Plant[]>, saveAquariumLayout: () => Promise<void>) {
  const draggedItem = ref<Plant | null>(null);
  const dragOffset = ref({ x: 0, y: 0 });

  const startDrag = (plant: Plant, event: MouseEvent | TouchEvent) => {
    draggedItem.value = plant;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const clientX = 'clientX' in event ? event.clientX : event.touches?.[0]?.clientX || 0;
    const clientY = 'clientY' in event ? event.clientY : event.touches?.[0]?.clientY || 0;
    
    dragOffset.value = {
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('touchend', stopDrag);
  };

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    if (!draggedItem.value) return;

    const tankElement = document.querySelector('.aquarium-tank') as HTMLElement;
    if (!tankElement) return;
    
    const tankRect = tankElement.getBoundingClientRect();
    const clientX = 'clientX' in event ? event.clientX : event.touches?.[0]?.clientX || 0;
    const clientY = 'clientY' in event ? event.clientY : event.touches?.[0]?.clientY || 0;
    
    // Calculate x position as percentage of tank width
    const newX = ((clientX - tankRect.left) / tankRect.width) * 100;
    
    // Calculate y position as percentage from bottom within ground region
    const groundHeight = tankRect.height * 0.20; // 25% of tank height
    const clickY = tankRect.bottom - clientY;
    let newY = (clickY / groundHeight) * 20; // Scale to 0-25% range
    
    // Constrain to ground region
    newY = Math.max(0, Math.min(20, newY));
    
    // Update plant position
    if (draggedItem.value) {
      draggedItem.value.x = Math.max(5, Math.min(95, newX));
      draggedItem.value.y = newY;
    }
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