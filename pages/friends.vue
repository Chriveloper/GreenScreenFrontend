<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Add debug info at the top of the page (remove in production) -->
    <div v-if="debug.enabled" class="bg-yellow-100 p-4 mb-4 rounded">
      <h3 class="font-bold">Debug Info:</h3>
      <pre class="text-xs mt-2 bg-yellow-50 p-2 rounded max-h-40 overflow-auto">{{ debug.log }}</pre>
      <button @click="debug.log = ''" class="text-xs text-gray-600 mt-2">Clear</button>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-sky-600">Friends</h1>
      <div class="flex items-center bg-white rounded-lg shadow px-4 py-2 border-t-4 border-yellow-400">
        <span class="text-2xl mr-2">🐚</span>
        <span class="text-lg font-bold text-yellow-600">{{ playerPearls }}</span>
        <span class="text-sm text-gray-600 ml-1">Pearls</span>
      </div>
    </div>

    <!-- Search Users -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Find Friends</h2>
      
      <div class="relative">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search by username or display name..."
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          :disabled="searching"
        />
        <div v-if="searching" class="absolute right-3 top-2.5">
          <div class="spinner w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchQuery.length >= 2" class="mt-4">
        <div v-if="searching" class="text-center py-4 text-gray-500">
          Searching...
        </div>
        <div v-else-if="searchResults.length === 0" class="text-center py-4 text-gray-500">
          No users found matching "{{ searchQuery }}"
        </div>
        <div v-else class="divide-y">
          <div v-for="user in searchResults" :key="user.id" class="py-3 flex items-center justify-between">
            <div>
              <div class="font-medium">{{ user.display_name || 'User' }}</div>
              <div class="text-sm text-gray-500">@{{ user.username }}</div>
            </div>
            <button
              v-if="!isRequestSent(user.id) && !isFriend(user.id) && !hasIncomingRequestFrom(user.id)"
              @click="sendFriendRequest(user.id)"
              class="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded text-sm transition"
            >
              Add Friend
            </button>
            <button
              v-else-if="hasIncomingRequestFrom(user.id)"
              @click="acceptIncomingRequest(user.id)"
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
            >
              Accept Request
            </button>
            <span v-else-if="isRequestSent(user.id)" class="text-sm text-gray-500">
              Request Sent
            </span>
            <span v-else class="text-sm text-green-500">
              Already Friends
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Friend Requests -->
    <div v-if="incomingRequests.length > 0" class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4 flex items-center">
        Friend Requests
        <span class="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">{{ incomingRequests.length }}</span>
      </h2>
      <div class="space-y-3">
        <div
          v-for="request in incomingRequests"
          :key="request.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <h3 class="font-medium">{{ request.display_name || request.username }}</h3>
            <p class="text-sm text-gray-600">@{{ request.username }}</p>
          </div>
          <div class="space-x-2">
            <button
              @click="respondToRequest(request.friendship_id, 'accepted')"
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition"
            >
              Accept
            </button>
            <button
              @click="respondToRequest(request.friendship_id, 'declined')"
              class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Friends List -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-lg font-semibold mb-4">My Friends ({{ friendsList.length }})</h2>
      <div v-if="friendsList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="friend in friendsList"
          :key="friend.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
        >
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="font-medium">{{ friend.display_name || friend.username }}</h3>
              <p class="text-sm text-gray-600">@{{ friend.username }}</p>
            </div>
            <div v-if="friend.pearls !== null" class="flex items-center text-yellow-600">
              <span class="text-lg mr-1">🐚</span>
              <span class="font-bold">{{ friend.pearls }}</span>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button
              @click="viewFriendAquarium(friend)"
              :disabled="!friend.aquarium_layout"
              class="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-1 px-2 rounded text-sm font-medium transition disabled:opacity-50"
            >
              View Aquarium
            </button>
            <button
              @click="removeFriend(friend.id)"
              class="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm font-medium transition"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500 text-center py-8">
        No friends yet. Search for users above to add friends!
      </p>
    </div>

    <!-- Friend Aquarium Modal -->
    <div v-if="selectedFriend" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{{ selectedFriend.display_name || selectedFriend.username }}'s Aquarium</h2>
          <button
            @click="selectedFriend = null"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Friend's Aquarium Display -->
        <div class="aspect-video bg-gradient-to-b from-sky-200 to-sky-400 rounded-lg relative overflow-hidden">
          <!-- This would be similar to your aquarium display but read-only -->
          <div class="w-full h-full relative">
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
          </div>
        </div>
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
const selectedFriend = ref(null);
const errorMessage = ref('');
const message = ref('');
const messageType = ref('success');

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

