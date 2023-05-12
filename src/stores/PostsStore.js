import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
// eslint-disable-next-line import/no-cycle
import { useThreadsStore } from '@/stores/ThreadsStore';
// eslint-disable-next-line import/no-cycle
import { useUsersStore } from '@/stores/UsersStore';

export const usePostsStore = defineStore('PostsStore', () => {
  const posts = reactive(sourceData.posts);

  // const getPostById = (id) => posts.find((post) => post.id === id);
  const getPostsByThreadId = (threadId) => posts.filter((post) => post.threadId === threadId);
  const getPostsByUserId = (userId) => posts.filter((post) => post.userId === userId);

  const appendPostToThread = ({ postId, threadId }) => {
    const threadsStore = useThreadsStore();
    const thread = threadsStore.getThreadById(threadId);
    thread.posts = thread.posts || [];
    thread.posts.push(postId);
  };

  const preparePost = ({ text, threadId }) => {
    const usersStore = useUsersStore();
    const { authUser } = usersStore;
    const postId = `ggqq${Math.random()}`;

    return {
      id: postId,
      publishedAt: Math.floor(Date.now() / 1000),
      userId: authUser.id,
      text,
      threadId,
    };
  };

  const setPost = async (post) => {
    const index = posts.findIndex((p) => p.id === post.id);
    if (index === -1) {
      posts.push(post);
    } else {
      posts[index] = post;
    }
  };

  const createPost = async ({ text, threadId }) => {
    const post = preparePost({ text, threadId });

    await setPost(post);

    appendPostToThread({ postId: post.id, threadId });
  };

  return {
    posts, getPostsByThreadId, getPostsByUserId, createPost,
  };
});
