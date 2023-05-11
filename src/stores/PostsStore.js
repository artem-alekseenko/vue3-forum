import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
import { useThreadsStore } from '@/stores/ThreadsStore';
// eslint-disable-next-line import/no-cycle
import { useUsersStore } from '@/stores/UsersStore';

export const usePostsStore = defineStore('PostsStore', () => {
  const posts = reactive(sourceData.posts);

  const getPostById = (id) => posts.find((post) => post.id === id);
  const getPostsByThreadId = (threadId) => posts.filter((post) => post.threadId === threadId);
  const getPostsByUserId = (userId) => posts.filter((post) => post.userId === userId);

  const appendPostToThread = ({ postId, threadId }) => {
    const threadsStore = useThreadsStore();
    const thread = threadsStore.getThreadById(threadId);
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

  const setPost = async ({ text, threadId }) => {
    const post = preparePost({ text, threadId });

    const index = posts.findIndex((p) => p.id === post.id);
    if (index === -1) {
      posts.push(post);
    } else {
      posts[index] = post;
    }

    return post.id;
  };

  return {
    posts, getPostById, getPostsByThreadId, setPost, appendPostToThread, getPostsByUserId,
  };
});
