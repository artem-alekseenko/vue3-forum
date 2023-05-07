<script setup>
import ForumList from '@/components/ForumList.vue';
import { useForumsStore } from '@/stores/ForumsStore';

const forumsStore = useForumsStore();
const { forums } = forumsStore;
</script>

<template>
    <h1>Welcome to the Forum</h1>
    <ForumList :forums="forums"/>
</template>

<style scoped>

</style>
