<script setup>
import { ref } from 'vue';

const emit = defineEmits(['save']);

const props = defineProps({
  post: {
    type: Object,
    default: () => ({}),
  },
});

const postCopy = ref({ ...props.post });
const save = () => {
  emit('save', { postText: postCopy.value.text });

  postCopy.value.text = '';
};
</script>

<template>
  <div>
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          id=""
          v-model="postCopy.text"
          name=""
          cols="30"
          rows="10"
          class="form-input"
        />
      </div>
      <div class="form-actions">
        <button class="btn-blue">
          {{ post.id ? 'Update post' : 'Submit post' }}
        </button>
      </div>
    </form>
  </div>
</template>
