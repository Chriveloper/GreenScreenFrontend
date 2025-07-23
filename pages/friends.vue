<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Add debug info at the top of the page (remove in production) -->
    <div v-if="debug.enabled" class="bg-yellow-100 p-4 mb-4 rounded">
      <h3 class="font-bold">Debug Info:</h3>
      <pre class="text-xs mt-2 bg-yellow-50 p-2 rounded max-h-40 overflow-auto">{{ debug.log }}</pre>
      <button class="text-xs text-gray-600 mt-2" @click="debug.log = ''">Clear</button>
    </div>

    <!-- Header with Pearl Count -->
    <div class="bg-white rounded-lg shadow p-6 mb-8 border-t-4 border-sky-400">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Friends</h1>
          <p class="text-gray-600 mt-1">Connect with friends and view their aquariums</p>
        </div>
        <div class="text-right">
          <div class="flex items-center text-yellow-500 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-bold">{{ playerPearls }}</span>
          </div>
          <span class="text-xs text-gray-500">Your Pearls</span>
        </div>
      </div>
    </div>

    <!-- Search Users -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Find Friends</h2>
      
      <div class="flex space-x-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by username or display name..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          :disabled="searching"
          @input="handleSearch"
        />
        <button
          :disabled="searching || !searchQuery.trim()"
          class="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition"
          @click="searchUsers"
        >
          {{ searching ? 'Searching...' : 'Search' }}
        </button>
      </div>

      <!-- Search Results -->
      <div v-if="searchQuery.length >= 2" class="mt-4">
        <div v-if="searching" class="flex justify-center py-4">
          <div class="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="searchResults.length > 0" class="space-y-3">
          <div
v-for="user in searchResults" :key="user.id"
               class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
            <div>
              <p class="font-medium">{{ user.display_name || user.username }}</p>
              <p class="text-sm text-gray-500">@{{ user.username }}</p>
            </div>
            <button
              v-if="!friendIds.includes(user.id) && !sentRequestIds.includes(user.id)"
              :disabled="sendingRequest"
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              @click="sendRequest(user.id)"
            >
              {{ sendingRequest ? 'Sending...' : 'Send Request' }}
            </button>
            <span v-else-if="sentRequestIds.includes(user.id)" class="text-yellow-600 text-sm font-medium">
              Request Sent
            </span>
            <span v-else class="text-green-600 text-sm font-medium">
              ✓ Friends
            </span>
          </div>
        </div>
        <div v-else-if="searchQuery.length >= 2" class="text-center text-gray-500 py-4">
          No users found matching "{{ searchQuery }}"
        </div>
      </div>
    </div>

    <!-- Incoming Friend Requests -->
    <div v-if="incomingRequests.length > 0" class="bg-white rounded-lg shadow p-6 mb-8">
      <h3 class="text-md font-semibold text-gray-900 mb-4">Friend Requests</h3>
      <div class="space-y-3">
        <div
          v-for="request in incomingRequests"
          :key="request.friendship_id"
          class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
        >
          <div>
            <h3 class="font-medium">{{ request.display_name || request.username }}</h3>
            <p class="text-sm text-gray-600">@{{ request.username }}</p>
          </div>
          <div class="flex space-x-2">
            <button
              :disabled="processingRequest"
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition"
              @click="respondToRequest(request.friendship_id, 'accepted')"
            >
              {{ processingRequest ? 'Processing...' : 'Accept' }}
            </button>
            <button
              :disabled="processingRequest"
              class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition"
              @click="respondToRequest(request.friendship_id, 'declined')"
            >
              {{ processingRequest ? 'Processing...' : 'Decline' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Friends List -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Your Friends ({{ friendsList.length }})</h2>
      <div v-if="friendsList.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="friend in friendsList"
          :key="friend.id"
          class="p-4 border rounded-lg hover:bg-gray-50 transition"
        >
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="font-medium">{{ friend.display_name || friend.username }}</h3>
              <p class="text-sm text-gray-600">@{{ friend.username }}</p>
            </div>
            <div v-if="friend.pearls !== null" class="flex items-center text-yellow-500 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ friend.pearls }}
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button
              :disabled="loadingFriendAquarium || !friend.aquarium_layout"
              class="flex-1 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              @click="viewFriendAquarium(friend)"
            >
              {{ loadingFriendAquarium ? 'Loading...' : 'View Aquarium' }}
            </button>
            <button
              :disabled="processingRequest"
              class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition"
              @click="removeFriend(friend.id)"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-8">
        <p class="text-lg mb-2">No friends yet!</p>
        <p class="text-sm">Search for users above to add friends!</p>
      </div>
    </div>

    <!-- Friend Aquarium Modal -->
    <div v-if="selectedFriend" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{{ selectedFriend.display_name || selectedFriend.username }}'s Aquarium</h2>
          <button
            class="text-gray-500 hover:text-gray-700"
            @click="selectedFriend = null"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Friend's Aquarium Display -->
        <div v-if="loadingFriendAquarium" class="h-64 flex items-center justify-center">
          <div class="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="!selectedFriend.aquarium_layout" class="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
          <div class="text-center">
            <p class="text-lg text-gray-500">This aquarium is private or empty</p>
          </div>
        </div>
        <div v-else class="aspect-video bg-gradient-to-b from-sky-200 to-sky-400 rounded-lg relative overflow-hidden">
          <!-- This would be similar to your aquarium display but read-only -->
          <div class="w-full h-full relative">
            <!-- Background -->
            <div class="absolute inset-0 pixelated" :style="getFriendBackgroundStyle()"></div>
            
            <!-- Floor -->
            <div class="absolute bottom-0 left-0 right-0 h-20 pixelated" :style="getFriendFloorStyle()"></div>
            
            <!-- Plants -->
            <div
              v-for="plant in friendAquariumPlants"
              :key="plant.id"
              class="absolute"
              :style="getPlantStyle(plant)"
            >
              <img 
                :src="plant.img" 
                :alt="plant.name"
                class="w-16 h-20 object-contain pixelated"
              />
            </div>
            
            <!-- Fish -->
            <div
              v-for="fish in friendAquariumFish"
              :key="fish.id"
              class="absolute transition-all duration-1000 ease-in-out"
              :style="getFishStyle(fish)"
            >
              <img 
                :src="fish.img" 
                :alt="fish.name"
                class="w-12 h-10 object-contain pixelated"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="fixed bottom-4 right-4 z-50">
      <div
class="p-4 rounded-md shadow-lg max-w-sm" :class="{
        'bg-green-100 text-green-700 border border-green-200': messageType === 'success',
        'bg-red-100 text-red-700 border border-red-200': messageType === 'error',
        'bg-blue-100 text-blue-700 border border-blue-200': messageType === 'info'
      }">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

const searchQuery = ref('');
const searchResults = ref([]);
const searching = ref(false);
const sendingRequest = ref(false);
const processingRequest = ref(false);
const selectedFriend = ref(null);
const loadingFriendAquarium = ref(false);
const friendAquariumFish = ref([]);
const friendAquariumPlants = ref([]);
const message = ref('');
const messageType = ref('success');

// Computed properties for user data
const playerPearls = computed(() => userStore.pearls);
const friendsList = computed(() => userStore.friendsList);
const incomingRequests = computed(() => userStore.incomingRequests);
const sentRequestIds = computed(() => userStore.outgoingRequests.map(r => r.id));
const friendIds = computed(() => userStore.friendsList.map(f => f.id));

// Debug object
const debug = ref({
  enabled: true,  // Set to false in production
  log: ''
});

// Add a debug log message
const addDebugLog = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  debug.value.log = `[${timestamp}] ${message}\n${debug.value.log}`;
  console.log(message);
};

