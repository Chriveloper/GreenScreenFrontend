<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
      
      <div class="space-y-6">
        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter username"
          />
        </div>
        
        <!-- Display Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
          <input
            v-model="displayName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter display name"
          />
        </div>
        
        <!-- Privacy Settings -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-md font-medium mb-2">Privacy Settings</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm">Aquarium Visibility</span>
              <select v-model="privacySettings.aquarium_visibility" class="border rounded px-2 py-1 text-sm">
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm">Pearl Count Visibility</span>
              <select v-model="privacySettings.pearls_visibility" class="border rounded px-2 py-1 text-sm">
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <button
        :disabled="saving"
        class="mt-6 w-full bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition"
        @click="saveProfile"
      >
        {{ saving ? 'Saving...' : 'Save Profile' }}
      </button>
      
      <!-- Success/Error Messages -->
      <div
v-if="message" class="mt-4 p-3 rounded-md" :class="{
        'bg-green-100 text-green-700 border border-green-200': messageType === 'success',
        'bg-red-100 text-red-700 border border-red-200': messageType === 'error'
      }">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

const username = ref('');
const displayName = ref('');
const saving = ref(false);
const message = ref('');
const messageType = ref('success');

const privacySettings = ref({
  aquarium_visibility: 'friends',
  pearls_visibility: 'friends',
  screen_time_visibility: 'friends'
});

const showMessage = (text, type = 'success') => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

const saveProfile = async () => {
  saving.value = true;
  message.value = '';
  
  try {
    const updates = {
      username: username.value,
      display_name: displayName.value,
      privacy_settings: privacySettings.value
    };
    
    const success = await userStore.updateUserProfile(updates);
    if (success) {
      showMessage('Profile updated successfully', 'success');
    } else {
      showMessage('Failed to update profile. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Profile update error:', error);
    showMessage('An error occurred while updating your profile.', 'error');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  if (userStore.userProfile) {
    username.value = userStore.userProfile.username || '';
    displayName.value = userStore.userProfile.display_name || '';
    if (userStore.userProfile.privacy_settings) {
      privacySettings.value = { ...privacySettings.value, ...userStore.userProfile.privacy_settings };
    }
  }
});
</script>