<script setup>
import { usePostsStore } from '@/stores/PostsStore';
import { useThreadsStore } from '@/stores/ThreadsStore';
import PostList from '@/components/PostList.vue';
import { computed } from 'vue';
import PostEditor from '@/components/PostEditor.vue';

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});

const threadsStore = useThreadsStore();
const thread = threadsStore.getThreadById(props.id);

const postsStore = usePostsStore();
const threadPosts = computed(() => postsStore.getPostsByThreadId(props.id));

const addPost = async (text) => {
  await postsStore.createPost({ text, threadId: props.id });
};
</script>

<template>
    <div class="col-large push-top">
      <h1>
        {{ thread.title }}
        <router-link :to="{ name: 'ThreadEdit', id: this.id }">
          <button class="btn-green btn-small">Edit Thread</button>
        </router-link>
      </h1>

        <post-list :posts="threadPosts" />

        <post-editor @save="addPost" />
    </div>
</template>
