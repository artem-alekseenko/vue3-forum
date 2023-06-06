<script setup>
import ThreadEditor from '@/components/ThreadEditor.vue';
import { useThreadsStore } from '@/stores/ThreadsStore';
import { ref, watchEffect } from 'vue';
import { usePostsStore } from '@/stores/PostsStore';
import { useRouter } from 'vue-router';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const text = ref('');
const firstPostId = ref('');
const postsStore = usePostsStore();
const thread = ref(null);
const threadsStore = useThreadsStore();
const threadPromise = threadsStore.thread(props.id);
watchEffect(async () => {
  thread.value = await threadPromise;
  [firstPostId.value] = thread.value.posts;
});
watchEffect(async () => {
  if (!firstPostId.value) return;
  const post = await postsStore.fetchPost(firstPostId.value);
  text.value = post.text;
});

const router = useRouter();

// eslint-disable-next-line no-shadow
const save = async ({ title, text }) => {
  // eslint-disable-next-line no-shadow
  const thread = await threadsStore.updateThread({
    title,
    text,
    threadId: props.id,
    postId: firstPostId.value,
  });

  await router.push({ name: 'ThreadShow', params: { id: thread.id } });
};

const cancel = () => {
  router.push({ name: 'ThreadShow', params: { id: props.id } });
};
</script>

<template>
  <div
    v-if="!thread && !text"
    class="text-center">
    Loading...
  </div>
  <div
      v-if="thread && text"
      class="col-full push-top"
  >
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor :title="thread.title" :text="text" @save="save" @cancel="cancel" />
  </div>
</template>
