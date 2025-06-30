<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-sky-600 mb-6">Aquarium</h1>
    
    <div class="bg-gradient-to-b from-sky-300 to-sky-500 rounded-full shadow-lg p-8 mb-8 min-h-[400px] max-w-[500px] mx-auto relative overflow-hidden aspect-square">
      <!-- Aquarium Display Area -->
      <!-- Fish swimming in the aquarium -->
      <div class="absolute top-12 left-1/4 animate-pulse">
        <div class="w-8 h-6 bg-orange-400 rounded-full relative">
          <div class="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-orange-400 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
        </div>
      </div>
      
      <div class="absolute top-20 right-1/3 animate-pulse" style="animation-delay: 1s;">
        <div class="w-6 h-4 bg-yellow-300 rounded-full relative">
          <div class="absolute -right-1 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-3 border-l-yellow-300 border-t-1 border-t-transparent border-b-1 border-b-transparent"></div>
        </div>
      </div>

      <!-- Coral and sea plants -->
      <div class="absolute bottom-8 left-1/4">
        <div class="w-16 h-24 bg-pink-400 rounded-t-full relative">
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-pink-300 rounded-full"></div>
          <div class="absolute -top-6 left-1/4 transform -translate-x-1/2 w-8 h-6 bg-pink-500 rounded-full"></div>
        </div>
      </div>
      
      <div class="absolute bottom-8 right-1/4">
        <div class="w-12 h-16 bg-green-400 rounded-t-full relative">
          <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-green-300 rounded-full"></div>
        </div>
      </div>

      <!-- Bubbles -->
      <div class="absolute bottom-12 left-1/2 w-2 h-2 bg-white rounded-full opacity-70 animate-bounce"></div>
      <div class="absolute bottom-16 left-1/2 w-1 h-1 bg-white rounded-full opacity-50 animate-bounce" style="animation-delay: 0.5s;"></div>
      
      <!-- Sand/gravel bottom -->
      <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-b-full"></div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Fish Collection -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-sky-400">
        <h2 class="text-lg font-semibold mb-4 text-sky-700">Fish Collection</h2>
        
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-sky-50 rounded-lg p-4 text-center border border-sky-200">
            <div class="w-12 h-12 bg-orange-400 rounded-full mx-auto mb-2"></div>
            <p class="text-sm">Goldfish</p>
          </div>
          <div class="bg-sky-50 rounded-lg p-4 text-center border border-sky-200">
            <div class="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2"></div>
            <p class="text-sm">Blue Tang</p>
          </div>
          <div class="bg-sky-50 rounded-lg p-4 text-center border border-sky-200">
            <div class="w-12 h-12 bg-red-400 rounded-full mx-auto mb-2"></div>
            <p class="text-sm">Betta</p>
          </div>
          <div class="bg-sky-50 rounded-lg p-4 text-center border border-sky-200">
            <div class="w-12 h-12 bg-yellow-300 rounded-full mx-auto mb-2"></div>
            <p class="text-sm">Angelfish</p>
          </div>
          <div class="bg-sky-50 rounded-lg p-4 text-center border border-sky-200">
            <div class="w-12 h-12 bg-purple-400 rounded-full mx-auto mb-2"></div>
            <p class="text-sm">Royal Gramma</p>
          </div>
          <div class="bg-sky-50 rounded-lg p-4 text-center border border-sky-200">
            <div class="w-12 h-12 bg-teal-400 rounded-full mx-auto mb-2"></div>
            <p class="text-sm">Clownfish</p>
          </div>
        </div>
      </div>
      
      <!-- Progress -->
      <div class="bg-white rounded-lg shadow p-6 border-t-4 border-sky-400">
        <h2 class="text-lg font-semibold mb-4 text-sky-700">Aquarium Progress</h2>
        <div class="mb-4">
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-gray-700">Next Fish</span>
            <span class="text-sm font-medium text-gray-700">65%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-sky-600 h-2.5 rounded-full" style="width: 65%"></div>
          </div>
        </div>
        <p class="text-sm text-gray-600">Complete 2 more focus sessions to add a new fish!</p>
      </div>
    </div>
  </div>
</template>
