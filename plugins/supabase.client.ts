import { createClient } from '@supabase/supabase-js';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public;
  const supabaseUrl = config.supabaseUrl as string;
  const supabaseKey = config.supabaseKey as string;
  const supabase = createClient(supabaseUrl, supabaseKey);
  return {
    provide: {
      supabase
    }
  };
});