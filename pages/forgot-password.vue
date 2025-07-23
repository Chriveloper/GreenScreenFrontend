<template>
  <div class="flex min-h-screen justify-center items-center bg-gray-100">
    <div class="bg-white shadow rounded-2xl p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Reset Password</h1>
      <form @submit.prevent="handleReset">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1" for="email">Email</label>
            <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                required
            />
          </div>
          <div v-if="error" class="bg-red-100 text-red-700 p-2 rounded text-sm">
            {{ error }}
          </div>
          <div v-if="successMessage" class="bg-green-100 text-green-700 p-2 rounded text-sm">
            {{ successMessage }}
          </div>
          <button
              type="submit"
              :disabled="loading"
              class="w-full bg-sky-600 text-white rounded py-2 hover:bg-sky-700 transition disabled:opacity-70"
          >
            <span v-if="loading">Sending...</span>
            <span v-else>Reset Password</span>
          </button>
        </div>
      </form>
      <p class="mt-4 text-center text-sm">
        <NuxtLink class="text-sky-600 hover:underline" to="/login">Back to Login</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { $supabase } = useNuxtApp();
const email = ref('');
const error = ref('');
const successMessage = ref('');
const loading = ref(false);

const handleReset = async () => {
  error.value = '';
  successMessage.value = '';
  loading.value = true;

  try {
    const { error: resetError } = await $supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (resetError) {
      error.value = resetError.message;
      return;
    }

    successMessage.value = 'Password reset instructions sent to your email.';
  } catch (err) {
    console.error('Reset error:', err);
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>