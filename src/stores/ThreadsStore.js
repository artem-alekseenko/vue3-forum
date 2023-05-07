import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';

export const useThreadsStore = defineStore('ThreadsStore', () => {
  const threads = reactive(sourceData.threads);

  const getThreadById = (id) => threads.find((thread) => thread.id === id);

  return { threads, getThreadById };
});
