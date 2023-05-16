import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
import { findById, makeAppendChildToParent } from '@/helpers';

export const useForumsStore = defineStore('ForumsStore', () => {
  const forums = reactive(sourceData.forums);

  const getForumById = (id) => findById(forums, id);

  const appendThreadToForum = makeAppendChildToParent({ parent: forums, child: 'threads' });

  const getForumsByCategoryId = (id) => forums.filter((forum) => forum.categoryId === id);

  return {
    forums, getForumById, getForumsByCategoryId, appendThreadToForum,
  };
});
