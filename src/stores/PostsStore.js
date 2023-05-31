import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
// eslint-disable-next-line import/no-cycle
import { useThreadsStore } from '@/stores/ThreadsStore';
// eslint-disable-next-line import/no-cycle
import { useUsersStore } from '@/stores/UsersStore';
import { findById } from '@/helpers';
import { db } from '@/config/firebase';
import {
  collection, getDocs, query, where, addDoc,
} from 'firebase/firestore';

export const usePostsStore = defineStore('PostsStore', () => {
  const posts = reactive(sourceData.posts);

  const getPostById = (id) => findById(posts, id);

  const getPostsByThreadId = async (threadId) => {
    const postsCollection = collection(db, 'posts');
    const postsQuery = query(
      postsCollection,
      where('threadId', '==', threadId),
    );
    const postsSnapshot = await getDocs(postsQuery);

    const promises = postsSnapshot.docs.map(async (document) => {
      const data = document.data();
      return {
        id: document.id,
        ...data,
      };
    });

    return Promise.all(promises);
  };

  const getPostsByUserId = async (userId) => {
    const postsCollection = collection(db, 'posts');
    const postsQuery = query(
      postsCollection,
      where('userId', '==', userId),
    );
    const postsSnapshot = await getDocs(postsQuery);

    const postsPromises = postsSnapshot.docs.map(async (postDoc) => {
      const data = postDoc.data();
      return {
        id: postDoc.id,
        ...data,
      };
    });

    return Promise.all(postsPromises);
  };

  const preparePost = ({ text, threadId }) => ({
    publishedAt: Math.floor(Date.now() / 1000),
    userId: useUsersStore().authUserId,
    text,
    threadId,
  });

  const createPost = async ({ text, threadId }) => {
    const post = preparePost({ text, threadId });

    const postsCollection = collection(db, 'posts');
    const newPostDocRef = await addDoc(postsCollection, post);

    const threadsStore = useThreadsStore();
    await threadsStore.appendPostToThread({ threadId, childId: newPostDocRef.id });
    await threadsStore.appendContributorToThread({ threadId, userId: post.userId });
  };

  return {
    posts, getPostById, getPostsByThreadId, getPostsByUserId, createPost,
  };
});
