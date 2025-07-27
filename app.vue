<template>
  <div class="min-h-screen flex bg-sky-50">
    <!-- Left Sidebar Menu -->
    <div
        v-if="shouldShowNavigation"
        :class="{'translate-x-0': mobileMenuOpen, '-translate-x-full': !mobileMenuOpen}"
        class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex items-center justify-between h-16 px-6 border-b">
        <span class="text-sky-600 font-bold text-xl">Focus Tank</span>
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
            <NuxtLink to="/" @click="closeMenu" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              Aquarium
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/focus" @click="closeMenu" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/timer' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Focus
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/friends" @click="closeMenu" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/friends' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
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
            <NuxtLink to="/shop" @click="closeMenu" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/shop' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Shop
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/test-usage" @click="closeMenu" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/test-usage' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Test Usage
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/usage-history" @click="closeMenu" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/usage-history' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Usage History
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/settings" @click="closeMenu" class="flex items-center px-4 py-2 rounded-lg transition" :class="route.path === '/settings' ? 'bg-sky-200 text-sky-800' : 'text-gray-600 hover:bg-sky-100'">
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
    <!-- Daily Reward Modal -->
    <div
        v-if="showDailyRewardModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
          class="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full mx-4 text-center shadow-2xl transform transition-all duration-300 scale-100 animate-fade-in"
      >
        <div class="text-6xl mb-3 text-amber-400 drop-shadow-sm">🦪 +200</div>
        <h3 class="text-2xl sm:text-3xl font-extrabold text-sky-600 mb-2">
          Daily Reward
        </h3>
        <p class="text-gray-500 text-sm sm:text-base mb-6">
          Come back every day to claim your reward!
        </p>
        <button
            class="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white py-2.5 rounded-xl font-semibold shadow-md transition duration-200"
            @click="claimDailyReward"
        >
          Claim Reward
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, provide} from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app';
import { useUserStore } from '~/stores/user'
import ToastNotification from '~/components/ToastNotification.vue';
import LinearProgress from '~/components/LinearProgress.vue';
import ConfirmDialog from '~/components/ConfirmDialog.vue';

const userStore = useUserStore()

// State for mobile menu
const mobileMenuOpen = ref(false)

const showDailyRewardModal = ref(false);

// Get current route
const route = useRoute()

const { $supabase } = useNuxtApp()

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
  $supabase.auth.signOut()
  userStore.clearUserData();
  navigateTo('/login');
  console.log("test");
}

onMounted(async () => {
  const isLoggedIn = !!(await useNuxtApp().$supabase.auth.getUser()).data.user;
  if (!isLoggedIn) {
    await logout();
    return;
  }

  if (userStore.isLoggedIn && !userStore.userProfile) {
    await userStore.loadUserProfile();
  }

  fetch('http://localhost:8080/data')
    .then(response => response.json())
    .then(async data => {
      console.log('Received native Android data:', data);

      // Check if this is an error response
      if (data.error) {
        console.error('Native data error:', data.message);
        if (toastRef.value) {
          toastRef.value.showToast(`Data error: ${data.message}`, 'error');
        }
        return;
      }
      
      userStore.installed_apps = JSON.stringify(data.installedApps);
      userStore.usage_data = JSON.stringify(data.usageData);

      const exceeded = await checkLimitsExceeded()

      if (toastRef.value) {
        const claimedToday = await claimedRewardToday();

        if (claimedToday) return;

        if (!exceeded) {
          showDailyRewardModal.value = true;
        }
      }
    })
    .catch(error => {
      console.error('Fetch failed:', error);
      if (toastRef.value) {
        toastRef.value.showToast('Welcome to Focus Tank! (Native data unavailable)', 'info');
      }
    });
})

async function claimDailyReward(){
  await userStore.collectDailyReward();
  showDailyRewardModal.value = false;
}

async function claimedRewardToday(){
  const lastRewardDate = new Date(userStore.userProfile.last_reward_collected);
  const today = new Date();

  const last = lastRewardDate.toLocaleDateString('sv-SE');
  const todayStr = today.toLocaleDateString('sv-SE');

  return last === todayStr;
}

async function checkLimitsExceeded() {
  if (!userStore.userProfile) return false;

  const dailyLimitMinutes = userStore.userProfile.screen_time_goals?.dailyLimit || 0;
  const appLimits = userStore.userProfile.app_limits || {};

    let totalUsageSeconds = 0;
    const appUsageSeconds = {};

  const usageData = JSON.parse(userStore.usage_data)[1];

  for (const entry of usageData.entries) {
    // Use foregroundSeconds (new field) or fall back to usageSeconds
    const appUsage = entry.usageSeconds || 0;
    totalUsageSeconds += appUsage;
    
    if (!appUsageSeconds[entry.packageName]) {
      appUsageSeconds[entry.packageName] = 0;
    }
    appUsageSeconds[entry.packageName] += appUsage;
  }

    const totalUsageMinutes = totalUsageSeconds / 60;
    if (totalUsageMinutes > dailyLimitMinutes) {
      console.log(`Daily limit of ${dailyLimitMinutes} minutes exceeded with ${totalUsageMinutes.toFixed(2)} minutes.`);
      return true;
    }

    for (const packageName in appLimits) {
      const limitMinutes = appLimits[packageName];
      const appSeconds = appUsageSeconds[packageName] || 0;
      const appMinutes = appSeconds / 60;
      if (appMinutes > limitMinutes) {
        console.log(`App ${packageName} limit of ${limitMinutes} minutes exceeded with ${appMinutes.toFixed(2)} minutes.`);
        return true;
      }
    }

  return false;
}

function closeMenu() {
  mobileMenuOpen.value = false
}
</script>

<!-- Optional animation class -->
<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>