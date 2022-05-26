<template>
  <form @submit.prevent="emitSaved">
    <h2 class="text-2xl">{{ entryToEdit ? 'Edit' : 'Create' }} a calorie entry</h2>
    <p class="mt-4">
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

  import { reactive, watchEffect } from 'vue';
  import { format, getDate, getMonth, getYear, set } from 'date-fns';
  import { ICalorieEntry } from '../db';

  interface Props {
    entryToEdit?: ICalorieEntry | null;
    selectedDate?: Date;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'saved', calorieEntry: ICalorieEntry): void
    (e: 'canceled'): void
  }>();

  interface ICalorieEntryInput {
    amount: number | null;
    title: string | null;
    happenedAt: string | null;
  }

  const input = reactive<ICalorieEntryInput>({
    amount: null,
    title: null,
    happenedAt: null,
  });

  watchEffect(async () => {
    if (!props.entryToEdit) {
      input.amount = null;
      input.title = null;
      input.happenedAt = null;

      return;
    }

    input.amount = props.entryToEdit.amount;
    input.title = props.entryToEdit.title;
    input.happenedAt = format(props.entryToEdit.happenedAt, 'yyyy-MM-dd\'T\'HH:mm');
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

    let emitData: ICalorieEntry = {
      amount: input.amount,
      title: input.title,
      happenedAt: input.happenedAt ? new Date(input.happenedAt) : getDefaultDate(),
    }

    if (props.entryToEdit) {
      emitData.id = props.entryToEdit.id;
    }

    emit('saved', emitData);
  }
</script>