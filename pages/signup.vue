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
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
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
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
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
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                required
            />
          </div>
          <div v-if="error" class="bg-red-100 text-red-700 p-2 rounded text-sm">
            {{ error }}
          </div>
          <button
              type="submit"
              class="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </div>
      </form>
      <p class="mt-4 text-center text-sm">
        Already have an account?
        <NuxtLink class="text-blue-600 hover:underline" to="/login">Log in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const { $supabase } = useNuxtApp();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');

const handleSignup = async () => {
  error.value = '';

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  const { data: userExistsData, error: userExistsError } = await $supabase.functions.invoke('user-exists', {
    body: JSON.stringify({ email: email.value }), // Ensure the body is stringified
  });

  if (userExistsError) {
    error.value = userExistsError.message;
    return;
  }

  const userExists = userExistsData?.exists === true;

  console.log(userExistsData);

  if (userExists){
    error.value = "This user already exists!";
    return;
  }

  const { data, error: signUpError } = await $supabase.auth.signUp({
    email: email.value,
    password: password.value
  });

  if (signUpError) {
    if (
        signUpError.message &&
        signUpError.message.toLowerCase().includes('user already registered')
    ) {
      error.value = 'An account with this email already exists. Please log in instead.'; //email_address_invalid
    } else if (
        signUpError.message &&
        signUpError.message.toLowerCase().includes('over_email_send_rate_limit')
    ) {
      error.value = 'Please wait 15 seconds before trying again.';
    } else {
      error.value = signUpError.message;
    }
    return;
  }

  localStorage.setItem('pending_email', email.value);
  localStorage.setItem('pending_password', password.value);
  navigateTo('/check-email');
};
</script>
