<template>
  <div class="p-6 container mx-auto">
    <h1 class="text-3xl font-bold text-green-600 mb-4">Focus Terrarium PWA</h1>

    <p class="mb-2">Testing Supabase connection...</p>

    <div v-if="loading" class="text-gray-500">Loading data...</div>
    <div v-else-if="error" class="text-red-500">Error: {{ error.message }}</div>
    <div v-else-if="items && items.length > 0">
      <h2 class="text-xl mt-4 mb-2">Data from Supabase:</h2>
      <ul class="list-disc list-inside bg-gray-100 p-4 rounded">
        <li v-for="item in items" :key="item.id" class="text-gray-800">
          {{ item.name }} <!-- Adjust 'name' to a column in your test table -->
        </li>
      </ul>
    </div>
    <div v-else class="text-gray-500">No items found in the test table or table doesn't exist.</div>

    <button @click="fetchData" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Refetch Data
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Database } from '~/types/supabase' // Import generated types (see note below)

// **IMPORTANT**: Create a simple table in your Supabase project first!
// e.g., a table named 'test_items' with columns 'id' (int8, primary key) and 'name' (text).
// Add some dummy data via the Supabase UI.
const tableName = 'test_items' // CHANGE this to your table name

// Use the composable provided by @nuxtjs/supabase
const client = useSupabaseClient<Database>() // Use generated types if available

const items = ref<any[] | null>(null) // Use specific type based on your table/generated types
const loading = ref(false)
const error = ref<Error | null>(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  items.value = null
  try {
    // Select data from your table
    const { data, error: queryError } = await client
      .from(tableName)
      .select('*') // Select specific columns like 'id, name' for better performance

    if (queryError) throw queryError

    items.value = data
  } catch (err: any) {
    console.error('Error fetching data:', err)
    error.value = err
  } finally {
    loading.value = false
  }
}

// Fetch data when the component mounts
onMounted(() => {
  fetchData()
})

// Optional: Generate Supabase types for better type safety
// Run this command after setting up your DB schema:
// pnpm exec supabase gen types typescript --project-id <your-project-ref> --schema public > types/supabase.d.ts
// (Replace <your-project-ref> with the Ref ID from Supabase Project Settings > General)
// Then create `types/supabase.ts` and export the Database type from `supabase.d.ts`
// You'll need the Supabase CLI: pnpm add -g supabase
// And login: supabase login
</script>

<style>
/* Scoped or global styles can go here if needed */
</style>