import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    userProfile: null,
    loading: false,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user,
    pearls: (state) => state.userProfile?.pearls || 0,
    fish: (state) => state.userProfile?.fish || [],
    decorations: (state) => state.userProfile?.decorations || [],
  },
  
  actions: {
    setUser(user) {
      console.log('Setting user:', user?.id);
      this.user = user;
    },
    
    async loadUserProfile() {
      if (!this.user) return null;
      
      this.loading = true;
      console.log('Loading user profile for:', this.user.id);
      
      try {
        const { $supabase } = useNuxtApp();
        
        if (!$supabase) {
          console.error('Supabase client not available');
          return null;
        }
        
        const { data, error } = await $supabase
          .from('user_data')
          .select('*')
          .eq('id', this.user.id)
          .single();
          
        if (error) {
          // Check if this is a "no rows returned" error, which means user data doesn't exist yet
          if (error.code === 'PGRST116') {
            console.log('User data not found, creating new profile');
            // You might want to create a user profile here
            return null;
          }
          throw error;
        }
        
        console.log('User profile loaded:', data);
        this.userProfile = data;
        return data;
      } catch (err) {
        console.error('Error loading user profile:', err);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    clearUserData() {
      this.user = null;
      this.userProfile = null;
    },
  }
});