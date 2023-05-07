import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
// eslint-disable-next-line import/no-cycle
import { usePostsStore } from '@/stores/PostsStore';
import { useThreadsStore } from '@/stores/ThreadsStore';

export const useUsersStore = defineStore('UsersStore', () => {
  const users = reactive(sourceData.users);
  const authUserId = ref(users[1].id);

  const authUser = computed(() => {
    const user = users.find((u) => u.id === authUserId.value);
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

  const getUserById = (id) => users.find((u) => u.id === id);

  return { users, authUser, getUserById };
});
