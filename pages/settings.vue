<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-green-600 mb-6">Settings</h1>
    
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <!-- Account Settings -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-4 pb-2 border-b">Account Settings</h2>
        
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" id="name" value="User Name" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" value="user@example.com" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
          </div>
          
          <div>
            <button class="text-sm text-red-600 hover:text-red-800">Change Password</button>
          </div>
        </div>
      </section>
      
      <!-- Focus Session Settings -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-4 pb-2 border-b">Focus Session Settings</h2>
        
        <div class="space-y-4">
          <div>
            <label for="focus-duration" class="block text-sm font-medium text-gray-700 mb-1">Default Focus Duration (minutes)</label>
            <select id="focus-duration" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
              <option>25</option>
              <option>50</option>
              <option>90</option>
              <option>Custom</option>
            </select>
          </div>
          
          <div>
            <label for="break-duration" class="block text-sm font-medium text-gray-700 mb-1">Default Break Duration (minutes)</label>
            <select id="break-duration" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>Custom</option>
            </select>
          </div>
          
          <div class="flex items-center">
            <input type="checkbox" id="sound-notifications" class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
            <label for="sound-notifications" class="ml-2 block text-sm text-gray-900">
              Enable Sound Notifications
            </label>
          </div>
        </div>
      </section>
      
      <!-- Appearance Settings -->
      <section>
        <h2 class="text-lg font-semibold mb-4 pb-2 border-b">Appearance</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <div class="flex space-x-4">
              <button class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Light
              </button>
              <button class="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Dark
              </button>
              <button class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                System Default
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <div class="mt-8 flex justify-end">
        <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>
