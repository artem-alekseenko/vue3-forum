<script setup>
import { useThreadsStore } from '@/stores/ThreadsStore';
import { usePostsStore } from '@/stores/PostsStore';
import { useUsersStore } from '@/stores/UsersStore';

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});

const threadsStore = useThreadsStore();
const postsStore = usePostsStore();
const usersStore = useUsersStore();

const thread = threadsStore.getThreadById(props.id);
const postById = (id) => postsStore.getPostById(id);
const userById = (userId) => usersStore.getUserById(userId);
</script>

<template>
    <div class="col-large push-top">`
        <h1>{{ thread.title }}</h1>
        <div class="post-list">
            <div class="post"
                 v-for="postId in thread.posts"
                 :key="postId"
            >
                <div class="user-info">
                    <a href="#" class="user-name">{{userById(postById(postId).userId).name}}</a>
                    <a href="#">
                        <img class="avatar-large" :src="userById(postById(postId).userId).avatar" alt="">
                    </a>
                    <p class="desktop-only text-small">107 posts</p>
                </div>
                <div class="post-content">
                    <div>
                        <p>
                            {{postById(postId).text}}
                        </p>
                    </div>
                </div>
                <div class="post-date text-faded">
                    {{postById(postId).publishedAt}}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
