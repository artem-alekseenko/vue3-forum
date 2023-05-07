import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';

export const useCategoriesStore = defineStore('CategoriesStore', () => {
  const categories = reactive(sourceData.categories);

  return { categories };
});
