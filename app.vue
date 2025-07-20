<template>
  <div class="min-h-screen flex bg-sky-50">
    <!-- Left Sidebar Menu -->
    <div
        :class="{'translate-x-0': mobileMenuOpen, '-translate-x-full': !mobileMenuOpen}"
        class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
        v-if="shouldShowNavigation"
    >
      <div class="flex items-center justify-between h-16 px-6 border-b">
        <span class="text-sky-600 font-bold text-xl">Bluescreen</span>
        <button
            @click="mobileMenuOpen = false"
            class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="mt-8">
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/timer" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/timer' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Focus Timer
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/focus" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/focus' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Focus
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/terrarium" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/terrarium' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7v3m-3 0v6m-1-6a2 2 0 012-2h3" />
              </svg>
              Aquarium
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/shop" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/shop' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Shop
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/test-usage" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/test-usage' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Test Usage
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/settings" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/settings' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </NuxtLink>
          </li>
        </ul>

        <div class="mt-8 pt-8 border-t border-gray-200 px-4">
          <button
              @click="logout"
              class="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </div>

    <!-- Overlay for mobile -->
    <div
        v-if="mobileMenuOpen && shouldShowNavigation"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        @click="mobileMenuOpen = false"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col lg:ml-0">
      <!-- Top Header with Hamburger (Mobile Only) -->
      <header v-if="shouldShowNavigation" class="bg-white shadow-sm lg:hidden">
        <div class="flex items-center justify-between h-16 px-4">
          <button
              @click="mobileMenuOpen = true"
              class="p-2 rounded-md text-gray-600 hover:text-sky-600 hover:bg-gray-100"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span class="text-sky-600 font-bold text-xl">Bluescreen</span>
          <div class="w-10"></div> <!-- Spacer for centering -->
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-grow">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </main>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

// State for mobile menu
const mobileMenuOpen = ref(false)

// Get current route
const route = useRoute()

// Determine if navigation should be shown (hide on auth pages)
const shouldShowNavigation = computed(() => {
  return !['/login', '/signup', '/check-email', '/forgot-password'].includes(route.path)
})

// Logout function
const logout = async () => {
  const { $supabase } = useNuxtApp()
  await $supabase.auth.signOut()
  userStore.clearUserData()
  navigateTo('/login')
}

onMounted(async () => {
  // Only run on client side
  if (process.client) {
    requestUsageData()
  }
})

// Only set up window functions on client side
if (process.client) {
  window.onNativeData = function(data) {
    console.log("🟢 [Web] Received from native:", data)
    try {
      const parsed = JSON.parse(data)
      userStore.installed_apps = JSON.stringify(parsed.installedApps);
      userStore.usage_data = JSON.stringify(parsed.usageData);
    } catch (e) {
      console.error('Error parsing native data:', e)
    }
  }
}

console.log("📤 [Web] Setup complete, ready to receive native data")
/*
// Set up the global callback for native data
const setupNativeCallback = () => {
  if (process.client) {

  }
}*/

