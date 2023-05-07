<script setup>
import { useCategoriesStore } from '@/stores/CategoriesStore';
import CategoryList from '@/components/CategoryList.vue';
import { storeToRefs } from 'pinia';

const { categories } = storeToRefs(useCategoriesStore());
</script>

<template>
  <h1 class="push-top">Welcome to the Forum</h1>
  <CategoryList :categories="categories"/>
</template>

<style scoped>

</style>
