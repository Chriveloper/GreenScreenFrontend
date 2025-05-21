<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-green-600 mb-6">Terrarium</h1>
    
    <div class="bg-gradient-to-b from-blue-100 to-green-100 rounded-lg shadow-lg p-8 mb-8 min-h-[400px] relative">
      <!-- Terrarium Display Area -->
      <div class="absolute bottom-4 left-1/4">
        <div class="w-16 h-24 bg-green-500 rounded-full relative">
          <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-green-400 rounded-full"></div>
          <div class="absolute -top-12 left-1/4 transform -translate-x-1/2 w-12 h-10 bg-green-300 rounded-full"></div>
        </div>
      </div>
      
      <div class="absolute bottom-4 right-1/4">
        <div class="w-12 h-16 bg-green-600 rounded-t-full relative">
          <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-green-500 rounded-full"></div>
        </div>
      </div>
      
      <!-- Ground -->
      <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-700 to-amber-500 rounded-b-lg"></div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Plant Collection -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Plant Collection</h2>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-gray-100 rounded-lg p-4 text-center">
            <div class="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2"></div>
            <p class="text-sm">Seedling</p>
          </div>
          <div class="bg-gray-100 rounded-lg p-4 text-center">
            <div class="w-12 h-12 bg-green-600 rounded-full mx-auto mb-2"></div>
            <p class="text-sm">Fern</p>
          </div>
          <div class="bg-gray-100 rounded-lg p-4 text-center">
            <div class="w-12 h-12 bg-green-400 rounded-full mx-auto mb-2"></div>
            <p class="text-sm">Succulent</p>
          </div>
        </div>
      </div>
      
      <!-- Progress -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Growth Progress</h2>
        <div class="mb-4">
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-gray-700">Next Plant</span>
            <span class="text-sm font-medium text-gray-700">65%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-green-600 h-2.5 rounded-full" style="width: 65%"></div>
          </div>
        </div>
        <p class="text-sm text-gray-600">Complete 2 more focus sessions to grow a new plant!</p>
      </div>
    </div>
  </div>
</template>
