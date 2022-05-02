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
        <td>{{ entry.happenedAt.toLocaleString([], { hour: 'numeric', minute: '2-digit' }) }}</td>
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
  import { db, ICalorieEntry } from './db';

  /**
   * Incompatible types with RXJS 7 for now. Seems to be an issue with the vueuse package.
   * https://github.com/dexie/Dexie.js/issues/1461
   */
  const calorieEntries: Ref<ICalorieEntry[]> = useObservable(
    liveQuery(() => db.calorieEntries.orderBy('happenedAt').toArray()) as any
  );

  /**
   * Turn a Date object into a string value used by 'datetime-local' input elements.
   */
  function toDatetimeLocalValue(datetime: Date): string {
    datetime.setMinutes(datetime.getMinutes() - datetime.getTimezoneOffset());
    return datetime.toISOString().slice(0, 16);
  }

  const calorieEntryInput = reactive({
    amount: null,
    title: null,
    happenedAt: null,
  });

  async function createEntry() {
    if (!calorieEntryInput.amount || !calorieEntryInput.title) {
      return;
    }

    try {
      const id = await db.calorieEntries.add({
        amount: calorieEntryInput.amount,
        title: calorieEntryInput.title,
        happenedAt: new Date(calorieEntryInput.happenedAt ?? toDatetimeLocalValue(new Date()))
      });

      calorieEntryInput.amount = null;
      calorieEntryInput.title = null;
      calorieEntryInput.happenedAt = null;
    } catch (error) {
      console.log(error);
    }
  }
</script>