<script setup>
import { usePostsStore } from '@/stores/PostsStore';
import { useThreadsStore } from '@/stores/ThreadsStore';
import PostList from '@/components/PostList.vue';
import { ref, watchEffect } from 'vue';
import PostEditor from '@/components/PostEditor.vue';

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});

const thread = ref(null);
const threadsStore = useThreadsStore();
const threadPromise = threadsStore.thread(props.id);
watchEffect(async () => {
  thread.value = await threadPromise;
});

const threadPosts = ref([]);
const postsStore = usePostsStore();
const getThreadPosts = async () => postsStore.getPostsByThreadId(props.id);
watchEffect(async () => {
  threadPosts.value = await getThreadPosts();
});

const addPost = async (text) => {
  await postsStore.createPost({ text, threadId: props.id });
  threadPosts.value = await getThreadPosts();
};
</script>

<template>
  <div
      v-if="!thread"
      class="text-center"
  >
    Loading...
  </div>
  <template v-if="thread">
    <div class="col-large push-top">
      <div>
        <h1>
          {{ thread.title }}
        </h1>

        <router-link :to="{ name: 'ThreadEdit', id: this.id }">
          <button class="btn-green btn-small">Edit Thread</button>
        </router-link>
      </div>
      <p>
        By <a href="#" class="link-unstyled">{{thread.author?.name}}</a>, <AppDate :timestamp="thread.publishedAt" />.
        <span
            style="float:right; margin-top: 2px;"
            class="hide-mobile text-faded text-small"
        >
          {{thread.repliesCount}} replies by {{thread.contributorsCount}} contributors
        </span>
      </p>

      <post-list :posts="threadPosts" />

      <post-editor @save="addPost" />
    </div>
  </template>
</template>
