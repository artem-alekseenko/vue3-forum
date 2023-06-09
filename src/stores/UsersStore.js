import { ref } from 'vue';
import { defineStore } from 'pinia';
// eslint-disable-next-line import/no-cycle
import { usePostsStore } from '@/stores/PostsStore';
// eslint-disable-next-line import/no-cycle
import { useThreadsStore } from '@/stores/ThreadsStore';
import { db } from '@/config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const useUsersStore = defineStore('UsersStore', () => {
  const authUserId = '7uVPJS9GHoftN58Z2MXCYDqmNAh2';
  const authUser = ref(null);

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
      get threads() {
        return threads;
      },
      get threadsCount() {
        return threads.length;
      },
    };
  };

  authUser.value = user(authUserId);

  const getAuthUser = async () => user(authUserId);

  // eslint-disable-next-line no-shadow
  const saveUser = async ({ user, id }) => {
    const userDocRef = doc(db, 'users', id);
    await updateDoc(userDocRef, user);
  };

  const increaseUserPostsCount = async (userId) => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userDoc = userDocSnap.data();
      const postsCount = userDoc.postsCount + 1;
      await updateDoc(userDocRef, { postsCount });
    }
  };

  return {
    fetchUser, user, authUser, saveUser, getAuthUser, authUserId, increaseUserPostsCount,
  };
});
