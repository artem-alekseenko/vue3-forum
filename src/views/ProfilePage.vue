<script setup>
import PostList from '@/components/PostList.vue';
import { useUsersStore } from '@/stores/UsersStore';
import { storeToRefs } from 'pinia';
import UserProfileCard from '@/components/UserProfileCard.vue';
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue';

const props = defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});

const { authUser: user } = storeToRefs(useUsersStore());
</script>

<template>
  <div class="container">
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
          <span class="text-lead"> {{user.username}} recent activity </span>
          <a href="#">See only started threads?</a>
        </div>
        <hr />
        <PostList :posts="user.posts" />
      </div>
    </div>
  </div>
</template>
