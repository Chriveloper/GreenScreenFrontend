<template>
  <div class="flex min-h-screen justify-center items-center bg-gray-100">
    <div class="bg-white shadow rounded-2xl p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Log In</h1>
      <form @submit.prevent="handleLogin">
        <div class="space-y-4">
          <FormInput
            id="email"
            label="Email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            :error="errors.email"
            required
          />
          
          <FormInput
            id="password"
            label="Password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            :error="errors.password"
            required
          />
          
          <div v-if="globalError" class="bg-red-100 text-red-700 p-3 rounded text-sm">
            {{ globalError }}
          </div>
          
          <ActionButton
            type="submit"
            :loading="loading"
            loadingText="Logging in..."
            variant="primary"
            class="w-full"
          >
            Log In
          </ActionButton>
        </div>
      </form>
      <p class="mt-4 text-center text-sm">
        Don't have an account?
        <NuxtLink class="text-sky-600 hover:underline link-hover" to="/signup">Sign up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useUserStore } from '~/stores/user';
import FormInput from '~/components/FormInput.vue';
import ActionButton from '~/components/ActionButton.vue';

const { $supabase } = useNuxtApp();
const userStore = useUserStore();
const toast = inject('toast');
const progress = inject('progress');

const email = ref('');
const password = ref('');
const errors = ref({});
const globalError = ref('');
const loading = ref(false);

const validateForm = () => {
  errors.value = {};
  let isValid = true;
  
  if (!email.value) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Please enter a valid email';
    isValid = false;
  }
  
  if (!password.value) {
    errors.value.password = 'Password is required';
    isValid = false;
  }
  
  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;
  
  globalError.value = '';
  loading.value = true;
  progress.value.startLoading();

  try {
    const { data, error: signInError } = await $supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });

    if (signInError) {
      if (signInError.message.includes('Email not confirmed')) {
        // Save pending email info and redirect to verification page
        localStorage.setItem('pending_email', email.value);
        localStorage.setItem('pending_password', password.value);
        toast.value.showToast('Please verify your email to continue', 'info');
        navigateTo('/check-email');
      } else {
        globalError.value = signInError.message;
        toast.value.showToast('Login failed: ' + signInError.message, 'error');
      }
      return;
    }

    toast.value.showToast('Login successful! Welcome back.', 'success');
    navigateTo('/');
  } catch (err) {
    console.error('Login error:', err);
    globalError.value = 'An unexpected error occurred. Please try again.';
    toast.value.showToast('Login failed: ' + (err.message || 'Unknown error'), 'error');
  } finally {
    loading.value = false;
    progress.value.stopLoading();
  }
};
</script>

