<template>
  <div :class="['animate-pulse', type === 'card' ? 'rounded-lg bg-gray-100 p-4' : '']">
    <template v-if="type === 'text'">
      <div 
        v-for="(_, i) in Array(lines)" 
        :key="i" 
        :class="[
          'bg-gray-200 rounded', 
          i === lines - 1 && lastLineWidth !== 100 ? `w-${lastLineWidth}%` : 'w-full'
        ]"
        :style="{ height: `${lineHeight}px` }"
        class="mb-2"
      ></div>
    </template>
    
    <template v-else-if="type === 'card'">
      <div class="h-16 bg-gray-200 rounded mb-3"></div>
      <div class="h-4 bg-gray-200 rounded mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </template>
    
    <template v-else-if="type === 'image'">
      <div 
        class="bg-gray-200 rounded"
        :style="{ width: `${width}px`, height: `${height}px` }"
      ></div>
    </template>
    
    <template v-else-if="type === 'list'">
      <div 
        v-for="(_, i) in Array(items)" 
        :key="i"
        class="flex items-center space-x-3 mb-3"
      >
        <div class="rounded-full bg-gray-200 h-10 w-10"></div>
        <div class="flex-1">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'text',
    validator: (v) => ['text', 'card', 'image', 'list'].includes(v)
  },
  lines: {
    type: Number,
    default: 3
  },
  lineHeight: {
    type: Number,
    default: 16
  },
  lastLineWidth: {
    type: Number,
    default: 70
  },
  width: {
    type: Number,
    default: 200
  },
  height: {
    type: Number,
    default: 200
  },
  items: {
    type: Number,
    default: 3
  }
});
</script>