<template>
  <h2>Entries</h2>
  <table>
    <thead>
      <tr>
        <th>Amount</th>
        <th>Title</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody v-for="entry in calorieEntries">
      <tr>
        <td>{{ entry.amount }}</td>
        <td>{{ entry.title }}</td>
        <td>{{ entry.happenedAt.toLocaleString(DateTime.TIME_SIMPLE) }}</td>
      </tr>
    </tbody>
  </table>

  <h2>Add an entry</h2>
  <form @submit.prevent="createEntry">
    <p>
      <label>
        <span>Amount</span>
        <input v-model="calorieEntryInput.amount" type="number" />
      </label>
    </p>
    <p>
      <label>
        <span>Title</span>
        <input v-model="calorieEntryInput.title" type="text" />
      </label>
    </p>
    <p>
      <label>
        <span>Happened At</span>
        <input v-model="calorieEntryInput.happenedAt" type="datetime-local" />
      </label>
    </p>
    <p>
      <button type="submit">Save</button>
    </p>
  </form>
</template>

<script setup lang="ts">
  import { reactive, Ref, ref } from 'vue';
  import { DateTime } from 'luxon';

  class CalorieEntry {
    amount: number;
    title: string;
    happenedAt: DateTime;

    constructor(amount: number, title: string, happenedAt: DateTime) {
      this.amount = amount;
      this.title = title;
      this.happenedAt = happenedAt;
    }
  }

  const calorieEntries: Ref<CalorieEntry[]> = ref([]);

  const calorieEntryInput = reactive({
    amount: null,
    title: null,
    happenedAt: DateTime.now().toISO(),
  });

  function createEntry() {
    if (!calorieEntryInput.amount || !calorieEntryInput.title || !calorieEntryInput.happenedAt) {
      return;
    }

    calorieEntries.value.push(
      new CalorieEntry(
        calorieEntryInput.amount,
        calorieEntryInput.title,
        DateTime.fromISO(calorieEntryInput.happenedAt)
      )
    )

    calorieEntryInput.amount = null;
    calorieEntryInput.title = null;
    calorieEntryInput.happenedAt = DateTime.now().toISO();
  }
</script>