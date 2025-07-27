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
        <!-- Daily Limit -->
        <div>
          <label for="daily-limit" class="text-md font-medium mb-2">Daily Screen Time Limit</label>
          <div class="flex items-center">
            <input
                id="daily-limit" v-model="dailyLimitMinutes" type="number" min="1" max="1440" step="1"
                class="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500">
            <span class="ml-2 text-gray-600">minutes</span>
            <button
                :disabled="saving" class="ml-4 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition"
                @click="saveDailyGoal">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>

          <div v-if="hasTodayData" class="mt-2">
            <div class="text-sm text-gray-600 flex justify-between mb-1">
              <span>Used today</span>
              <span>{{ formatUsageTime(todayUsageSeconds) }} / {{ dailyLimitMinutes }} min</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                  class="h-3 rounded-full transition-all duration-300"
                  :class="todayUsageSeconds >= dailyLimitMinutes * 60 ? 'bg-red-500' : 'bg-sky-500'"
                  :style="{ width: barWidth(todayUsageSeconds, dailyLimitMinutes) }"
              ></div>
            </div>
          </div>
        </div>

        <!-- App Specific Limits -->
        <div class="border-t pt-4 mt-4">
          <h3 class="text-md font-medium mb-2">App Specific Limits</h3>

          <!-- Add Limit -->
          <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Add New App Limit</h4>

            <div class="relative w-full mb-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">App</label>
              <button
                  class="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  @click="showDropdown = !showDropdown">
                <div class="flex items-center space-x-2 truncate">
                  <img
                      v-if="selectedAppObject?.icon"
                      :src="`data:image/png;base64,${selectedAppObject.icon}`"
                      class="w-5 h-5 rounded" />
                  <span class="truncate">{{ selectedAppObject?.appName || 'Select an app' }}</span>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                  v-if="showDropdown"
                  class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-xl max-h-72 overflow-auto">
                <input
                    v-model="dropdownSearch"
                    placeholder="Search apps..."
                    class="w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none focus:ring-0" />
                <ul class="divide-y divide-gray-100">
                  <li
                      v-for="app in filteredDropdownApps" :key="app.packageName"
                      class="flex items-center px-3 py-2 hover:bg-sky-50 cursor-pointer transition"
                      @click="selectApp(app)">
                    <img
                        v-if="app.icon"
                        :src="`data:image/png;base64,${app.icon}`"
                        class="w-5 h-5 mr-2 rounded" />
                    <div class="flex-1">
                      <span class="truncate">{{ app.appName }}</span>
                      <span
                          v-if="app.isSystemApp"
                          class="ml-2 text-xs text-gray-500 bg-gray-100 px-1 rounded">System</span>
                    </div>
                  </li>
                  <li
                      v-if="filteredDropdownApps.length === 0"
                      class="px-3 py-2 text-sm text-gray-500">No matching apps</li>
                </ul>
              </div>
            </div>

            <div class="flex items-end space-x-2">
              <div>
                <label for="app-limit" class="block text-sm font-medium text-gray-700 mb-1">Limit (minutes)</label>
                <input
                    id="app-limit" v-model="newAppLimit" type="number" min="1" max="1440"
                    class="w-28 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    placeholder="30">
              </div>
              <button
                  :disabled="!selectedApp || !newAppLimit || saving" class="bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm transition"
                  @click="addAppLimit">
                {{ saving ? 'Adding...' : 'Add' }}
              </button>
            </div>
          </div>

          <!-- Current App Limits with Usage -->
          <div v-if="Object.keys(appLimits).length > 0" class="space-y-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Current App Limits</h4>
            <div
                v-for="(limitMin, pkg) in appLimits" :key="pkg"
                class="p-3 bg-gray-50 rounded-lg border-l-4 border-sky-500">
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <img v-if="getAppIcon(pkg)" :src="getAppIcon(pkg)" class="w-5 h-5 mr-2 rounded" />
                  <div>
                    <span class="font-medium">{{ formatAppName(pkg) }}</span>
                    <span
                        v-if="getAppType(pkg) === 'system'"
                        class="ml-2 text-xs text-gray-500 bg-gray-100 px-1 rounded">System</span>
                  </div>
                </div>
                <button
                    :disabled="saving" class="text-red-500 hover:text-red-700 disabled:text-gray-400 p-1 transition"
                    title="Remove limit"
                    @click="removeAppLimit(pkg)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>

              <div class="mt-2">
                <div class="text-xs text-gray-600 flex justify-between mb-1">
                  <span>Used: {{ formatUsageTime(appUsageMap[pkg].usedSeconds) }}</span>
                  <span>{{ formatUsageTime(limitMin * 60) }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                      class="h-2 rounded-full transition-all duration-300"
                      :class="appUsageMap[pkg].usedSeconds >= limitMin * 60 ? 'bg-red-500' : 'bg-sky-400'"
                      :style="{ width: barWidth(appUsageMap[pkg].usedSeconds, limitMin) }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-6 border-t">
        <div class="flex justify-center">
          <button
              class="text-red-600 hover:text-red-700 text-sm font-medium transition"
              @click="resetAllLimits">
            Reset All Limits
          </button>
        </div>
      </div>
    </div>

    <!-- Profile Settings -->
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mb-8">
      <h2 class="text-lg font-semibold mb-4 pb-2 border-b text-sky-700">Profile Settings</h2>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
              v-model="username" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              placeholder="Enter username" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
          <input
              v-model="displayName" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              placeholder="Enter display name" />
        </div>

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

        <button
            :disabled="saving"
            class="mt-6 w-full bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition"
            @click="saveProfile">
          {{ saving ? 'Saving...' : 'Save Profile' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useUserStore} from '~/stores/user'

const userStore = useUserStore()

const dailyLimitMinutes = ref(userStore.userProfile?.screen_time_goals?.dailyLimit || 0)
const appLimits = computed(() => userStore.userProfile?.app_limits || {})
const username = ref(userStore.userProfile?.username || '')
const displayName = ref(userStore.userProfile?.display_name || '')
const privacySettings = ref(userStore.userProfile?.privacy_settings || {
  aquarium_visibility: 'friends',
  pearls_visibility: 'friends'
})

const availableApps = ref([])
const selectedApp = ref('')
const newAppLimit = ref('')
const saving = ref(false)
const showDropdown = ref(false)
const dropdownSearch = ref('')
const message = ref('')
const messageType = ref('success')

const parsedUsage = computed(() => {
  try {
    return JSON.parse(userStore.usage_data || '[]')
  } catch {
    return []
  }
})
const todayEntries = computed(() => parsedUsage.value[0]?.entries || [])
const hasTodayData = computed(() => parsedUsage.value.length > 0)

const todayUsageSeconds = computed(() =>
    todayEntries.value.reduce((acc, e) => acc + (e.usageSeconds || 0), 0)
)

const appUsageMap = computed(() => {
  const map = {}
  for (const pkg in appLimits.value) {
    const entry = todayEntries.value.find(e => e.packageName === pkg)
    map[pkg] = {
      usedSeconds: entry?.usageSeconds || 0
    }
  }
  return map
})

const formatUsageTime = (seconds) => {
  const m = Math.round(seconds / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

const barWidth = (usedSec, limitMin) => {
  const width = limitMin > 0 ? Math.min((usedSec / (limitMin * 60)) * 100, 100) : 0
  return `${width}%`
}

const filteredDropdownApps = computed(() =>
    availableApps.value.filter(a =>
        a.packageName &&
        !appLimits.value[a.packageName] &&
        a.appName.toLowerCase().includes(dropdownSearch.value.toLowerCase())
    )
)
const selectedAppObject = computed(() =>
    availableApps.value.find(a => a.packageName === selectedApp.value) || null
)

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const getAppIcon = (pkg) => {
  const app = availableApps.value.find(a => a.packageName === pkg)
  return app?.icon ? `data:image/png;base64,${app.icon}` : null
}
const formatAppName = (pkg) => {
  const app = availableApps.value.find(a => a.packageName === pkg)
  return app?.appName || pkg
}
const getAppType = (pkg) => {
  const app = availableApps.value.find(a => a.packageName === pkg)
  return app?.isSystemApp ? 'system' : 'user'
}

const selectApp = (app) => {
  selectedApp.value = app.packageName
  showDropdown.value = false
  dropdownSearch.value = ''
}

const loadInstalledApps = () => {
  try {
    const parsed = JSON.parse(userStore.installed_apps || '[]')
    availableApps.value = Array.isArray(parsed) ? parsed : []
  } catch {
    availableApps.value = []
  }
}

const saveDailyGoal = async () => {
  saving.value = true
  try {
    const goals = {dailyLimit: Math.round(dailyLimitMinutes.value)}
    const success = await userStore.updateScreenTimeGoals(goals)
    showMessage(success ? 'Daily limit updated.' : 'Failed to save daily limit', success ? 'success' : 'error')
  } finally {
    saving.value = false
  }
}

const addAppLimit = async () => {
  if (!selectedApp.value || !newAppLimit.value) return
  const val = parseInt(newAppLimit.value)
  if (val < 1 || val > 1440) return
  saving.value = true
  try {
    const updated = {...appLimits.value, [selectedApp.value]: val}
    const success = await userStore.updateAppLimits(updated)
    if (success) {
      selectedApp.value = ''
      newAppLimit.value = ''
      showMessage('App limit added.')
    } else showMessage('Failed to add app limit', 'error')
  } finally {
    saving.value = false
  }
}

const removeAppLimit = async (pkg) => {
  saving.value = true
  try {
    const updated = {...appLimits.value}
    delete updated[pkg]
    const success = await userStore.updateAppLimits(updated)
    showMessage(success ? 'Limit removed.' : 'Failed to remove limit', success ? 'success' : 'error')
  } finally {
    saving.value = false
  }
}

const resetAllLimits = async () => {
  if (!confirm('Are you sure you want to remove all app limits?')) return
  saving.value = true
  try {
    const success = await userStore.updateAppLimits({})
    showMessage(success ? 'All limits reset.' : 'Failed to reset limits', success ? 'success' : 'error')
  } finally {
    saving.value = false
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    const updates = {
      username: username.value,
      display_name: displayName.value,
      privacy_settings: privacySettings.value
    }
    const success = await userStore.updateUserProfile(updates)
    showMessage(success ? 'Profile updated' : 'Failed to update profile', success ? 'success' : 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadInstalledApps();
  watch(() => userStore.usage_data, loadInstalledApps)
})
</script>
