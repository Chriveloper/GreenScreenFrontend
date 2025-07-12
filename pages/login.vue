<template>
  <div class="flex min-h-screen justify-center items-center bg-gray-100">
    <div class="bg-white shadow rounded-2xl p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Log In</h1>
      <form @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1" for="email">Email</label>
            <input
                v-model="email"
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                required
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" for="password">Password</label>
            <input
                v-model="password"
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                required
            />
          </div>
          <div v-if="error" class="bg-red-100 text-red-700 p-2 rounded text-sm">
            {{ error }}
          </div>
          <button
              type="submit"
              :disabled="loading"
              class="w-full bg-sky-600 text-white rounded py-2 hover:bg-sky-700 transition disabled:opacity-70"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </div>
      </form>
      <div class="mt-4 flex justify-between text-sm">
        <NuxtLink class="text-sky-600 hover:underline" to="/forgot-password">
          Forgot your password?
        </NuxtLink>
        <NuxtLink class="text-sky-600 hover:underline" to="/signup">
          Don't have an account? Sign up
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const { $supabase } = useNuxtApp();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    const { error: signInError } = await $supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });

    if (signInError) {
      if (signInError.message.includes('Email not confirmed')) {
        // Save pending email info and redirect to verification page
        localStorage.setItem('pending_email', email.value);
        localStorage.setItem('pending_password', password.value);
        navigateTo('/check-email');
      } else {
        error.value = signInError.message;
      }
      return;
    }

    // Redirect to dashboard on success
    navigateTo('/');
  } catch (err) {
    console.error('Login error:', err);
    error.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

