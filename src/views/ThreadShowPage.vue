<script setup>
import { usePostsStore } from '@/stores/PostsStore';
import { useThreadsStore } from '@/stores/ThreadsStore';
import PostList from '@/components/PostList.vue';
import { ref, watchEffect } from 'vue';
import PostEditor from '@/components/PostEditor.vue';
import { useAsyncDataLoadedStatus } from '@/composables/AsyncDataLoadedStatus';

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});

const isEditorVisible = ref(false);
const thread = ref(null);
const threadPosts = ref([]);
const { isAsyncDataLoaded, setAsyncDataStatusLoaded } = useAsyncDataLoadedStatus();

const threadsStore = useThreadsStore();
const threadPromise = threadsStore.thread(props.id);
watchEffect(async () => {
  thread.value = await threadPromise;
});

const postsStore = usePostsStore();
const getThreadPosts = async () => postsStore.getPostsByThreadId(props.id);
watchEffect(async () => {
  threadPosts.value = await getThreadPosts();
});

watchEffect(() => {
  if (thread.value && threadPosts.value.length) {
    setAsyncDataStatusLoaded();
  }
});

const addPost = async ({ text }) => {
  await postsStore.createPost({ text, threadId: props.id });
  threadPosts.value = await getThreadPosts();
};

const updatePost = (updatedPost) => {
  const postIndex = threadPosts.value.findIndex((post) => post.id === updatedPost.id);
  threadPosts.value.splice(postIndex, 1, updatedPost);
};
</script>

<template>
  <template v-if="isAsyncDataLoaded">
    <div class="col-large push-top">
      <div>
        <h1>
          {{ thread.title }}
        </h1>

        <router-link :to="{ name: 'ThreadEdit', id: id }">
          <button class="btn-green btn-small">
            Edit Thread
          </button>
        </router-link>
      </div>
      <p>
        By <a
          href="#"
          class="link-unstyled"
        >{{ thread.author?.name }}</a>, <AppDate :timestamp="thread.publishedAt" />.
        <span
          style="float:right; margin-top: 2px;"
          class="hide-mobile text-faded text-small"
        >
          {{ thread.repliesCount }} replies by {{ thread.contributorsCount }} contributors
        </span>
      </p>

      <post-list
        :posts="threadPosts"
        @show-editor.once="isEditorVisible = true"
        @update-post="updatePost"
      />

      <post-editor
        v-if="isEditorVisible"
        @save="addPost"
      />
    </div>
  </template>
</template>
