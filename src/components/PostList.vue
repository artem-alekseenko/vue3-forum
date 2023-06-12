<script setup>
import { useUsersStore } from '@/stores/UsersStore';
import {
  onBeforeMount, ref, watch,
} from 'vue';

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['showEditor']);

const usersStore = useUsersStore();
const users = ref({});

onBeforeMount(async () => {
  await Promise.all(
    props.posts.map(async (post) => {
      if (!users.value[post.userId]) {
        users.value[post.userId] = await usersStore.user(post.userId);
      }
    }),
  );
});

watch(users.value, () => {
  emit('showEditor');
});

watch(
  () => props.posts,
  async () => {
    const { authUserId } = usersStore;
    users.value[authUserId] = await usersStore.user(authUserId);
  },
);

</script>

<template>
  <div
    v-if="Object.keys(users).length"
    class="post-list"
  >
    <div class="post"
      v-for="post in props.posts"
      :key="post.id"
    >
      <template v-if="post && users[post.userId]">
        <div class="user-info">
          <a href="#" class="user-name">{{users[post.userId].name}}</a>

          <a href="#">
            <img
                class="avatar-large" :src="users[post.userId].avatar" alt="">
          </a>

          <p class="desktop-only text-small">{{users[post.userId].postsCount}} posts</p>
          <p class="desktop-only text-small">{{users[post.userId].threadsCount}} threads</p>

        </div>

        <div class="post-content">
          <div>
            <p>
              {{post.text}}
            </p>
          </div>
        </div>

        <div class="post-date text-faded">
          <AppDate :timestamp="post.publishedAt" />
        </div>
      </template>

    </div>

  </div>
</template>
