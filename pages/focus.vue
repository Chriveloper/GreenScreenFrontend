<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-sky-600">Focus Session</h1>
      <div class="flex items-center bg-white rounded-lg shadow px-4 py-2 border-t-4 border-yellow-400">
        <span class="text-2xl mr-2">🐚</span>
        <span class="text-lg font-bold text-yellow-600">{{ playerPearls }}</span>
        <span class="text-sm text-gray-600 ml-1">Pearls</span>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Screen Time Goals Section -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-lg font-semibold text-sky-700 mb-6">Screen Time Goals</h2>
        
        <!-- Goal Setting -->
        <div class="mb-6">
          <label for="daily-limit" class="block text-sm font-medium text-gray-700 mb-2">Daily Screen Time Limit (hours)</label>
          <div class="flex items-center space-x-2">
            <input 
              type="number" 
              id="daily-limit" 
              v-model="dailyLimitHours"
              min="1" 
              max="12" 
              step="0.5"
              class="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            >
            <span class="text-sm text-gray-600">hours per day</span>
            <button 
              @click="saveDailyGoal"
              class="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Set Goal
            </button>
          </div>
        </div>

        <!-- App-Specific Limits -->
        <div class="mb-6">
          <h3 class="text-md font-medium text-gray-700 mb-3">App Limits</h3>
          <div class="space-y-3">
            <div v-for="(limit, app) in appLimits" :key="app" class="flex items-center justify-between bg-sky-50 p-3 rounded-lg">
              <div>
                <p class="font-medium text-gray-800">{{ formatAppName(app) }}</p>
                <p class="text-sm text-gray-600">{{ limit }} minutes/day</p>
              </div>
              <button 
                @click="removeAppLimit(app)"
                class="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
          
          <!-- Add New App Limit -->
          <div class="mt-4 border-t pt-4">
            <div class="flex space-x-2">
              <select 
                v-model="selectedApp"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Select an app...</option>
                <option v-for="app in availableApps" :key="app.packageName" :value="app.packageName">
                  {{ app.appName }}
                </option>
              </select>
              <input 
                type="number" 
                v-model="newAppLimit"
                placeholder="Minutes"
                min="5"
                max="480"
                class="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              >
              <button 
                @click="addAppLimit"
                :disabled="!selectedApp || !newAppLimit"
                class="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <!-- Today's Progress -->
        <div class="border-t pt-6">
          <h3 class="text-md font-medium text-gray-700 mb-4">Today's Progress</h3>
          
          <!-- Overall Progress -->
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">Total Screen Time</span>
              <span class="text-sm font-medium" :class="isOverDailyLimit ? 'text-red-600' : 'text-gray-700'">
                {{ formatUsageTime(totalScreenTimeToday) }} / {{ dailyLimitHours }}h
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="h-3 rounded-full transition-all duration-500"
                :class="isOverDailyLimit ? 'bg-red-500' : 'bg-sky-600'"
                :style="{ width: `${Math.min(dailyProgressPercentage, 100)}%` }"
              ></div>
            </div>
            <p v-if="isOverDailyLimit" class="text-xs text-red-600 mt-1">
              ⚠️ You've exceeded your daily limit by {{ formatUsageTime(totalScreenTimeToday - (dailyLimitHours * 60)) }}
            </p>
          </div>

          <!-- App Usage Today -->
          <div v-if="todayUsageData.length > 0">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Top Apps Today</h4>
            <div class="space-y-2">
              <div 
                v-for="app in topAppsToday.slice(0, 5)" 
                :key="app.packageName"
                class="flex items-center justify-between text-sm"
              >
                <span class="font-medium">{{ app.appName }}</span>
                <div class="flex items-center space-x-2">
                  <span :class="isAppOverLimit(app) ? 'text-red-600' : 'text-gray-600'">
                    {{ formatUsageTime(app.usage) }}
                  </span>
                  <span v-if="isAppOverLimit(app)" class="text-red-500 text-xs">⚠️</span>
                </div>
              </div>
            </div>
          </div>

          <!-- No Data Message -->
          <div v-else class="text-center py-4">
            <p class="text-gray-500 text-sm">No usage data available yet.</p>
            <button 
              @click="requestUsageData"
              class="mt-2 text-sky-600 hover:text-sky-700 text-sm font-medium"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Complete Modal -->
    <div v-if="showCompletionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md mx-4">
        <div class="text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold mb-4 text-sky-600">Session Complete!</h3>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div class="flex items-center justify-center mb-2">
              <span class="text-3xl mr-2">🐚</span>
              <span class="text-2xl font-bold text-yellow-600">+{{ lastPearlReward }}</span>
            </div>
            <p class="text-sm text-yellow-700">Pearls earned for your focus!</p>
          </div>
          <p class="text-gray-600 mb-6">
            Great job focusing for {{ completedSessionMinutes }} minutes!
          </p>
          <div class="flex space-x-4">
            <button 
              @click="closeCompletionModal"
              class="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Continue
            </button>
            <NuxtLink 
              to="/shop"
              @click="closeCompletionModal"
              class="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium text-center"
            >
              Visit Shop
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