// Show message helper
const showMessage = (text, type = 'success') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Create a debounced search function
const debouncedSearch = debounce(() => {
  if (searchQuery.value.trim().length >= 2) {
    searchUsers();
  } else {
    searchResults.value = [];
  }
}, 300);

// Handle search input
const handleSearch = () => {
  debouncedSearch();
};

// Search for users
const searchUsers = async () => {
  if (searchQuery.value.trim().length < 2) {
    searchResults.value = [];
    return;
  }
  
  searching.value = true;
  addDebugLog(`Searching for: ${searchQuery.value}`);
  
  try {
    const results = await userStore.searchUsers(searchQuery.value);
    searchResults.value = results || [];
    addDebugLog(`Found ${searchResults.value.length} users`);
    
    if (searchResults.value.length === 0) {
      showMessage('No users found', 'info');
    }
  } catch (error) {
    addDebugLog(`Search error: ${error.message}`);
    showMessage('Search failed. Please try again.', 'error');
  } finally {
    searching.value = false;
  }
};

// Send a friend request
const sendRequest = async (userId) => {
  sendingRequest.value = true;
  addDebugLog(`Sending friend request to user: ${userId}`);
  
  try {
    const success = await userStore.sendFriendRequest(userId);
    if (success) {
      addDebugLog('Friend request sent successfully');
      showMessage('Friend request sent!', 'success');
      // Refresh search results to show updated state
      await searchUsers();
    } else {
      addDebugLog('Failed to send friend request');
      showMessage('Failed to send friend request', 'error');
    }
  } catch (error) {
    addDebugLog(`Friend request error: ${error.message}`);
    showMessage('Failed to send friend request', 'error');
  } finally {
    sendingRequest.value = false;
  }
};

// Respond to a friend request
const respondToRequest = async (friendshipId, response) => {
  processingRequest.value = true;
  addDebugLog(`Responding to friendship ${friendshipId} with: ${response}`);
  
  try {
    const success = await userStore.respondToFriendRequest(friendshipId, response);
    if (success) {
      addDebugLog(`Friend request ${response} successfully`);
      showMessage(`Friend request ${response}!`, response === 'accepted' ? 'success' : 'info');
    } else {
      addDebugLog(`Failed to ${response} friend request`);
      showMessage(`Failed to ${response} friend request`, 'error');
    }
  } catch (error) {
    addDebugLog(`ERROR: ${error.message}`);
    showMessage('An error occurred while responding to the friend request.', 'error');
  } finally {
    processingRequest.value = false;
  }
};

