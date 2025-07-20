<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-sky-600">Aquarium Shop</h1>
        <div class="flex items-center bg-white rounded-lg shadow px-4 py-2 border-t-4 border-yellow-400">
          <span class="text-2xl mr-2">🐚</span>
          <span class="text-lg font-bold text-yellow-600">{{ playerPearls }}</span>
          <span class="text-sm text-gray-600 ml-1">Pearls</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow-lg p-6 border-t-4 border-sky-400">
          <h2 class="text-xl font-semibold text-sky-700 mb-6 flex items-center">
            <span class="text-2xl mr-2">🐠</span>
            Fish Collection
          </h2>

          <div class="grid grid-cols-2 gap-4">
            <div
                v-for="fish in fishShop"
                :key="fish.id"
                class="bg-sky-50 rounded-lg p-4 border border-sky-200 relative"
                :class="{ 'opacity-50': fish.owned }"
            >
              <div class="text-center">
                <div class="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                  <img :src="fish.img" alt="fish image" class="w-full h-full object-contain" style="image-rendering: pixelated;" />
                </div>
                <h3 class="font-semibold text-gray-800 mb-1">{{ fish.name }}</h3>
                <p class="text-xs text-gray-600 mb-3">{{ fish.description }}</p>
                <div class="flex items-center justify-center mb-3">
                  <span class="text-lg mr-1">🐚</span>
                  <span class="font-bold text-yellow-600">{{ fish.price }}</span>
                </div>
                <button
                    @click="buyFish(fish)"
                    :disabled="fish.owned || playerPearls < fish.price"
                    class="w-full py-2 px-3 rounded-md text-sm font-medium transition"
                    :class="fish.owned
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : playerPearls >= fish.price
                      ? 'bg-sky-600 hover:bg-sky-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'"
                >
                  {{ fish.owned ? 'Owned' : playerPearls >= fish.price ? 'Buy' : 'Not enough pearls' }}
                </button>
              </div>
              <div v-if="fish.owned" class="absolute top-2 right-2">
                <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-400">
          <h2 class="text-xl font-semibold text-green-700 mb-6 flex items-center">
            <span class="text-2xl mr-2">🌿</span>
            Plants & Decorations
          </h2>

          <div class="grid grid-cols-3 gap-4">
            <div
                v-for="plant in plantShop"
                :key="plant.id"
                class="bg-green-50 rounded-lg p-4 border border-green-200 relative"
                :class="{ 'opacity-50': plant.owned }"
            >
              <div class="text-center">
                <div class="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                  <img :src="plant.img" alt="plant image" class="w-full h-full object-contain" style="image-rendering: pixelated;" />
                </div>
                <h3 class="font-semibold text-gray-800 mb-1">{{ plant.name }}</h3>
                <p class="text-xs text-gray-600 mb-3">{{ plant.description }}</p>
                <div class="flex items-center justify-center mb-3">
                  <span class="text-lg mr-1">🐚</span>
                  <span class="font-bold text-yellow-600">{{ plant.price }}</span>
                </div>
                <button
                    @click="buyPlant(plant)"
                    :disabled="plant.owned || playerPearls < plant.price"
                    class="w-full py-2 px-3 rounded-md text-sm font-medium transition"
                    :class="plant.owned
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : playerPearls >= plant.price
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'"
                >
                  {{ plant.owned ? 'Owned' : playerPearls >= plant.price ? 'Buy' : 'Not enough pearls' }}
                </button>
              </div>
              <div v-if="plant.owned" class="absolute top-2 right-2">
                <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showPurchaseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
          <div class="text-center">
            <div class="w-32 h-32 mx-auto mb-4">
              <img v-if="purchasedItem?.img" :src="purchasedItem.img" alt="Purchased Item" class="w-full h-full object-contain" style="image-rendering: pixelated;" />
            </div>
            <h3 class="text-lg font-semibold mb-2">Purchase Successful!</h3>
            <p class="text-gray-600 mb-4">
              You've added {{ purchasedItem?.name }} to your aquarium!
            </p>
            <button
                @click="closePurchaseModal"
                class="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <svg class="animate-spin h-10 w-10 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4zm16 0a8 8 0 01-8 8v-8h8z"></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const isLoading = ref(true);

const showPurchaseModal = ref(false);
const purchasedItem = ref(null);

const playerPearls = computed(() => userStore.pearls);
const ownedFish = computed(() => userStore.fish || []);
const ownedDecorations = computed(() => userStore.decorations || []);

const fishShop = ref([
  { id: 'goldfish', name: 'Goldfish', img: '/resources/fish/fish_1.gif', color: '#FFA726', price: 50, description: 'Classic orange goldfish', owned: false },
  { id: 'angelfish', name: 'Angelfish', img: '/resources/fish/fish_2.gif', color: '#FFD54F', price: 75, description: 'Elegant striped angelfish', owned: false },
  { id: 'clownfish', name: 'Clownfish', img: '/resources/fish/fish_3.gif', color: '#FF7043', price: 100, description: 'Colorful reef clownfish', owned: false },
  { id: 'blue_tang', name: 'Blue Tang', img: '/resources/fish/fish_4.gif', color: '#42A5F5', price: 120, description: 'Beautiful blue tropical fish', owned: false },
  { id: 'royal_gramma', name: 'Royal Gramma', img: '/resources/fish/fish_5.gif', color: '#AB47BC', price: 150, description: 'Purple and yellow beauty', owned: false }
]);

watch(ownedFish, (newOwnedFish) => {
  fishShop.value.forEach(fish => {
    fish.owned = newOwnedFish.includes(fish.id);
  });
}, { immediate: true });

