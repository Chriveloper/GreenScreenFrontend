import { defineNuxtPlugin } from '#app';
import { useUserStore } from '~/stores/user';

export default defineNuxtPlugin({
  name: 'auth-plugin',
  enforce: 'post', // Makes this plugin run after other plugins
  async setup(nuxtApp) {
    // Wait until Supabase is available in the nuxtApp
    const userStore = useUserStore();
    
    // Only run auth checks after Supabase is available
    nuxtApp.hook('app:created', async () => {
      try {
        const { $supabase } = nuxtApp;
        
        if (!$supabase) {
          console.error('Supabase plugin not initialized');
          return;
        }
        
        console.log('Auth plugin: Checking session');
        const { data } = await $supabase.auth.getSession();
        
        if (data.session) {
          console.log('Auth plugin: Existing session found');
          userStore.setUser(data.session.user);
          await userStore.loadUserProfile();
        }
        
        // Set up auth state change listener
        const { data: { subscription } } = $supabase.auth.onAuthStateChange(async (event, session) => {
          console.log(`Auth state changed: ${event}`);
          
          if (event === 'SIGNED_IN') {
            userStore.setUser(session.user);
            await userStore.loadUserProfile();
          } else if (event === 'SIGNED_OUT') {
            userStore.clearUserData();
          }
        });
        
        // Clean up subscription when app is unmounted
        nuxtApp.hook('app:unmounted', () => {
          subscription?.unsubscribe();
        });
      } catch (error) {
        console.error('Error in auth plugin:', error);
      }
    });
  }
});