// Usage data methods
const requestUsageData = () => {
  if (process.client && typeof fetchNativeData !== 'undefined') {
    console.log("📤 [Focus] Requesting usage data...")
    fetchNativeData.postMessage('request_device_data')
  } else {
    console.log('⚠️ Native data channel not available - using sample data')
    // Use sample data for development (in seconds)
    const data = JSON.stringify({
          "installedApps": [
            {
              "packageName": "com.whatsapp",
              "appName": "WhatsApp",
              "icon": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVDbDcMgDPz3FB0BbANmHNKmUjfo+D1iiELbkzg/ddim/f160q2Do5KmYrnmHACtWrnBseBoB8egB3ugoxbXPJ0FRkpgxUPLo3/m4yngpsFLFyG7j8K2Fur4gO1LiN1In6j7jyFUh5CwF+aEzdcKuVq5rrDtYYX5o05q69g/ccH1Hgn/CPMuUQJYxHwA6S+RNDgFHNGEgSXDV7GD50o4yL87TdAH5IJZH17vvdEAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1OlIlVBO4g4ZKhOFkRFHEsVi2ChtBVadTC59AuaNCQpLo6Ca8HBj8Wqg4uzrg6ugiD4AeIuOCm6SIn/SwotYjw47se7e4+7d4DQqDDV7IoCqmYZqXhMzOZWxcArAgiiH5MYlJipJ9KLGXiOr3v4+HoX4Vne5/4cfUreZIBPJI4y3bCIN4hnNy2d8z5xiJUkhficeMKgCxI/cl12+Y1z0WGBZ4aMTGqeOEQsFjtY7mBWMlTiGeKwomqUL2RdVjhvcVYrNda6J39hMK+tpLlOcxRxLCGBJETIqKGMCixEaNVIMZGi/ZiHf8TxJ8klk6sMRo4FVKFCcvzgf/C7W7MwPeUmBWNA94ttf4wBgV2gWbft72Pbbp4A/mfgSmv7qw1g7pP0elsLHwED28DFdVuT94DLHWD4SZcMyZH8NIVCAXg/o2/KAUO3QO+a21trH6cPQIa6Wr4BDg6B8SJlr3u8u6ezt3/PtPr7AbeycsJFMci9AAANdmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDoxZjljYWIwOS0xNzg2LTRiZDMtYjI5Yy01NjU3ODA0ZGNlNTEiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTc5ZjBiNmUtYTNlNi00YzY3LTlkM2YtYWI1MGRhZmQ5NWEzIgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZmM0YzZjOTYtZjQ5NC00ODU0LWE2ZjctZTJjMzRhZmU5YzQzIgogICBkYzpGb3JtYXQ9ImltYWdlL3BuZyIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iV2luZG93cyIKICAgR0lNUDpUaW1lU3RhbXA9IjE3NTIzMzE3MjM4MDA2NDciCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zOCIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjU6MDc6MTJUMTY6NDg6NDMrMDI6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDI1OjA3OjEyVDE2OjQ4OjQzKzAyOjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YzRlNmFjYWYtZjA5Zi00YTVmLTkzNjctMzI4ZDg2NTU1ZDA5IgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDI1LTA3LTEyVDE2OjQ4OjQzIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pm3/Ya4AAAB4UExURTLGcf///xPCZSzFbiXEa7DmxBrDZ9Tx3w7CY+X37NHw3bLmxR/Daef37dz05dfy4Z/huDzId/X8+KHhuYzbquz58cDr0Jjfs7npy1bOh3XVml3Pi6vkwMnu15Pdr/D69GrSk4DYokbKfVHNg1vPiW7TlnzXn4bapy4txv4AAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6QcMDjArfA1h+wAAAJZJREFUGNNt0csKAyEMBdCblZCCg9OFBaclSPv/v9gkPtDSLASPovEK8uIsKUnmNoMNQdCrhIEXlroabuYKCvipoFhWeNu5BF7tTk8dGXkzogeUZDe7VpCAehx12M2XFSNRrKvZ3lNncbFiF33O9uSxL3tLXbspefOuw7R58u5Vh4FnIPLaAvkfneY+Qyk8k7fvUC/jO74xEgfL0gaMmQAAAABJRU5ErkJggg=="
            },
            {
              "packageName": "com.instagram.android",
              "appName": "Instagram",
              "icon": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVDbDcMgDPz3FB0BbANmHNKmUjfo+D1iiELbkzg/ddim/f160q2Do5KmYrnmHACtWrnBseBoB8egB3ugoxbXPJ0FRkpgxUPLo3/m4yngpsFLFyG7j8K2Fur4gO1LiN1In6j7jyFUh5CwF+aEzdcKuVq5rrDtYYX5o05q69g/ccH1Hgn/CPMuUQJYxHwA6S+RNDgFHNGEgSXDV7GD50o4yL87TdAH5IJZH17vvdEAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1OlIlVBO4g4ZKhOFkRFHEsVi2ChtBVadTC59AuaNCQpLo6Ca8HBj8Wqg4uzrg6ugiD4AeIuOCm6SIn/SwotYjw47se7e4+7d4DQqDDV7IoCqmYZqXhMzOZWxcArAgiiH5MYlJipJ9KLGXiOr3v4+HoX4Vne5/4cfUreZIBPJI4y3bCIN4hnNy2d8z5xiJUkhficeMKgCxI/cl12+Y1z0WGBZ4aMTGqeOEQsFjtY7mBWMlTiGeKwomqUL2RdVjhvcVYrNda6J39hMK+tpLlOcxRxLCGBJETIqKGMCixEaNVIMZGi/ZiHf8TxJ8klk6sMRo4FVKFCcvzgf/C7W7MwPeUmBWNA94ttf4wBgV2gWbft72Pbbp4A/mfgSmv7qw1g7pP0elsLHwED28DFdVuT94DLHWD4SZcMyZH8NIVCAXg/o2/KAUO3QO+a21trH6cPQIa6Wr4BDg6B8SJlr3u8u6ezt3/PtPr7AbeycsJFMci9AAANdmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDoxZjljYWIwOS0xNzg2LTRiZDMtYjI5Yy01NjU3ODA0ZGNlNTEiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTc5ZjBiNmUtYTNlNi00YzY3LTlkM2YtYWI1MGRhZmQ5NWEzIgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZmM0YzZjOTYtZjQ5NC00ODU0LWE2ZjctZTJjMzRhZmU5YzQzIgogICBkYzpGb3JtYXQ9ImltYWdlL3BuZyIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iV2luZG93cyIKICAgR0lNUDpUaW1lU3RhbXA9IjE3NTIzMzE3MjM4MDA2NDciCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zOCIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjU6MDc6MTJUMTY6NDg6NDMrMDI6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDI1OjA3OjEyVDE2OjQ4OjQzKzAyOjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YzRlNmFjYWYtZjA5Zi00YTVmLTkzNjctMzI4ZDg2NTU1ZDA5IgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDI1LTA3LTEyVDE2OjQ4OjQzIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pm3/Ya4AAAB4UExURTLGcf///xPCZSzFbiXEa7DmxBrDZ9Tx3w7CY+X37NHw3bLmxR/Daef37dz05dfy4Z/huDzId/X8+KHhuYzbquz58cDr0Jjfs7npy1bOh3XVml3Pi6vkwMnu15Pdr/D69GrSk4DYokbKfVHNg1vPiW7TlnzXn4bapy4txv4AAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6QcMDjArfA1h+wAAAJZJREFUGNNt0csKAyEMBdCblZCCg9OFBaclSPv/v9gkPtDSLASPovEK8uIsKUnmNoMNQdCrhIEXlroabuYKCvipoFhWeNu5BF7tTk8dGXkzogeUZDe7VpCAehx12M2XFSNRrKvZ3lNncbFiF33O9uSxL3tLXbspefOuw7R58u5Vh4FnIPLaAvkfneY+Qyk8k7fvUC/jO74xEgfL0gaMmQAAAABJRU5ErkJggg=="
            },
            {
              "packageName": "com.spotify.music",
              "appName": "Spotify",
              "icon": "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVDbDcMgDPz3FB0BbANmHNKmUjfo+D1iiELbkzg/ddim/f160q2Do5KmYrnmHACtWrnBseBoB8egB3ugoxbXPJ0FRkpgxUPLo3/m4yngpsFLFyG7j8K2Fur4gO1LiN1In6j7jyFUh5CwF+aEzdcKuVq5rrDtYYX5o05q69g/ccH1Hgn/CPMuUQJYxHwA6S+RNDgFHNGEgSXDV7GD50o4yL87TdAH5IJZH17vvdEAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1OlIlVBO4g4ZKhOFkRFHEsVi2ChtBVadTC59AuaNCQpLo6Ca8HBj8Wqg4uzrg6ugiD4AeIuOCm6SIn/SwotYjw47se7e4+7d4DQqDDV7IoCqmYZqXhMzOZWxcArAgiiH5MYlJipJ9KLGXiOr3v4+HoX4Vne5/4cfUreZIBPJI4y3bCIN4hnNy2d8z5xiJUkhficeMKgCxI/cl12+Y1z0WGBZ4aMTGqeOEQsFjtY7mBWMlTiGeKwomqUL2RdVjhvcVYrNda6J39hMK+tpLlOcxRxLCGBJETIqKGMCixEaNVIMZGi/ZiHf8TxJ8klk6sMRo4FVKFCcvzgf/C7W7MwPeUmBWNA94ttf4wBgV2gWbft72Pbbp4A/mfgSmv7qw1g7pP0elsLHwED28DFdVuT94DLHWD4SZcMyZH8NIVCAXg/o2/KAUO3QO+a21trH6cPQIa6Wr4BDg6B8SJlr3u8u6ezt3/PtPr7AbeycsJFMci9AAANdmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDoxZjljYWIwOS0xNzg2LTRiZDMtYjI5Yy01NjU3ODA0ZGNlNTEiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTc5ZjBiNmUtYTNlNi00YzY3LTlkM2YtYWI1MGRhZmQ5NWEzIgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZmM0YzZjOTYtZjQ5NC00ODU0LWE2ZjctZTJjMzRhZmU5YzQzIgogICBkYzpGb3JtYXQ9ImltYWdlL3BuZyIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iV2luZG93cyIKICAgR0lNUDpUaW1lU3RhbXA9IjE3NTIzMzE3MjM4MDA2NDciCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zOCIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjU6MDc6MTJUMTY6NDg6NDMrMDI6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDI1OjA3OjEyVDE2OjQ4OjQzKzAyOjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YzRlNmFjYWYtZjA5Zi00YTVmLTkzNjctMzI4ZDg2NTU1ZDA5IgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDI1LTA3LTEyVDE2OjQ4OjQzIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pm3/Ya4AAAB4UExURTLGcf///xPCZSzFbiXEa7DmxBrDZ9Tx3w7CY+X37NHw3bLmxR/Daef37dz05dfy4Z/huDzId/X8+KHhuYzbquz58cDr0Jjfs7npy1bOh3XVml3Pi6vkwMnu15Pdr/D69GrSk4DYokbKfVHNg1vPiW7TlnzXn4bapy4txv4AAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6QcMDjArfA1h+wAAAJZJREFUGNNt0csKAyEMBdCblZCCg9OFBaclSPv/v9gkPtDSLASPovEK8uIsKUnmNoMNQdCrhIEXlroabuYKCvipoFhWeNu5BF7tTk8dGXkzogeUZDe7VpCAehx12M2XFSNRrKvZ3lNncbFiF33O9uSxL3tLXbspefOuw7R58u5Vh4FnIPLaAvkfneY+Qyk8k7fvUC/jO74xEgfL0gaMmQAAAABJRU5ErkJggg=="
            }
          ],
          "usageData": [
            {
              "packageName": "com.whatsapp",
              "appName": "WhatsApp",
              "usageSeconds": 4523,
              "startTime": "2025-07-11T00:12:34.000",
              "endTime": "2025-07-11T23:45:12.000"
            },
            {
              "packageName": "com.instagram.android",
              "appName": "Instagram",
              "usageSeconds": 1892,
              "startTime": "2025-07-11T10:03:21.000",
              "endTime": "2025-07-11T18:44:00.000"
            },
            {
              "packageName": "com.spotify.music",
              "appName": "Spotify",
              "usageSeconds": 3210,
              "startTime": "2025-07-11T07:00:00.000",
              "endTime": "2025-07-11T20:10:45.000"
            }
          ]
        }
    )

    const parsed = JSON.parse(data)
    userStore.installed_apps = JSON.stringify(parsed.installedApps);
    userStore.usage_data = JSON.stringify(parsed.usageData);
  }
}

</script>

<style>
body {
  @apply antialiased text-gray-800;
}
</style>
