<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-sky-600 mb-6">Settings</h1>
    
    <!-- Success/Error Messages -->
    <div v-if="message" class="mb-4 p-4 rounded-lg" :class="messageClass">
      {{ message }}
    </div>
    
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- Screen Time Goals Settings -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-4 pb-2 border-b text-sky-700">Screen Time Goals</h2>
        
        <div class="space-y-4">
          <div>
            <label for="daily-limit" class="block text-sm font-medium text-gray-700 mb-1">Daily Screen Time Limit (hours)</label>
            <div class="flex items-center">
              <input 
                id="daily-limit" 
                v-model="dailyLimitHours" 
                type="number"
                min="0.5" 
                max="24" 
                step="0.5"
                class="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              >
              <span class="ml-2 text-gray-600">hours</span>
              <button 
                :disabled="saving" 
                class="ml-4 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition"
                @click="saveDailyGoal"
              >
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Recommended: 4 hours or less for better digital wellness</p>
            <div class="mt-2">
              <div class="bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  :class="dailyLimitHours <= 4 ? 'bg-green-500' : dailyLimitHours <= 6 ? 'bg-yellow-500' : 'bg-red-500'"
                  :style="`width: ${Math.min(100, (dailyLimitHours / 8) * 100)}%`"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ dailyLimitHours * 60 }} minutes total
              </p>
            </div>
          </div>
          
          <div class="border-t pt-4 mt-4">
            <h3 class="text-md font-medium mb-2">App Specific Limits</h3>
            <p class="text-sm text-gray-600 mb-4">Set daily usage limits for individual apps to help manage your screen time.</p>
            
            <!-- Add new app limit -->
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Add New App Limit</h4>
              <div class="flex items-end space-x-2">
                <div class="flex-1">
                  <label for="app-select" class="block text-sm font-medium text-gray-700 mb-1">App</label>
                  <select 
                    id="app-select" 
                    v-model="selectedApp"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Select an app</option>
                    <option 
                      v-for="app in availableAppsForLimits" 
                      :key="app?.packageName || ''" 
                      :value="app?.packageName"
                    >
                      {{ app.appName }}
                    </option>
                  </select>
                </div>
                <div>
                  <label for="app-limit" class="block text-sm font-medium text-gray-700 mb-1">Limit (minutes)</label>
                  <input 
                    id="app-limit" 
                    v-model="newAppLimit" 
                    type="number"
                    min="1" 
                    max="1440"
                    class="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    placeholder="30"
                  >
                </div>
                <button 
                  :disabled="!selectedApp || !newAppLimit || saving" 
                  class="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm h-10 transition"
                  @click="addAppLimit"
                >
                  {{ saving ? 'Adding...' : 'Add' }}
                </button>
              </div>
            </div>
            
            <!-- App limits list -->
            <div v-if="Object.keys(appLimits).length > 0" class="space-y-2">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Current App Limits</h4>
              <div 
                v-for="(limit, packageName) in appLimits" 
                :key="packageName"
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-sky-500"
              >
                <div>
                  <span class="font-medium">{{ formatAppName(packageName) }}</span>
                  <div class="text-sm text-gray-600">
                    {{ limit }} minutes per day
                    <span class="ml-2 text-xs text-gray-500">
                      ({{ Math.round(limit / 60 * 10) / 10 }}h)
                    </span>
                  </div>
                </div>
                <button 
                  :disabled="saving" 
                  class="text-red-500 hover:text-red-700 disabled:text-gray-400 p-1 transition"
                  title="Remove limit"
                  @click="removeAppLimit(packageName)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <!-- Summary -->
              <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700">
                  <strong>Total app limits:</strong> {{ Object.keys(appLimits).length }} apps
                </p>
                <p class="text-xs text-blue-600 mt-1">
                  Combined limit: {{ totalAppLimits }} minutes ({{ Math.round(totalAppLimits / 60 * 10) / 10 }}h)
                </p>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p class="text-sm text-gray-500">No app limits set</p>
              <p class="text-xs text-gray-400 mt-1">Add limits above to get started</p>
            </div>
          </div>
        </div>
      </section>
      
      <div class="flex justify-between items-center pt-6 border-t">
        <div class="text-sm text-gray-500">
          Changes are saved automatically when you click Save buttons above.
        </div>
        <button 
          class="text-red-600 hover:text-red-700 text-sm font-medium transition" 
          @click="resetAllLimits"
        >
          Reset All Limits
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Disable SSR for this page to avoid hydration issues
definePageMeta({
  ssr: false,
});

import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

// Screen time settings
const dailyLimitHours = ref(4)
const selectedApp = ref('')
const newAppLimit = ref('')
const availableApps = ref([])
const saving = ref(false)
const message = ref('')
const messageType = ref('success') // 'success' or 'error'

