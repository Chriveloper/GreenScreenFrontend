<script setup>
import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const parsedUsageData = ref([])

const loadUsageDataFromStore = () => {
  try {
    const usageRaw = userStore.usage_data
    const installedRaw = userStore.installed_apps

    if (!usageRaw || !installedRaw) return

    const parsed = JSON.parse(usageRaw)
    const installed = JSON.parse(installedRaw)

    parsedUsageData.value = parsed.map(day => {
      const entries = (day.entries || []).map(entry => {
        const match = installed.find(app => app.packageName === entry.packageName)
        return {
          ...entry,
          appName: match?.appName || '',
          icon: match?.icon || null
        }
      })
      return {
        date: day.date || 'Unknown',
        entries
      }
    })
  } catch (e) {
    // silently fail
  }
}

onMounted(() => {
  loadUsageDataFromStore()
  watch(() => userStore.usage_data, loadUsageDataFromStore)
})

const formatUsageTime = (seconds) => {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}
</script>

<template>
  <div class="max-w-full w-full px-4 py-4 sm:px-6 sm:py-6">
    <h1 class="text-xl sm:text-2xl font-bold text-sky-600 mb-6">All Usage History</h1>

    <div
        v-if="parsedUsageData.length > 0"
        class="space-y-10"
    >
      <div
          v-for="(day, index) in parsedUsageData"
          :key="index"
          class="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-sky-400"
      >
        <h2 class="text-base sm:text-lg font-semibold mb-4 text-sky-700">
          Usage Data – {{ day.date }}
        </h2>

        <div v-if="day.entries.length > 0" class="overflow-x-auto">
          <table class="min-w-full table-auto border-collapse text-sm sm:text-base">
            <thead>
            <tr class="bg-sky-50 border-b border-sky-200">
              <th class="px-2 py-2 sm:px-4 text-left font-medium text-sky-700">Icon</th>
              <th class="px-2 py-2 sm:px-4 text-left font-medium text-sky-700">App Name</th>
              <th class="px-2 py-2 sm:px-4 text-left font-medium text-sky-700">Usage Time</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="app in day.entries"
                :key="`${app.appName}-${app.usageSeconds}`"
                class="border-b hover:bg-sky-25"
            >
              <td class="px-2 py-2 sm:px-4">
                <img
                    v-if="app.icon"
                    :src="`data:image/png;base64,${app.icon}`"
                    alt="App icon"
                    class="w-5 h-5 sm:w-6 sm:h-6 rounded"
                />
              </td>
              <td class="px-2 py-2 sm:px-4 font-medium">{{ app.appName }}</td>
              <td class="px-2 py-2 sm:px-4">{{ formatUsageTime(app.usageSeconds || 0) }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-sm text-gray-500">No usage data for this day.</div>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500 mb-6">No usage data available.</div>
  </div>
</template>
