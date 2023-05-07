import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';

export const useForumsStore = defineStore('ForumsStore', () => {
  const forums = reactive(sourceData.forums);

  const getForumById = (id) => forums.find((forum) => forum.id === id);

  return { forums, getForumById };
});
