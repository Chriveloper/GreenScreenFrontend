<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-sky-600 mb-6">Usage Data Test</h1>

    <div v-if="parsedUsageData.length > 0" class="bg-white rounded-lg shadow-lg p-6 border-t-4 border-sky-400">
      <h2 class="text-lg font-semibold mb-4 text-sky-700">Parsed Usage Data</h2>

      <div class="overflow-x-auto mb-6">
        <table class="min-w-full table-auto border-collapse">
          <thead>
          <tr class="bg-sky-50 border-b border-sky-200">
            <th class="px-4 py-2 text-left font-medium text-sky-700">Icon</th>
            <th class="px-4 py-2 text-left font-medium text-sky-700">App Name</th>
            <th class="px-4 py-2 text-left font-medium text-sky-700">Package Name</th>
            <th class="px-4 py-2 text-left font-medium text-sky-700">Foreground Time</th>
            <th class="px-4 py-2 text-left font-medium text-sky-700">Background Time</th>
            <th class="px-4 py-2 text-left font-medium text-sky-700">Launches</th>
            <th class="px-4 py-2 text-left font-medium text-sky-700">First Used</th>
            <th class="px-4 py-2 text-left font-medium text-sky-700">Last Used</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="app in parsedUsageData"
              :key="`${app.packageName}-${app.startTime}`"
              class="border-b hover:bg-sky-25"
          >
            <td class="px-4 py-2">
              <img
                  v-if="app.icon"
                  :src="`data:image/png;base64,${app.icon}`"
                  alt="App icon"
                  class="w-6 h-6 rounded"
              />
            </td>
            <td class="px-4 py-2 font-medium">{{ app.appName }}</td>
            <td class="px-4 py-2 text-sm text-gray-600">{{ app.packageName }}</td>
            <td class="px-4 py-2">{{ formatUsageTime(app.foregroundSeconds || app.usageSeconds) }}</td>
            <td class="px-4 py-2">{{ formatUsageTime(app.backgroundSeconds || 0) }}</td>
            <td class="px-4 py-2">{{ app.launchCount || 1 }}</td>
            <td class="px-4 py-2 text-sm">{{ app.firstTimeUsed ? formatDateTime(app.firstTimeUsed) : 'N/A' }}</td>
            <td class="px-4 py-2 text-sm">{{ app.lastTimeUsed ? formatDateTime(app.lastTimeUsed) : 'N/A' }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6">
        <h3 class="font-semibold mb-2 text-sky-700">Native Android Usage Summary:</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-sky-50 p-4 rounded-lg border border-sky-200">
            <p class="text-sm text-gray-600">Total Apps</p>
            <p class="text-2xl font-bold text-sky-600">{{ parsedUsageData.length }}</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <p class="text-sm text-gray-600">Foreground Usage</p>
            <p class="text-2xl font-bold text-green-600">{{ totalForegroundMinutes }} min</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p class="text-sm text-gray-600">Background Usage</p>
            <p class="text-2xl font-bold text-yellow-600">{{ totalBackgroundMinutes }} min</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p class="text-sm text-gray-600">Most Used App</p>
            <p class="text-2xl font-bold text-purple-600">{{ mostUsedApp?.appName || 'N/A' }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-gray-500">Waiting for native data...</div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useUserStore} from '@/stores/user'

const userStore = useUserStore()

const parsedUsageData = ref([])

const loadUsageDataFromStore = () => {
  try {
    const usageRaw = userStore.usage_data
    const installedRaw = userStore.installed_apps

    if (!usageRaw || !installedRaw) return

    const usage = JSON.parse(usageRaw)
    const installed = JSON.parse(installedRaw)

    // Merge icon and appName from installed apps
    parsedUsageData.value = usage.map(entry => {
      const match = installed.find(app => app.packageName === entry.packageName)
      return {
        ...entry,
        appName: match?.appName || entry.appName,
        icon: match?.icon || null
      }
    })
  } catch (e) {
    console.error("Error loading user store usage data:", e)
  }
}

onMounted(() => {
  loadUsageDataFromStore()

  // Optional: listen to changes if store updates dynamically
  watch(() => userStore.usage_data, loadUsageDataFromStore)
})

// Computed properties
const totalForegroundMinutes = computed(() => {
  const total = parsedUsageData.value.reduce((sum, app) => sum + (app.foregroundSeconds || app.usageSeconds || 0), 0)
  return Math.round(total / 60)
})

const totalBackgroundMinutes = computed(() => {
  const total = parsedUsageData.value.reduce((sum, app) => sum + (app.backgroundSeconds || 0), 0)
  return Math.round(total / 60)
})

const mostUsedApp = computed(() => {
  if (parsedUsageData.value.length === 0) return null
  return parsedUsageData.value.reduce((prev, curr) =>
      (curr.foregroundSeconds || curr.usageSeconds || 0) > (prev.foregroundSeconds || prev.usageSeconds || 0) ? curr : prev
  )
})

// Utility
const formatUsageTime = (seconds) => {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
