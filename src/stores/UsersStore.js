import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
// eslint-disable-next-line import/no-cycle
import { usePostsStore } from '@/stores/PostsStore';
// eslint-disable-next-line import/no-cycle
import { useThreadsStore } from '@/stores/ThreadsStore';
import { findById, upsert } from '@/helpers';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useUsersStore = defineStore('UsersStore', () => {
  const users = reactive(sourceData.users);
  const authUserId = '7uVPJS9GHoftN58Z2MXCYDqmNAh2';

  const getUserById = (id) => findById(users, id);

  const fetchUser = async (id) => {
    const userDocRef = doc(db, 'users', id);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const res = userDocSnap.data();
      return {
        id: userDocSnap.id,
        ...res,
      };
    }
    // eslint-disable-next-line no-console
    console.error(`No user with id ${id}`);
    return null;
  };

  const user = async (id) => {
    const userFromDb = await fetchUser(id);

    if (!userFromDb) {
      return null;
    }

    const posts = await usePostsStore().getPostsByUserId(id);
    const threads = await useThreadsStore().getThreadsByUserId(id);

    return {
      ...userFromDb,
      get posts() {
        return posts;
      },
      get postsCount() {
        return posts.length;
      },
      get threads() {
        return threads;
      },
      get threadsCount() {
        return threads.length;
      },
    };
  };

  const authUser = computed(() => user(authUserId));

  // eslint-disable-next-line no-shadow
  const setUser = async (user) => upsert(users, user);

  return {
    users, fetchUser, user, authUser, getUserById, setUser,
  };
});
