import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
// eslint-disable-next-line import/no-cycle
import { usePostsStore } from '@/stores/PostsStore';
// eslint-disable-next-line import/no-cycle
import { useThreadsStore } from '@/stores/ThreadsStore';
import { findById, upsert } from '@/helpers';

export const useUsersStore = defineStore('UsersStore', () => {
  const users = reactive(sourceData.users);
  const authUserId = users[1].id;

  const getUserById = (id) => findById(users, id);

  const authUser = computed(() => {
    const user = getUserById(authUserId);
    if (!user) {
      return null;
    }

    const posts = usePostsStore().getPostsByUserId(user.id);
    const threads = useThreadsStore().getThreadsByUserId(user.id);

    return {
      ...user,
      posts,
      postsCount: posts.length,
      threads,
      threadsCount: threads.length,
    };
  });

  const setUser = async (user) => upsert(users, user);

  return {
    users, authUser, getUserById, setUser,
  };
});
