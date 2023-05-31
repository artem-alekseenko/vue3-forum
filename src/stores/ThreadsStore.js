import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
// eslint-disable-next-line import/no-cycle
import { useUsersStore } from '@/stores/UsersStore';
import { useForumsStore } from '@/stores/ForumsStore';
// eslint-disable-next-line import/no-cycle
import { usePostsStore } from '@/stores/PostsStore';
import { findById } from '@/helpers';
import {
  collection, doc, getDoc, getDocs, query, where, updateDoc, arrayUnion, addDoc,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export const useThreadsStore = defineStore('ThreadsStore', () => {
  const threads = reactive(sourceData.threads);

  const getThreadById = (id) => findById(threads, id);

  const fetchThread = async (id) => {
    const threadDocRef = doc(db, 'threads', id);
    const threadDocSnap = await getDoc(threadDocRef);
    if (threadDocSnap.exists()) {
      const res = threadDocSnap.data();
      return {
        id: threadDocSnap.id,
        ...res,
      };
    }
    // eslint-disable-next-line no-console
    console.error(`No thread with id ${id}`);
    return null;
  };

  const thread = async (id) => {
    const threadFromDb = await fetchThread(id);

    if (!threadFromDb) {
      return null;
    }

    const authorPromise = useUsersStore().fetchUser(threadFromDb.userId);
    const author = await authorPromise;

    return {
      ...threadFromDb,
      get author() {
        return author;
      },
      get repliesCount() {
        return (threadFromDb.posts?.length || 1) - 1;
      },
      get contributorsCount() {
        return threadFromDb.contributors?.length || 0;
      },
    };
  };

  // eslint-disable-next-line no-shadow
  const getThreadsByForumId = (id) => threads.filter((thread) => thread.forumId === id);

  const getThreadsByUserId = async (id) => {
    const threadsCollection = collection(db, 'threads');
    const threadsQuery = query(
      threadsCollection,
      where('userId', '==', id),
    );
    const threadsSnapshot = await getDocs(threadsQuery);

    const threadsPromises = threadsSnapshot.docs.map(async (threadDoc) => {
      const data = threadDoc.data();
      return {
        id: threadDoc.id,
        ...data,
      };
    });

    return Promise.all(threadsPromises);
  };

  const prepareThread = ({ title, forumId }) => ({
    publishedAt: Math.floor(Date.now() / 1000),
    userId: useUsersStore().authUserId,
    title,
    forumId,
  });

  const appendPostToThread = async ({ threadId, childId }) => {
    const threadDocRef = doc(db, 'threads', threadId);

    await updateDoc(threadDocRef, {
      posts: arrayUnion(childId),
    });
  };

  const appendContributorToThread = async ({ threadId, userId }) => {
    const threadDocRef = doc(db, 'threads', threadId);

    await updateDoc(threadDocRef, {
      contributors: arrayUnion(userId),
    });
  };

  const createThread = async ({ text, title, forumId }) => {
    const newThread = prepareThread({ title, forumId });

    const threadsCollection = collection(db, 'threads');
    const newThreadDocRef = await addDoc(threadsCollection, newThread);

    newThread.id = newThreadDocRef.id;

    const forumsStore = useForumsStore();
    await forumsStore.appendThreadToForum({ forumId, threadId: newThread.id });

    const postsStore = usePostsStore();
    await postsStore.createPost({ text, threadId: newThread.id });

    return newThread;
  };

  const updateThread = async ({ id, title, text }) => {
    // eslint-disable-next-line no-shadow
    const thread = getThreadById(id);
    thread.title = title;

    const postsStore = usePostsStore();
    const post = postsStore.getPostById(thread.posts[0]);
    post.text = text;

    return thread;
  };

  return {
    thread,
    getThreadsByForumId,
    getThreadsByUserId,
    createThread,
    updateThread,
    appendContributorToThread,
    appendPostToThread,
  };
});
