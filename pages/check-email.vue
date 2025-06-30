<template>
  <div class="flex min-h-screen justify-center items-center bg-gray-100">
    <div class="bg-white shadow rounded-2xl p-8 w-full max-w-md text-center">
      <h1 class="text-2xl font-bold mb-6">Verify Your Email</h1>
      <p class="mb-4">
        We sent a verification link to
        <strong>{{ pendingEmail }}</strong>.
      </p>
      <p class="mb-6 text-sm text-gray-600">
        Please check your inbox and click the link to verify your account.
      </p>
      <button
          @click="tryVerify"
          class="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
      >
        I Verified My Email
      </button>
      <p v-if="error" class="text-red-600 mt-4 text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
const { $supabase } = useNuxtApp();
const router = useRouter();

let pendingEmail : string | null;
let pendingPassword : string | null;
const error = ref('');

onMounted(async () => {
  if (typeof localStorage == 'undefined') {
    navigateTo('/');
    return;
  }

  pendingEmail = localStorage.getItem('pending_email');
  pendingPassword = localStorage.getItem('pending_password');

  if (!pendingEmail || !pendingPassword) {
    navigateTo('/');
    return;
  }
});

const tryVerify = async () => {
  error.value = '';
  if (!pendingEmail || !pendingPassword) {
    error.value = 'No pending signup found.';
    return;
  }

  const { data, error: signInError } = await $supabase.auth.signInWithPassword({
    email: pendingEmail,
    password: pendingPassword,
  });

  if (signInError) {
    error.value = signInError.message;
  } else if (data.session) {
    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('refresh_token', data.session.refresh_token);
    localStorage.removeItem('pending_email');
    localStorage.removeItem('pending_password');
    navigateTo('/main');
  } else {
    error.value = 'Account still not verified. Please check again.';
  }
};
</script>
