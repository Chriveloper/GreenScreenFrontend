<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Navigation Header -->
    <nav v-if="shouldShowNavigation" class="bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex-shrink-0 flex items-center">
              <span class="text-green-600 font-bold text-xl">GreenScreen</span>
            </NuxtLink>
          </div>
          
          <!-- Navigation Links - Desktop -->
          <div class="hidden md:flex items-center space-x-4">
            <NuxtLink to="/" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">
              Dashboard
            </NuxtLink>
            <NuxtLink to="/focus" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">
              Focus
            </NuxtLink>
            <NuxtLink to="/terrarium" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">
              Terrarium
            </NuxtLink>
            <NuxtLink to="/settings" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">
              Settings
            </NuxtLink>
            <button @click="logout" class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-gray-100">
              Logout
            </button>
          </div>
          
          <!-- Mobile Menu Button -->
          <div class="flex md:hidden items-center">
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen" 
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NuxtLink to="/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">
            Dashboard
          </NuxtLink>
          <NuxtLink to="/focus" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">
            Focus
          </NuxtLink>
          <NuxtLink to="/terrarium" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">
            Terrarium
          </NuxtLink>
          <NuxtLink to="/settings" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-100">
            Settings
          </NuxtLink>
          <button @click="logout" class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-100">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>

    <!-- Footer -->
    <footer v-if="shouldShowNavigation" class="bg-white border-t py-4">
      <div class="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} GreenScreen. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// State for mobile menu
const mobileMenuOpen = ref(false)

// Get current route
const route = useRoute()

// Determine if navigation should be shown (hide on auth pages)
const shouldShowNavigation = computed(() => {
  return !['login', 'signup'].includes(route.name)
})

// Logout function (placeholder)
const logout = () => {
  // TODO: Implement logout logic with Supabase
  console.log('Logging out...')
  navigateTo('/login')
}
</script>

<style>
body {
  @apply antialiased text-gray-800;
}
</style>
