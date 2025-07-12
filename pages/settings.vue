<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-sky-600 mb-6">Settings</h1>
    
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- Screen Time Goals Settings -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-4 pb-2 border-b text-sky-700">Screen Time Goals</h2>
        
        <div class="space-y-4">
          <div>
            <label for="daily-limit" class="block text-sm font-medium text-gray-700 mb-1">Daily Screen Time Limit (hours)</label>
            <div class="flex items-center">
              <input 
                type="number" 
                id="daily-limit" 
                v-model="dailyLimitHours"
                min="0" 
                max="24" 
                step="0.5"
                class="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              >
              <span class="ml-2 text-gray-600">hours</span>
              <button 
                @click="saveDailyGoal" 
                class="ml-4 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded text-sm"
              >
                Save
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Recommended: 4 hours or less</p>
          </div>
          
          <div class="border-t pt-4 mt-4">
            <h3 class="text-md font-medium mb-2">App Specific Limits</h3>
            
            <!-- Add new app limit -->
            <div class="flex items-end space-x-2 mb-4">
              <div class="flex-1">
                <label for="app-select" class="block text-sm font-medium text-gray-700 mb-1">App</label>
                <select 
                  id="app-select" 
                  v-model="selectedApp"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="">Select an app</option>
                  <option 
                    v-for="app in availableApps" 
                    :key="app.packageName" 
                    :value="app.packageName"
                    v-if="!appLimits[app.packageName]"
                  >
                    {{ app.appName }}
                  </option>
                </select>
              </div>
              <div>
                <label for="app-limit" class="block text-sm font-medium text-gray-700 mb-1">Limit (minutes)</label>
                <input 
                  type="number" 
                  id="app-limit" 
                  v-model="newAppLimit"
                  min="1" 
                  class="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                >
              </div>
              <button 
                @click="addAppLimit" 
                class="bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded text-sm h-10"
                :disabled="!selectedApp || !newAppLimit"
              >
                Add
              </button>
            </div>
            
            <!-- App limits list -->
            <div v-if="Object.keys(appLimits).length > 0" class="space-y-2 mt-2">
              <div 
                v-for="(limit, packageName) in appLimits" 
                :key="packageName"
                class="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div>
                  <span class="font-medium">{{ formatAppName(packageName) }}</span>
                  <span class="text-sm text-gray-600 ml-2">{{ limit }} min/day</span>
                </div>
                <button 
                  @click="removeAppLimit(packageName)" 
                  class="text-red-500 hover:text-red-700"
                >
                  <span class="sr-only">Remove</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500 italic">No app limits set</p>
          </div>
        </div>
      </section>
      
      <div class="mt-8 flex justify-end">
        <button 
          @click="saveSettings" 
          class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Save All Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

// Screen time settings
const dailyLimitHours = ref(4)
const selectedApp = ref('')
const newAppLimit = ref('')
const availableApps = ref([])

// Computed properties
const appLimits = computed(() => userStore.appLimits)

// Load installed apps from store
const loadInstalledApps = () => {
  try {
    if (userStore.installed_apps) {
      const parsed = JSON.parse(userStore.installed_apps)
      availableApps.value = parsed || []
    }
  } catch (error) {
    console.error('Error parsing installed apps:', error)
    availableApps.value = []
  }
}

// Load settings from store
const loadSettings = () => {
  if (userStore.userProfile?.screen_time_goals?.dailyLimit) {
    // Convert minutes to hours
    dailyLimitHours.value = userStore.userProfile.screen_time_goals.dailyLimit / 60
  }
}

// Save daily screen time goal
const saveDailyGoal = async () => {
  // Convert hours to minutes for storage
  const goals = { dailyLimit: Math.round(dailyLimitHours.value * 60) }
  const success = await userStore.updateScreenTimeGoals(goals)
  
  if (success) {
    // Show success message or notification
    console.log(`Daily limit set to ${dailyLimitHours.value} hours`)
  }
}

// Add an app limit
const addAppLimit = async () => {
  if (selectedApp.value && newAppLimit.value) {
    // Create updated limits object with the new limit
    const updatedLimits = { 
      ...appLimits.value, 
      [selectedApp.value]: parseInt(newAppLimit.value) 
    }
    
    // Update in store
    const success = await userStore.updateAppLimits(updatedLimits)
    
    if (success) {
      // Reset form
      selectedApp.value = ''
      newAppLimit.value = ''
    }
  }
}

// Remove an app limit
const removeAppLimit = async (packageName) => {
  // Create updated limits object without the removed app
  const updatedLimits = { ...appLimits.value }
  delete updatedLimits[packageName]
  
  // Update in store
  await userStore.updateAppLimits(updatedLimits)
}

// Format app name for display
const formatAppName = (packageName) => {
  const app = availableApps.value.find(app => app.packageName === packageName)
  return app ? app.appName : packageName
}

// Save all settings
const saveSettings = async () => {
  await saveDailyGoal()
  // Add any other settings saves here
}

onMounted(() => {
  loadInstalledApps()
  loadSettings()
  
  // Mock data for development (remove in production)
  if (availableApps.value.length === 0) {
    availableApps.value = [
      { packageName: 'com.instagram.android', appName: 'Instagram' },
      { packageName: 'com.facebook.katana', appName: 'Facebook' },
      { packageName: 'com.whatsapp', appName: 'WhatsApp' },
      { packageName: 'com.tiktok.app', appName: 'TikTok' },
      { packageName: 'com.twitter.android', appName: 'Twitter' },
      { packageName: 'com.snapchat.android', appName: 'Snapchat' },
      { packageName: 'com.youtube.android', appName: 'YouTube' }
    ]
  }
})
</script>
