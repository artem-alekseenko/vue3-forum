import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
// eslint-disable-next-line import/no-cycle
import { useUsersStore } from '@/stores/UsersStore';
import { useForumsStore } from '@/stores/ForumsStore';
// eslint-disable-next-line import/no-cycle
import { usePostsStore } from '@/stores/PostsStore';

export const useThreadsStore = defineStore('ThreadsStore', () => {
  const threads = reactive(sourceData.threads);

  const getThreadById = (id) => threads.find((thread) => thread.id === id);
  const getThreadsByForumId = (id) => threads.filter((thread) => thread.forumId === id);
  const getThreadsByUserId = (id) => threads.filter((thread) => thread.userId === id);

  const prepareThread = ({ title, forumId }) => {
    const { authUser } = useUsersStore();
    const threadId = `tttt${Math.random()}`;

    return {
      id: threadId,
      publishedAt: Math.floor(Date.now() / 1000),
      userId: authUser.id,
      title,
      forumId,
    };
  };

  const setThread = async (thread) => {
    const index = threads.findIndex((t) => t.id === thread.id);
    if (index === -1) {
      threads.push(thread);
    } else {
      threads[index] = thread;
    }
  };

  const appendThreadToForum = ({ forumId, threadId }) => {
    const forumsStore = useForumsStore();
    const forum = forumsStore.getForumById(forumId);
    forum.threads = forum.threads || [];
    forum.threads.push(threadId);
  };

  const createThread = async ({ text, title, forumId }) => {
    const thread = prepareThread({ title, forumId });

    await setThread(thread);

    appendThreadToForum({ forumId, threadId: thread.id });

    const postsStore = usePostsStore();
    await postsStore.createPost({ text, threadId: thread.id });

    return getThreadById(thread.id);
  };

  return {
    threads, getThreadById, getThreadsByForumId, getThreadsByUserId, createThread,
  };
});
