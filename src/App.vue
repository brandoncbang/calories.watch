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
  import { liveQuery } from 'dexie';
  import { useObservable } from '@vueuse/rxjs';
  import { DateTime } from 'luxon';
  import { db, ICalorieEntry } from './db';

  /**
   * Incompatible types with RXJS 7 for now. Seems to be an issue with the vueuse package.
   * https://github.com/dexie/Dexie.js/issues/1461
   */
  const calorieEntries: Ref<ICalorieEntry[]> = useObservable(
    liveQuery(() => db.calorieEntries.toArray()) as any
  );

    constructor(amount: number, title: string, happenedAt: DateTime) {
      this.amount = amount;
      this.title = title;
      this.happenedAt = happenedAt;
    }
  }

  const calorieEntryInput = reactive({
    amount: null,
    title: null,
    happenedAt: DateTime.now().toISO(),
  });

  async function createEntry() {
    if (!calorieEntryInput.amount || !calorieEntryInput.title || !calorieEntryInput.happenedAt) {
      return;
    }

    try {
      const id = await db.calorieEntries.add({
        amount: calorieEntryInput.amount,
        title: calorieEntryInput.title,
        happenedAt: new Date(calorieEntryInput.happenedAt)
      });

    calorieEntryInput.amount = null;
    calorieEntryInput.title = null;
      calorieEntryInput.happenedAt = toDatetimeLocalValue(new Date());
    } catch (error) {
      console.log(error);
    }
  }
</script>