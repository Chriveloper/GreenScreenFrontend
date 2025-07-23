import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import { SupabaseClient } from '@supabase/supabase-js';

// Define TypeScript interfaces for better type checking
interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  pearls: number;
  fish: string[];
  decorations: string[];
  aquarium_layout: Record<string, any>;
  screen_time_goals: {
    dailyLimit: number;
  };
  app_limits: Record<string, number>;
  privacy_settings?: {
    aquarium_visibility: 'public' | 'friends' | 'private';
    pearls_visibility: 'public' | 'friends' | 'private';
    screen_time_visibility: 'public' | 'friends' | 'private';
  };
  created_at?: string;
  updated_at?: string;
  last_reward_collected: string;
}

interface PurchasableItem {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  price: number;
  description?: string;
}

interface Friend {
  id: string;
  username: string;
  display_name?: string;
  pearls?: number;
  aquarium_layout?: Record<string, any>;
  friendship_status: 'accepted' | 'pending' | 'declined';
  is_requester: boolean;
  friendship_id?: string; // Add this for responding to requests
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as any | null,
    userProfile: null as UserProfile | null,
    loading: false,
    installed_apps: "" as string,
    usage_data: "" as string,
    friends: [] as Friend[],
    pendingRequests: [] as Friend[],
    sentRequests: [] as Friend[],
    screen_time_metadata: null as string | null,
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
    aquariumLayout: (state) => state.userProfile?.aquarium_layout || {},
    screenTimeGoals: (state) => state.userProfile?.screen_time_goals || { dailyLimit: 240 },
    appLimits: (state) => state.userProfile?.app_limits || {},
    friendsList: (state) => state.friends.filter(f => f.friendship_status === 'accepted'),
    incomingRequests: (state) => state.pendingRequests.filter(f => !f.is_requester),
    outgoingRequests: (state) => state.sentRequests.filter(f => f.is_requester),
    screenTimeMetadata(): any {
      if (!this.screen_time_metadata) return null;
      try {
        return JSON.parse(this.screen_time_metadata);
      } catch {
        return null;
      }
    },
    
    todayTotalScreenTime(): number {
      const metadata = this.screenTimeMetadata;
      return metadata?.totalScreenTime || 0;
    },
    
    todayAppsUsed(): number {
      const metadata = this.screenTimeMetadata;
      return metadata?.totalAppsUsed || 0;
    }
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
        
        // Generate a unique username based on user email
        const emailUsername = this.user.email.split('@')[0];
        const randomSuffix = Math.floor(Math.random() * 1000);
        const suggestedUsername = `${emailUsername}${randomSuffix}`;
        
        const defaultProfile: UserProfile = {
          id: this.user.id,
          username: suggestedUsername,
          display_name: this.user.email.split('@')[0],
          pearls: 50,
          fish: [],
          decorations: [],
          aquarium_layout: {},
          screen_time_goals: { dailyLimit: 240 },
          app_limits: {},
          privacy_settings: {
            aquarium_visibility: 'friends',
            pearls_visibility: 'friends',
            screen_time_visibility: 'friends'
          },
          last_reward_collected: "1970-01-01"
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

    async updateUserProfile(updates: Partial<UserProfile>) {
      if (!this.user || !this.userProfile || process.server) return false;
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        const { error } = await supabase
          .from('user_data')
          .update(updates)
          .eq('id', this.user.id);
          
        if (error) throw error;
        
        // Update local state
        this.userProfile = { ...this.userProfile, ...updates };
        return true;
      } catch (err) {
        console.error('Error updating user profile:', err);
        return false;
      }
    },
    
    // RESTORED: Original purchase function (for backwards compatibility)
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
    
    // RESTORED: This is a critical function that was missing
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
    
    // RESTORED: Screen time goals function
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
    
    // RESTORED: App limits function
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
    
    // RESTORED: Save usage data function
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
    
    // RESTORED: Clear user data function
    clearUserData() {
      this.user = null;
      this.userProfile = null;
      this.friends = [];
      this.pendingRequests = [];
      this.sentRequests = [];
    },

