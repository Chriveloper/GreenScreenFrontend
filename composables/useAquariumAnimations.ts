// composables/useAquariumAnimations.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useAquariumAnimations(activeFish, bubbles) {
  let fishAnimationInterval = null;
  let bubbleInterval = null;

  const animateFish = () => {
    activeFish.value.forEach(fish => {
      if (!fish.targetX || !fish.targetY) {
        fish.targetX = Math.random() * 60 + 20;
        fish.targetY = Math.random() * 50 + 15;
      }

      const deltaX = fish.targetX - fish.swimX;
      const deltaY = fish.targetY - fish.swimY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < 3) {
        fish.targetX = Math.random() * 60 + 20;
        fish.targetY = Math.random() * 50 + 15;
      } else {
        const speed = 0.4;
        const moveX = (deltaX / distance) * speed;
        const moveY = (deltaY / distance) * speed;
        fish.swimX += moveX;
        fish.swimY += moveY;
        fish.direction = moveX > 0 ? 'right' : 'left';
      }

      fish.swimX = Math.max(15, Math.min(85, fish.swimX));
      fish.swimY = Math.max(10, Math.min(70, fish.swimY));

      if (Math.random() < 0.008) {
        fish.targetX = Math.random() * 60 + 20;
        fish.targetY = Math.random() * 50 + 15;
      }
    });
  };

  const generateBubbles = () => {
    if (bubbles.value.length < 15) {
      const newBubbleCount = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < newBubbleCount; i++) {
        const size = Math.random();
        let sizeClass = 'w-1 h-1';
        if (size < 0.3) sizeClass = 'w-1 h-1';
        else if (size < 0.7) sizeClass = 'w-2 h-2';
        else sizeClass = 'w-3 h-3';
        
        bubbles.value.push({
          id: Date.now() + Math.random(),
          x: Math.random() * 90 + 5,
          y: Math.random() * 50,
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 4,
          opacity: 0.5 + Math.random() * 0.4,
          sizeClass: sizeClass
        });
      }
    }
    if (bubbles.value.length > 15) {
      bubbles.value = bubbles.value.slice(-15);
    }
  };

  onMounted(() => {
    fishAnimationInterval = setInterval(animateFish, 100);
    bubbleInterval = setInterval(generateBubbles, 2000);
    generateBubbles();
  });

  onUnmounted(() => {
    clearInterval(fishAnimationInterval);
    clearInterval(bubbleInterval);
  });
}
