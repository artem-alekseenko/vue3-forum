<script setup>
import { computed, ref } from 'vue';
import { useForumsStore } from '@/stores/ForumsStore';
import { useRouter } from 'vue-router';
import { useThreadsStore } from '@/stores/ThreadsStore';

const props = defineProps({
  forumId: {
    type: String,
    required: true,
  },
});

const forumsStore = useForumsStore();
const forum = computed(() => forumsStore.getForumById(props.forumId));

const title = ref('');
const text = ref('');

const router = useRouter();

const save = async () => {
  const threadsStore = useThreadsStore();
  const thread = await threadsStore.createThread({
    title: title.value,
    text: text.value,
    forumId: props.forumId,
  });

  await router.push({ name: 'ThreadShow', params: { id: thread.id } });
};

const cancel = () => {
  router.push({ name: 'Forum', params: { id: props.forumId } });
};
</script>

<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <form @submit.prevent="save">
      <div class="form-group">
        <label for="thread_title">Title:</label>
        <input
            v-model="title"
            type="text"
            id="thread_title"
            class="form-input"
            name="title"
        />
      </div>

      <div class="form-group">
        <label for="thread_content">Content:</label>
        <textarea
            v-model="text"
            id="thread_content"
            class="form-input"
            name="content"
            rows="8"
            cols="140"
        ></textarea>
      </div>

      <div class="btn-group">
        <button class="btn btn-ghost" @click="cancel">Cancel</button>
        <button class="btn btn-blue" type="submit" name="Publish">
          Publish
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>
