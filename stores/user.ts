import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import { SupabaseClient } from '@supabase/supabase-js';

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
  last_reward_collected: string;
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
    installed_apps: "" as string,
    usage_data: "" as string,
  }),
  
  getters: {
    isLoggedIn: (state) => {
      // Prevent SSR issues during static generation
      if (process.server) return false;
      return !!state.user;
    },
    pearls: (state) => state.userProfile?.pearls || 0,
    fish: (state) => state.userProfile?.fish || [],
    decorations: (state) => state.userProfile?.decorations || [],
    screenTimeGoals: (state) => state.userProfile?.screen_time_goals || { dailyLimit: 240 },
    appLimits: (state) => state.userProfile?.app_limits || {},
    last_reward_collected: (state) => state.userProfile?.last_reward_collected || "1970-01-01",
  },
  
  actions: {
    setUser(user: any) {
      console.log('Setting user:', user?.id);
      this.user = user;
    },
    
    async loadUserProfile() {
      if (!this.user || process.server) return null;
      
      this.loading = true;
      console.log('Loading user profile for:', this.user.id);
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        if (!supabase) {
          console.error('Supabase client not available');
          return null;
        }
        
        const { data, error } = await supabase
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
      if (!this.user || process.server) return null;
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        const defaultProfile: UserProfile = {
          id: this.user.id,
          pearls: 50,
          fish: [],
          decorations: [],
          aquarium_layout: {},
          screen_time_goals: { dailyLimit: 240 },
          app_limits: {},
          last_reward_collected: "1970-01-01",
        };
        
        const { data, error } = await supabase
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
      if (!this.user || !this.userProfile || process.server) return false;
      
      // Check if user has enough pearls
      if (this.pearls < item.price) {
        console.error('Not enough pearls to purchase item');
        return false;
      }
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
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
        const { error } = await supabase
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
      if (!this.user || !this.userProfile || process.server) {
        console.error('No user or user profile found, or running on server');
        return false;
      }
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        if (!supabase) {
          console.error('Supabase client not available');
          return false;
        }
        
        console.log(`Adding focus session: ${durationMinutes} min, ${pearlsEarned} pearls`);
        console.log('Current pearls:', this.userProfile.pearls);
        
        // First log the focus session
        const { error: sessionError } = await supabase
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
        const { error: updateError } = await supabase
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
    
    async updateScreenTimeGoals(goals: { dailyLimit: number }) {
      if (!this.user || !this.userProfile || process.server) return false;
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        const { error } = await supabase
          .from('user_data')
          .update({ screen_time_goals: goals })
          .eq('id', this.user.id);
          
        if (error) throw error;
        
        // Update local state
        this.userProfile.screen_time_goals = goals;
        console.log('Screen time goals updated:', goals);
        return true;
      } catch (err) {
        console.error('Error updating screen time goals:', err);
        return false;
      }
    },
    
    async updateAppLimits(limits: Record<string, number>) {
      if (!this.user || !this.userProfile || process.server) return false;
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        const { error } = await supabase
          .from('user_data')
          .update({ app_limits: limits })
          .eq('id', this.user.id);
          
        if (error) throw error;
        
        // Update local state
        this.userProfile.app_limits = limits;
        console.log('App limits updated:', limits);
        return true;
      } catch (err) {
        console.error('Error updating app limits:', err);
        return false;
      }
    },
    
    async saveUsageData(usageData: any[]) {
      if (!this.user) return false;
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        // Format data for insertion
        const formattedData = usageData.map(app => ({
          user_id: this.user!.id,
          date: new Date(app.startTime).toISOString().split('T')[0],
          app_name: app.appName,
          package_name: app.packageName,
          usage_seconds: app.usage,
          start_time: app.startTime,
          end_time: app.endTime
        }));
        
        const { error } = await supabase
          .from('usage_data')
          .insert(formattedData);
          
        if (error) throw error;
        
        console.log('Usage data saved successfully');
        return true;
      } catch (err) {
        console.error('Error saving usage data:', err);
        return false;
      }
    },
    
    clearUserData() {
      this.user = null;
      this.userProfile = null;
    },
  }
});