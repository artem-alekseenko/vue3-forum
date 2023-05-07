<script setup>
import { useCategoriesStore } from '@/stores/CategoriesStore';
import CategoryList from '@/components/CategoryList.vue';

const categoriesStore = useCategoriesStore();
const { categories } = categoriesStore;
</script>

<template>
    <h1>Welcome to the Forum</h1>
    <CategoryList :categories="categories"/>
</template>

<style scoped>

</style>
