<script setup>
import { useUsersStore } from '@/stores/UsersStore';
import {
  onBeforeMount, ref, watch,
} from 'vue';
import PostEditor from '@/components/PostEditor.vue';
import { usePostsStore } from '@/stores/PostsStore';
import { useAsyncDataLoadedStatus } from '@/composables/AsyncDataLoadedStatus';

const emit = defineEmits(['showEditor', 'updatePost']);

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
});

const editingPostId = ref(null);
const { isAsyncDataLoaded, setAsyncDataStatusLoaded } = useAsyncDataLoadedStatus();

const postsStore = usePostsStore();
const usersStore = useUsersStore();
const users = ref({});

const toggleEditMode = (postId) => {
  editingPostId.value = postId === editingPostId.value ? null : postId;
};

const handleUpdate = async ({ postText }) => {
  const updatedPost = await postsStore.updatePost({ id: editingPostId.value, text: postText });
  emit('updatePost', updatedPost);
  editingPostId.value = null;
};

onBeforeMount(async () => {
  await Promise.all(
    props.posts.map(async (post) => {
      if (!users.value[post.userId]) {
        users.value[post.userId] = await usersStore.user(post.userId);
      }
    }),
  );
  setAsyncDataStatusLoaded();
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
    v-if="isAsyncDataLoaded"
    class="post-list"
  >
    <div
      v-for="post in props.posts"
      :key="post.id"
      class="post"
    >
      <template v-if="isAsyncDataLoaded">
        <div class="user-info">
          <a
            href="#"
            class="user-name"
          >{{ users[post.userId]?.name }}</a>

          <a href="#">
            <img
              class="avatar-large"
              :src="users[post.userId].avatar"
              alt=""
            >
          </a>

          <p class="desktop-only text-small">
            {{ users[post.userId].postsCount }} posts
          </p>
          <p class="desktop-only text-small">
            {{ users[post.userId].threadsCount }} threads
          </p>
        </div>

        <div class="post-content">
          <div class="col-full">
            <post-editor
              v-if="editingPostId === post.id"
              :post="post"
              @save="handleUpdate"
            />
            <p v-else>
              {{ post.text }}
            </p>
          </div>
          <a
            v-if="usersStore.authUserId === post.userId"
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
          <div
            v-if="post.edited?.at"
            class="edition-info"
          >
            edited
          </div>
          <AppDate :timestamp="post.publishedAt" />
        </div>
      </template>
    </div>
  </div>
</template>
