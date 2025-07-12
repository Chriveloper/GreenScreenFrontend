<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
    </div>

    <!-- Rest of your shop content -->
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
        <!-- Fish Shop -->
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
                <div
                  class="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl"
                  :style="{ backgroundColor: fish.color }"
                >
                  
                  {{ fish.emoji }}
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

        <!-- Plants & Decorations Shop -->
        <div class="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-400">
          <h2 class="text-xl font-semibold text-green-700 mb-6 flex items-center">
            <span class="text-2xl mr-2">🌿</span>
            Plants & Decorations
          </h2>
          
          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="plant in plantShop" 
              :key="plant.id"
              class="bg-green-50 rounded-lg p-4 border border-green-200 relative"
              :class="{ 'opacity-50': plant.owned }"
            >
              <div class="text-center">
                <div 
                  class="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl"
                  :style="{ backgroundColor: plant.color }"
                >
                  {{ plant.emoji }}
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

      <!-- Purchase Confirmation Modal -->
      <div v-if="showPurchaseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
          <div class="text-center">
            <div class="text-4xl mb-4">{{ purchasedItem?.emoji }}</div>
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

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <svg class="animate-spin h-10 w-10 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4zm16 0a8 8 0 01-8 8v-8h8z"></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const isLoading = ref(true)

// Purchase modal
const showPurchaseModal = ref(false)
const purchasedItem = ref(null)

// Computed properties from store
const playerPearls = computed(() => userStore.pearls)
const ownedFish = computed(() => userStore.fish)
const ownedDecorations = computed(() => userStore.decorations)

// Fish shop items
const fishShop = ref([
  {
    id: 'goldfish',
    name: 'Goldfish',
    emoji: 'fish_1.gif',
    color: '#FFA726',
    price: 50,
    description: 'Classic orange goldfish'
  },
  {
    id: 'angelfish',
    name: 'Angelfish',
    emoji: '🐠',
    color: '#FFD54F',
    price: 75,
    description: 'Elegant striped angelfish'
  },
  {
    id: 'clownfish',
    name: 'Clownfish',
    emoji: '🐠',
    color: '#FF7043',
    price: 100,
    description: 'Colorful reef clownfish'
  },
  {
    id: 'blue_tang',
    name: 'Blue Tang',
    emoji: '🐟',
    color: '#42A5F5',
    price: 120,
    description: 'Beautiful blue tropical fish'
  },
  {
    id: 'royal_gramma',
    name: 'Royal Gramma',
    emoji: '🐠',
    color: '#AB47BC',
    price: 150,
    description: 'Purple and yellow beauty'
  },
  {
    id: 'mandarin_fish',
    name: 'Mandarin Fish',
    emoji: '🐠',
    color: '#66BB6A',
    price: 200,
    description: 'Exotic mandarin dragonet'
  },
  {
    id: 'seahorse',
    name: 'Seahorse',
    emoji: '🦄',
    color: '#8D6E63',
    price: 300,
    description: 'Mystical seahorse'
  },
  {
    id: 'pufferfish',
    name: 'Pufferfish',
    emoji: '🐡',
    color: '#FFAB40',
    price: 250,
    description: 'Spiky pufferfish'
  }
])

// Plant shop items
const plantShop = ref([
  {
    id: 'seaweed',
    name: 'Seaweed',
    emoji: '🌿',
    color: '#4CAF50',
    price: 25,
    description: 'Basic green seaweed'
  },
  {
    id: 'coral_pink',
    name: 'Pink Coral',
    emoji: '🪸',
    color: '#EC407A',
    price: 40,
    description: 'Beautiful pink coral'
  },
  {
    id: 'treasure_chest',
    name: 'Treasure Chest',
    emoji: '💰',
    color: '#8D6E63',
    price: 150,
    description: 'Mysterious treasure chest'
  },
  {
    id: 'shipwreck',
    name: 'Shipwreck',
    emoji: '🚢',
    color: '#5D4037',
    price: 200,
    description: 'Ancient sunken ship'
  }
])

// Computed properties to check if items are owned
const isFishOwned = (id) => ownedFish.value.includes(id)
const isDecorationOwned = (id) => ownedDecorations.value.includes(id)

// Purchase functions
const buyFish = async (fish) => {
  if (playerPearls.value >= fish.price && !isFishOwned(fish.id)) {
    const success = await userStore.purchaseItem('fish', fish)
    
    if (success) {
      purchasedItem.value = fish
      showPurchaseModal.value = true
      console.log(`Purchased ${fish.name} for ${fish.price} pearls`)
    }
  }
}

const buyPlant = async (plant) => {
  if (playerPearls.value >= plant.price && !isDecorationOwned(plant.id)) {
    const success = await userStore.purchaseItem('decorations', plant)
    
    if (success) {
      purchasedItem.value = plant
      showPurchaseModal.value = true
      console.log(`Purchased ${plant.name} for ${plant.price} pearls`)
    }
  }
}

const closePurchaseModal = () => {
  showPurchaseModal.value = false
  purchasedItem.value = null
}

onMounted(async () => {
  isLoading.value = true;
  
  // Check login status after a brief delay to ensure auth state is loaded
  setTimeout(async () => {
    console.log('Shop page mounted, checking auth state:', userStore.isLoggedIn);
    
    if (!userStore.isLoggedIn) {
      console.log('Not logged in, redirecting to login');
      navigateTo('/login')
      return;
    }
    
    // If we don't have user profile data yet, load it
    if (!userStore.userProfile && userStore.user) {
      await userStore.loadUserProfile();
    }
    
    isLoading.value = false;
  }, 300);
})
</script>