<script setup>
import { computed } from 'vue';
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

const forumsStore = useForumsStore();
const forum = computed(() => forumsStore.getForumById(props.forumId));

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
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor @save="save" @cancel="cancel"/>
  </div>
</template>

<style scoped>

</style>
