<template>
  <button
    :disabled="loading || disabled"
    :class="[
      baseClasses,
      variantClass,
      sizeClass,
      loading ? 'opacity-70 cursor-not-allowed' : '',
      disabled && !loading ? 'opacity-50 cursor-not-allowed' : ''
    ]"
    @click="$emit('click', $event)"
  >
    <div v-if="loading" class="flex items-center justify-center">
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>{{ loadingText }}</span>
    </div>
    <slot v-else></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  loading: Boolean,
  disabled: Boolean,
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  }
});

defineEmits(['click']);

const baseClasses = 'transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500';
    case 'secondary':
      return 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500';
    case 'success':
      return 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500';
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
    case 'warning':
      return 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500';
    case 'info':
      return 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500';
    default:
      return 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500';
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm rounded';
    case 'md':
      return 'px-4 py-2 text-sm rounded-md';
    case 'lg':
      return 'px-5 py-3 text-base rounded-md';
    default:
      return 'px-4 py-2 text-sm rounded-md';
  }
});
</script>