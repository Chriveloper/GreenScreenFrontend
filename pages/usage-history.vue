<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const parsedUsageData = ref([])
const usageDate = ref(null)
const selectedDayOffset = ref(0)
const totalScreenTime = ref(0)

const dailyLimitMinutes = computed(() =>
    userStore.userProfile?.screen_time_goals?.dailyLimit || 0
)

const appLimits = computed(() => userStore.userProfile?.app_limits || {})

const totalUsagePercent = computed(() => {
  if (dailyLimitMinutes.value === 0) return 0
  return Math.min((totalScreenTime.value / 60 / dailyLimitMinutes.value) * 100, 100)
})

const appLimitUsage = computed(() => {
  const parsed = JSON.parse(userStore.usage_data || '[]')
  const usageBlock = parsed[selectedDayOffset.value] || { entries: [] }
  const map = {}

  for (const entry of usageBlock.entries) {
    const pkg = entry.packageName
    const usedSec = entry.usageSeconds || 0
    const limitMin = appLimits.value?.[pkg]
    if (!limitMin || usedSec <= 0) continue
    map[pkg] = {
      used: usedSec,
      limit: limitMin,
      percent: Math.min((usedSec / 60 / limitMin) * 100, 100)
    }
  }
  return map
})

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

    const sortedEntries = [...usageBlock.entries].sort((a, b) => (b.usageSeconds || 0) - (a.usageSeconds || 0))

    parsedUsageData.value = sortedEntries.map(entry => {
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

    <!-- Combined Limit Container -->
    <div
        v-if="dailyLimitMinutes > 0 || Object.keys(appLimitUsage).length > 0"
        class="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-sky-400 mb-6"
    >
      <h2 class="text-base sm:text-lg font-semibold mb-3 text-sky-700">Screen Time Limits</h2>

      <!-- Daily Limit -->
      <div v-if="dailyLimitMinutes > 0" class="mb-6">
        <div class="flex justify-between items-center mb-1 text-sm text-gray-600">
          <span>Daily Limit: {{ dailyLimitMinutes }} min</span>
          <span class="flex items-center gap-2">
      Used: {{ formatUsageTime(totalScreenTime) }}
      <span
          v-if="totalUsagePercent >= 100"
          class="text-red-600 font-semibold text-xs"
      >
        Over limit
      </span>
    </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
              class="h-3 rounded-full transition-all duration-300"
              :class="totalUsagePercent >= 100 ? 'bg-red-500' : 'bg-sky-500'"
              :style="{ width: totalUsagePercent + '%' }"
          ></div>
        </div>
      </div>

      <!-- App Limits Header -->
      <div
          v-if="Object.keys(appLimitUsage).length > 0"
          class="text-base sm:text-lg font-semibold mb-3 text-sky-700"
      >
        App Limits
      </div>

      <!-- App Limits Overview with Icons -->
      <div
          v-for="(data, pkg) in appLimitUsage"
          :key="pkg"
          class="mb-6"
      >
        <div class="flex items-center gap-3 mb-1">
          <img
              v-if="parsedUsageData.find(a => a.packageName === pkg)?.icon"
              :src="`data:image/png;base64,${parsedUsageData.find(a => a.packageName === pkg)?.icon}`"
              alt="App icon"
              class="w-10 h-10 sm:w-12 sm:h-12 rounded"
          />
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-700">
              {{ parsedUsageData.find(a => a.packageName === pkg)?.appName || pkg }}
            </div>
            <div class="text-xs text-gray-600 flex items-center gap-2">
              {{ formatUsageTime(data.used) }} / {{ data.limit }} min
              <span
                  v-if="data.percent >= 100"
                  class="text-red-600 font-semibold text-xs"
              >
          Over limit
        </span>
            </div>
          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
              class="h-2 rounded-full transition-all duration-300"
              :class="data.percent >= 100 ? 'bg-red-500' : 'bg-sky-400'"
              :style="{ width: data.percent + '%' }"
          ></div>
        </div>
      </div>



    </div>

    <!-- Usage Table -->
    <div
        v-if="parsedUsageData.length > 0"
        class="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-sky-400"
    >
      <h2 class="text-base sm:text-lg font-semibold mb-3 text-sky-700">App Usage ({{ usageDate }})</h2>
      <div class="text-xs sm:text-sm text-gray-500 mb-2">
        Total screen time: {{ formatUsageTime(totalScreenTime) }}
      </div>

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
          <template v-for="app in parsedUsageData" :key="`${app.appName}-${app.usageSeconds}`">
            <tr class="border-b hover:bg-sky-25">
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
          </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No Data -->
    <div v-else class="text-sm text-gray-500 mb-6">No usage data available for selected day.</div>
  </div>
</template>
