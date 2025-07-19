<template>
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- First column: Focus Timer -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-lg font-semibold text-sky-700 mb-6">Focus Timer</h2>
        
        <!-- Timer Display -->
        <div class="flex flex-col items-center mb-8">
          <div class="relative">
            <svg class="w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#f1f5f9"
                stroke-width="12"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#0284c7"
                stroke-width="12"
                stroke-dasharray="553"
                :stroke-dashoffset="progressOffset"
                stroke-linecap="round"
                transform="rotate(-90 96 96)"
                class="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <p class="text-3xl font-bold text-sky-700">{{ displayTime }}</p>
                <p class="text-sm text-gray-500">{{ isBreak ? 'Break' : 'Focus' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Timer Controls -->
        <div class="flex justify-center space-x-3 mb-6">
          <button 
            @click="setFocusTime(15)"
            :class="{'bg-sky-600 text-white': focusMinutes === 15 && !isRunning, 'bg-gray-100 text-gray-700': focusMinutes !== 15 || isRunning}"
            class="px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50"
            :disabled="isRunning"
          >
            15 min
          </button>
          <button 
            @click="setFocusTime(25)"
            :class="{'bg-sky-600 text-white': focusMinutes === 25 && !isRunning, 'bg-gray-100 text-gray-700': focusMinutes !== 25 || isRunning}"
            class="px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50"
            :disabled="isRunning"
          >
            25 min
          </button>
          <button 
            @click="setFocusTime(45)"
            :class="{'bg-sky-600 text-white': focusMinutes === 45 && !isRunning, 'bg-gray-100 text-gray-700': focusMinutes !== 45 || isRunning}"
            class="px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50"
            :disabled="isRunning"
          >
            45 min
          </button>
        </div>
        
        <!-- Session Goal Input -->
        <div class="mb-6">
          <label for="session-goal" class="block text-sm font-medium text-gray-700 mb-2">Session Goal (optional)</label>
          <input 
            type="text" 
            id="session-goal" 
            v-model="sessionGoal"
            placeholder="What will you focus on?"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            :disabled="isRunning"
          >
        </div>
        
        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button 
            v-if="!isRunning"
            @click="startTimer"
            class="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-3 rounded-md font-medium text-sm transition"
          >
            Start Focus
          </button>
          <button 
            v-else
            @click="pauseTimer"
            class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-md font-medium text-sm transition"
          >
            Pause
          </button>
          <button 
            @click="resetTimer"
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-md font-medium text-sm transition"
            :disabled="!isRunning && timeLeft === focusMinutes * 60"
          >
            Reset
          </button>
        </div>
      </div>
      
      <!-- Second column: Usage Analytics -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-lg font-semibold text-sky-700 mb-6">Usage Analytics</h2>
        
        <!-- Daily Screen Time Summary -->
        <div class="mb-6 bg-gray-50 rounded-lg p-4">
          <h3 class="text-md font-medium text-gray-700 mb-2">Today's Screen Time</h3>
          <div class="flex items-center justify-between">
            <div>
              <span class="text-2xl font-bold text-sky-600">{{ formatUsageTime(totalScreenTimeToday) }}</span>
              <span class="text-sm text-gray-500 ml-2">of {{ dailyLimitHours }}h limit</span>
            </div>
            <div class="w-24 h-24 relative">
              <!-- Circle progress for screen time -->
              <svg class="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#f1f5f9"
                  stroke-width="8"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  :stroke="isOverDailyLimit ? '#ef4444' : '#0284c7'"
                  stroke-width="8"
                  :stroke-dasharray="251.2"
                  :stroke-dashoffset="dailyLimitProgress"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-sm font-medium">{{ dailyLimitPercentage }}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- App Usage List -->
        <div>
          <h3 class="text-md font-medium text-gray-700 mb-2">Today's App Usage</h3>
          <div v-if="todayUsageData.length > 0" class="space-y-3">
            <!-- App usage items -->
            <div 
              v-for="app in sortedTodayUsage" 
              :key="app.packageName"
              :class="{'border-red-500': isAppOverLimit(app)}"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4"
            >
              <div>
                <p class="font-medium">{{ app.appName }}</p>
                <p class="text-xs text-gray-500">{{ formatUsageTime(app.usage) }}</p>
              </div>
              
              <!-- Show warning if over limit -->
              <div v-if="isAppOverLimit(app)" class="text-red-500 text-xs font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Over limit
              </div>
              
              <!-- Show limit if set -->
              <div v-else-if="appLimits[app.packageName]" class="text-gray-500 text-xs">
                Limit: {{ appLimits[app.packageName] }}min
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500 text-sm italic">No usage data available for today</p>
        </div>
      </div>
    </div>
    
    <!-- Completion Modal -->
    <div v-if="showCompletionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Focus Session Complete!</h3>
          <p class="text-gray-600 mt-2">You've completed a {{ completedSessionMinutes }} minute focus session.</p>
          <div class="flex items-center justify-center mt-4 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xl font-bold ml-2">+{{ lastPearlReward }} pearls</span>
          </div>
        </div>
        <div class="flex space-x-3">
          <button @click="closeCompletionModal" class="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md font-medium">
            Continue
          </button>
          <NuxtLink to="/shop" @click="closeCompletionModal" class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium text-center">
            Visit Shop
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <!-- Notifications -->
    <div class="fixed bottom-4 right-4 z-50">
      <transition-group name="notification">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          :class="{
            'bg-sky-100 border-sky-500': notification.type === 'info',
            'bg-yellow-100 border-yellow-500': notification.type === 'warning',
            'bg-red-100 border-red-500': notification.type === 'error'
          }"
          class="mb-2 p-3 border-l-4 rounded shadow-md max-w-xs"
        >
          {{ notification.message }}
        </div>
      </transition-group>
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

// Notifications
const notifications = ref([])

// Get user data from store
const playerPearls = computed(() => userStore.pearls)
const appLimits = computed(() => userStore.appLimits)

// Timer computed properties
const displayTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Add this computed property
const progressOffset = computed(() => {
  const totalSeconds = focusMinutes.value * 60;
  const percentage = (totalSeconds - timeLeft.value) / totalSeconds;
  return 553 * (1 - percentage); // 553 is the circumference of the circle with r=88
});

// Screen time computed properties
const totalScreenTimeToday = computed(() => {
  // Convert from seconds to minutes
  return todayUsageData.value.reduce((total, app) => total + app.usage, 0)
})

const dailyLimitPercentage = computed(() => {
  const dailyLimitSeconds = dailyLimitHours.value * 60 * 60
  const percentage = Math.min(100, Math.round((totalScreenTimeToday.value / dailyLimitSeconds) * 100))
  return percentage
})

const dailyLimitProgress = computed(() => {
  const percentage = Math.min(1, totalScreenTimeToday.value / (dailyLimitHours.value * 60 * 60))
  return 251.2 * (1 - percentage) // 251.2 is circumference of circle with r=40
})

const isOverDailyLimit = computed(() => {
  return totalScreenTimeToday.value > dailyLimitHours.value * 60 * 60
})

const sortedTodayUsage = computed(() => {
  return [...todayUsageData.value].sort((a, b) => b.usage - a.usage)
})

// Timer methods
const startTimer = () => {
  if (!isRunning.value) {
    isRunning.value = true;
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        // Timer finished
        isRunning.value = false;
        clearInterval(timerInterval);
        
        if (isBreak.value) {
          // Break finished, start new focus session
          isBreak.value = false;
          timeLeft.value = focusMinutes.value * 60;
          showNotification('Break finished! Ready for next focus session.', 'info');
        } else {
          // Focus session finished - award pearls
          const pearlReward = calculatePearlReward();
          lastPearlReward.value = pearlReward;
          completedSessionMinutes.value = focusMinutes.value;
          
          // Save session and update pearls in store
          userStore.addFocusSession(focusMinutes.value, pearlReward);
          
          // Show completion modal
          showCompletionModal.value = true;
          
          // Start break
          isBreak.value = true;
          timeLeft.value = breakMinutes.value * 60;
        }
      }
    }, 1000);
  }
};

