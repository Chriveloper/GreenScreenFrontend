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
}

export function useAquariumAnimations(activeFish: Ref<Fish[]>, bubbles: Ref<Bubble[]>) {
  let fishAnimationInterval: NodeJS.Timeout | null = null;
  let bubbleInterval: NodeJS.Timeout | null = null;

  const biasedEdgeRandom = () => {
    const r = Math.random();
    if (r < 0.5) {
      // 50% chance: pick from left/top edge (0–20%)
      return Math.random() * 25;
    } else {
      // 50% chance: pick from right/bottom edge (80–100%)
      return 75 + Math.random() * 25;
    }
  };

  const randomX = () => biasedEdgeRandom();  // favor left and right edges
  const randomY = () => biasedEdgeRandom();  // favor top and bottom edges

  const animateFish = () => {
    activeFish.value.forEach((fish: Fish) => {
      // Set new random target if none exists
      if (fish.targetX === undefined || fish.targetY === undefined) {
        fish.targetX = randomX();
        fish.targetY = randomY();
      }

      const dx = fish.targetX - fish.swimX;
      const dy = fish.targetY - fish.swimY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If close to the target, pick a new one
      if (distance < 2) {
        fish.targetX = randomX();
        fish.targetY = randomY();
      } else {
        // Dynamic speed: slower when near target, faster when far
        const maxSpeed = 0.3;
        const minSpeed = 0.1;
        const speed = Math.max(minSpeed, Math.min(maxSpeed, distance * 0.05));

        // Apply easing for smoother turning
        const easing = 0.05;
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        fish.swimX += (moveX - fish.prevVX || 0) * easing + (fish.prevVX || 0);
        fish.swimY += (moveY - fish.prevVY || 0) * easing + (fish.prevVY || 0);

        // Store previous velocity for smoother easing next frame
        fish.prevVX = moveX;
        fish.prevVY = moveY;

        // Smooth direction update
        if (Math.abs(moveX) > 0.2) {
          fish.direction = moveX > 0 ? 'right' : 'left';
        }
      }

      // Clamp within 0–100 bounds
      fish.swimX = Math.max(0, Math.min(90, fish.swimX));
      fish.swimY = Math.max(0, Math.min(90, fish.swimY));

      // Occasionally assign a new target for unpredictable behavior
      if (Math.random() < 0.005) {
        fish.targetX = randomX();
        fish.targetY = randomY();
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
          sizeClass,
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
    if (fishAnimationInterval) clearInterval(fishAnimationInterval);
    if (bubbleInterval) clearInterval(bubbleInterval);
  });
}