    async searchUsers(query: string) {
      if (!query.trim() || process.server) {
        console.log("Invalid search query or running on server");
        return [];
      }
      
      console.log("Searching for users with query:", query);
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        if (!supabase) {
          console.error("Supabase client not available");
          return [];
        }
        
        // Use separate filters for username and display name with the correct ILIKE syntax
        console.log("Executing search query");
        const { data, error } = await supabase
          .from('user_data')
          .select('id, username, display_name')
          .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
          .neq('id', this.user?.id)
          .limit(10);
          
        if (error) {
          console.error("Search query error:", error);
          throw error;
        }
        
        console.log(`Found ${data?.length || 0} results`);
        return data || [];
      } catch (err) {
        console.error('Error searching users:', err);
        return [];
      }
    },

    async sendFriendRequest(userId: string) {
      if (!this.user || process.server) return false;
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        // First check if a friendship already exists between these users
        const { data: existingFriendship, error: checkError } = await supabase
          .from('friendships')
          .select('*')
          .or(
            `and(requester_id.eq.${this.user.id},addressee_id.eq.${userId}),` +
            `and(requester_id.eq.${userId},addressee_id.eq.${this.user.id})`
          )
          .maybeSingle();
          
        if (checkError) throw checkError;
        
        // If a friendship already exists
        if (existingFriendship) {
          // If the other user already sent a request to us, auto-accept it
          if (existingFriendship.requester_id === userId && existingFriendship.status === 'pending') {
            return await this.respondToFriendRequest(existingFriendship.id, 'accepted');
          }
          
          // Otherwise, a request is already pending or they're already friends
          return true; // Return success, but don't create a duplicate
        }
        
        // No existing friendship, create a new request
        const { error } = await supabase
          .from('friendships')
          .insert({
            requester_id: this.user.id,
            addressee_id: userId,
            status: 'pending'
          });
          
        if (error) throw error;
        
        // Refresh friend requests
        await this.loadFriends();
        return true;
      } catch (err) {
        console.error('Error sending friend request:', err);
        return false;
      }
    },

    async respondToFriendRequest(friendshipId: string, response: 'accepted' | 'declined') {
      if (!this.user || process.server) return false;
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        const { error } = await supabase
          .from('friendships')
          .update({ status: response })
          .eq('id', friendshipId)
          .eq('addressee_id', this.user.id);
          
        if (error) throw error;
        
        // Refresh friends list
        await this.loadFriends();
        return true;
      } catch (err) {
        console.error('Error responding to friend request:', err);
        return false;
      }
    },

    async loadFriends() {
      if (!this.user || process.server) return;
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        // First, get all friendships for this user
        const { data: friendshipsData, error: friendshipsError } = await supabase
          .from('friendships')
          .select('*')
          .or(`requester_id.eq.${this.user.id},addressee_id.eq.${this.user.id}`);
          
        if (friendshipsError) {
          console.error('Error loading friendships:', friendshipsError);
          return;
        }
        
        // Then get user data for all friends
        const userIds = new Set<string>();
        friendshipsData?.forEach((friendship: any) => {
          if (friendship.requester_id !== this.user.id) {
            userIds.add(friendship.requester_id);
          }
          if (friendship.addressee_id !== this.user.id) {
            userIds.add(friendship.addressee_id);
          }
        });
        
        let usersData: any[] = [];
        if (userIds.size > 0) {
          const { data: userData, error: userError } = await supabase
            .from('user_data')
            .select('id, username, display_name, pearls, aquarium_layout')
            .in('id', Array.from(userIds));
            
          if (userError) {
            console.error('Error loading user data:', userError);
            return;
          }
          usersData = userData || [];
        }
        
        // Create a map for quick user data lookup
        const userDataMap = new Map();
        usersData.forEach(user => {
          userDataMap.set(user.id, user);
        });
        
        // Process friendships
        const friends: Friend[] = [];
        const pendingRequests: Friend[] = [];
        const sentRequests: Friend[] = [];
        
        friendshipsData?.forEach((friendship: any) => {
          const isRequester = friendship.requester_id === this.user.id;
          const friendId = isRequester ? friendship.addressee_id : friendship.requester_id;
          const friendData = userDataMap.get(friendId);
          
          if (!friendData) return; // Skip if user data not found
          
          const friend: Friend = {
            id: friendData.id,
            username: friendData.username || 'Unknown',
            display_name: friendData.display_name || 'Unknown User',
            pearls: friendData.pearls,
            aquarium_layout: friendData.aquarium_layout,
            friendship_status: friendship.status,
            is_requester: isRequester,
            friendship_id: friendship.id // Add friendship ID for responding to requests
          };
          
          if (friendship.status === 'accepted') {
            friends.push(friend);
          } else if (friendship.status === 'pending') {
            if (isRequester) {
              sentRequests.push(friend);
            } else {
              pendingRequests.push(friend);
            }
          }
        });
        
        // Update state
        this.friends = friends;
        this.pendingRequests = pendingRequests;
        this.sentRequests = sentRequests;
      } catch (err) {
        console.error('Error loading friends:', err);
      }
    },
    
    async getFriendProfile(friendId: string) {
      if (!this.user || process.server) return null;
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        // First, check if this user is actually a friend
        const isFriend = this.friendsList.some(f => f.id === friendId);
        if (!isFriend) {
          console.error('Not friends with this user');
          return null;
        }
        
        // Get the friend's profile data
        const { data, error } = await supabase
          .from('user_data')
          .select('id, username, display_name, pearls, aquarium_layout, fish, decorations, privacy_settings')
          .eq('id', friendId)
          .single();
          
        if (error) throw error;
        
        // Check privacy settings
        if (data.privacy_settings) {
          if (data.privacy_settings.aquarium_visibility === 'private') {
            data.aquarium_layout = null; // Don't show private aquariums
          }
          
          if (data.privacy_settings.pearls_visibility === 'private') {
            data.pearls = null; // Don't show private pearl counts
          }
        }
        
        return data;
      } catch (err) {
        console.error('Error getting friend profile:', err);
        return null;
      }
    },

    async updateAquariumLayout(layout: Record<string, any>) {
      if (!this.user || process.server) return false;
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        // Update the aquarium_layout field in the database
        const { error } = await supabase
          .from('user_data')
          .update({
            aquarium_layout: layout,
            updated_at: new Date().toISOString()
          })
          .eq('id', this.user.id);
          
        if (error) throw error;
        
        // Update local state
        if (this.userProfile) {
          this.userProfile.aquarium_layout = layout;
        }
        
        console.log('Aquarium layout updated successfully');
        return true;
      } catch (err) {
        console.error('Error updating aquarium layout:', err);
        return false;
      }
    },

    async purchaseShopItem(item: any, type: 'fish' | 'plant' | 'decoration', price: number) {
      if (!this.user || process.server) return false;
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        // Check if user has enough pearls
        if (!this.userProfile || this.userProfile.pearls < price) {
          console.error('Not enough pearls to purchase item');
          return false;
        }
        
        // Prepare the update
        const updateData: any = {
          pearls: this.userProfile.pearls - price,
          updated_at: new Date().toISOString()
        };
        
        // Add item to the appropriate collection
        if (type === 'fish') {
          const fishId = item.id;
          const fishCollection = [...(this.userProfile.fish || [])];
          // Count how many of this fish the user already has
          const fishCount = fishCollection.filter(id => id === fishId).length;
          // Allow up to 3 of the same fish
          if (fishCount < 3) {
            fishCollection.push(fishId);
            updateData.fish = fishCollection;
          } else {
            console.log('Maximum number of this fish already owned');
            return false;
          }
        } else if (type === 'plant') {
          const plantId = item.id;
          const decorCollection = [...(this.userProfile.decorations || [])];
          // Count how many of this plant the user already has
          const plantCount = decorCollection.filter(id => id === plantId).length;
          // Allow up to 3 of the same plant
          if (plantCount < 3) {
            decorCollection.push(plantId);
            updateData.decorations = decorCollection;
          } else {
            console.log('Maximum number of this plant already owned');
            return false;
          }
        } else if (type === 'decoration') {
          const decoId = item.id;
          const decorCollection = [...(this.userProfile.decorations || [])];
          // Count how many of this decoration the user already has
          const decoCount = decorCollection.filter(id => id === decoId).length;
          // Allow up to 3 of the same decoration
          if (decoCount < 3) {
            decorCollection.push(decoId);
            updateData.decorations = decorCollection;
          } else {
            console.log('Maximum number of this decoration already owned');
            return false;
          }
        }
        
        // Update the user's profile in the database
        const { error } = await supabase
          .from('user_data')
          .update(updateData)
          .eq('id', this.user.id);
          
        if (error) throw error;
        
        // Update local state
        if (this.userProfile) {
          this.userProfile.pearls = updateData.pearls;
          if (updateData.fish) this.userProfile.fish = updateData.fish;
          if (updateData.decorations) this.userProfile.decorations = updateData.decorations;
        }
        
        console.log(`Successfully purchased ${item.name}`);
        return true;
      } catch (err) {
        console.error('Error purchasing item:', err);
        return false;
      }
    },
    
    /**
     * Check if user is eligible for a daily reward
     * @returns boolean indicating if user can collect a reward
     */
    canCollectDailyReward(): boolean {
      if (!this.userProfile) return false;
      
      const lastCollected = new Date(this.userProfile.last_reward_collected);
      const today = new Date();
      
      // Reset hours to compare dates only
      lastCollected.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      // User can collect reward if they haven't already collected today
      return lastCollected < today;
    },
    
    /**
     * Calculate reward amount based on streak or other factors
     * @returns number of pearls to award
     */
    calculateDailyReward(): number {
      // Implement reward calculation logic
      // For example, base reward + streak bonus
      const baseReward = 10;
      const streakBonus = this.getDailyRewardStreak() * 2;
      
      return baseReward + streakBonus;
    },
    
    /**
     * Get the current login streak
     * @returns number of consecutive days with rewards collected
     */
    getDailyRewardStreak(): number {
      // Implement streak calculation
      // This would need to track consecutive days
      return 0; // Placeholder
    },
    
    /**
     * Collect daily reward and update user profile
     * @returns boolean indicating success
     */
    async collectDailyReward(): Promise<boolean> {
      if (!this.user || !this.userProfile || !this.canCollectDailyReward()) {
        return false;
      }
      
      try {
        const { $supabase } = useNuxtApp();
        const supabase = $supabase as SupabaseClient;
        
        const rewardAmount = this.calculateDailyReward();
        const today = new Date().toISOString();
        
        const updateData = {
          pearls: this.userProfile.pearls + rewardAmount,
          last_reward_collected: today,
          updated_at: today
        };
        
        const { error } = await supabase
          .from('user_data')
          .update(updateData)
          .eq('id', this.user.id);
          
        if (error) throw error;
        
        // Update local state
        if (this.userProfile) {
          this.userProfile.pearls = updateData.pearls;
          this.userProfile.last_reward_collected = today;
        }
        
        return true;
      } catch (err) {
        console.error('Error collecting daily reward:', err);
        return false;
      }
    },
    
    // New method to fetch historical data
    async fetchHistoricalUsageData(dayOffset: number = 0) {
      try {
        const response = await fetch(`http://localhost:8080/data?day=${dayOffset}`);
        const data = await response.json();
        
        return {
          usageData: data.usageData,
          metadata: {
            totalScreenTime: data.totalScreenTime,
            totalAppsUsed: data.totalAppsUsed,
            dayLabel: data.dayLabel,
            targetDate: data.targetDate,
            dataTimestamp: data.dataTimestamp
          }
        };
      } catch (error) {
        console.error('Error fetching historical usage data:', error);
        return null;
      }
    }
  }
});