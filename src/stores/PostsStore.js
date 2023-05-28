import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
// eslint-disable-next-line import/no-cycle
import { useThreadsStore } from '@/stores/ThreadsStore';
// eslint-disable-next-line import/no-cycle
import { useUsersStore } from '@/stores/UsersStore';
import { findById, upsert } from '@/helpers';
import { db } from '@/config/firebase';
import {
  collection, getDocs, query, where,
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
  const getPostsByUserId = (userId) => posts.filter((post) => post.userId === userId);

  const preparePost = ({ text, threadId }) => {
    const usersStore = useUsersStore();
    const { authUser } = usersStore;
    const postId = `post_${Math.random()}`;

    return {
      id: postId,
      publishedAt: Math.floor(Date.now() / 1000),
      userId: authUser.id,
      text,
      threadId,
    };
  };

  const setPost = async (post) => upsert(posts, post);

  const createPost = async ({ text, threadId }) => {
    const post = preparePost({ text, threadId });

    await setPost(post);

    const threadsStore = useThreadsStore();
    threadsStore.appendPostToThread({ parentId: threadId, childId: post.id });
    threadsStore.appendContributorToThread({ parentId: threadId, childId: post.userId });
  };

  return {
    posts, getPostById, getPostsByThreadId, getPostsByUserId, createPost,
  };
});
