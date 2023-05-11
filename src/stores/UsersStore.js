import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
// eslint-disable-next-line import/no-cycle
import { usePostsStore } from '@/stores/PostsStore';
import { useThreadsStore } from '@/stores/ThreadsStore';

export const useUsersStore = defineStore('UsersStore', () => {
  const users = reactive(sourceData.users);
  const authUserId = users[1].id;

  const getUserById = (id) => users.find((u) => u.id === id);

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

  const setUser = (user) => {
    const index = users.findIndex((u) => u.id === user.id);
    if (index === -1) {
      users.push(user);
    } else {
      Object.assign(users[index], user);
    }
  };

  return {
    users, authUser, getUserById, setUser,
  };
});
