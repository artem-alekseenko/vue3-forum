<script setup>
import { ref, watchEffect } from 'vue';
import { useForumsStore } from '@/stores/ForumsStore';
import { useRouter } from 'vue-router';
import { useThreadsStore } from '@/stores/ThreadsStore';
import ThreadEditor from '@/components/ThreadEditor.vue';

const props = defineProps({
  forumId: {
    type: String,
    required: true,
  },
});

const forum = ref(null);
const forumsStore = useForumsStore();
const forumPromise = forumsStore.forum(props.forumId);
watchEffect(async () => {
  forum.value = await forumPromise;
});

const router = useRouter();

const save = async ({ title, text }) => {
  const threadsStore = useThreadsStore();
  const thread = await threadsStore.createThread({
    title,
    text,
    forumId: props.forumId,
  });

  await router.push({ name: 'ThreadShow', params: { id: thread.id } });
};

const cancel = () => {
  router.push({ name: 'Forum', params: { id: props.forumId } });
};
</script>

<template>
  <div
      v-if="!forum"
      class="text-center">
    Loading...
  </div>
  <div
      v-else
      class="col-full push-top"
  >
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor @save="save" @cancel="cancel"/>
  </div>
</template>

<style scoped>

</style>
