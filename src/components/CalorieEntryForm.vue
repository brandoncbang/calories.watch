<template>
  <form @submit.prevent="emitSaved">
    <p class="mt-2">
      <Field 
          v-model.number="input.amount"
          type="number"
          label="Amount"
          placeholder="800"
          required
      />
    </p>
    <p class="mt-2">
      <Field 
          v-model="input.title"
          type="text"
          label="Title"
          placeholder="Burrito"
          required
      />
    </p>
    <p class="mt-2">
      <Field 
          v-model="input.happenedAt"
          type="datetime-local"
          label="Happened At"
      />
    </p>

    <p class="flex items-center justify-center mt-6 space-x-2 text-center">
      <Button @click="$emit('canceled')">
        Cancel
      </Button>
      <Button type="submit">
        Save entry
      </Button>
    </p>
  </form>
</template>

<script setup lang="ts">
  import Field from './forms/Field.vue';
  import Button from './forms/Button.vue';

  import { reactive } from 'vue';
  import { ICalorieEntry } from '../db';
  import { toDatetimeLocalValue } from '../lib/date';

  const emit = defineEmits<{
    (e: 'saved', calorieEntry: ICalorieEntry): void
    (e: 'canceled'): void
  }>();

  const input = reactive({
    amount: null,
    title: null,
    happenedAt: null,
  });

  function emitSaved() {
    if (!input.amount || !input.title) return;

    emit('saved', {
      amount: input.amount,
      title: input.title,
      happenedAt: new Date(input.happenedAt ?? toDatetimeLocalValue(new Date())),
    });

    input.amount = null;
    input.title = null;
    input.happenedAt = null;
  }
</script>