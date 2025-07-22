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
  last_reward_collected : string;
}

interface PurchasableItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  price: number;
  description: string;
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
          screen_time_goals: { dailyLimit: 4 },
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
  }
});