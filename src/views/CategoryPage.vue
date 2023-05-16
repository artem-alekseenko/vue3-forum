<script setup>
import ForumList from '@/components/ForumList.vue';
import { useCategoriesStore } from '@/stores/CategoriesStore';
import { useForumsStore } from '@/stores/ForumsStore';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const categoriesStore = useCategoriesStore();
const category = categoriesStore.getCategoryById(props.id);

const forumsStore = useForumsStore();
const getForumsForCategory = (categoryData) => forumsStore.getForumsByCategoryId(categoryData.id);
</script>

<template>
  <h1 class="push-top col-full">{{ category.name }}</h1>
  <ForumList
      :title="category.name"
      :forums="getForumsForCategory(category)"
  />
</template>
