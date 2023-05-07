import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';

export const useThreadsStore = defineStore('ThreadsStore', () => {
  const threads = reactive(sourceData.threads);

  const getThreadById = (id) => threads.find((thread) => thread.id === id);

  const getThreadsByForumId = (id) => threads.filter((thread) => thread.forumId === id);

  return { threads, getThreadById, getThreadsByForumId };
});
