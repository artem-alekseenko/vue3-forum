<script setup>
import { useUsersStore } from '@/stores/UsersStore';

const props = defineProps({
  threads: {
    type: Array,
    required: true,
  },
});

const usersStore = useUsersStore();
const userById = (userId) => usersStore.getUserById(userId);
</script>

<template>
      <div class="thread-list">

          <h2 class="list-title">Threads</h2>

          <div v-for="thread in props.threads" :key="thread.id" class="thread">
              <div>
                  <p>
                    <router-link :to="{name: 'ThreadShow', params: {id: thread.id}}">{{ thread.title }}</router-link>
                  </p>
                <p class="text-faded text-xsmall">
                  By <a href="#">{{ userById(thread.userId).name }}</a>, <AppDate :timestamp="thread.publishedAt" />.
                </p>
              </div>

              <div class="activity">
                  <p class="replies-count">
                    {{ thread.repliesCount }} replies
                  </p>

                  <img class="avatar-medium" :src="userById(thread.userId).avatar" alt="">

                  <div>
                      <p class="text-xsmall">
                          <a href="#">{{ userById(thread.userId).name }}</a>
                      </p>
                      <p class="text-xsmall text-faded">
                        <AppDate :timestamp="thread.publishedAt" />
                      </p>
                  </div>
              </div>
          </div>

      </div>
</template>

<style scoped>

</style>
