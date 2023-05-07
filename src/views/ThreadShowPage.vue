<script setup>
import { usePostsStore } from '@/stores/PostsStore';
import { useThreadsStore } from '@/stores/ThreadsStore';
import PostList from '@/components/PostList.vue';

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});

const threadsStore = useThreadsStore();
const thread = threadsStore.getThreadById(props.id);

const postsStore = usePostsStore();
const threadPosts = postsStore.getPostsByThreadId(props.id);
</script>

<template>
    <div class="col-large push-top">`
        <h1>{{ thread.title }}</h1>
      <post-list :posts="threadPosts"/>
    </div>
</template>
