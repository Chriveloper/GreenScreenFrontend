import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false as boolean,
    profile: null as null | { id: string; email: string }
  }),
  actions: {
    setLoggedIn(status: boolean) {
      this.isLoggedIn = status;
    }
  }
});