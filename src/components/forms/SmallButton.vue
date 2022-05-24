<template>
  <button class="border-2 border-slate-800 px-2 py-0.5 text-sm focus:outline-none focus:ring focus:ring-slate-400" :type="type">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
  interface Props {
    type?: 'button'|'submit'|'reset';
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'button',
  });
</script>