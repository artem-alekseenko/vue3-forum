<script setup>
import PostList from '@/components/PostList.vue';
import UserProfileCard from '@/components/UserProfileCard.vue';
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue';
import { ref, watchEffect } from 'vue';
import { DataProvider } from '@/data-provider/DataProvider';
import { useAsyncDataLoadedStatus } from '@/composables/AsyncDataLoadedStatus';

const props = defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});

const isLoading = ref(true);
const user = ref(null);

const { setAsyncDataStatusLoaded } = useAsyncDataLoadedStatus();

const dataProvider = DataProvider.getInstance();

watchEffect(async () => {
  user.value = await dataProvider.getAuthUser();
  isLoading.value = false;
});
watchEffect(async () => {
  if (!props.edit) {
    isLoading.value = true;
    user.value = await dataProvider.getAuthUser();
    isLoading.value = false;
  }
  setAsyncDataStatusLoaded();
});
</script>

<template>
  <div
    v-if="!isLoading"
    class="container"
  >
    <div class="flex-grid">
      <div class="col-3 push-top">
        <UserProfileCard
          v-if="!props.edit"
          :user="user"
        />
        <UserProfileCardEditor
          v-else
          :user="user"
        />
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{ user.username }} recent activity </span>
          <a href="#">See only started threads?</a>
        </div>
        <hr>
        <PostList :posts="user.posts" />
      </div>
    </div>
  </div>
</template>
