import { defineStore } from 'pinia';
// eslint-disable-next-line import/no-cycle
import { useThreadsStore } from '@/stores/ThreadsStore';
// eslint-disable-next-line import/no-cycle
import { useUsersStore } from '@/stores/UsersStore';
import { db } from '@/config/firebase';
import {
  collection, getDocs, query, where, addDoc, doc, getDoc, updateDoc, orderBy,
} from 'firebase/firestore';

export const usePostsStore = defineStore('PostsStore', () => {
  const fetchPost = async (id) => {
    if (!id) {
      return null;
    }
    const postDocRef = doc(db, 'posts', id);
    const postDocSnap = await getDoc(postDocRef);
    if (postDocSnap.exists()) {
      const res = postDocSnap.data();
      return {
        id: postDocSnap.id,
        ...res,
      };
    }
    // eslint-disable-next-line no-console
    console.error(`No post with id ${id}`);
    return null;
  };

  const getPostsByThreadId = async (threadId) => {
    const postsCollection = collection(db, 'posts');
    const postsQuery = query(
      postsCollection,
      where('threadId', '==', threadId),
      orderBy('publishedAt', 'asc'),
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

  const updatePost = async ({ id, text }) => {
    const postDocRef = doc(db, 'posts', id);
    await updateDoc(postDocRef, {
      text,
    });
  };

  return {
    getPostsByThreadId, getPostsByUserId, createPost, fetchPost, updatePost,
  };
});
