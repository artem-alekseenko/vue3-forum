<script setup>
import { computed, ref } from 'vue';

const emit = defineEmits(['save', 'cancel']);

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const form = ref({
  title: props.title,
  text: props.text,
});

const existing = computed(() => Boolean(props.title));

const save = () => {
  emit('save', { ...form.value });
};
</script>

<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
          v-model="form.title"
          type="text"
          id="thread_title"
          class="form-input"
          name="title"
      />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
          v-model="form.text"
          id="thread_content"
          class="form-input"
          name="content"
          rows="8"
          cols="140"
      ></textarea>
    </div>

    <div class="btn-group">
      <button class="btn btn-ghost" @click.prevent="emit('cancel')">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{existing ? 'Update' : 'Publish'}}
      </button>
    </div>
  </form>
</template>
