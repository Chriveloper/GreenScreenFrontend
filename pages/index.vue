<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-blue-600 mb-6">Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Stats Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Focus Stats</h2>
        <div class="flex justify-between">
          <div class="text-center">
            <p class="text-3xl font-bold text-blue-500">12</p>
            <p class="text-sm text-gray-500">Sessions</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-blue-500">5.4</p>
            <p class="text-sm text-gray-500">Hours</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-blue-500">6</p>
            <p class="text-sm text-gray-500">Fish</p>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul class="space-y-2">
          <li class="border-b pb-2">Completed a 25-minute focus session</li>
          <li class="border-b pb-2">Added a new fish to aquarium</li>
          <li>Updated focus goals</li>
        </ul>
      </div>
    </div>
    
    <div class="mt-8">
      <NuxtLink to="/focus" class="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition">
        Start Focus Session
      </NuxtLink>
    </div>
  </div>
</template>
