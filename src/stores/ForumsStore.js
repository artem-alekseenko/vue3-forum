import { reactive } from 'vue';
import { defineStore } from 'pinia';
import sourceData from '@/data.json';
import { makeAppendChildToParent } from '@/helpers';
import { db } from '@/config/firebase';
import {
  collection, doc, getDoc, getDocs, query, where,
} from 'firebase/firestore';

export const useForumsStore = defineStore('ForumsStore', () => {
  const forums = reactive(sourceData.forums);

  const fetchForum = async (id) => {
    const forumDocRef = doc(db, 'forums', id);
    const forumDocSnap = await getDoc(forumDocRef);
    if (forumDocSnap.exists()) {
      const res = forumDocSnap.data();
      return {
        id: forumDocSnap.id,
        ...res,
      };
    }
    // eslint-disable-next-line no-console
    console.error(`No forum with id ${id}`);
    return null;
  };

  const forum = async (id) => {
    const forumFromDb = await fetchForum(id);

    return {
      ...forumFromDb,
      get threadIds() {
        return forumFromDb.threads || [];
      },
    };
  };

  const appendThreadToForum = makeAppendChildToParent({ parent: forums, child: 'threads' });

  const getForumsByCategoryId = async (categoryId) => {
    const forumsCollection = collection(db, 'forums');
    const forumsQuery = query(
      forumsCollection,
      where('categoryId', '==', categoryId),
    );
    const forumsSnapshot = await getDocs(forumsQuery);

    const forumsPromises = forumsSnapshot.docs.map(async (forumDoc) => {
      const data = forumDoc.data();
      return {
        id: forumDoc.id,
        ...data,
      };
    });
    return Promise.all(forumsPromises);
  };

  return {
    forum, getForumsByCategoryId, appendThreadToForum,
  };
});
