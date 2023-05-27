import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const useCategoriesStore = defineStore('CategoriesStore', () => {
  const categories = reactive(sourceData.categories);

  const getCategoryById = async (id) => {
    const categoryDocRef = doc(db, 'categories', id);
    const categoryDocSnap = await getDoc(categoryDocRef);
    if (categoryDocSnap.exists()) {
      const res = categoryDocSnap.data();
      return {
        id: categoryDocSnap.id,
        ...res,
      };
    }
    // eslint-disable-next-line no-console
    console.error(`No category with id ${id}`);
    return null;
  };

  return { categories, getCategoryById };
});
