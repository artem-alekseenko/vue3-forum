import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';

export const useUsersStore = defineStore('UsersStore', () => {
  const users = reactive(sourceData.users);

  const user = reactive(sourceData.users[0]);

  const getUserById = (id) => users.find((u) => u.id === id);

  return { user, getUserById };
});
