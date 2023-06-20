<script setup>
import CategoryList from '@/components/CategoryList.vue';
import { onBeforeMount, ref } from 'vue';
import { DataProvider } from '@/data-provider/DataProvider';
import { useAsyncDataLoadedStatus } from '@/composables/AsyncDataLoadedStatus';

const allCategories = ref(null);
const { isAsyncDataLoaded, setAsyncDataStatusLoaded } = useAsyncDataLoadedStatus();

const dataProvider = DataProvider.getInstance();

onBeforeMount(async () => {
  allCategories.value = await dataProvider.getAllCategories();
  setAsyncDataStatusLoaded();
});
</script>

<template>
  <template v-if="isAsyncDataLoaded">
    <h1 class="push-top col-full">
      Welcome to the Forum
    </h1>
    <CategoryList :categories="allCategories" />
  </template>
</template>

<style scoped>

</style>
