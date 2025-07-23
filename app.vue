<template>
  <div class="min-h-screen flex bg-sky-50">
    <!-- Left Sidebar Menu -->
    <div
        v-if="shouldShowNavigation"
        :class="{'translate-x-0': mobileMenuOpen, '-translate-x-full': !mobileMenuOpen}"
        class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex items-center justify-between h-16 px-6 border-b">
        <span class="text-sky-600 font-bold text-xl">Bluescreen</span>
        <button
            class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            @click="mobileMenuOpen = false"
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
            <NuxtLink to="/focus" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/timer' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Focus
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/aquarium" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/aquarium' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Aquarium
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/friends" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/friends' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              Friends
              <span v-if="userStore.incomingRequests.length > 0" class="bg-red-500 text-white text-xs rounded-full px-1 ml-auto">
                {{ userStore.incomingRequests.length }}
              </span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/profile" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/profile' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
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
              class="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
              @click="logout"
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
              class="p-2 rounded-md text-gray-600 hover:text-sky-600 hover:bg-gray-100"
              @click="mobileMenuOpen = true"
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
          <transition name="page" mode="out-in">
            <NuxtPage />
          </transition>
        </NuxtLayout>
      </main>
    </div>

    <!-- Add these components at the root level - with correct refs -->
    <ToastNotification ref="toastRef" />
    <LinearProgress ref="progressRef" />
    <ConfirmDialog ref="dialogRef" />
  </div>
</template>

<script setup>
import {ref, computed, onMounted, provide} from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/user'
import ToastNotification from '~/components/ToastNotification.vue';
import LinearProgress from '~/components/LinearProgress.vue';
import ConfirmDialog from '~/components/ConfirmDialog.vue';

const userStore = useUserStore()

// State for mobile menu
const mobileMenuOpen = ref(false)

// Get current route
const route = useRoute()

// Define refs for the components
const toastRef = ref(null);
const progressRef = ref(null);
const dialogRef = ref(null);

// Provide these refs to descendants
provide('toast', toastRef);
provide('progress', progressRef);
provide('dialog', dialogRef);

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
  fetch('http://localhost:8080/data')
    .then(response => response.json())
    .then(async data => {
      console.log('Received data:', data);
      console.log(JSON.stringify(data))
      userStore.installed_apps = JSON.stringify(data.installedApps);
      userStore.usage_data = JSON.stringify(data.usageData);

      const exceeded = await checkLimitsExceeded()

      // Display welcome toast after data is loaded
      if (toastRef.value) {
        toastRef.value.showToast('Welcome to Bluescreen! Exceeded Limit:' + exceeded, 'info');
      }
    })
    .catch(error => {
      console.error('Fetch failed:', error);
      // Still try to show welcome toast even if data fetch fails
      if (toastRef.value) {
        toastRef.value.showToast('Welcome to Bluescreen!', 'info');
      }
    });
})

async function checkLimitsExceeded() {
  const userStore = useUserStore();

  if (!userStore.userProfile) return false;

  const lastRewardDate = new Date(userStore.userProfile.last_reward_collected);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  if (lastRewardDate >= yesterday) {
    // Reward already collected yesterday or today
    return false;
  }

  // Fetch usage data from backend
  const response = await fetch('http://localhost:8080/data');
  const data = await response.json();

  userStore.installed_apps = JSON.stringify(data.installedApps);
  userStore.usage_data = JSON.stringify(data.usageData);

  const usageData = data.usageData;

  const dailyLimitHours = userStore.userProfile.screen_time_goals.dailyLimit;
  const appLimits = userStore.userProfile.app_limits;

  let totalUsageSeconds = 0;
  const appUsageSeconds = {};

  for (const entry of usageData) {
    totalUsageSeconds += entry.usageSeconds;
    if (!appUsageSeconds[entry.packageName]) {
      appUsageSeconds[entry.packageName] = 0;
    }
    appUsageSeconds[entry.packageName] += entry.usageSeconds;
  }

  const totalUsageHours = totalUsageSeconds / 3600;
  if (totalUsageHours > dailyLimitHours) {
    console.log(`Daily limit of ${dailyLimitHours} hours exceeded with ${totalUsageHours.toFixed(2)} hours.`);
    return true;
  }

  for (const packageName in appLimits) {
    const limitHours = appLimits[packageName];
    const appSeconds = appUsageSeconds[packageName] || 0;
    const appHours = appSeconds / 3600;
    if (appHours > limitHours) {
      console.log(`App ${packageName} limit of ${limitHours} hours exceeded with ${appHours.toFixed(2)} hours.`);
      return true;
    }
  }

  return false;
}

</script>

<style>
body {
  @apply antialiased text-gray-800;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