// Remove a friend
const removeFriend = async (friendId) => {
  if (confirm('Are you sure you want to remove this friend?')) {
    processingRequest.value = true;
    try {
      await userStore.removeFriend(friendId);
      showMessage('Friend removed', 'info');
    } catch (error) {
      showMessage('Failed to remove friend', 'error');
    } finally {
      processingRequest.value = false;
    }
  }
};

// Get CSS styles for fish animation
const getFishStyle = (fish) => {
  return {
    left: `${fish.swimX || fish.x}%`,
    top: `${fish.swimY || fish.y}%`,
    transform: fish.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
  };
};

// Get CSS styles for plant positioning
const getPlantStyle = (plant) => {
  return {
    left: `${plant.x}%`,
    top: `${plant.y}%`,
  };
};

// Get background style for friend's aquarium
const getFriendBackgroundStyle = () => {
  if (!selectedFriend.value?.aquarium_layout?.background) return 'background: linear-gradient(to bottom, #0ea5e9, #0284c7);';
  
  const bgId = selectedFriend.value.aquarium_layout.background;
  if (bgId.includes('background_')) {
    return `background-image: url("/resources/backgrounds/${bgId}.png"); background-size: cover; background-position: center;`;
  }
  
  return 'background: linear-gradient(to bottom, #0ea5e9, #0284c7);';
};

// Get floor style for friend's aquarium
const getFriendFloorStyle = () => {
  if (!selectedFriend.value?.aquarium_layout?.floor) return 'background: linear-gradient(to top, #fbbf24, #f59e0b);';
  
  const floorId = selectedFriend.value.aquarium_layout.floor;
  if (floorId.includes('tiles_')) {
    return `background-image: url("/resources/floor_tiles/${floorId}.png"); background-size: cover; background-position: center;`;
  }
  
  return 'background: linear-gradient(to top, #fbbf24, #f59e0b);';
};

// View a friend's aquarium
const viewFriendAquarium = async (friend) => {
  loadingFriendAquarium.value = true;
  selectedFriend.value = { ...friend };
  friendAquariumFish.value = [];
  friendAquariumPlants.value = [];
  
  try {
    const profile = await userStore.getFriendProfile(friend.id);
    if (profile) {
      selectedFriend.value = { ...friend, ...profile };
      
      // Process fish data if available
      if (profile.aquarium_layout?.fish) {
        // Map of fish data
        const fishData = {
          goldfish: { name: 'Goldfish', img: '/resources/fish/fish_1.gif' },
          angelfish: { name: 'Angelfish', img: '/resources/fish/fish_2.gif' },
          clownfish: { name: 'Clownfish', img: '/resources/fish/fish_3.gif' },
          blue_tang: { name: 'Blue Tang', img: '/resources/fish/fish_4.gif' },
          royal_gramma: { name: 'Royal Gramma', img: '/resources/fish/fish_5.gif' }
        };
        
        friendAquariumFish.value = profile.aquarium_layout.fish.map(fish => {
          const template = fishData[fish.id] || { name: 'Unknown Fish', img: '/resources/fish/fish_1.gif' };
          return {
            ...fish,
            ...template,
            direction: fish.direction || 'right'
          };
        });
      }
      
      // Process plants data if available
      if (profile.aquarium_layout?.plants) {
        // Map of plant data
        const plantData = {
          plant1: { name: 'Java Moss', img: '/resources/plants/plant_1.png' },
          plant2: { name: 'Amazon Sword', img: '/resources/plants/plant_2.png' },
          plant3: { name: 'Anubias', img: '/resources/plants/plant_3.png' },
          plant4: { name: 'Water Wisteria', img: '/resources/plants/plant_4.png' },
          plant5: { name: 'Hornwort', img: '/resources/plants/plant_5.png' }
        };
        
        friendAquariumPlants.value = profile.aquarium_layout.plants.map(plant => {
          const template = plantData[plant.plantId] || { name: 'Unknown Plant', img: '/resources/plants/plant_1.png' };
          return {
            ...plant,
            ...template
          };
        });
      }
    }
  } catch (error) {
    console.error('Error loading friend aquarium:', error);
    addDebugLog(`ERROR loading friend aquarium: ${error.message}`);
    showMessage('Unable to load friend\'s aquarium', 'error');
  } finally {
    loadingFriendAquarium.value = false;
  }
};

// On component mount, load friends data
onMounted(async () => {
  if (!userStore.isLoggedIn) {
    await navigateTo('/login');
    return;
  }
  
  console.log("Loading friends...");
  await userStore.loadFriends();
  console.log("Friends loaded:", {
    friends: userStore.friendsList.length,
    incoming: userStore.incomingRequests.length,
    outgoing: userStore.outgoingRequests.length
  });
});
</script>

<style scoped>
.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.spinner {
  border-color: #3b82f6;
  border-top-color: transparent;
}
</style>