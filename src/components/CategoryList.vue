<script setup>
import ForumList from '@/components/ForumList.vue';
import { useForumsStore } from '@/stores/ForumsStore';

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
});

const forumsStore = useForumsStore();
const getForumsForCategory = (category) => forumsStore.getForumsByCategoryId(category.id);
</script>

<template>
  <ForumList
      v-for="category in props.categories"
      :key="category.id"
      :forums="getForumsForCategory(category)"
      :title="category.name"
      :category-id="category.id"
  />
</template>
