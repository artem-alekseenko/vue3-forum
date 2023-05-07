import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';

export const usePostsStore = defineStore('PostsStore', () => {
  const posts = reactive(sourceData.posts);

  const getPostById = (id) => posts.find((post) => post.id === id);
  const getPostsByThreadId = (threadId) => posts.filter((post) => post.threadId === threadId);

  return { posts, getPostById, getPostsByThreadId };
});
