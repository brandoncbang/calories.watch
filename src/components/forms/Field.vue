<template>
  <label class="flex flex-col">
    <span>{{ label }}</span>
    <input
        class="border-2 border-slate-800 px-3 py-1.5 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-300"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>

<script setup lang="ts">
  interface Props {
    type?: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    modelValue?: any|null;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
  });

  const emits = defineEmits(['update:modelValue']);
</script>