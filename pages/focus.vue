<template>
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- First column: Focus Timer -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-sky-700">Focus Timer</h2>
          <div class="flex items-center bg-white rounded-lg shadow px-4 py-2 border-t-4 border-yellow-400">
            <span class="text-2xl mr-2">🦪</span>
            <span class="text-lg font-bold text-yellow-600">{{ playerPearls }}</span>
            <span class="text-sm text-gray-600 ml-1">Pearls</span>
          </div>
        </div>
        
        <!-- Timer Display -->
        <div class="relative w-48 h-48 mx-auto mb-6">
          <svg class="w-full h-full" viewBox="0 0 100 100">
            <circle class="text-gray-200" stroke-width="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
            <circle
              class="text-sky-600 transition-all duration-1000"
              stroke-width="8"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="progressOffset"
              stroke-linecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <p class="text-3xl font-bold text-sky-700">{{ displayTime }}</p>
              <p class="text-sm text-gray-500">{{ isBreak ? 'Break' : 'Focus' }}</p>
            </div>
          </div>
        </div>

        <!-- Duration Selection -->
        <div class="mb-4">
          <h3 class="text-center text-gray-600 mb-3">Select Focus Duration</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              :disabled="isRunning"
              class="p-3 rounded-lg transition"
              :class="focusSelection === 15 ? 'bg-sky-100 border border-sky-500' : 'bg-gray-100 hover:bg-gray-200'"
              @click="setFocusTime(15)"
            >
              <div class="font-bold text-sky-700">15 min</div>
              <div class="text-xs text-yellow-600">{{ 15**2 }} pearls</div>
            </button>
            <button
              :disabled="isRunning"
              class="p-3 rounded-lg transition"
              :class="focusSelection === 25 ? 'bg-sky-100 border border-sky-500' : 'bg-gray-100 hover:bg-gray-200'"
              @click="setFocusTime(25)"
            >
              <div class="font-bold text-sky-700">25 min</div>
              <div class="text-xs text-yellow-600">{{ 25**2 }} pearls</div>
            </button>
            <button
              :disabled="isRunning"
              class="p-3 rounded-lg transition"
              :class="focusSelection === 45 ? 'bg-sky-100 border border-sky-500' : 'bg-gray-100 hover:bg-gray-200'"
              @click="setFocusTime(45)"
            >
              <div class="font-bold text-sky-700">45 min</div>
              <div class="text-xs text-yellow-600">{{ 45**2 }} pearls</div>
            </button>
            <button
              :disabled="isRunning"
              class="p-3 rounded-lg transition"
              :class="focusSelection === 'custom' ? 'bg-sky-100 border border-sky-500' : 'bg-gray-100 hover:bg-gray-200'"
              @click="setFocusTime('custom')"
            >
              <div class="font-bold text-sky-700">Custom</div>
              <div class="text-xs text-gray-500">Enter time</div>
            </button>
          </div>
        </div>

        <!-- Custom Time Input -->
        <div v-if="focusSelection === 'custom'" class="mb-6">
          <label for="custom-minutes" class="block text-sm font-medium text-gray-700 text-center">Custom Minutes</label>
          <div class="mt-1 relative rounded-md shadow-sm w-48 mx-auto">
            <input
              id="custom-minutes"
              v-model.number="customMinutes"
              type="number"
              name="custom-minutes"
              :disabled="isRunning"
              class="w-full text-center p-2 border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
              placeholder="e.g., 10"
              min="1"
              max="180"
            />
          </div>
          <p v-if="customMinutes > 0" class="text-center text-xs text-yellow-600 mt-2">
            Reward: {{ customMinutes**2 }} pearls
          </p>
        </div>

        <!-- Session Goal Input -->
        <div class="mb-6">
          <label for="session-goal" class="block text-sm font-medium text-gray-700 mb-2">Session Goal (optional)</label>
          <input 
            id="session-goal" 
            v-model="sessionGoal" 
            type="text"
            placeholder="What will you focus on?"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            :disabled="isRunning"
          >
        </div>
        
        <!-- Controls -->
        <div class="flex items-center justify-center space-x-4">
          <button class="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition" @click="resetTimer">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5M20 20v-5h-5"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 9a9 9 0 0114.13-5.12M20 15a9 9 0 01-14.13 5.12"></path></svg>
          </button>
          <button
            class="w-20 h-20 rounded-full text-white font-bold text-lg transition flex items-center justify-center"
            :class="isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-sky-600 hover:bg-sky-700'"
            @click="isRunning ? pauseTimer() : startTimer()"
          >
            {{ isRunning ? 'PAUSE' : 'START' }}
          </button>
          <button class="p-3 rounded-full bg-gray-200 invisible">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 17.364a5 5 0 010-7.072m2.828 9.9a9 9 0 010-12.728"></path></svg>
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
              <div class="flex-1">
                <p class="font-medium">{{ app.appName }}</p>
                <div class="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{{ formatUsageTime(app.foregroundSeconds || app.usage, app.launchCount, app.backgroundSeconds) }}</span>
                  <span v-if="app.firstTimeUsed">First: {{ new Date(app.firstTimeUsed).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}</span>
                  <span v-if="app.lastTimeUsed">Last: {{ new Date(app.lastTimeUsed).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}</span>
                  <span v-if="app.launchCount > 1" class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{{ app.launchCount }} launches</span>
                </div>
                
                <!-- Show foreground vs background breakdown for significant apps -->
                <div v-if="app.backgroundSeconds > 60" class="mt-1 text-xs text-gray-400">
                  Foreground: {{ Math.round(app.foregroundSeconds / 60) }}m, Background: {{ Math.round(app.backgroundSeconds / 60) }}m
                </div>
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
    
    <!-- Session Complete Modal -->
    <div v-if="showCompletionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-2xl font-bold mb-4 text-sky-600">Session Complete!</h3>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-center mb-2">
            <span class="text-3xl mr-2">🦪</span>
            <span class="text-2xl font-bold text-yellow-600">+{{ lastPearlReward }}</span>
          </div>
          <p class="text-sm text-yellow-700">Pearls earned for your focus!</p>
          <p class="text-xs text-gray-500 mt-1">
            ({{ completedSessionMinutes }} minutes)² = {{ lastPearlReward }} pearls
          </p>
        </div>
        <div class="flex space-x-4">
          <button class="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md font-medium" @click="closeCompletionModal">
            Continue
          </button>
          <NuxtLink to="/shop" class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium text-center" @click="closeCompletionModal">
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

// Timer state
const focusSelection = ref(25); // 15, 25, 45, or 'custom'
const customMinutes = ref(10);
const focusMinutes = ref(25);
const breakMinutes = ref(5);
const timeLeft = ref(25 * 60); // in seconds
const isRunning = ref(false);
const isBreak = ref(false);
const sessionGoal = ref('');
let timerInterval = null;

// Pearl system
const showCompletionModal = ref(false);
const lastPearlReward = ref(0);
const completedSessionMinutes = ref(0);

// Screen time goals state
const dailyLimitHours = ref(4);
const selectedApp = ref('');
const newAppLimit = ref('');

// Usage data state
const todayUsageData = ref([]);
const rawUsageData = ref([]);

// Notifications
const notifications = ref([]);

// Computed Properties
const playerPearls = computed(() => userStore.pearls);
const appLimits = computed(() => userStore.appLimits);

const activeMinutes = computed(() => {
  if (focusSelection.value === 'custom') {
    return Math.max(1, customMinutes.value || 1); // Ensure at least 1 minute
  }
  return focusSelection.value;
});

const displayTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const circumference = 2 * Math.PI * 45;
const progressOffset = computed(() => {
  const totalSeconds = activeMinutes.value * 60;
  if (totalSeconds === 0) return circumference;
  const percentage = (totalSeconds - timeLeft.value) / totalSeconds;
  return circumference * (1 - percentage);
});

// Screen time computed properties
const totalScreenTimeToday = computed(() => {
  return todayUsageData.value.reduce((total, app) => total + app.usage, 0);
});

const dailyLimitPercentage = computed(() => {
  const dailyLimitSeconds = dailyLimitHours.value * 60 * 60;
  const percentage = Math.min(100, Math.round((totalScreenTimeToday.value / dailyLimitSeconds) * 100));
  return percentage;
});

const dailyLimitProgress = computed(() => {
  const percentage = Math.min(1, totalScreenTimeToday.value / (dailyLimitHours.value * 60 * 60));
  return 251.2 * (1 - percentage); // 251.2 is circumference of circle with r=40
});

const isOverDailyLimit = computed(() => {
  return totalScreenTimeToday.value > dailyLimitHours.value * 60 * 60;
});

const sortedTodayUsage = computed(() => {
  return [...todayUsageData.value].sort((a, b) => b.usage - a.usage);
});

// Watch for changes in custom minutes to update the timer
watch(customMinutes, (newVal) => {
  if (focusSelection.value === 'custom' && !isRunning.value) {
    timeLeft.value = Math.max(1, newVal || 1) * 60;
    focusMinutes.value = Math.max(1, newVal || 1);
  }
});

// Methods
const setFocusTime = (selection) => {
  if (isRunning.value) return;
  focusSelection.value = selection;
  
  if (selection !== 'custom') {
    timeLeft.value = selection * 60;
    focusMinutes.value = selection;
  } else {
    timeLeft.value = Math.max(1, customMinutes.value || 1) * 60;
    focusMinutes.value = Math.max(1, customMinutes.value || 1);
  }
};

const calculatePearlReward = () => {
  return Math.round(Math.pow(activeMinutes.value, 2));
};

const refreshUserData = async () => {
  console.log('Refreshing user data...');
  await userStore.loadUserProfile();
  console.log('User data refreshed. Current pearls:', userStore.pearls);
};

const startTimer = async () => {
  if (isRunning.value || activeMinutes.value <= 0) return;
  isRunning.value = true;
  
  timerInterval = setInterval(async () => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      await completeTimer();
    }
  }, 1000);
};

