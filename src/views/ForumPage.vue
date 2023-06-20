<script setup>
import ThreadList from '@/components/ThreadList.vue';
import { useForumsStore } from '@/stores/ForumsStore';
import { useThreadsStore } from '@/stores/ThreadsStore';
import { ref, watchEffect } from 'vue';
import { useAsyncDataLoadedStatus } from '@/composables/AsyncDataLoadedStatus';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const forum = ref(null);
const threads = ref([]);
const { isAsyncDataLoaded, setAsyncDataStatusLoaded } = useAsyncDataLoadedStatus();

const forumsStore = useForumsStore();
const forumPromise = forumsStore.forum(props.id);
watchEffect(async () => {
  forum.value = await forumPromise;
});

const threadsStore = useThreadsStore();
const threadsPromise = threadsStore.fetchThreadsByForumId(props.id);
watchEffect(async () => {
  threads.value = await threadsPromise;
});

watchEffect(() => {
  if (forum.value && threads.value) {
    setAsyncDataStatusLoaded();
  }
});
</script>

<template>
  <template v-if="isAsyncDataLoaded">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">
            {{ forum.description }}
          </p>
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
      <ThreadList :threads="threads" />
    </div>
  </template>
</template>
