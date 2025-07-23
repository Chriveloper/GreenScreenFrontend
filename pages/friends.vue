<template>
  <div class="min-h-screen w-full flex flex-col overflow-x-hidden bg-gray-50">
    <main class="flex-1 overflow-y-auto px-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] py-4 sm:px-4">
      <div class="w-full max-w-screen-sm mx-auto px-4">

        <!-- Debug Info -->
        <div v-if="debug.enabled" class="bg-yellow-100 p-3 mb-4 rounded">
          <h3 class="font-bold text-sm">Debug Info:</h3>
          <pre class="text-xs mt-2 bg-yellow-50 p-2 rounded h-32 overflow-y-auto whitespace-pre-wrap break-words">{{ debug.log }}</pre>
          <button class="text-xs text-gray-600 mt-2" @click="debug.log = ''">Clear</button>
        </div>

        <!-- Header -->
        <div class="bg-white rounded-lg shadow p-4 mb-6 border-t-4 border-sky-400">
          <h1 class="text-xl font-bold text-gray-900">Friends</h1>
          <p class="text-gray-600 mt-1 text-sm">Connect with friends and view their aquarium!</p>
        </div>

        <!-- Search -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <h2 class="text-base font-semibold text-gray-900 mb-3">Find Friends</h2>
          <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by username..."
                class="flex-1 px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
                :disabled="searching"
                @input="handleSearch"
            />
            <button
                :disabled="searching || !searchQuery.trim()"
                class="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium w-full sm:w-auto"
                @click="searchUsers"
            >
              {{ searching ? 'Searching...' : 'Search' }}
            </button>
          </div>

          <!-- Results -->
          <div v-if="searchQuery.length >= 2" class="mt-4">
            <div v-if="searching" class="flex justify-center py-4">
              <div class="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else-if="searchResults.length" class="space-y-3">
              <div
                  v-for="user in searchResults"
                  :key="user.id"
                  class="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
              >
                <div>
                  <p class="font-medium text-sm">{{ user.display_name || user.username }}</p>
                  <p class="text-xs text-gray-500">@{{ user.username }}</p>
                </div>
                <button
                    v-if="!friendIds.includes(user.id) && !sentRequestIds.includes(user.id)"
                    :disabled="sendingRequest"
                    class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-xs font-medium"
                    @click="sendRequest(user.id)"
                >
                  {{ sendingRequest ? 'Sending...' : 'Send Request' }}
                </button>
                <span v-else-if="sentRequestIds.includes(user.id)" class="text-yellow-600 text-xs font-medium">Request Sent</span>
                <span v-else class="text-green-600 text-xs font-medium">✓ Friends</span>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 py-4 text-sm">
              No users found matching "{{ searchQuery }}"
            </div>
          </div>
        </div>

        <!-- Friend Requests -->
        <div v-if="incomingRequests.length" class="bg-white rounded-lg shadow p-4 mb-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Friend Requests</h3>
          <div class="space-y-3">
            <div
                v-for="request in incomingRequests"
                :key="request.friendship_id"
                class="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
            >
              <div>
                <h3 class="font-medium text-sm">{{ request.display_name || request.username }}</h3>
                <p class="text-xs text-gray-600">@{{ request.username }}</p>
              </div>
              <div class="flex space-x-2">
                <button
                    :disabled="processingRequest"
                    class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-xs font-medium"
                    @click="respondToRequest(request.friendship_id, 'accepted')"
                >
                  {{ processingRequest ? '...' : 'Accept' }}
                </button>
                <button
                    :disabled="processingRequest"
                    class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-xs font-medium"
                    @click="respondToRequest(request.friendship_id, 'declined')"
                >
                  {{ processingRequest ? '...' : 'Decline' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Friends List -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <h2 class="text-base font-semibold text-gray-900 mb-3">Your Friends ({{ friendsList.length }})</h2>
          <div v-if="friendsList.length" class="space-y-3">
            <div
                v-for="friend in friendsList"
                :key="friend.id"
                class="p-3 border rounded hover:bg-gray-50"
            >
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h3 class="font-medium text-sm">{{ friend.display_name || friend.username }}</h3>
                  <p class="text-xs text-gray-600">@{{ friend.username }}</p>
                </div>
                <div v-if="friend.pearls !== null" class="flex items-center text-yellow-500 text-xs">
                  🦪 {{ friend.pearls }}
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                    :disabled="loadingFriendAquarium || !friend.aquarium_layout"
                    class="flex-1 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-xs font-medium"
                    @click="viewFriendAquarium(friend)"
                >
                  {{ loadingFriendAquarium ? 'Loading...' : 'View Aquarium' }}
                </button>
                <button
                    :disabled="processingRequest"
                    class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-xs font-medium"
                    @click="removeFriend(friend.id)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 py-6 text-sm">
            <p>No friends yet!</p>
            <p>Search above to add some.</p>
          </div>
        </div>

        <!-- Toast -->
        <div v-if="message" class="fixed bottom-4 right-4 z-50 max-w-[90vw]">
          <div class="p-3 rounded shadow-lg text-sm font-medium"
               :class="{
                 'bg-green-100 text-green-700 border border-green-200': messageType === 'success',
                 'bg-red-100 text-red-700 border border-red-200': messageType === 'error',
                 'bg-blue-100 text-blue-700 border border-blue-200': messageType === 'info'
               }">
            {{ message }}
          </div>
        </div>
      </div>
    </main>
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
</style>
