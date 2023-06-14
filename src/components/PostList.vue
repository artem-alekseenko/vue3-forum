<script setup>
import { useUsersStore } from '@/stores/UsersStore';
import {
  onBeforeMount, ref, watch,
} from 'vue';
import PostEditor from '@/components/PostEditor.vue';

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
});

const editingPostId = ref(null);

const emit = defineEmits(['showEditor']);

const usersStore = useUsersStore();
const users = ref({});

const toggleEditMode = (postId) => {
  editingPostId.value = postId === editingPostId.value ? null : postId;
};

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
          <div class="col-full">
            <PostEditor
              v-if="editingPostId === post.id"
              :post="post"
            />
            <p v-else>
              {{post.text}}
            </p>
          </div>
          <a
            href="#"
            style="margin-left: auto; padding-left:10px;"
            class="link-unstyled"
            title="Make a change"
            @click.prevent="toggleEditMode(post.id)"
          >
            <fa-icon icon="pencil-alt" />
          </a>
        </div>

        <div class="post-date text-faded">
          <AppDate :timestamp="post.publishedAt" />
        </div>
      </template>
    </div>
  </div>
</template>
