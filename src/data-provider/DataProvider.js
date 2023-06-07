import { useCategoriesStore } from '@/stores/CategoriesStore';
import { useForumsStore } from '@/stores/ForumsStore';

const singletonEnforcer = Symbol('singletonEnforcer');
let dataProviderInstance = null;

export class DataProvider {
  constructor(enforcer) {
    if (!enforcer) {
      throw new Error('Cannot construct singleton');
    }

    this.categoriesStore = useCategoriesStore();
    this.forumsStore = useForumsStore();
  }

  async getAllCategories() {
    await this.categoriesStore.fetchAllCategories();

    return this.categoriesStore.allCategories;
  }

  async getCategoryById(categoryId) {
    await this.categoriesStore.fetchCategoryById(categoryId);

    return this.categoriesStore.currentCategory;
  }

  async getForumsByCategoryId(categoryId) {
    return this.forumsStore.getForumsByCategoryId(categoryId);
  }

  static getInstance() {
    if (!dataProviderInstance) {
      dataProviderInstance = new DataProvider(singletonEnforcer);
    }
    return dataProviderInstance;
  }
}
