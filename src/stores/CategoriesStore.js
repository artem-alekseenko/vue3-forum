import { defineStore } from 'pinia';
import {
  collection, doc, getDoc, getDocs,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ref } from 'vue';

export const useCategoriesStore = defineStore('CategoriesStore', () => {
  // state
  const allCategories = ref([]);
  const currentCategory = ref(null);

  // actions
  const fetchAllCategories = async () => {
    const categoriesCollection = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesCollection);

    const promises = categoriesSnapshot.docs.map(async (document) => {
      const data = document.data();
      return {
        id: document.id,
        ...data,
      };
    });

    const res = await Promise.all(promises);
    allCategories.value.push(...res);
  };

  const fetchCategoryById = async (id) => {
    const categoryDocRef = doc(db, 'categories', id);
    const categoryDocSnap = await getDoc(categoryDocRef);
    if (categoryDocSnap.exists()) {
      const res = categoryDocSnap.data();
      currentCategory.value = {
        id: categoryDocSnap.id,
        ...res,
      };
      return;
    }
    // eslint-disable-next-line no-console
    console.error(`No category with id ${id}`);
  };

  return {
    fetchAllCategories, fetchCategoryById, allCategories, currentCategory,
  };
});
