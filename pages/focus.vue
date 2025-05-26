<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-blue-600 mb-6">Focus Session</h1>
    
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <!-- Timer Display -->
      <div class="text-center mb-8">
        <p class="text-6xl font-bold text-gray-800 mb-2">25:00</p>
        <p class="text-gray-500">Focus Session</p>
      </div>
      
      <!-- Controls -->
      <div class="flex justify-center space-x-4 mb-8">
        <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
          Start
        </button>
        <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg transition" disabled>
          Pause
        </button>
        <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition" disabled>
          Reset
        </button>
      </div>
      
      <!-- Session Goal -->
      <div class="mb-6">
        <label for="goal" class="block text-sm font-medium text-gray-700 mb-1">Session Goal</label>
        <input type="text" id="goal" placeholder="What will you focus on?" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
      </div>
      
      <!-- Settings -->
      <div class="flex justify-between mb-4">
        <button class="text-gray-600 hover:text-gray-800 text-sm flex items-center">
          <span class="mr-1">⚙️</span> Settings
        </button>
        <div class="flex space-x-2">
          <button class="text-sm text-gray-600 bg-gray-100 py-1 px-3 rounded-full">25m</button>
          <button class="text-sm text-gray-600 hover:bg-gray-100 py-1 px-3 rounded-full">50m</button>
          <button class="text-sm text-gray-600 hover:bg-gray-100 py-1 px-3 rounded-full">Custom</button>
        </div>
      </div>
    </div>
  </div>
</template>