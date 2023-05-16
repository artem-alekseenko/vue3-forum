import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
import { findById, makeAppendChildToParent } from '@/helpers';

export const useForumsStore = defineStore('ForumsStore', () => {
  const forums = reactive(sourceData.forums);

  const getForumById = (id) => findById(forums, id);

  const forum = (id) => {
    // eslint-disable-next-line no-shadow
    const forum = findById(forums, id);

    return {
      ...forum,
      get threadIds() {
        return forum.threads || [];
      },
    };
  };

  const appendThreadToForum = makeAppendChildToParent({ parent: forums, child: 'threads' });

  // eslint-disable-next-line no-shadow
  const getForumsByCategoryId = (id) => forums.filter((forum) => forum.categoryId === id);

  return {
    forums, getForumById, forum, getForumsByCategoryId, appendThreadToForum,
  };
});