// Computed properties
const appLimits = computed(() => {
  if (process.server) return {}
  return userStore.appLimits
})

const availableAppsForLimits = computed(() => {
  // Filter out apps that already have limits
  return availableApps.value.filter(app => 
    app && app.packageName && !appLimits.value[app.packageName]
  )
})

const totalAppLimits = computed(() => {
  return Object.values(appLimits.value).reduce((total, limit) => total + limit, 0)
})

const messageClass = computed(() => {
  return messageType.value === 'success' 
    ? 'bg-green-100 text-green-700 border border-green-200' 
    : 'bg-red-100 text-red-700 border border-red-200'
})

// Show message helper
const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// Load installed apps from store
const loadInstalledApps = () => {
  if (process.server) return
  try {
    if (userStore.installed_apps && typeof userStore.installed_apps === 'string') {
      const parsed = JSON.parse(userStore.installed_apps)
      availableApps.value = Array.isArray(parsed) ? parsed.filter(app => app && app.packageName && app.appName) : []
    } else {
      availableApps.value = []
    }
  } catch (error) {
    console.error('Error parsing installed apps:', error)
    availableApps.value = []
  }
}

// Load settings from store
const loadSettings = () => {
  if (process.server) return
  if (userStore.userProfile?.screen_time_goals?.dailyLimit) {
    // Convert minutes to hours
    dailyLimitHours.value = userStore.userProfile.screen_time_goals.dailyLimit / 60
  }
}

// Save daily screen time goal
const saveDailyGoal = async () => {
  if (process.server) return false
  
  saving.value = true
  try {
    // Convert hours to minutes for storage
    const goals = { dailyLimit: Math.round(dailyLimitHours.value * 60) }
    const success = await userStore.updateScreenTimeGoals(goals)
    
    if (success) {
      showMessage(`Daily screen time limit updated to ${dailyLimitHours.value} hours`, 'success')
    } else {
      showMessage('Failed to save daily limit. Please try again.', 'error')
    }
    return success
  } finally {
    saving.value = false
  }
}

// Add an app limit
const addAppLimit = async () => {
  if (process.server) return false
  if (!selectedApp.value || !newAppLimit.value) return false
  
  const limitValue = parseInt(newAppLimit.value)
  if (limitValue < 1 || limitValue > 1440) {
    showMessage('App limit must be between 1 and 1440 minutes', 'error')
    return false
  }
  
  saving.value = true
  try {
    // Create updated limits object with the new limit
    const updatedLimits = { 
      ...appLimits.value, 
      [selectedApp.value]: limitValue
    }
    
    // Update in store
    const success = await userStore.updateAppLimits(updatedLimits)
    
    if (success) {
      const appName = formatAppName(selectedApp.value)
      showMessage(`Added ${limitValue} minute limit for ${appName}`, 'success')
      // Reset form
      selectedApp.value = ''
      newAppLimit.value = ''
    } else {
      showMessage('Failed to add app limit. Please try again.', 'error')
    }
    return success
  } finally {
    saving.value = false
  }
}

// Remove an app limit
const removeAppLimit = async (packageName) => {
  if (process.server) return false
  
  saving.value = true
  try {
    // Create updated limits object without the removed app
    const updatedLimits = { ...appLimits.value }
    delete updatedLimits[packageName]
    
    // Update in store
    const success = await userStore.updateAppLimits(updatedLimits)
    
    if (success) {
      const appName = formatAppName(packageName)
      showMessage(`Removed limit for ${appName}`, 'success')
    } else {
      showMessage('Failed to remove app limit. Please try again.', 'error')
    }
    return success
  } finally {
    saving.value = false
  }
}

// Reset all limits
const resetAllLimits = async () => {
  if (!confirm('Are you sure you want to remove all app limits? This cannot be undone.')) {
    return
  }
  
  saving.value = true
  try {
    const success = await userStore.updateAppLimits({})
    if (success) {
      showMessage('All app limits have been reset', 'success')
    } else {
      showMessage('Failed to reset limits. Please try again.', 'error')
    }
  } finally {
    saving.value = false
  }
}

// Format app name for display
const formatAppName = (packageName) => {
  if (!availableApps.value || !Array.isArray(availableApps.value)) {
    return packageName
  }
  const app = availableApps.value.find(app => app && app.packageName === packageName)
  return app ? app.appName : packageName
}

onMounted(() => {
  if (process.server) return
  
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
      { packageName: 'com.youtube.android', appName: 'YouTube' },
      { packageName: 'com.netflix.mediaclient', appName: 'Netflix' }
    ]
  }
})
</script>
