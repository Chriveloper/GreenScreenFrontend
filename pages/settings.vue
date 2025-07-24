<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-sky-600 mb-6">Settings</h1>

    <div v-if="message" class="mb-4 p-4 rounded-lg" :class="messageClass">
      {{ message }}
    </div>

    <!-- Screen Time Goals -->
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mb-8">
      <h2 class="text-lg font-semibold mb-4 pb-2 border-b text-sky-700">Screen Time Goals</h2>

      <div class="space-y-4">
        <!-- Daily Goal -->
        <div>
          <label for="daily-limit" class="block text-sm font-medium text-gray-700 mb-1">Daily Screen Time Limit</label>
          <div class="flex items-center">
            <input type="number" id="daily-limit" v-model="dailyLimitMinutes" min="0.5" max="24" step="0.5"
                   class="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500">
            <span class="ml-2 text-gray-600">minutes</span>
            <button @click="saveDailyGoal" :disabled="saving"
                    class="ml-4 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>

        <!-- App Specific Limits -->
        <div class="border-t pt-4 mt-4">
          <h3 class="text-md font-medium mb-2">App Specific Limits</h3>

          <!-- Add New App Limit -->
          <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Add New App Limit</h4>

            <!-- App Selector -->
            <div class="relative w-full mb-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">App</label>
              <button
                  @click="showDropdown = !showDropdown"
                  type="button"
                  class="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <div class="flex items-center space-x-2 truncate">
                  <img
                      v-if="selectedAppObject?.icon"
                      :src="`data:image/png;base64,${selectedAppObject.icon}`"
                      class="w-5 h-5 rounded"
                  />
                  <span class="truncate">{{ selectedAppObject?.appName || 'Select an app' }}</span>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                  v-if="showDropdown"
                  class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-xl max-h-72 overflow-auto"
              >
                <input
                    type="text"
                    v-model="dropdownSearch"
                    placeholder="Search apps..."
                    class="w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none focus:ring-0"
                />
                <ul class="divide-y divide-gray-100">
                  <li
                      v-for="app in filteredDropdownApps"
                      :key="app.packageName"
                      @click="selectApp(app)"
                      class="flex items-center px-3 py-2 hover:bg-sky-50 cursor-pointer transition"
                  >
                    <img
                        v-if="app.icon"
                        :src="`data:image/png;base64,${app.icon}`"
                        class="w-5 h-5 mr-2 rounded"
                    />
                    <div class="flex-1">
                      <span class="truncate">{{ app.appName }}</span>
                      <span v-if="app.isSystemApp" class="ml-2 text-xs text-gray-500 bg-gray-100 px-1 rounded">System</span>
                    </div>
                  </li>
                  <li v-if="filteredDropdownApps.length === 0" class="px-3 py-2 text-sm text-gray-500">
                    No matching apps
                  </li>
                </ul>
              </div>
            </div>

            <!-- Input + Add Button Row -->
            <div class="flex items-end space-x-2">
              <div>
                <label for="app-limit" class="block text-sm font-medium text-gray-700 mb-1">Limit (minutes)</label>
                <input type="number" id="app-limit" v-model="newAppLimit" min="1" max="1440"
                       class="w-28 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                       placeholder="30">
              </div>

              <button @click="addAppLimit" :disabled="!selectedApp || !newAppLimit || saving"
                      class="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm transition">
                {{ saving ? 'Adding...' : 'Add' }}
              </button>
            </div>
          </div>

          <!-- Current App Limits -->
          <div v-if="Object.keys(appLimits).length > 0" class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Current App Limits</h4>
            <div v-for="(limit, packageName) in appLimits"
                 :key="packageName"
                 class="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-sky-500">
              <div class="flex items-center">
                <img
                    v-if="getAppIcon(packageName)"
                    :src="getAppIcon(packageName)"
                    class="w-5 h-5 mr-2 rounded"
                    alt="App icon"
                />
                <div>
                  <span class="font-medium">{{ formatAppName(packageName) }}</span>
                  <span v-if="getAppType(packageName) === 'system'" class="ml-2 text-xs text-gray-500 bg-gray-100 px-1 rounded">System</span>
                </div>
                <div class="text-sm text-gray-600 ml-2">{{ limit }} minutes per day
                  <span class="ml-2 text-xs text-gray-500">({{ Math.round(limit / 60 * 10) / 10 }}h)</span>
                </div>
              </div>
              <button @click="removeAppLimit(packageName)" :disabled="saving"
                      class="text-red-500 hover:text-red-700 disabled:text-gray-400 p-1 transition"
                      title="Remove limit">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Centered Reset Button (no disclaimer) -->
      <div class="pt-6 border-t">
        <div class="flex justify-center">
          <button @click="resetAllLimits"
                  class="text-red-600 hover:text-red-700 text-sm font-medium transition">
            Reset All Limits
          </button>
        </div>
      </div>
    </div>

    <!-- Profile Settings -->
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mb-8">
      <h2 class="text-lg font-semibold mb-4 pb-2 border-b text-sky-700">Profile Settings</h2>

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
definePageMeta({ ssr: false })

