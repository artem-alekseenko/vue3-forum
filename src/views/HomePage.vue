<script setup>
import sourceData from '@/data.json';
import { reactive } from 'vue';

const threads = reactive(sourceData.threads);
const posts = reactive(sourceData.posts);
const users = reactive(sourceData.users);

const postById = (postId) => posts.find((p) => p.id === postId);
const userById = (userId) => users.find((p) => p.id === userId);
</script>

<template>
  <div>Hello from page home</div>
  <div
    v-for="thread in threads"
    :key="thread.id"
  >
    <h2>{{ thread.title }}</h2>
    <div
      v-for="postId in thread.posts"
      :key="postId"
    >
      <p>{{ userById(postById(postId).userId).name }}</p>
      <p>{{ postById(postId).text }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>
