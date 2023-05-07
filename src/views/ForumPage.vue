<script setup>
import ThreadList from '@/components/ThreadList.vue';
import { useForumsStore } from '@/stores/ForumsStore';
import { useThreadsStore } from '@/stores/ThreadsStore';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const forumsStore = useForumsStore();
const forum = forumsStore.getForumById(props.id);

const threadsStore = useThreadsStore();
const threads = threadsStore.getThreadsByForumId(props.id);
</script>

<template>
  <div class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <a href="new-thread.html" class="btn-green btn-small">Start a thread</a>
    </div>
  </div>

  <div class="col-full push-top">
    <ThreadList :threads="threads"/>
  </div>
</template>
