import { getCurrentInstance, ref } from 'vue';

export const useAsyncDataLoadedStatus = () => {
  const isAsyncDataLoaded = ref(false);
  const instance = getCurrentInstance();
  const setAsyncDataStatusLoaded = () => {
    isAsyncDataLoaded.value = true;
    instance.emit('ready');
  };

  return {
    isAsyncDataLoaded,
    setAsyncDataStatusLoaded,
  };
};
