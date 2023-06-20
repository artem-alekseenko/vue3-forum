import { ref } from 'vue';

export const useAsyncDataLoadedStatus = () => {
  const isAsyncDataLoaded = ref(false);
  const setAsyncDataStatusLoaded = () => {
    console.log('setAsyncDataStatusLoaded');
    isAsyncDataLoaded.value = true;
  };

  return {
    isAsyncDataLoaded,
    setAsyncDataStatusLoaded,
  };
};
