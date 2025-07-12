import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';

// Define TypeScript interfaces for better type checking
interface UserProfile {
  id: string;
  pearls: number;
  fish: string[];
  decorations: string[];
  aquarium_layout: Record<string, any>;
  screen_time_goals: {
    dailyLimit: number;
  };
  app_limits: Record<string, number>;
  created_at?: string;
  updated_at?: string;
}

interface PurchasableItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  price: number;
  description: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as any | null,
    userProfile: null as UserProfile | null,
    loading: false,
    installed_apps : "" as String,
    usage_data : "" as String,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user,
    pearls: (state) => state.userProfile?.pearls || 0,
    fish: (state) => state.userProfile?.fish || [],
    decorations: (state) => state.userProfile?.decorations || [],
  },
  
  actions: {
    setUser(user: any) {
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
            // Create a default profile
            return await this.createUserProfile();
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

    async createUserProfile() {
      if (!this.user) return null;
      
      try {
        const { $supabase } = useNuxtApp();
        
        const defaultProfile: UserProfile = {
          id: this.user.id,
          pearls: 50,
          fish: [],
          decorations: [],
          aquarium_layout: {},
          screen_time_goals: { dailyLimit: 240 },
          app_limits: {}
        };
        
        const { data, error } = await $supabase
          .from('user_data')
          .insert(defaultProfile)
          .select()
          .single();
          
        if (error) throw error;
        
        this.userProfile = data;
        return data;
      } catch (err) {
        console.error('Error creating user profile:', err);
        return null;
      }
    },
    
    async purchaseItem(type: 'fish' | 'decorations', item: PurchasableItem) {
      if (!this.user || !this.userProfile) return false;
      
      // Check if user has enough pearls
      if (this.pearls < item.price) {
        console.error('Not enough pearls to purchase item');
        return false;
      }
      
      try {
        const { $supabase } = useNuxtApp();
        
        // Get current collections
        const currentFish = [...this.fish];
        const currentDecorations = [...this.decorations];
        const currentPearls = this.pearls;
        
        // Update the appropriate collection
        if (type === 'fish') {
          // Check if already owned
          if (currentFish.includes(item.id)) {
            console.log('Fish already owned');
            return false;
          }
          currentFish.push(item.id);
        } else if (type === 'decorations') {
          // Check if already owned
          if (currentDecorations.includes(item.id)) {
            console.log('Decoration already owned');
            return false;
          }
          currentDecorations.push(item.id);
        } else {
          console.error('Invalid item type');
          return false;
        }
        
        // Update in database
        const { error } = await $supabase
          .from('user_data')
          .update({
            pearls: currentPearls - item.price,
            fish: type === 'fish' ? currentFish : this.fish,
            decorations: type === 'decorations' ? currentDecorations : this.decorations
          })
          .eq('id', this.user.id);
          
        if (error) throw error;
        
        // Update local state
        this.userProfile.pearls = currentPearls - item.price;
        if (type === 'fish') {
          this.userProfile.fish = currentFish;
        } else {
          this.userProfile.decorations = currentDecorations;
        }
        
        console.log(`Purchased ${item.name} for ${item.price} pearls`);
        return true;
      } catch (err) {
        console.error('Error purchasing item:', err);
        return false;
      }
    },
    
    async addFocusSession(durationMinutes: number, pearlsEarned: number) {
      if (!this.user || !this.userProfile) {
        console.error('No user or user profile found');
        return false;
      }
      
      try {
        const { $supabase } = useNuxtApp();
        
        if (!$supabase) {
          console.error('Supabase client not available');
          return false;
        }
        
        console.log(`Adding focus session: ${durationMinutes} min, ${pearlsEarned} pearls`);
        console.log('Current pearls:', this.userProfile.pearls);
        
        // First log the focus session
        const { error: sessionError } = await $supabase
          .from('focus_sessions')
          .insert({
            user_id: this.user.id,
            duration_minutes: durationMinutes,
            pearls_earned: pearlsEarned,
            completed_at: new Date().toISOString()
          });
          
        if (sessionError) {
          console.error('Error recording focus session:', sessionError);
          // Continue even if logging fails - we still want to give pearls
        }
        
        // Calculate new pearl balance
        const newPearlBalance = this.userProfile.pearls + pearlsEarned;
        
        // Update pearls in user profile
        const { error: updateError } = await $supabase
          .from('user_data')
          .update({
            pearls: newPearlBalance
          })
          .eq('id', this.user.id);
          
        if (updateError) {
          console.error('Error updating pearls:', updateError);
          throw updateError;
        }
        
        // Update local state
        this.userProfile.pearls = newPearlBalance;
        
        console.log(`Pearl balance updated: ${this.userProfile.pearls} (+${pearlsEarned})`);
        return true;
      } catch (err) {
        console.error('Error in addFocusSession:', err);
        return false;
      }
    },
    
    clearUserData() {
      this.user = null;
      this.userProfile = null;
    },
  }
});