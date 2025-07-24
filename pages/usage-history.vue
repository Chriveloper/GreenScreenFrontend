<script setup>
import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const parsedUsageData = ref([])
const usageDate = ref(null)
const selectedDayOffset = ref(0)
const totalScreenTime = ref(0)

const dayOptions = [
  { offset: 0, label: 'Today' },
  { offset: 1, label: 'Yesterday' },
  { offset: 2, label: '2 days ago' },
  { offset: 3, label: '3 days ago' },
  { offset: 4, label: '4 days ago' },
  { offset: 5, label: '5 days ago' },
  { offset: 6, label: '6 days ago' },
  { offset: 7, label: 'A week ago' }
]

const loadUsageDataFromStore = () => {
  try {
    const usageRaw = userStore.usage_data
    const installedRaw = userStore.installed_apps

    if (!usageRaw || !installedRaw) return

    const parsed = JSON.parse(usageRaw)
    const installed = JSON.parse(installedRaw)

    const usageBlock = parsed[selectedDayOffset.value] || { entries: [] }
    usageDate.value = usageBlock.date || 'Unknown'
    totalScreenTime.value = usageBlock.entries.reduce((sum, e) => sum + (e.usageSeconds || 0), 0)

    parsedUsageData.value = usageBlock.entries.map(entry => {
      const match = installed.find(app => app.packageName === entry.packageName)
      return {
        ...entry,
        appName: match?.appName || entry.appName,
        icon: match?.icon || null
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

watch(selectedDayOffset, loadUsageDataFromStore)

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
    <h1 class="text-xl sm:text-2xl font-bold text-sky-600 mb-4 sm:mb-6">Usage History</h1>

    <!-- Day Selector -->
    <div class="mb-4 sm:mb-6">
      <div class="flex flex-wrap gap-2">
        <button
            v-for="day in dayOptions"
            :key="day.offset"
            @click="selectedDayOffset = day.offset"
            :class="selectedDayOffset === day.offset ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition text-sm sm:text-base font-medium"
        >
          {{ day.label }}
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div
        v-if="parsedUsageData.length > 0"
        class="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-sky-400"
    >
      <h2 class="text-base sm:text-lg font-semibold mb-3 text-sky-700">App Usage ({{ usageDate }})</h2>

      <div class="text-xs sm:text-sm text-gray-500 mb-2">Total screen time: {{ formatUsageTime(totalScreenTime) }}</div>

      <div class="overflow-x-auto">
        <table class="min-w-full table-auto border-collapse text-sm sm:text-base">
          <thead>
          <tr class="bg-sky-50 border-b border-sky-200">
            <th class="px-2 py-2 sm:px-4 text-left font-medium text-sky-700">Icon</th>
            <th class="px-2 py-2 sm:px-4 text-left font-medium text-sky-700">App Name</th>
            <th class="px-2 py-2 sm:px-4 text-left font-medium text-sky-700">Usage</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="app in parsedUsageData"
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
    </div>

    <!-- No Data -->
    <div v-else class="text-sm text-gray-500 mb-6">No usage data available for selected day.</div>
  </div>
</template>

