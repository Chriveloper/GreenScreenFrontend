<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Pearl Balance Header -->
    <div class="bg-white rounded-lg shadow p-6 mb-8 border-t-4 border-yellow-400">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Pearl Shop</h1>
          <p class="text-gray-600 mt-1">Spend your focus pearls on aquarium items</p>
        </div>
        <div class="text-right">
          <div class="flex items-center text-yellow-500 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-2xl font-bold">{{ playerPearls }}</span>
          </div>
          <span class="text-sm text-gray-500">Available Pearls</span>
        </div>
      </div>
    </div>

    <!-- Shop Categories -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Fish Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-sky-700 mb-4 flex items-center">
          🐠 Fish
        </h2>
        <div class="space-y-4">
          <div v-for="fish in availableFish" :key="fish.id" 
               class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
            <div class="flex items-center">
              <img :src="fish.img" :alt="fish.name" class="w-12 h-12 pixelated mr-3">
              <div>
                <p class="font-medium">{{ fish.name }}</p>
                <div class="flex items-center text-yellow-500 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ fish.price }}
                </div>
              </div>
            </div>
            <button 
              @click="purchaseItem(fish, 'fish')"
              :disabled="purchasing || playerPearls < fish.price"
              class="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition"
            >
              {{ purchasing ? 'Buying...' : 'Buy' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Plants Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-green-700 mb-4 flex items-center">
          🌿 Plants
        </h2>
        <div class="space-y-4">
          <div v-for="plant in availablePlants" :key="plant.id" 
               class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
            <div class="flex items-center">
              <img :src="plant.img" :alt="plant.name" class="w-12 h-12 pixelated mr-3">
              <div>
                <p class="font-medium">{{ plant.name }}</p>
                <div class="flex items-center text-yellow-500 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ plant.price }}
                </div>
              </div>
            </div>
            <button 
              @click="purchaseItem(plant, 'plant')"
              :disabled="purchasing || playerPearls < plant.price"
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition"
            >
              {{ purchasing ? 'Buying...' : 'Buy' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Decorations Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-purple-700 mb-4 flex items-center">
          🎨 Decorations
        </h2>
        <div class="space-y-4">
          <div v-for="decoration in availableDecorations" :key="decoration.id" 
               class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
            <div class="flex items-center">
              <img :src="decoration.img" :alt="decoration.name" class="w-12 h-12 pixelated mr-3">
              <div>
                <p class="font-medium">{{ decoration.name }}</p>
                <div class="flex items-center text-yellow-500 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ decoration.price }}
                </div>
              </div>
            </div>
            <button 
              @click="purchaseItem(decoration, 'decoration')"
              :disabled="purchasing || playerPearls < decoration.price"
              class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition"
            >
              {{ purchasing ? 'Buying...' : 'Buy' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchase Success Modal -->
    <div v-if="showPurchaseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Purchase Successful!</h3>
          <p class="text-gray-600 mt-2">{{ lastPurchaseItem.name }} has been added to your collection.</p>
        </div>
        <div class="flex space-x-3">
          <button @click="closePurchaseModal" class="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md font-medium">
            Continue Shopping
          </button>
          <NuxtLink to="/aquarium" @click="closePurchaseModal" class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium text-center">
            Go to Aquarium
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const purchasing = ref(false);
const showPurchaseModal = ref(false);
const lastPurchaseItem = ref({});

const playerPearls = computed(() => userStore.pearls);

// Sample items - replace with actual data
const availableFish = ref([
  { id: 'fish_1', name: 'Goldfish', img: '/resources/fish/fish_1.gif', price: 50 },
  { id: 'fish_2', name: 'Angelfish', img: '/resources/fish/fish_2.gif', price: 75 },
  { id: 'fish_3', name: 'Clownfish', img: '/resources/fish/fish_3.gif', price: 100 },
  { id: 'fish_4', name: 'Blue Tang', img: '/resources/fish/fish_4.gif', price: 125 },
  { id: 'fish_5', name: 'Royal Gramma', img: '/resources/fish/fish_5.gif', price: 150 },
]);

const availablePlants = ref([
  { id: 'plant_1', name: 'Java Moss', img: '/resources/plants/plant_1.png', price: 25 },
  { id: 'plant_2', name: 'Amazon Sword', img: '/resources/plants/plant_2.png', price: 40 },
  { id: 'plant_3', name: 'Anubias', img: '/resources/plants/plant_3.png', price: 60 },
  { id: 'plant_4', name: 'Water Wisteria', img: '/resources/plants/plant_4.png', price: 35 },
  { id: 'plant_5', name: 'Hornwort', img: '/resources/plants/plant_5.png', price: 45 },
]);

const availableDecorations = ref([
  { id: 'deco_1', name: 'Shell', img: '/resources/plants/shell_1.png', price: 30 },
  { id: 'deco_2', name: 'Sponge', img: '/resources/plants/sponge_1.png', price: 35 },
  { id: 'deco_3', name: 'Tall Lotus', img: '/resources/plants/plant_long_1.png', price: 50 },
]);

const purchaseItem = async (item, type) => {
  if (purchasing.value || playerPearls.value < item.price) return;
  
  purchasing.value = true;
  
  try {
    const success = await userStore.purchaseShopItem(item, type, item.price);
    if (success) {
      lastPurchaseItem.value = item;
      showPurchaseModal.value = true;
    }
  } catch (error) {
    console.error('Purchase failed:', error);
  } finally {
    purchasing.value = false;
  }
};

const closePurchaseModal = () => {
  showPurchaseModal.value = false;
};

onMounted(async () => {
  if (!userStore.userProfile) {
    await userStore.loadUserProfile();
  }
});
</script>

<style scoped>
.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>
