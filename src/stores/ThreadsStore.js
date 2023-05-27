import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
// eslint-disable-next-line import/no-cycle
import { useUsersStore } from '@/stores/UsersStore';
import { useForumsStore } from '@/stores/ForumsStore';
// eslint-disable-next-line import/no-cycle
import { usePostsStore } from '@/stores/PostsStore';
import { findById, makeAppendChildToParent, upsert } from '@/helpers';
import {
  doc, getDoc,
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

    const authorPromise = useUsersStore().getUserById(threadFromDb.userId);
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
  // eslint-disable-next-line no-shadow
  const getThreadsByUserId = (id) => threads.filter((thread) => thread.userId === id);

  const prepareThread = ({ title, forumId }) => {
    const { authUser } = useUsersStore();
    const threadId = `thread_${Math.random()}`;

    return {
      id: threadId,
      publishedAt: Math.floor(Date.now() / 1000),
      userId: authUser.id,
      title,
      forumId,
    };
  };

  // eslint-disable-next-line no-shadow
  const setThread = async (thread) => upsert(threads, thread);

  const appendPostToThread = makeAppendChildToParent({ parent: threads, child: 'posts' });

  const appendContributorToThread = makeAppendChildToParent({ parent: threads, child: 'contributors' });

  const createThread = async ({ text, title, forumId }) => {
    // eslint-disable-next-line no-shadow
    const thread = prepareThread({ title, forumId });

    await setThread(thread);

    const forumsStore = useForumsStore();
    forumsStore.appendThreadToForum({ parentId: forumId, childId: thread.id });

    const postsStore = usePostsStore();
    await postsStore.createPost({ text, threadId: thread.id });

    return getThreadById(thread.id);
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
    threads,
    getThreadById,
    thread,
    getThreadsByForumId,
    getThreadsByUserId,
    createThread,
    updateThread,
    appendContributorToThread,
    appendPostToThread,
  };
});
