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
            <span class="mr-1 text-2xl">🦪</span>
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
        <h2 class="text-lg font-semibold text-sky-700 mb-4 flex items-center">🐠 Fish</h2>
        <div class="space-y-4">
          <div v-for="fish in availableFish" :key="fish.id" class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
            <div class="flex items-center">
              <img :src="fish.img" :alt="fish.name" class="w-12 h-12 pixelated mr-3" />
              <div>
                <p class="font-medium">{{ fish.name }}</p>
                <div class="flex items-center text-yellow-500 text-sm">
                  <span class="mr-1">🦪</span>{{ fish.price }}
                </div>
                <div class="text-gray-500 text-xs mt-1">Owned: {{ getItemCount(fish, 'fish') }}/3</div>
              </div>
            </div>
            <button
                :disabled="purchasing || playerPearls < fish.price || getItemCount(fish, 'fish') >= 3"
                class="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition"
                @click="purchaseItem(fish, 'fish')"
            >
              {{ purchasing ? 'Buying...' : (getItemCount(fish, 'fish') >= 3 ? 'Max Owned' : 'Buy') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Plants Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-green-700 mb-4 flex items-center">🌿 Plants</h2>
        <div class="space-y-4">
          <div v-for="plant in availablePlants" :key="plant.id" class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
            <div class="flex items-center">
              <img :src="plant.img" :alt="plant.name" class="w-12 h-12 pixelated mr-3" />
              <div>
                <p class="font-medium">{{ plant.name }}</p>
                <div class="flex items-center text-yellow-500 text-sm">
                  <span class="mr-1">🦪</span>{{ plant.price }}
                </div>
                <div class="text-gray-500 text-xs mt-1">Owned: {{ getItemCount(plant, 'plant') }}/3</div>
              </div>
            </div>
            <button
                :disabled="purchasing || playerPearls < plant.price || getItemCount(plant, 'plant') >= 3"
                class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition"
                @click="purchaseItem(plant, 'plant')"
            >
              {{ purchasing ? 'Buying...' : (getItemCount(plant, 'plant') >= 3 ? 'Max Owned' : 'Buy') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Decorations Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-purple-700 mb-4 flex items-center">🎨 Decorations</h2>
        <div class="space-y-4">
          <div v-for="decoration in availableDecorations" :key="decoration.id" class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
            <div class="flex items-center">
              <img :src="decoration.img" :alt="decoration.name" class="w-12 h-12 pixelated mr-3" />
              <div>
                <p class="font-medium">{{ decoration.name }}</p>
                <div class="flex items-center text-yellow-500 text-sm">
                  <span class="mr-1">🦪</span>{{ decoration.price }}
                </div>
                <div class="text-gray-500 text-xs mt-1">Owned: {{ getItemCount(decoration, 'decoration') }}/3</div>
              </div>
            </div>
            <button
                :disabled="purchasing || playerPearls < decoration.price || getItemCount(decoration, 'decoration') >= 3"
                class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition"
                @click="purchaseItem(decoration, 'decoration')"
            >
              {{ purchasing ? 'Buying...' : (getItemCount(decoration, 'decoration') >= 3 ? 'Max Owned' : 'Buy') }}
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
          <button class="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md font-medium" @click="closePurchaseModal">
            Continue Shopping
          </button>
          <NuxtLink to="/" class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium text-center" @click="closePurchaseModal">
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
  { id: 'goldfish', name: 'Goldfish', img: '/resources/fish/fish_1.gif', price: 50 },
  { id: 'angelfish', name: 'Angelfish', img: '/resources/fish/fish_2.gif', price: 75 },
  { id: 'clownfish', name: 'Clownfish', img: '/resources/fish/fish_3.gif', price: 100 },
  { id: 'blue_tang', name: 'Blue Tang', img: '/resources/fish/fish_4.gif', price: 125 },
  { id: 'royal_gramma', name: 'Royal Gramma', img: '/resources/fish/fish_5.gif', price: 150 },
]);

const availablePlants = ref([
  { id: 'plant1', name: 'Java Moss', img: '/resources/plants/plant_1.png', price: 25 },
  { id: 'plant2', name: 'Amazon Sword', img: '/resources/plants/plant_2.png', price: 40 },
  { id: 'plant3', name: 'Anubias', img: '/resources/plants/plant_3.png', price: 60 },
  { id: 'plant4', name: 'Water Wisteria', img: '/resources/plants/plant_4.png', price: 35 },
  { id: 'plant5', name: 'Hornwort', img: '/resources/plants/plant_5.png', price: 45 },
  { id: 'plant6', name: 'Cryptocoryne', img: '/resources/plants/plant_6.png', price: 55 },
  { id: 'plant7', name: 'Duckweed', img: '/resources/plants/plant_7.png', price: 30 },
  { id: 'plant8', name: 'Bucephalandra', img: '/resources/plants/plant_8.png', price: 65 },
  { id: 'plant9', name: 'Vallisneria', img: '/resources/plants/plant_9.png', price: 50 },
  { id: 'plant10', name: 'Rotala', img: '/resources/plants/plant_10.png', price: 40 },
  { id: 'plant11', name: 'Ludwigia', img: '/resources/plants/plant_11.png', price: 55 },
  { id: 'plant12', name: 'Dwarf Hairgrass', img: '/resources/plants/plant_12.png', price: 45 },
  { id: 'plant13', name: 'Marimo Moss Ball', img: '/resources/plants/plant_13.png', price: 70 },
  { id: 'plant14', name: 'Red Tiger Lotus', img: '/resources/plants/plant_14.png', price: 75 },
  { id: 'plant15', name: 'Java Fern', img: '/resources/plants/plant_15.png', price: 50 },
]);

const availableDecorations = ref([
  { id: 'plant_long_1', name: 'Tall Lotus', img: '/resources/plants/plant_long_1.png', price: 50 },
  { id: 'plant_long_2', name: 'Reed Grass', img: '/resources/plants/plant_long_2.png', price: 45 },
  { id: 'plant_long_3', name: 'Large Amazon Sword', img: '/resources/plants/plant_long_3.png', price: 65 },
  { id: 'plant_long_4', name: 'Weeping Moss', img: '/resources/plants/plant_long_4.png', price: 55 },
  { id: 'shell_1', name: 'Shell', img: '/resources/plants/shell_1.png', price: 30 },
  { id: 'sponge_1', name: 'Sponge', img: '/resources/plants/sponge_1.png', price: 35 },
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

const getItemCount = (item, type) => {
  if (!userStore.userProfile) return 0;
  
  if (type === 'fish') {
    return userStore.fish.filter(id => id === item.id).length;
  } else if (type === 'plant') {
    return userStore.decorations.filter(id => id === item.id).length;
  } else if (type === 'decoration') {
    return userStore.decorations.filter(id => id === item.id).length;
  }
  
  return 0;
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
