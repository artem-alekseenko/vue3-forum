import { defineStore } from 'pinia';
import { db } from '@/config/firebase';
import {
  arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where,
} from 'firebase/firestore';

export const useForumsStore = defineStore('ForumsStore', () => {
  const fetchForumById = async (id) => {
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
    const forumFromDb = await fetchForumById(id);

    return {
      ...forumFromDb,
      get threadIds() {
        return forumFromDb.threads || [];
      },
    };
  };

  const appendThreadToForum = async ({ forumId, threadId }) => {
    const forumDocRef = doc(db, 'forums', forumId);

    await updateDoc(forumDocRef, {
      threads: arrayUnion(threadId),
    });
  };

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
