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

  const user = (id) => {
    // eslint-disable-next-line no-shadow
    const user = getUserById(id);
    if (!user) {
      return null;
    }

    return {
      ...user,
      get posts() {
        return usePostsStore().getPostsByUserId(user.id);
      },
      get postsCount() {
        return this.posts.length;
      },
      get threads() {
        return useThreadsStore().getThreadsByUserId(user.id);
      },
      get threadsCount() {
        return this.threads.length;
      },
    };
  };

  const authUser = computed(() => user(authUserId));

  // eslint-disable-next-line no-shadow
  const setUser = async (user) => upsert(users, user);

  return {
    users, user, authUser, getUserById, setUser,
  };
});
