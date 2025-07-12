import { createClient } from '@supabase/supabase-js';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre', // Makes this plugin run before other plugins
  setup() {
    const config = useRuntimeConfig().public;
    const supabaseUrl = config.supabaseUrl as string;
    const supabaseKey = config.supabaseKey as string;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL or Key is missing from environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');
    
    return {
      provide: {
        supabase
      }
    };
  }
});