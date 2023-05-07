<script setup>
import dayjs from 'dayjs/esm';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedDate from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

const props = defineProps({
  timestamp: {
    type: Number,
    required: true,
  },
});

const diffForHumans = dayjs.unix(props.timestamp).fromNow();
const humanFriendlyDate = dayjs.unix(props.timestamp).format('llll');
</script>

<template>
  <span :title="humanFriendlyDate">
    {{ diffForHumans }}
  </span>
</template>
