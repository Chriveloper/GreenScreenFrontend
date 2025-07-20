import { createClient } from '@supabase/supabase-js';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre', // Makes this plugin run before other plugins
  setup() {
    // Only run on client side during static generation
    if (process.server) {
      return {
        provide: {
          supabase: null as any
        }
      };
    }

    const config = useRuntimeConfig().public;
    const supabaseUrl = config.supabaseUrl as string;
    const supabaseKey = config.supabaseKey as string;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL or Key is missing from environment variables');
      return {
        provide: {
          supabase: null as any
        }
      };
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