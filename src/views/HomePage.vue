<script setup>
import CategoryList from '@/components/CategoryList.vue';
import { onBeforeMount, ref } from 'vue';
import { DataProvider } from '@/data-provider/DataProvider';

const allCategories = ref(null);

const dataProvider = DataProvider.getInstance();

onBeforeMount(async () => {
  allCategories.value = await dataProvider.getAllCategories();
});
</script>

<template>
  <h1 class="push-top col-full">
    Welcome to the Forum
  </h1>
  <CategoryList
    v-if="allCategories"
    :categories="allCategories"
  />
</template>

<style scoped>

</style>
