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
  import { getDate, getMonth, getYear, set } from 'date-fns';
  import { ICalorieEntry } from '../db';

  interface Props {
    selectedDate?: Date;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'saved', calorieEntry: ICalorieEntry): void
    (e: 'canceled'): void
  }>();

  const input = reactive({
    amount: null,
    title: null,
    happenedAt: null,
  });

  function getDefaultDate(): Date {
    if (!props.selectedDate) return new Date();

    return set(new Date(), {
      year: getYear(props.selectedDate),
      month: getMonth(props.selectedDate),
      date: getDate(props.selectedDate),
    });
  }

  function emitSaved() {
    if (!input.amount || !input.title) return;

    emit('saved', {
      amount: input.amount,
      title: input.title,
      happenedAt: input.happenedAt ? new Date(input.happenedAt) : getDefaultDate(),
    });

    input.amount = null;
    input.title = null;
    input.happenedAt = null;
  }
</script>