// Timer state
const focusMinutes = ref(25)
const breakMinutes = ref(5)
const timeLeft = ref(25 * 60) // in seconds
const isRunning = ref(false)
const isBreak = ref(false)
const sessionGoal = ref('')
let timerInterval = null

// Pearl system
const showCompletionModal = ref(false)
const lastPearlReward = ref(0)
const completedSessionMinutes = ref(0)

// Screen time goals state
const dailyLimitHours = ref(4)
const selectedApp = ref('')
const newAppLimit = ref('')

// Usage data state
const todayUsageData = ref([])
const rawUsageData = ref([])

// Get user data from store
const playerPearls = computed(() => userStore.pearls)
const appLimits = computed(() => userStore.appLimits)

// Timer computed properties
const displayTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Screen time computed properties
const totalScreenTimeToday = computed(() => {
  // Convert from seconds to minutes
  const totalSeconds = todayUsageData.value.reduce((total, app) => total + app.usage, 0)
  return Math.round(totalSeconds / 60)
})

const dailyProgressPercentage = computed(() => {
  const limitMinutes = dailyLimitHours.value * 60
  const totalMinutes = totalScreenTimeToday.value
  return (totalMinutes / limitMinutes) * 100
})

const isOverDailyLimit = computed(() => {
  return totalScreenTimeToday.value > (dailyLimitHours.value * 60)
})

const topAppsToday = computed(() => {
  return [...todayUsageData.value]
    .map(app => ({
      ...app,
      usageMinutes: Math.round(app.usage / 60) // Convert seconds to minutes
    }))
    .sort((a, b) => b.usage - a.usage)
})

const availableApps = computed(() => {
  const uniqueApps = new Map()
  rawUsageData.value.forEach(app => {
    if (!uniqueApps.has(app.packageName)) {
      uniqueApps.set(app.packageName, app)
    }
  })
  return Array.from(uniqueApps.values()).sort((a, b) => a.appName.localeCompare(b.appName))
})

// Timer methods
const setFocusTime = (minutes) => {
  if (!isRunning.value) {
    focusMinutes.value = minutes
    timeLeft.value = minutes * 60
  }
}

const startTimer = () => {
  if (!isRunning.value) {
    isRunning.value = true
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        // Timer finished
        isRunning.value = false
        if (isBreak.value) {
          // Break finished, start new focus session
          isBreak.value = false
          timeLeft.value = focusMinutes.value * 60
          
          console.log('Break finished! Ready for next focus session.')
        } else {
          // Focus session finished - award pearls
          const pearlReward = calculatePearlReward()
          lastPearlReward.value = pearlReward
          completedSessionMinutes.value = focusMinutes.value
          
          // Save session and update pearls in store
          userStore.addFocusSession(focusMinutes.value, pearlReward)
          
          // Show completion modal
          showCompletionModal.value = true
          
          // Start break
          isBreak.value = true
          timeLeft.value = breakMinutes.value * 60
          
          console.log(`Focus session completed! Earned ${pearlReward} pearls.`)
        }
        clearInterval(timerInterval)
      }
    }, 1000)
  }
}

const pauseTimer = () => {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
  }
}

