<template>
  <div class="min-h-screen w-full flex flex-col overflow-x-hidden bg-gray-50">
    <main class="flex-1 overflow-y-auto px-4 py-6">
      <div class="w-full max-w-screen-md mx-auto flex flex-col gap-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow p-4 border-t-4 border-sky-400">
          <h1 class="text-xl font-bold text-gray-900">Friends</h1>
          <p class="text-gray-600 mt-1 text-sm">Connect with friends and view their aquariums!</p>
        </div>

        <!-- Search -->
        <div class="bg-white rounded-lg shadow p-4">
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

          <div v-if="searchQuery.length >= 2" class="mt-4">
            <div v-if="searching" class="flex justify-center py-4">
              <div class="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else-if="searchResults.length" class="space-y-3">
              <div v-for="user in searchResults" :key="user.id" class="flex justify-between items-center p-3 border rounded">
                <div>
                  <p class="font-medium text-sm">{{ user.display_name || user.username }}</p>
                  <p class="text-xs text-gray-500">@{{ user.username }}</p>
                </div>
                <div>
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
            </div>
            <p v-else class="text-center text-gray-500 py-4 text-sm">No users found matching "{{ searchQuery }}"</p>
          </div>
        </div>

        <!-- Friend Requests -->
        <div v-if="incomingRequests.length" class="bg-white rounded-lg shadow p-4">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Friend Requests</h3>
          <div class="space-y-3">
            <div
                v-for="request in incomingRequests"
                :key="request.friendship_id"
                class="flex items-center justify-between p-3 border rounded"
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
        <div class="bg-white rounded-lg shadow p-4">
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
                <div v-if="friend.pearls !== null" class="text-yellow-500 text-xs">🦪 {{ friend.pearls }}</div>
              </div>
              <div class="flex space-x-2">
                <button
                    :disabled="loadingFriendAquarium"
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
          <p v-else class="text-sm text-gray-500 text-center py-6">No friends yet!</p>
        </div>

        <!-- Friend Aquarium View -->
        <div v-if="selectedFriend" class="bg-white rounded-lg shadow p-4">
          <h3 class="text-sm font-semibold text-gray-800 mb-2">
            {{ selectedFriend.display_name || selectedFriend.username }}'s Aquarium
          </h3>
        </div>
        <AquariumTank
            v-if="selectedFriend"
            :placed-plants="placedPlants"
            :active-fish="activeFish"
            :bubbles="bubbles"
            :selected-background="selectedBackground"
            :selected-floor="selectedFloor"
            :edit-mode="false"
            :show-button="false"
            :loading="loadingFriendAquarium"
        />

        <!-- Toast -->
        <div v-if="message" class="fixed bottom-4 right-4 z-50 max-w-sm w-[90%]">
          <div
              class="p-3 rounded shadow-lg text-sm font-medium"
              :class="{
              'bg-green-100 text-green-700 border border-green-200': messageType === 'success',
              'bg-red-100 text-red-700 border border-red-200': messageType === 'error',
              'bg-blue-100 text-blue-700 border border-blue-200': messageType === 'info'
            }"
          >
            {{ message }}
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAquarium } from '~/composables/useAquarium';
import { useAquariumAnimations } from '~/composables/useAquariumAnimations';
import AquariumTank from '~/components/aquarium/AquariumTank.vue';

const userStore = useUserStore();

const searchQuery = ref('');
const searchResults = ref([]);
const searching = ref(false);
const sendingRequest = ref(false);
const processingRequest = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error' | 'info'>('success');
const selectedFriend = ref<any>(null);
const loadingFriendAquarium = ref(false);

const {
  placedPlants,
  activeFish,
  selectedBackground,
  selectedFloor,
  loadUserAquariumLayout
} = useAquarium();

const bubbles = ref([]);
useAquariumAnimations(activeFish, bubbles);

const friendsList = computed(() => userStore.friendsList);
const incomingRequests = computed(() => userStore.incomingRequests);
const sentRequestIds = computed(() => userStore.outgoingRequests.map(r => r.id));
const friendIds = computed(() => userStore.friendsList.map(f => f.id));

const debounce = (func: Function, wait = 300) => {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => (message.value = ''), 3000);
};

const handleSearch = debounce(() => {
  if (searchQuery.value.trim().length >= 2) {
    searchUsers();
  } else {
    searchResults.value = [];
  }
});

const searchUsers = async () => {
  searching.value = true;
  try {
    const results = await userStore.searchUsers(searchQuery.value);
    searchResults.value = results || [];
    if (!results.length) showMessage('No users found', 'info');
  } catch (e) {
    showMessage('Search failed', 'error');
  } finally {
    searching.value = false;
  }
};

const sendRequest = async (userId: string) => {
  sendingRequest.value = true;
  try {
    const success = await userStore.sendFriendRequest(userId);
    if (success) {
      showMessage('Friend request sent!', 'success');
      await searchUsers();
    } else {
      showMessage('Request failed', 'error');
    }
  } catch {
    showMessage('Request failed', 'error');
  } finally {
    sendingRequest.value = false;
  }
};

const respondToRequest = async (friendshipId: string, response: 'accepted' | 'declined') => {
  processingRequest.value = true;
  try {
    const success = await userStore.respondToFriendRequest(friendshipId, response);
    showMessage(success ? `Friend request ${response}` : 'Failed to respond', success ? 'success' : 'error');
  } catch {
    showMessage('Error processing request', 'error');
  } finally {
    processingRequest.value = false;
  }
};

const removeFriend = async (friendId: string) => {
  if (confirm('Are you sure you want to remove this friend?')) {
    processingRequest.value = true;
    try {
      await userStore.removeFriend(friendId);
      showMessage('Friend removed', 'info');
    } catch {
      showMessage('Failed to remove friend', 'error');
    } finally {
      processingRequest.value = false;
    }
  }
};

const viewFriendAquarium = async (friend: any) => {
  loadingFriendAquarium.value = true;
  try {
    const profile = await userStore.getFriendProfile(friend.id);
    if (profile?.aquarium_layout) {
      selectedFriend.value = friend;
      loadUserAquariumLayout(profile.aquarium_layout);
    }
  } catch {
    showMessage('Failed to load aquarium', 'error');
  } finally {
    loadingFriendAquarium.value = false;
  }
};

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    await navigateTo('/login');
    return;
  }
  await userStore.loadFriends();
});
</script>