const pauseTimer = () => {
  isRunning.value = false;
  if (timerInterval) {
    clearInterval(timerInterval);
  }
};

const resetTimer = () => {
  isRunning.value = false;
  isBreak.value = false;
  timeLeft.value = focusMinutes.value * 60;
  if (timerInterval) {
    clearInterval(timerInterval);
  }
};

const setFocusTime = (minutes) => {
  if (!isRunning.value) {
    focusMinutes.value = minutes;
    timeLeft.value = minutes * 60;
  }
};

const closeCompletionModal = () => {
  showCompletionModal.value = false;
};

// Calculate pearl reward based on session length
const calculatePearlReward = () => {
  // Basic formula: 2 pearls per 5 minutes, rounded up
  return Math.ceil(focusMinutes.value / 5) * 2;
};

// Screen time methods
const saveDailyGoal = async () => {
  // Update screen time goals in store
  const goals = { dailyLimit: dailyLimitHours.value * 60 }
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
  const app = todayUsageData.value.find(a => a.packageName === packageName)
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
    const sampleData = JSON.stringify([
      { packageName: 'com.instagram.android', appName: 'Instagram', usage: 3600, startTime: new Date().toISOString(), endTime: new Date().toISOString() },
      { packageName: 'com.facebook.katana', appName: 'Facebook', usage: 1800, startTime: new Date().toISOString(), endTime: new Date().toISOString() },
      { packageName: 'com.whatsapp', appName: 'WhatsApp', usage: 2400, startTime: new Date().toISOString(), endTime: new Date().toISOString() },
      { packageName: 'com.tiktok.app', appName: 'TikTok', usage: 4500, startTime: new Date().toISOString(), endTime: new Date().toISOString() }
    ])
    processUsageData(sampleData)
  }
}

// Process usage data from native app
const processUsageData = (data) => {
  try {
    const parsed = JSON.parse(data)
    rawUsageData.value = parsed
    
    // Filter for today's data
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
/*const setupNativeCallback = () => {
  if (process.client) {
    window.onNativeData = function(data) {
      console.log("🟢 [Focus] Received usage data from native:", data);
      processUsageData(data);
      
      // Add notification if daily limit is exceeded
      setTimeout(() => {
        if (isOverDailyLimit.value) {
          showNotification('Daily screen time limit exceeded!', 'warning');
        }
      }, 500);
    };
    
    // Add a method that Flutter can call when the app is put in background
    window.onAppBackground = function() {
      // Save any unsaved state
      console.log("App went to background");
      if (isRunning.value) {
        pauseTimer();
      }
    };
  }
};*/

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

// Notifications
const showNotification = (message, type = 'info') => {
  const id = Date.now();
  notifications.value.push({ id, message, type });
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }, 5000);
};
</script>

<style>
.notification-enter-active, .notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from, .notification-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>