const addDebugLog = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  debug.value.log = `[${timestamp}] ${message}\n${debug.value.log}`;
  console.log(message);
};

// KEEP ONLY ONE debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Create a debounced search function
const handleSearch = debounce(async () => {
  console.log("Search query:", searchQuery.value);
  if (searchQuery.value.length >= 2) {
    await performSearch();
  } else {
    searchResults.value = [];
  }
}, 300);

const performSearch = async () => {
  if (!searchQuery.value.trim()) return;
  
  searching.value = true;
  searchResults.value = []; // Clear previous results
  
  try {
    addDebugLog(`Performing search for: "${searchQuery.value}"`);
    const results = await userStore.searchUsers(searchQuery.value);
    addDebugLog(`Search results: ${results.length} users found`);
    searchResults.value = results;
  } catch (error) {
    addDebugLog(`ERROR: ${error.message}`);
    errorMessage.value = "Failed to search for users. Please try again.";
  } finally {
    searching.value = false;
  }
};

const isRequestSent = (userId) => {
  return sentRequestIds.value.includes(userId);
};

const isFriend = (userId) => {
  return friendIds.value.includes(userId);
};

// Add this helper method to check for incoming requests
const hasIncomingRequestFrom = (userId) => {
  return incomingRequests.value.some(req => req.id === userId);
};

// Add this helper to accept an incoming request directly from search
const acceptIncomingRequest = async (userId) => {
  const request = incomingRequests.value.find(req => req.id === userId);
  if (request && request.friendship_id) {
    await respondToRequest(request.friendship_id, 'accepted');
    // Refresh search results
    await performSearch();
  }
};

const showMessage = (text, type = 'success') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 5000);
};

const sendFriendRequest = async (userId) => {
  try {
    const success = await userStore.sendFriendRequest(userId);
    if (success) {
      const userIndex = searchResults.value.findIndex(u => u.id === userId);
      if (userIndex >= 0) {
        searchResults.value.splice(userIndex, 1);
      }
      showMessage('Friend request sent successfully!', 'success');
    } else {
      showError('Failed to send friend request. Please try again.');
    }
  } catch (error) {
    console.error('Error sending friend request:', error);
    showError('An error occurred while sending the friend request.');
  }
};

const respondToRequest = async (friendshipId, response) => {
  try {
    addDebugLog(`Responding to request ${friendshipId} with "${response}"`);
    
    if (!friendshipId) {
      addDebugLog('ERROR: Missing friendship ID!');
      showError(`Cannot ${response} - missing friendship ID`);
      return;
    }
    
    const success = await userStore.respondToFriendRequest(friendshipId, response);
    
    if (success) {
      addDebugLog(`Successfully ${response} friend request`);
      showMessage(`Friend request ${response}!`, 'success');
    } else {
      addDebugLog(`Failed to ${response} friend request`);
      showError(`Failed to ${response} friend request. Please try again.`);
    }
  } catch (error) {
    addDebugLog(`ERROR: ${error.message}`);
    console.error('Error responding to friend request:', error);
    showError('An error occurred while responding to the friend request.');
  }
};

const removeFriend = async (friendId) => {
  if (confirm('Are you sure you want to remove this friend?')) {
    await userStore.removeFriend(friendId);
  }
};

const viewFriendAquarium = async (friend) => {
  const profile = await userStore.getFriendProfile(friend.id);
  if (profile) {
    selectedFriend.value = { ...friend, ...profile };
  }
};

const getFishStyle = (fish) => {
  return {
    left: `${fish.swimX || fish.x}%`,
    top: `${fish.swimY || fish.y}%`,
    transform: fish.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
  };
};

const getPlantStyle = (plant) => {
  return {
    left: `${plant.x}%`,
    top: `${plant.y}%`,
  };
};

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
  border-top-color: transparent;
}
</style>