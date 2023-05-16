<script setup>
import ThreadEditor from '@/components/ThreadEditor.vue';
import { useThreadsStore } from '@/stores/ThreadsStore';
import { computed } from 'vue';
import { usePostsStore } from '@/stores/PostsStore';
import { useRouter } from 'vue-router';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const thread = useThreadsStore().thread(props.id);

const text = computed(() => {
  const post = usePostsStore().getPostById(thread.posts[0]);
  return post.text;
});

const router = useRouter();

// eslint-disable-next-line no-shadow
const save = async ({ title, text }) => {
  const threadsStore = useThreadsStore();
  // eslint-disable-next-line no-shadow
  const thread = await threadsStore.updateThread({
    title,
    text,
    id: props.id,
  });

  await router.push({ name: 'ThreadShow', params: { id: thread.id } });
};

const cancel = () => {
  router.push({ name: 'ThreadShow', params: { id: props.id } });
};
</script>

<template>
  <div class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor :title="thread.title" :text="text" @save="save" @cancel="cancel" />
  </div>
</template>
