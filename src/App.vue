<template>
  <h1>
    <button @click="loadPreviousDay">&larr;</button>
    &nbsp;<span>{{ entriesDateIsToday ? 'Today' : entriesDate.toLocaleDateString() }}</span>&nbsp;
    <button @click="loadNextDay">&rarr;</button>
  </h1>

  <h2>Entries</h2>
  <table v-if="calorieEntries.length">
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
        <td><button @click="deleteCalorieEntry(entry.id!)">Delete</button></td>
      </tr>
    </tbody>
  </table>
  <p v-else>No entries for this date!</p>

  <h2>Total</h2>
  <p :style="{ color: settings.dailyLimit && totalCalories > settings.dailyLimit ? 'red' : 'inherit' }">
    <span>{{ totalCalories }}</span>
    <span v-if="settings.dailyLimit"> / {{ settings.dailyLimit }}</span>
  </p>

  <h2>Add an entry</h2>
  <form @submit.prevent="createCalorieEntry">
    <p>
      <label>
        <span>Amount</span>
        <input v-model.number="calorieEntryInput.amount" type="number" />
      </label>
    </p>
    <p>
      <label>
        <span>Title</span>
        <input v-model.trim="calorieEntryInput.title" type="text" />
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

  <h2>Settings</h2>
  <form @submit.prevent="saveSettings">
    <p>
      <label>
        <span>Daily limit</span>
        <input v-model.lazy.number="settings.dailyLimit" type="number" />
      </label>
    </p>
  </form>
</template>

<script setup lang="ts">
  import { reactive, ref, Ref, computed, watchEffect, watch } from 'vue';
  import { db, ICalorieEntry } from './db';

  const entriesDate = ref(new Date());

  const entriesDateIsToday = computed(() => {
    return entriesDate.value >= getDateStart(new Date()) && entriesDate.value <= getDateEnd(new Date());
  });

  const calorieEntries: Ref<ICalorieEntry[]> = ref([]);

  const totalCalories = computed(() => {
    return calorieEntries.value.reduce((sum, entry) => sum + entry.amount, 0);
  });

  const totalIsOverLimit = computed(() => {
    return settings.dailyLimit && totalCalories > settings.dailyLimit;
  });

  /**
   * Turn a Date object into a string value used by 'datetime-local' input elements.
   */
  function toDatetimeLocalValue(datetime: Date): string {
    datetime.setMinutes(datetime.getMinutes() - datetime.getTimezoneOffset());
    return datetime.toISOString().slice(0, 16);
  }

  function getDateStart(datetime: Date): Date {
    datetime.setHours(0, 0, 0, 0);
    return datetime;
  }

  function getDateEnd(datetime: Date): Date {
    datetime.setHours(23, 59, 59, 999);
    return datetime;
  }

  const calorieEntryInput = reactive({
    amount: null,
    title: null,
    happenedAt: null,
  });

  function loadPreviousDay() {
    entriesDate.value.setDate(entriesDate.value.getDate() - 1);
    entriesDate.value = new Date(entriesDate.value);
  }

  function loadNextDay() {
    entriesDate.value.setDate(entriesDate.value.getDate() + 1);
    entriesDate.value = new Date(entriesDate.value);
  }

  async function getCalorieEntries() {
    calorieEntries.value = await db.calorieEntries
      .where('happenedAt')
      .between(
        getDateStart(new Date(entriesDate.value)),
        getDateEnd(new Date(entriesDate.value))
      )
      .sortBy('happenedAt');
  }

  async function createCalorieEntry() {
    if (!calorieEntryInput.amount || !calorieEntryInput.title) {
      return;
    }

    try {
      db.calorieEntries.add({
        amount: calorieEntryInput.amount,
        title: calorieEntryInput.title,
        happenedAt: new Date(calorieEntryInput.happenedAt ?? toDatetimeLocalValue(new Date()))
      });

      getCalorieEntries();

      calorieEntryInput.amount = null;
      calorieEntryInput.title = null;
      calorieEntryInput.happenedAt = null;
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteCalorieEntry(id: number) {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      await db.calorieEntries.delete(id);

      getCalorieEntries();
    } catch (error) {
      console.log(error);
    }
  }

  watchEffect(() => {
    getCalorieEntries();
  });

  const settings = reactive(loadSettings());

  function saveSettings() {
    window.localStorage.settings = JSON.stringify(settings);
  }

  function loadSettings() {
    if (!window.localStorage.settings) {
      return {
        dailyLimit: null,
      }
    }

    return JSON.parse(window.localStorage.settings)
  }

  watch(settings, () => {
    saveSettings();
  });
</script>