const completeTimer = async () => {
  clearInterval(timerInterval);
  isRunning.value = false;
  
  if (isBreak.value) {
    // Break finished, start new focus session
    isBreak.value = false;
    timeLeft.value = focusMinutes.value * 60;
    showNotification('Break finished! Ready for next focus session.', 'info');
  } else {
    // Focus session finished - award pearls
    const pearlReward = calculatePearlReward();
    lastPearlReward.value = pearlReward;
    completedSessionMinutes.value = activeMinutes.value;
    
    try {
      const success = await userStore.addFocusSession(activeMinutes.value, pearlReward);
      if (success) {
        console.log(`Successfully added ${pearlReward} pearls to account.`);
        await refreshUserData();
        showNotification(`Earned ${pearlReward} pearls for focusing ${activeMinutes.value} minutes!`, 'success');
      } else {
        console.error('Failed to add focus session rewards');
        showNotification('Failed to add rewards. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error while adding focus session:', error);
    }
    
    showCompletionModal.value = true;
    
    // Start break if not in custom mode
    if (focusSelection.value !== 'custom') {
      isBreak.value = true;
      timeLeft.value = breakMinutes.value * 60;
    } else {
      resetTimer(false); // Reset without changing duration
    }
  }
};

const pauseTimer = () => {
  isRunning.value = false;
  clearInterval(timerInterval);
};

const resetTimer = (changeDuration = true) => {
  pauseTimer();
  isBreak.value = false;
  
  if (changeDuration) {
    focusSelection.value = 25;
    focusMinutes.value = 25;
    timeLeft.value = 25 * 60;
  } else {
    timeLeft.value = activeMinutes.value * 60;
  }
};

const closeCompletionModal = () => {
  showCompletionModal.value = false;
};

const formatUsageTime = (seconds, launchCount = null, backgroundSeconds = null) => {
  const minutes = Math.round(seconds / 60);
  let timeStr = '';
  
  if (minutes < 60) {
    timeStr = `${minutes}m`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    timeStr = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  
  // Add launch count if available
  if (launchCount && launchCount > 1) {
    timeStr += ` (${launchCount}×)`;
  }
  
  // Add background time indicator if significant
  if (backgroundSeconds && backgroundSeconds > 60) {
    const bgMinutes = Math.round(backgroundSeconds / 60);
    timeStr += ` +${bgMinutes}m bg`;
  }
  
  return timeStr;
};

const isAppOverLimit = (app) => {
  const limit = appLimits.value[app.packageName];
  const appMinutes = Math.round(app.usage / 60);
  return limit && appMinutes > limit;
};

// Usage data methods
const requestUsageData = () => {
  if (process.client && typeof fetchNativeData !== 'undefined') {
    console.log("📤 [Focus] Requesting usage data...");
    fetchNativeData.postMessage('request_device_data');
  } else {
    console.log('⚠️ Native data channel not available - fetching from server');
    // Fetch from server instead of using sample data
    fetchUsageDataFromServer();
  }
};

// New method to fetch from native Android server
const fetchUsageDataFromServer = async () => {
  try {
    const response = await fetch('http://localhost:8080/data');
    const data = await response.json();
    
    if (data.error) {
      console.error('Native Android error:', data.message);
      showNotification(`Native data error: ${data.message}`, 'error');
      // Fall back to sample data
      const sampleData = JSON.stringify([
        { packageName: 'com.instagram.android', appName: 'Instagram', foregroundSeconds: 3600, backgroundSeconds: 120, usageSeconds: 3600, startTime: new Date().toISOString(), endTime: new Date().toISOString(), launchCount: 5 },
        { packageName: 'com.facebook.katana', appName: 'Facebook', foregroundSeconds: 1800, backgroundSeconds: 60, usageSeconds: 1800, startTime: new Date().toISOString(), endTime: new Date().toISOString(), launchCount: 3 },
        { packageName: 'com.whatsapp', appName: 'WhatsApp', foregroundSeconds: 2400, backgroundSeconds: 180, usageSeconds: 2400, startTime: new Date().toISOString(), endTime: new Date().toISOString(), launchCount: 8 },
        { packageName: 'com.tiktok.app', appName: 'TikTok', foregroundSeconds: 4500, backgroundSeconds: 90, usageSeconds: 4500, startTime: new Date().toISOString(), endTime: new Date().toISOString(), launchCount: 6 }
      ]);
      processUsageData(sampleData);
      return;
    }
    
    console.log(`📊 Received native ${data.dayLabel} data:`, {
      totalScreenTime: Math.round(data.totalScreenTime / 3600 * 10) / 10 + 'h',
      totalAppsUsed: data.totalAppsUsed,
      targetDate: data.targetDate,
      queryPeriod: `${data.queryStartTime} to ${data.queryEndTime}`
    });
    
    processEnhancedNativeData(data);
  } catch (error) {
    console.error('Error fetching native usage data from server:', error);
    showNotification('Failed to fetch native data', 'error');
    // Fall back to sample data
    const sampleData = JSON.stringify([
      { packageName: 'com.instagram.android', appName: 'Instagram', foregroundSeconds: 3600, backgroundSeconds: 120, usageSeconds: 3600, startTime: new Date().toISOString(), endTime: new Date().toISOString(), launchCount: 5 },
      { packageName: 'com.facebook.katana', appName: 'Facebook', foregroundSeconds: 1800, backgroundSeconds: 60, usageSeconds: 1800, startTime: new Date().toISOString(), endTime: new Date().toISOString(), launchCount: 3 }
    ]);
    processUsageData(sampleData);
  }
};

// Process enhanced native Android data
const processEnhancedNativeData = (nativeData) => {
  try {
    rawUsageData.value = nativeData.usageData;
    
    // Map native Android data to our format
    todayUsageData.value = nativeData.usageData.map(app => ({
      ...app,
      usage: app.foregroundSeconds || 0, // Use foreground time for screen time calculations
      backgroundTime: app.backgroundSeconds || 0,
      totalTime: (app.foregroundSeconds || 0) + (app.backgroundSeconds || 0)
    }));
    
    // Update total screen time from native metadata
    if (nativeData.totalScreenTime) {
      totalScreenTimeToday.value = nativeData.totalScreenTime;
    }
    
    // Save to Supabase if authenticated
    if (userStore.isLoggedIn) {
      userStore.saveUsageData(nativeData.usageData);
    }
    
    console.log(`📊 Processed ${todayUsageData.value.length} apps for ${nativeData.dayLabel}`);
    console.log('Sample app data:', todayUsageData.value.slice(0, 2));
    
    // Show notification with native screen time summary
    const screenTimeHours = Math.round(nativeData.totalScreenTime / 3600 * 10) / 10;
    showNotification(`${nativeData.dayLabel}: ${screenTimeHours}h screen time, ${nativeData.totalAppsUsed} apps used (Native Android)`, 'info');
    
  } catch (error) {
    console.error('Error processing native Android data:', error);
  }
};

// Process usage data from native app (keep existing for compatibility)
const processUsageData = (data) => {
  try {
    const parsed = JSON.parse(data);
    rawUsageData.value = parsed;
    
    // Filter for today's data
    const today = new Date().toDateString();
    todayUsageData.value = parsed.filter(app => {
      const appDate = new Date(app.startTime).toDateString();
      return appDate === today;
    }).map(app => ({
      ...app,
      usage: app.foregroundSeconds || app.usageSeconds || 0
    }));
    
    // Save to Supabase if authenticated
    if (userStore.isLoggedIn) {
      userStore.saveUsageData(parsed);
    }
    
    console.log(`📊 Processed ${todayUsageData.value.length} apps for today`);
  } catch (error) {
    console.error('Error processing usage data:', error);
  }
};

// Set up native data callback
const setupNativeCallback = () => {
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
      console.log("App went to background");
      if (isRunning.value) {
        pauseTimer();
      }
    };
  }
};

// Load saved settings
const loadSettings = async () => {
  if (userStore.isLoggedIn) {
    // Get screen time goal from store
    const screenTimeGoals = userStore.screenTimeGoals;
    if (screenTimeGoals?.dailyLimit) {
      dailyLimitHours.value = screenTimeGoals.dailyLimit / 60; // Convert minutes to hours
    }
  }
};

// Notifications
const showNotification = (message, type = 'info') => {
  const id = Date.now();
  notifications.value.push({ id, message, type });
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }, 5000);
};

onMounted(async () => {
  setupNativeCallback();
  await loadSettings();
  requestUsageData();
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
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