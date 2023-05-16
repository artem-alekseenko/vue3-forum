import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
// eslint-disable-next-line import/no-cycle
import { useUsersStore } from '@/stores/UsersStore';
import { useForumsStore } from '@/stores/ForumsStore';
// eslint-disable-next-line import/no-cycle
import { usePostsStore } from '@/stores/PostsStore';
import { findById, makeAppendChildToParent, upsert } from '@/helpers';

export const useThreadsStore = defineStore('ThreadsStore', () => {
  const threads = reactive(sourceData.threads);

  const getThreadById = (id) => {
    const thread = findById(threads, id);

    return {
      ...thread,
      get author() {
        return useUsersStore().getUserById(thread.userId);
      },
      get repliesCount() {
        return (thread.posts?.length || 1) - 1;
      },
      get contributorsCount() {
        return thread.contributors?.length || 0;
      },
    };
  };

  const getThreadsByForumId = (id) => threads.filter((thread) => thread.forumId === id);
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

  const setThread = async (thread) => upsert(threads, thread);

  const appendPostToThread = makeAppendChildToParent({ parent: threads, child: 'posts' });

  const appendContributorToThread = makeAppendChildToParent({ parent: threads, child: 'contributors' });

  const createThread = async ({ text, title, forumId }) => {
    const thread = prepareThread({ title, forumId });

    await setThread(thread);

    const forumsStore = useForumsStore();
    forumsStore.appendThreadToForum({ parentId: forumId, childId: thread.id });

    const postsStore = usePostsStore();
    await postsStore.createPost({ text, threadId: thread.id });

    return getThreadById(thread.id);
  };

  const updateThread = async ({ id, title, text }) => {
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
    getThreadsByForumId,
    getThreadsByUserId,
    createThread,
    updateThread,
    appendContributorToThread,
    appendPostToThread,
  };
});