const plantShop = ref([
  { id: 'plant1', name: 'Java Moss', img: '/resources/plants/plant_1.png', color: '#4CAF50', price: 10, description: 'Soft green moss for aquariums', owned: false },
  { id: 'plant2', name: 'Amazon Sword', img: '/resources/plants/plant_2.png', color: '#4CAF50', price: 15, description: 'Large leafy plant for background', owned: false },
  { id: 'plant3', name: 'Anubias', img: '/resources/plants/plant_3.png', color: '#4CAF50', price: 20, description: 'Slow-growing hardy plant', owned: false },
  { id: 'plant4', name: 'Water Wisteria', img: '/resources/plants/plant_4.png', color: '#4CAF50', price: 25, description: 'Fast-growing light green plant', owned: false },
  { id: 'plant5', name: 'Hornwort', img: '/resources/plants/plant_5.png', color: '#4CAF50', price: 30, description: 'Floating or planted plant', owned: false },
  { id: 'plant6', name: 'Cryptocoryne', img: '/resources/plants/plant_6.png', color: '#4CAF50', price: 35, description: 'Beautiful brown-green leaves', owned: false },
  { id: 'plant7', name: 'Duckweed', img: '/resources/plants/plant_7.png', color: '#4CAF50', price: 40, description: 'Floating green cover', owned: false },
  { id: 'plant8', name: 'Bucephalandra', img: '/resources/plants/plant_8.png', color: '#4CAF50', price: 45, description: 'Exotic small-leaved plant', owned: false },
  { id: 'plant9', name: 'Vallisneria', img: '/resources/plants/plant_9.png', color: '#4CAF50', price: 50, description: 'Tall grass-like plant', owned: false },
  { id: 'plant10', name: 'Rotala', img: '/resources/plants/plant_10.png', color: '#4CAF50', price: 55, description: 'Bright red stem plant', owned: false },
  { id: 'plant11', name: 'Ludwigia', img: '/resources/plants/plant_11.png', color: '#4CAF50', price: 60, description: 'Colorful stem plant', owned: false },
  { id: 'plant12', name: 'Dwarf Hairgrass', img: '/resources/plants/plant_12.png', color: '#4CAF50', price: 65, description: 'Short carpet plant', owned: false },
  { id: 'plant13', name: 'Marimo Moss Ball', img: '/resources/plants/plant_13.png', color: '#4CAF50', price: 70, description: 'Round green algae ball', owned: false },
  { id: 'plant14', name: 'Red Tiger Lotus', img: '/resources/plants/plant_14.png', color: '#4CAF50', price: 75, description: 'Red patterned leaves', owned: false },
  { id: 'plant15', name: 'Java Fern', img: '/resources/plants/plant_15.png', color: '#4CAF50', price: 80, description: 'Classic aquarium plant', owned: false },

  { id: 'plant_long_1', name: 'Tall Lotus', img: '/resources/plants/plant_long_1.png', color: '#4CAF50', price: 90, description: 'Tall decorative lotus plant', owned: false },
  { id: 'plant_long_2', name: 'Reed Grass', img: '/resources/plants/plant_long_2.png', color: '#4CAF50', price: 95, description: 'Thin reed-like grass', owned: false },
  { id: 'plant_long_3', name: 'Large Amazon Sword', img: '/resources/plants/plant_long_3.png', color: '#4CAF50', price: 100, description: 'Large background centerpiece', owned: false },
  { id: 'plant_long_4', name: 'Weeping Moss', img: '/resources/plants/plant_long_4.png', color: '#4CAF50', price: 105, description: 'Unique cascading moss', owned: false },

  { id: 'shell_1', name: 'Shell', img: '/resources/plants/shell_1.png', color: '#4CAF50', price: 125, description: 'Shell', owned: false },

  { id: 'sponge_1', name: 'Sponge', img: '/resources/plants/sponge_1.png', color: '#4CAF50', price: 125, description: 'Sponge', owned: false },
]);

watch(ownedDecorations, (newOwnedDecorations) => {
  plantShop.value.forEach(plant => {
    plant.owned = newOwnedDecorations.includes(plant.id);
  });
}, { immediate: true });

const isFishOwned = (id) => ownedFish.value.includes(id);
const isDecorationOwned = (id) => ownedDecorations.value.includes(id);

const buyFish = async (fish) => {
  if (playerPearls.value >= fish.price && !isFishOwned(fish.id)) {
    const success = await userStore.purchaseItem('fish', fish);
    if (success) {
      fish.owned = true;
      purchasedItem.value = fish;
      showPurchaseModal.value = true;
    }
  }
};

const buyPlant = async (plant) => {
  if (playerPearls.value >= plant.price && !isDecorationOwned(plant.id)) {
    const success = await userStore.purchaseItem('decorations', plant);
    if (success) {
      plant.owned = true;
      purchasedItem.value = plant;
      showPurchaseModal.value = true;
    }
  }
};

const closePurchaseModal = () => {
  showPurchaseModal.value = false;
  purchasedItem.value = null;
};

onMounted(async () => {
  isLoading.value = true;
  try {
    // Only run auth checks on client side
    if (process.client) {
      setTimeout(async () => {
        if (!userStore.isLoggedIn) {
          navigateTo('/login');
          return;
        }
        if (!userStore.userProfile && userStore.user) {
          await userStore.loadUserProfile();
        }
        fishShop.value.forEach(fish => {
          fish.owned = ownedFish.value.includes(fish.id);
        });
        plantShop.value.forEach(plant => {
          plant.owned = ownedDecorations.value.includes(plant.id);
        });
        isLoading.value = false;
      }, 300);
    } else {
      // On server side, just stop loading
      isLoading.value = false;
    }
  } catch (error) {
    console.error('Error in shop setup:', error);
    isLoading.value = false;
  }
});
</script>
