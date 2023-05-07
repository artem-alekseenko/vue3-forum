<script setup>
import { reactive } from 'vue';
import sourceData from '@/data.json';

const props = defineProps({
  threads: {
    type: Array,
    required: true,
  },
});

const users = reactive(sourceData.users);

const userById = (userId) => users.find((p) => p.id === userId);
</script>

<template>
    <div class="col-full">

        <div class="thread-list">

            <h2 class="list-title">Threads</h2>

            <div v-for="thread in props.threads" :key="thread.id" class="thread">
                <div>
                    <p>
                        <a href="#">{{ thread.title }}</a>
                    </p>
                    <p class="text-faded text-xsmall">
                        By <a href="#">{{ userById(thread.userId).name }}</a>, {{ thread.publishedAt }}.
                    </p>
                </div>

                <div class="activity">
                    <p class="replies-count">
                        {{ thread.posts.length }} replies
                    </p>

                    <img class="avatar-medium" :src="userById(thread.userId).avatar" alt="">

                    <div>
                        <p class="text-xsmall">
                            <a href="#">{{ userById(thread.userId).name }}</a>
                        </p>
                        <p class="text-xsmall text-faded">{{ thread.publishedAt }}</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>

</style>
