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
                autocomplete="current-password"
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
            Sign In
          </button>
        </div>
      </form>
      <div class="mt-4 flex justify-between text-sm">
        <!-- <NuxtLink class="text-blue-600 hover:underline" to="/forgot-password">
          Forgot your password?
        </NuxtLink> -->
        <NuxtLink class="text-blue-600 hover:underline" to="/signup">
          Don't have an account? Sign up
        </NuxtLink>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const { $supabase } = useNuxtApp();

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

// check for existing session
onMounted(async () => {
  const { data } = await $supabase.auth.getSession();
  if (data.session) {
    navigateTo('/');
  }

  if (typeof localStorage == 'undefined') {
    return;
  }

  const pendingEmail = localStorage.getItem('pending_email');

  if (pendingEmail) {
    navigateTo('/check-email');
  }
});

const handleLogin = async () => {
  error.value = '';

  const { data, error: signInError } = await $supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });

  if (signInError) {
    if (
        signInError.message &&
        signInError.message.toLowerCase().includes('invalid login credentials')
    ) {
      error.value = 'Invalid email or password.';
    } else {
      error.value = signInError.message;
    }
    return;
  }

  // redirect to the main page
  navigateTo('/');
};
</script>

