import { useCategoriesStore } from '@/stores/CategoriesStore';
import { useForumsStore } from '@/stores/ForumsStore';
import { useUsersStore } from '@/stores/UsersStore';

const singletonEnforcer = Symbol('singletonEnforcer');
let dataProviderInstance = null;

export class DataProvider {
  constructor(enforcer) {
    if (!enforcer) {
      throw new Error('Cannot construct singleton');
    }

    this.categoriesStore = useCategoriesStore();
    this.forumsStore = useForumsStore();
    this.usersStore = useUsersStore();
  }

  // Categories
  async getAllCategories() {
    await this.categoriesStore.fetchAllCategories();

    return this.categoriesStore.allCategories;
  }

  async getCategoryById(categoryId) {
    await this.categoriesStore.fetchCategoryById(categoryId);

    return this.categoriesStore.currentCategory;
  }

  // Forums
  async getForumsByCategoryId(categoryId) {
    return this.forumsStore.getForumsByCategoryId(categoryId);
  }

  // Users
  async getAuthUser() {
    return this.usersStore.getAuthUser();
  }

  // eslint-disable-next-line class-methods-use-this
  async registerUser(user) {
    console.log('registerUser', user);
    return 'registerUser';
  }

  static getInstance() {
    if (!dataProviderInstance) {
      dataProviderInstance = new DataProvider(singletonEnforcer);
    }
    return dataProviderInstance;
  }
}
