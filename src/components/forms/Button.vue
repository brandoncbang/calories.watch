<template>
  <button class="border-2 border-slate-800 px-3 py-1.5 text-base focus:outline-none focus:ring focus:ring-slate-400" :type="type">
    Save entry
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