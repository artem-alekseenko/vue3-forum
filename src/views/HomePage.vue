<script setup>
import { useCategoriesStore } from '@/stores/CategoriesStore';
import CategoryList from '@/components/CategoryList.vue';
import { ref, watchEffect } from 'vue';

const categories = ref([]);
const categoriesStore = useCategoriesStore();
watchEffect(async () => {
  categories.value = await categoriesStore.categories();
});
</script>

<template>
  <h1 class="push-top col-full">Welcome to the Forum</h1>
  <CategoryList :categories="categories"/>
</template>

<style scoped>

</style>
