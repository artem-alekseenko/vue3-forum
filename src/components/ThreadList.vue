<script setup>
import { useUsersStore } from '@/stores/UsersStore';
import { ref, watchEffect } from 'vue';

const props = defineProps({
  threads: {
    type: Array,
    required: true,
  },
});

// TODO: use composable AsyncDataLoadedStatus
const isLoading = ref(true);

const usersStore = useUsersStore();
const users = ref({});
watchEffect(async () => {
  isLoading.value = true;
  await Promise.all(
    props.threads.map(async (thread) => {
      if (!users.value[thread.userId]) {
        users.value[thread.userId] = await usersStore.fetchUser(thread.userId);
      }
    }),
  );
  isLoading.value = false;
});
</script>

<template>
  <div
    v-if="!isLoading"
    class="thread-list"
  >
    <h2 class="list-title">
      Threads
    </h2>

    <div
      v-for="thread in props.threads"
      :key="thread.id"
      class="thread"
    >
      <div>
        <p>
          <router-link :to="{name: 'ThreadShow', params: {id: thread.id}}">
            {{ thread.title }}
          </router-link>
        </p>
        <p class="text-faded text-xsmall">
          By <a href="#">{{ users[thread.userId].name }}</a>, <AppDate :timestamp="thread.publishedAt" />.
        </p>
      </div>

      <div class="activity">
        <p class="replies-count">
          {{ thread.repliesCount }} replies
        </p>

        <img
          class="avatar-medium"
          :src="users[thread.userId].avatar"
          alt=""
        >

        <div>
          <p class="text-xsmall">
            <a href="#">{{ users[thread.userId].name }}</a>
          </p>
          <p class="text-xsmall text-faded">
            <AppDate :timestamp="thread.publishedAt" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
