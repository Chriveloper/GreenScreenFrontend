<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-2xl font-bold text-sky-600 mb-6">Usage History</h1>
      
      <!-- Day Selector -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="day in dayOptions" 
            :key="day.offset"
            @click="loadDay(day.offset)"
            :class="selectedDay === day.offset ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            class="px-4 py-2 rounded-lg transition font-medium"
          >
            {{ day.label }}
          </button>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading usage data...</p>
      </div>
      
      <!-- Data Display -->
      <div v-else-if="currentData">
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-sky-50 p-4 rounded-lg border border-sky-200">
            <p class="text-sm text-gray-600">Total Screen Time</p>
            <p class="text-2xl font-bold text-sky-600">{{ formatTotalTime(currentData.metadata.totalScreenTime) }}</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <p class="text-sm text-gray-600">Apps Used</p>
            <p class="text-2xl font-bold text-green-600">{{ currentData.metadata.totalAppsUsed }}</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p class="text-sm text-gray-600">Data For</p>
            <p class="text-2xl font-bold text-purple-600">{{ currentData.metadata.dayLabel }}</p>
          </div>
        </div>
        
        <!-- App Usage List with Native Data -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">App Usage Details (Native Android)</h3>
          <div 
            v-for="app in sortedUsageData" 
            :key="app.packageName"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
          >
            <div class="flex-1">
              <p class="font-medium">{{ app.appName }}</p>
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span class="font-medium">{{ formatUsageTime(app.foregroundSeconds || app.usageSeconds) }}</span>
                <span v-if="app.launchCount" class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{{ app.launchCount }} launches</span>
                <span v-if="app.firstTimeUsed">
                  First: {{ new Date(app.firstTimeUsed).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
                </span>
                <span v-if="app.lastTimeUsed">
                  Last: {{ new Date(app.lastTimeUsed).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
                </span>
              </div>
              
              <!-- Show foreground vs background breakdown -->
              <div v-if="app.backgroundSeconds > 0" class="mt-1 text-xs text-gray-400">
                Foreground: {{ Math.round((app.foregroundSeconds || 0) / 60) }}m
                <span v-if="app.backgroundSeconds > 0">, Background: {{ Math.round(app.backgroundSeconds / 60) }}m</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-semibold text-gray-700">
                {{ Math.round((app.foregroundSeconds || app.usageSeconds) / currentData.metadata.totalScreenTime * 100) }}%
              </div>
              <div class="text-xs text-gray-500">of total time</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No Data State -->
      <div v-else class="text-center py-8 text-gray-500">
        <p>No usage data available</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

// State
const loading = ref(false);
const selectedDay = ref(0);
const currentData = ref(null);

// Day options
const dayOptions = [
  { offset: 0, label: 'Today' },
  { offset: -1, label: 'Yesterday' },
  { offset: -2, label: '2 days ago' },
  { offset: -3, label: '3 days ago' },
  { offset: -4, label: '4 days ago' },
  { offset: -5, label: '5 days ago' },
  { offset: -6, label: '6 days ago' },
  { offset: -7, label: 'A week ago' },
];

// Computed
const sortedUsageData = computed(() => {
  if (!currentData.value?.usageData) return [];
  
  return [...currentData.value.usageData].sort((a, b) => {
    const aTime = a.foregroundSeconds || a.usageSeconds || 0;
    const bTime = b.foregroundSeconds || b.usageSeconds || 0;
    return bTime - aTime;
  });
});

const formatUsageTime = (seconds) => {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Methods
const loadDay = async (dayOffset) => {
  loading.value = true;
  selectedDay.value = dayOffset;
  
  try {
    const data = await userStore.fetchHistoricalUsageData(dayOffset);
    currentData.value = data;
  } catch (error) {
    console.error('Error loading historical data:', error);
    currentData.value = null;
  } finally {
    loading.value = false;
  }
};

const formatTotalTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Initialize
onMounted(() => {
  loadDay(0); // Load today's data by default
});
</script>