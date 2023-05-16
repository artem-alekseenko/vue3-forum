import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
import { findById } from '@/helpers';

export const useCategoriesStore = defineStore('CategoriesStore', () => {
  const categories = reactive(sourceData.categories);

  const getCategoryById = (id) => findById(categories, id);

  return { categories, getCategoryById };
});
