<template>
  <!-- Add username and display name fields to your profile page -->
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-lg font-semibold mb-4">Profile Settings</h2>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Username</label>
        <input
          v-model="username"
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          placeholder="Choose a unique username"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Display Name</label>
        <input
          v-model="displayName"
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          placeholder="Your display name"
        />
      </div>
      
      <!-- Privacy Settings -->
      <div>
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
      
      <button
        @click="saveProfile"
        class="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium transition"
      >
        Save Profile
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

const username = ref('');
const displayName = ref('');
const privacySettings = ref({
  aquarium_visibility: 'friends',
  pearls_visibility: 'friends',
  screen_time_visibility: 'friends'
});

const saveProfile = async () => {
  const updates = {
    username: username.value,
    display_name: displayName.value,
    privacy_settings: privacySettings.value
  };
  
  const success = await userStore.updateUserProfile(updates);
  if (success) {
    // Show success message
    console.log('Profile updated successfully');
  }
};

onMounted(() => {
  if (userStore.userProfile) {
    username.value = userStore.userProfile.username || '';
    displayName.value = userStore.userProfile.display_name || '';
    privacySettings.value = userStore.userProfile.privacy_settings || privacySettings.value;
  }
});
</script>