const resetTimer = () => {
  isRunning.value = false
  isBreak.value = false
  timeLeft.value = focusMinutes.value * 60
  if (timerInterval) {
    clearInterval(timerInterval)
  }
}

const closeCompletionModal = () => {
  showCompletionModal.value = false
}

// Pearl calculation
const calculatePearlReward = () => {
  // Base pearls: 1 pearl per minute
  // Bonus for longer sessions
  const basePearls = focusMinutes.value
  let bonus = 0
  
  if (focusMinutes.value >= 45) bonus = 10
  else if (focusMinutes.value >= 25) bonus = 5
  
  return basePearls + bonus
}

// Screen time methods
const saveDailyGoal = async () => {
  // Update screen time goals in store
  const goals = { ...userStore.screenTimeGoals, dailyLimit: dailyLimitHours.value * 60 }
  await userStore.updateScreenTimeGoals(goals)
  console.log(`Daily limit set to ${dailyLimitHours.value} hours`)
}

const addAppLimit = async () => {
  if (selectedApp.value && newAppLimit.value) {
    // Create updated limits object
    const updatedLimits = { ...appLimits.value, [selectedApp.value]: parseInt(newAppLimit.value) }
    
    // Update in store
    await userStore.updateAppLimits(updatedLimits)
    
    // Reset form
    selectedApp.value = ''
    newAppLimit.value = ''
  }
}

const removeAppLimit = async (packageName) => {
  // Create updated limits object without the removed app
  const updatedLimits = { ...appLimits.value }
  delete updatedLimits[packageName]
  
  // Update in store
  await userStore.updateAppLimits(updatedLimits)
}

const formatAppName = (packageName) => {
  const app = availableApps.value.find(a => a.packageName === packageName)
  return app ? app.appName : packageName
}

const formatUsageTime = (seconds) => {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

const isAppOverLimit = (app) => {
  const limit = appLimits.value[app.packageName]
  const appMinutes = Math.round(app.usage / 60)
  return limit && appMinutes > limit
}

// Usage data methods
const requestUsageData = () => {
  if (process.client && typeof fetchNativeData !== 'undefined') {
    console.log("📤 [Focus] Requesting usage data...")
    fetchNativeData.postMessage('request_device_data')
  } else {
    console.log('⚠️ Native data channel not available - using sample data')
    // Use sample data for development (in seconds)
    processUsageData(JSON.stringify([
      {
        "packageName": "com.android.chrome",
        "appName": "chrome",
        "usage": 7200, // 2 hours in seconds
        "startTime": new Date().toISOString(),
        "endTime": new Date().toISOString()
      },
      {
        "packageName": "com.instagram.android",
        "appName": "instagram",
        "usage": 2700, // 45 minutes in seconds
        "startTime": new Date().toISOString(),
        "endTime": new Date().toISOString()
      }
    ]))
  }
}

const processUsageData = (data) => {
  try {
    const parsed = JSON.parse(data)
    rawUsageData.value = parsed
    
    // Filter today's data (you might want to implement proper date filtering)
    const today = new Date().toDateString()
    todayUsageData.value = parsed.filter(app => {
      const appDate = new Date(app.startTime).toDateString()
      return appDate === today
    })
    
    // Save to Supabase if authenticated
    if (userStore.isLoggedIn) {
      userStore.saveUsageData(parsed)
    }
    
    console.log(`📊 Processed ${todayUsageData.value.length} apps for today`)
  } catch (error) {
    console.error('Error processing usage data:', error)
  }
}

// Set up native data callback
const setupNativeCallback = () => {
  if (process.client) {
    window.onNativeData = function(data) {
      console.log("🟢 [Focus] Received usage data from native:", data)
      processUsageData(data)
    }
  }
}

// Load saved settings
const loadSettings = async () => {
  if (userStore.isLoggedIn) {
    // Get screen time goal from store
    const screenTimeGoals = userStore.screenTimeGoals
    if (screenTimeGoals?.dailyLimit) {
      dailyLimitHours.value = screenTimeGoals.dailyLimit / 60 // Convert minutes to hours
    }
  }
}

onMounted(async () => {
  setupNativeCallback()
  await loadSettings()
  requestUsageData()
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>