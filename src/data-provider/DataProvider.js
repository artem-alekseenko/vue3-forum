import { useCategoriesStore } from '@/stores/CategoriesStore';
import { useForumsStore } from '@/stores/ForumsStore';

const forumsStore = useForumsStore();
const categoriesStore = useCategoriesStore();

export const getCategoryById = async (categoryId) => {
  await categoriesStore.fetchCategoryById(categoryId);

  return categoriesStore.currentCategory;
};

export const getAllCategories = async () => {
  await categoriesStore.fetchAllCategories();

  return categoriesStore.allCategories;
};

export const getForumsByCategoryId = async (categoryId) => forumsStore.getForumsByCategoryId(categoryId);
