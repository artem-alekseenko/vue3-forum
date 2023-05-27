import { defineStore } from 'pinia';
import {
  collection, doc, getDoc, getDocs,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export const useCategoriesStore = defineStore('CategoriesStore', () => {
  const categories = async () => {
    const categoriesCollection = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesCollection);

    const promises = categoriesSnapshot.docs.map(async (document) => {
      const data = document.data();
      return {
        id: document.id,
        ...data,
      };
    });

    return Promise.all(promises);
  };

  const category = async (id) => {
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

  return { categories, category };
});
