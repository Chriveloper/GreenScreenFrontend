<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-sky-600 mb-6">Usage Data Test</h1>
    
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6 border-t-4 border-sky-400">
      <h2 class="text-lg font-semibold mb-4 text-sky-700">Native Data Communication Test</h2>
      
      <div class="mb-4">
        <button 
          @click="simulateNativeData" 
          class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg mr-4"
        >
          Simulate Native Data
        </button>
        <button 
          @click="clearOutput" 
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Clear Output
        </button>
      </div>
      
      <div class="border rounded-lg p-4 bg-sky-50">
        <h3 class="font-semibold mb-2 text-sky-700">Raw Data Output:</h3>
        <pre class="text-sm text-gray-700 whitespace-pre-wrap">{{ rawOutput }}</pre>
      </div>
    </div>

    <div v-if="parsedUsageData.length > 0" class="bg-white rounded-lg shadow-lg p-6 border-t-4 border-sky-400">
      <h2 class="text-lg font-semibold mb-4 text-sky-700">Parsed Usage Data</h2>
      
      <div class="overflow-x-auto mb-6">
        <table class="min-w-full table-auto border-collapse">
          <thead>
            <tr class="bg-sky-50 border-b border-sky-200">
              <th class="px-4 py-2 text-left font-medium text-sky-700">App Name</th>
              <th class="px-4 py-2 text-left font-medium text-sky-700">Package Name</th>
              <th class="px-4 py-2 text-left font-medium text-sky-700">Usage Time</th>
              <th class="px-4 py-2 text-left font-medium text-sky-700">Start Time</th>
              <th class="px-4 py-2 text-left font-medium text-sky-700">End Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in parsedUsageData" :key="`${app.packageName}-${app.startTime}`" class="border-b hover:bg-sky-25">
              <td class="px-4 py-2 font-medium">{{ app.appName }}</td>
              <td class="px-4 py-2 text-sm text-gray-600">{{ app.packageName }}</td>
              <td class="px-4 py-2">{{ formatUsageTime(app.usage) }}</td>
              <td class="px-4 py-2 text-sm">{{ formatDateTime(app.startTime) }}</td>
              <td class="px-4 py-2 text-sm">{{ formatDateTime(app.endTime) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6">
        <h3 class="font-semibold mb-2 text-sky-700">Usage Summary:</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-sky-50 p-4 rounded-lg border border-sky-200">
            <p class="text-sm text-gray-600">Total Apps</p>
            <p class="text-2xl font-bold text-sky-600">{{ parsedUsageData.length }}</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <p class="text-sm text-gray-600">Total Usage</p>
            <p class="text-2xl font-bold text-green-600">{{ totalUsageMinutes }} min</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p class="text-sm text-gray-600">Most Used App</p>
            <p class="text-2xl font-bold text-purple-600">{{ mostUsedApp?.appName || 'N/A' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const rawOutput = ref('Waiting for native data...')
const parsedUsageData = ref([])

// Sample data that matches your format
const sampleData = [
  {
    "packageName": "com.google.android.apps.wellbeing",
    "appName": "wellbeing",
    "usage": 3,
    "startTime": "2025-05-26T06:23:34.000",
    "endTime": "2025-05-26T07:01:27.000"
  },
  {
    "packageName": "com.google.android.packageinstaller",
    "appName": "packageinstaller", 
    "usage": 7,
    "startTime": "2025-05-26T06:23:34.000",
    "endTime": "2025-05-26T06:59:16.000"
  },
  {
    "packageName": "com.android.chrome",
    "appName": "chrome",
    "usage": 99,
    "startTime": "2025-05-26T06:23:34.000",
    "endTime": "2025-05-26T06:50:01.000"
  },
  {
    "packageName": "dev.notium.greenscreen",
    "appName": "greenscreen",
    "usage": 8,
    "startTime": "2025-05-26T06:23:34.000",
    "endTime": "2025-05-26T07:02:03.000"
  },
  {
    "packageName": "com.google.android.apps.nexuslauncher",
    "appName": "nexuslauncher",
    "usage": 1518,
    "startTime": "2025-05-26T06:23:34.000",
    "endTime": "2025-05-26T07:01:59.000"
  },
  {
    "packageName": "com.android.settings",
    "appName": "settings",
    "usage": 73,
    "startTime": "2025-05-26T06:23:34.000",
    "endTime": "2025-05-26T07:01:43.000"
  }
]

// Set up the global callback for native data
const setupNativeCallback = () => {
  if (process.client) {
    window.onNativeData = function(data) {
      console.log("🟢 [Web] Received from native:", data)
      try {
        const parsed = JSON.parse(data)
        rawOutput.value = `Native sent: ${JSON.stringify(parsed, null, 2)}`
        parsedUsageData.value = parsed
      } catch (e) {
        rawOutput.value = `Native sent (raw): ${data}`
        console.error('Error parsing native data:', e)
      }
    }
    
    console.log("📤 [Web] Setup complete, ready to receive native data")
  }
}

const simulateNativeData = () => {
  const dataString = JSON.stringify(sampleData)
  console.log("🧪 [Test] Simulating native data:", dataString)
  
  if (process.client && window.onNativeData) {
    window.onNativeData(dataString)
  }
}

const clearOutput = () => {
  rawOutput.value = 'Waiting for native data...'
  parsedUsageData.value = []
}

// Computed properties for data analysis
const totalUsageMinutes = computed(() => {
  return parsedUsageData.value.reduce((total, app) => total + app.usage, 0)
})

const mostUsedApp = computed(() => {
  if (parsedUsageData.value.length === 0) return null
  return parsedUsageData.value.reduce((prev, current) => 
    prev.usage > current.usage ? prev : current
  )
})

// Utility functions
const formatUsageTime = (minutes) => {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Request native data on component mount
onMounted(() => {
  setupNativeCallback()
  
  // Try to request data from native if available
  if (process.client) {
    setTimeout(() => {
      if (typeof fetchNativeData !== 'undefined') {
        console.log("📤 [Web] Requesting native data...")
        fetchNativeData.postMessage('request_device_data')
      } else {
        console.log('⚠ fetchNativeData channel is not available - running in web mode')
      }
    }, 100)
  }
})
</script>