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
const forum = forumsStore.forum(props.id);

const threadsStore = useThreadsStore();
const threads = forum.threadIds.map((threadId) => threadsStore.thread(threadId));
</script>

<template>
  <div class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link
          :to="{name:'ThreadCreate', params: {forumId: forum.id}}"
          class="btn-green btn-small"
      >
        Start a thread
      </router-link>
    </div>
  </div>

  <div class="col-full push-top">
    <ThreadList :threads="threads"/>
  </div>
</template>
