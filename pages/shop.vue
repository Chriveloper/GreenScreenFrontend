<template>
  <div class="container mx-auto px-4 py-8">
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
              <div s
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
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Player currency
const playerPearls = localStorage.getItem("pearls") // Starting pearls

// Purchase modal
const showPurchaseModal = ref(false)
const purchasedItem = ref(null)

// Fish shop items
const fishShop = ref([
  {
    id: 'goldfish',
    name: 'Goldfish',
    emoji: '🐠',
    color: '#FFA726',
    price: 50,
    description: 'Classic orange goldfish',
    owned: false
  },
  {
    id: 'angelfish',
    name: 'Angelfish',
    emoji: '🐠',
    color: '#FFD54F',
    price: 75,
    description: 'Elegant striped angelfish',
    owned: false
  },
  {
    id: 'clownfish',
    name: 'Clownfish',
    emoji: '🐠',
    color: '#FF7043',
    price: 100,
    description: 'Colorful reef clownfish',
    owned: false
  },
  {
    id: 'blue_tang',
    name: 'Blue Tang',
    emoji: '🐟',
    color: '#42A5F5',
    price: 120,
    description: 'Beautiful blue tropical fish',
    owned: false
  },
  {
    id: 'royal_gramma',
    name: 'Royal Gramma',
    emoji: '🐠',
    color: '#AB47BC',
    price: 150,
    description: 'Purple and yellow beauty',
    owned: false
  },
  {
    id: 'mandarin_fish',
    name: 'Mandarin Fish',
    emoji: '🐠',
    color: '#66BB6A',
    price: 200,
    description: 'Exotic mandarin dragonet',
    owned: false
  },
  {
    id: 'seahorse',
    name: 'Seahorse',
    emoji: '🦄',
    color: '#8D6E63',
    price: 300,
    description: 'Mystical seahorse',
    owned: false
  },
  {
    id: 'pufferfish',
    name: 'Pufferfish',
    emoji: '🐡',
    color: '#FFAB40',
    price: 250,
    description: 'Spiky pufferfish',
    owned: false
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
    description: 'Basic green seaweed',
    owned: false
  },
  {
    id: 'coral_pink',
    name: 'Pink Coral',
    emoji: '🪸',
    color: '#EC407A',
    price: 40,
    description: 'Beautiful pink coral',
    owned: false
  },
  {
    id: 'coral_orange',
    name: 'Orange Coral',
    emoji: '🪸',
    color: '#FF7043',
    price: 45,
    description: 'Vibrant orange coral',
    owned: false
  },
  {
    id: 'anemone',
    name: 'Sea Anemone',
    emoji: '🪼',
    color: '#9C27B0',
    price: 60,
    description: 'Swaying sea anemone',
    owned: false
  },
  {
    id: 'kelp',
    name: 'Kelp Forest',
    emoji: '🌱',
    color: '#2E7D32',
    price: 80,
    description: 'Tall kelp plants',
    owned: false
  },
  {
    id: 'bubble_coral',
    name: 'Bubble Coral',
    emoji: '🫧',
    color: '#00BCD4',
    price: 100,
    description: 'Bubbly coral formation',
    owned: false
  },
  {
    id: 'treasure_chest',
    name: 'Treasure Chest',
    emoji: '💰',
    color: '#8D6E63',
    price: 150,
    description: 'Mysterious treasure chest',
    owned: false
  },
  {
    id: 'shipwreck',
    name: 'Shipwreck',
    emoji: '🚢',
    color: '#5D4037',
    price: 200,
    description: 'Ancient sunken ship',
    owned: false
  }
])

// Purchase functions
const buyFish = (fish) => {
  if (playerPearls.value >= fish.price && !fish.owned) {
    playerPearls.value -= fish.price
    fish.owned = true
    purchasedItem.value = fish
    showPurchaseModal.value = true
    
    // Save to localStorage
    savePurchases()
    savePearls()
    
    console.log(`Purchased ${fish.name} for ${fish.price} pearls`)
  }
}

const buyPlant = (plant) => {
  if (playerPearls.value >= plant.price && !plant.owned) {
    playerPearls.value -= plant.price
    plant.owned = true
    purchasedItem.value = plant
    showPurchaseModal.value = true
    
    // Save to localStorage
    savePurchases()
    savePearls()
    
    console.log(`Purchased ${plant.name} for ${plant.price} pearls`)
  }
}

const closePurchaseModal = () => {
  showPurchaseModal.value = false
  purchasedItem.value = null
}

// Save/Load functions
const savePurchases = () => {
  if (process.client) {
    const ownedFish = fishShop.value.filter(f => f.owned).map(f => f.id)
    const ownedPlants = plantShop.value.filter(p => p.owned).map(p => p.id)
    
    localStorage.setItem('ownedFish', JSON.stringify(ownedFish))
    localStorage.setItem('ownedPlants', JSON.stringify(ownedPlants))
  }
}

const savePearls = () => {
  if (process.client) {
    localStorage.setItem('playerPearls', playerPearls.value.toString())
  }
}

const loadPurchases = () => {
  if (process.client) {
    // Load pearls
    const savedPearls = localStorage.getItem('playerPearls')
    if (savedPearls) {
      playerPearls.value = parseInt(savedPearls)
    }
    
    // Load owned fish
    const ownedFish = JSON.parse(localStorage.getItem('ownedFish') || '[]')
    fishShop.value.forEach(fish => {
      if (ownedFish.includes(fish.id)) {
        fish.owned = true
      }
    })
    
    // Load owned plants
    const ownedPlants = JSON.parse(localStorage.getItem('ownedPlants') || '[]')
    plantShop.value.forEach(plant => {
      if (ownedPlants.includes(plant.id)) {
        plant.owned = true
      }
    })
  }
}

// Add pearls function (called when focus sessions complete)
const addPearls = (amount) => {
  playerPearls.value += amount
  savePearls()
}

// Expose addPearls function globally for other components
if (process.client) {
  window.addPearls = addPearls
}

onMounted(() => {
  loadPurchases()
})
</script>