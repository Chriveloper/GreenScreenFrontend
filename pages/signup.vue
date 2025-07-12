<template>
  <div class="flex min-h-screen justify-center items-center bg-gray-100">
    <div class="bg-white shadow rounded-2xl p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Sign Up</h1>
      <form @submit.prevent="handleSignup">
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
                autocomplete="new-password"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                required
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" for="confirmPassword">Confirm Password</label>
            <input
                v-model="confirmPassword"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                required
            />
          </div>
          <div v-if="error" class="bg-red-100 text-red-700 p-2 rounded text-sm">
            {{ error }}
          </div>
          <div v-if="rawError" class="mt-2 p-2 bg-gray-100 text-xs text-gray-700 rounded overflow-auto max-h-32">
            <p class="font-semibold">Debug info:</p>
            <pre>{{ rawError }}</pre>
          </div>
          <button
              type="submit"
              :disabled="loading"
              class="w-full bg-sky-600 text-white rounded py-2 hover:bg-sky-700 transition disabled:opacity-70"
          >
            <span v-if="loading">Creating account...</span>
            <span v-else>Create Account</span>
          </button>
        </div>
      </form>
      <p class="mt-4 text-center text-sm">
        Already have an account?
        <NuxtLink class="text-sky-600 hover:underline" to="/login">Log in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const { $supabase } = useNuxtApp();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const loading = ref(false);
const rawError = ref(''); // For debugging purposes

const handleSignup = async () => {
  error.value = '';
  rawError.value = '';
  loading.value = true;

  try {
    // Basic validation
    if (password.value.length < 6) {
      error.value = 'Password must be at least 6 characters';
      loading.value = false;
      return;
    }

    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      loading.value = false;
      return;
    }

    console.log('Attempting signup with:', { email: email.value, redirect: window.location.origin });
    
    // Try a simpler signup call with minimal options
    const { data, error: signUpError } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    console.log('Signup response:', { data, error: signUpError });

    if (signUpError) {
      // Store raw error for debugging
      rawError.value = JSON.stringify(signUpError, null, 2);
      
      // Check if the error indicates the user already exists
      if (signUpError.message.includes('already registered') || 
          signUpError.message.includes('already in use') ||
          signUpError.message.includes('User already registered')) {
        error.value = 'An account with this email already exists';
      } else {
        error.value = signUpError.message || 'Error creating account';
      }
      return;
    }

    // Store pending email information for verification page
    localStorage.setItem('pending_email', email.value);
    localStorage.setItem('pending_password', password.value);
    
    // Redirect to check email page
    navigateTo('/check-email');
  } catch (err) {
    console.error('Signup error:', err);
    error.value = 'An unexpected error occurred. Please try again.';
    rawError.value = err instanceof Error ? 
      `${err.name}: ${err.message}` : 
      JSON.stringify(err, null, 2);
  } finally {
    loading.value = false;
  }
};
</script>
