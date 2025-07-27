import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

interface Fish {
  id: string;
  swimX: number;
  swimY: number;
  swimVY: number;
  swimVX: number;
  prevVY: number;
  prevVX: number;
  targetX?: number;
  targetY?: number;
  direction?: 'left' | 'right';
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  opacity: number;
  sizeClass: string;
  spawnedAt: number;
}

export function useAquariumAnimations(activeFish: Ref<Fish[]>, bubbles: Ref<Bubble[]>) {
  let fishAnimationInterval: NodeJS.Timeout | null = null;
  let bubbleInterval: NodeJS.Timeout | null = null;
  let bubbleCleanupInterval: NodeJS.Timeout | null = null;

  const biasedEdgeRandom = () => {
    const r = Math.random();
    if (r < 0.5) {
      return Math.random() * 25;
    } else {
      return 75 + Math.random() * 25;
    }
  };

  const randomX = () => biasedEdgeRandom();
  const randomY = () => biasedEdgeRandom();

  const animateFish = () => {
    activeFish.value.forEach((fish: Fish) => {
      if (fish.targetX === undefined || fish.targetY === undefined) {
        fish.targetX = randomX();
        fish.targetY = randomY();
      }

      const dx = fish.targetX - fish.swimX;
      const dy = fish.targetY - fish.swimY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 2) {
        fish.targetX = randomX();
        fish.targetY = randomY();
      } else {
        const maxSpeed = 0.3;
        const minSpeed = 0.1;
        const speed = Math.max(minSpeed, Math.min(maxSpeed, distance * 0.05));

        const easing = 0.05;
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        fish.swimX += (moveX - fish.prevVX || 0) * easing + (fish.prevVX || 0);
        fish.swimY += (moveY - fish.prevVY || 0) * easing + (fish.prevVY || 0);

        fish.prevVX = moveX;
        fish.prevVY = moveY;

        if (Math.abs(moveX) > 0.2) {
          fish.direction = moveX > 0 ? 'right' : 'left';
        }
      }

      fish.swimX = Math.max(0, Math.min(90, fish.swimX));
      fish.swimY = Math.max(0, Math.min(90, fish.swimY));

      if (Math.random() < 0.005) {
        fish.targetX = randomX();
        fish.targetY = randomY();
      }
    });
  };

  const generateBubbles = () => {
    const now = performance.now();

      const newBubbleCount = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < newBubbleCount; i++) {
        let sizeClass;
        if (Math.random() < 0.3) sizeClass = 'w-1 h-1';
        else sizeClass = 'w-2 h-2';

        const duration = 3 + Math.random() * 4;

        bubbles.value.push({
          id: Date.now() + Math.random(),
          x: Math.random() * 90 + 5,
          y: Math.random() * 30 + 60,
          delay: Math.random() * 2,
          duration,
          opacity: 0.5 + Math.random() * 0.4,
          sizeClass,
          spawnedAt: now,
        });
      }
  };

  const cleanupOldBubbles = () => {
    const now = performance.now();
    bubbles.value = bubbles.value.filter(
        (b) => now - b.spawnedAt < b.duration * 1000
    );
  };

  onMounted(() => {
    fishAnimationInterval = setInterval(animateFish, 100);
    bubbleInterval = setInterval(generateBubbles, 3000);
    bubbleCleanupInterval = setInterval(cleanupOldBubbles, 500);
    generateBubbles()
  });

  onUnmounted(() => {
    if (fishAnimationInterval) clearInterval(fishAnimationInterval);
    if (bubbleInterval) clearInterval(bubbleInterval);
    if (bubbleCleanupInterval) clearInterval(bubbleCleanupInterval);
  });
}