import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const username = ref('');
const displayName = ref('');

const dailyLimitMinutes = ref(4)
const selectedApp = ref('')
const newAppLimit = ref('')
const availableApps = ref([])
const saving = ref(false)
const showDropdown = ref(false)
const dropdownSearch = ref('')
const message = ref('')
const messageType = ref('success')

const privacySettings = ref({
  aquarium_visibility: 'friends',
  pearls_visibility: 'friends',
  screen_time_visibility: 'friends'
});

const appLimits = computed(() => userStore.appLimits)

const availableAppsForLimits = computed(() =>
    availableApps.value.filter(app => app && app.packageName && !appLimits.value[app.packageName])
)

const filteredDropdownApps = computed(() =>
    availableAppsForLimits.value.filter(app =>
        app.appName.toLowerCase().includes(dropdownSearch.value.toLowerCase())
    )
)

const selectedAppObject = computed(() =>
    availableApps.value.find(app => app.packageName === selectedApp.value) || null
)

const messageClass = computed(() =>
    messageType.value === 'success'
        ? 'bg-green-100 text-green-700 border border-green-200'
        : 'bg-red-100 text-red-700 border border-red-200'
)

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const loadInstalledApps = () => {
  try {
    if (userStore.installed_apps && typeof userStore.installed_apps === 'string') {
      const parsed = JSON.parse(userStore.installed_apps)
      availableApps.value = Array.isArray(parsed)
          ? parsed.filter(app => app && app.packageName && app.appName)
          : []
    }
  } catch (error) {
    console.error('Error parsing installed apps:', error)
    availableApps.value = []
  }
}

const loadSettings = () => {
  if (userStore.userProfile?.screen_time_goals.dailyLimit) {
    dailyLimitMinutes.value = userStore.userProfile.screen_time_goals.dailyLimit
  }
}

const saveDailyGoal = async () => {
  saving.value = true
  try {
    const goals = { dailyLimit: Math.round(dailyLimitMinutes.value) }
    const success = await userStore.updateScreenTimeGoals(goals)
    if (success) showMessage(`Daily limit updated to ${dailyLimitMinutes.value} minutes`)
    else showMessage('Failed to save daily limit', 'error')
  } finally {
    saving.value = false
  }
}

const selectApp = (app) => {
  selectedApp.value = app.packageName
  showDropdown.value = false
  dropdownSearch.value = ''
}

const addAppLimit = async () => {
  if (!selectedApp.value || !newAppLimit.value) return
  const limitValue = parseInt(newAppLimit.value)
  if (limitValue < 1 || limitValue > 1440) {
    showMessage('App limit must be between 1 and 1440 minutes', 'error')
    return
  }

  saving.value = true
  try {
    const updatedLimits = { ...appLimits.value, [selectedApp.value]: limitValue }
    const success = await userStore.updateAppLimits(updatedLimits)
    if (success) {
      showMessage(`Added ${limitValue} min limit for ${formatAppName(selectedApp.value)}`)
      selectedApp.value = ''
      newAppLimit.value = ''
    } else {
      showMessage('Failed to add app limit', 'error')
    }
  } finally {
    saving.value = false
  }
}

const removeAppLimit = async (packageName) => {
  saving.value = true
  try {
    const updatedLimits = { ...appLimits.value }
    delete updatedLimits[packageName]
    const success = await userStore.updateAppLimits(updatedLimits)
    if (success) showMessage(`Removed limit for ${formatAppName(packageName)}`)
    else showMessage('Failed to remove app limit', 'error')
  } finally {
    saving.value = false
  }
}

const resetAllLimits = async () => {
  if (!confirm('Are you sure you want to remove all app limits?')) return
  saving.value = true
  try {
    const success = await userStore.updateAppLimits({})
    if (success) showMessage('All app limits reset')
    else showMessage('Failed to reset limits', 'error')
  } finally {
    saving.value = false
  }
}

const formatAppName = (packageName) => {
  const app = availableApps.value.find(app => app && app.packageName === packageName)
  return app ? app.appName : packageName
}

const getAppIcon = (packageName) => {
  const app = availableApps.value.find(app => app && app.packageName === packageName)
  if (app && app.icon) {
    // If icon is already a data URL, use as is; else, prepend
    return app.icon.startsWith('data:image') ? app.icon : `data:image/png;base64,${app.icon}`
  }
  return null
}

const getAppType = (packageName) => {
  const app = availableApps.value.find(app => app && app.packageName === packageName)
  return app?.isSystemApp ? 'system' : 'user'
}

onMounted(() => {
  loadInstalledApps()
  loadSettings()

  if (userStore.userProfile) {
    username.value = userStore.userProfile.username || '';
    displayName.value = userStore.userProfile.display_name || '';
    if (userStore.userProfile.privacy_settings) {
      privacySettings.value = { ...privacySettings.value, ...userStore.userProfile.privacy_settings };
    }
  }
})

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
</script>
