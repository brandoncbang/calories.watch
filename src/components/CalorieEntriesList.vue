<template>
  <div v-if="calorieEntries.length" class="mt-2 overflow-y-auto h-72">
    <table class="w-full text-base">
      <thead class="sticky top-0 pb-2 text-right bg-white after:absolute after:-bottom-px after:left-0 after:block after:w-full after:h-[2px] after:bg-slate-800">
        <tr>
          <th class="p-2 pl-0 font-semibold">Amount</th>
          <th class="p-2 font-semibold">Title</th>
          <th class="p-2 font-semibold">Time</th>
          <th class="p-2 pr-0 font-semibold"></th>
        </tr>
      </thead>
      <tbody>
        <tr
            v-for="entry in calorieEntries"
            class="text-right border-t border-slate-800 first:border-t-0"
        >
          <td class="py-3 pr-2">
            {{ entry.amount }}
          </td>
          <td class="w-full px-2 py-3 break-words max-w-0">
            {{ entry.title }}
          </td>
          <td class="px-2 py-3 whitespace-nowrap">
            {{ entry.happenedAt.toLocaleString([], { hour: 'numeric', minute: '2-digit' }) }}
          </td>
          <td class="pl-2 py-1.5">
            <div class="flex text-slate-800">
              <button
                  @click="$emit('editEntry', entry.id!)"
                  aria-label="edit entry"
                  title="Edit Entry"
              >
                <PencilAltIcon class="w-5 h-5" />
              </button>
              
              <button
                  @click="$emit('deleteEntry', entry.id!)"
                  class="ml-1"
                  aria-label="delete entry"
                  title="Delete Entry"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="flex items-center justify-center px-4 py-2 mt-2 h-72">
    <p>No entries for this date!</p>
  </div>
</template>

<script setup lang="ts">
  import { PencilAltIcon, TrashIcon } from '@heroicons/vue/solid';

  import { ICalorieEntry } from '../db';

  interface Props {
    calorieEntries: ICalorieEntry[];
  }

  const props = withDefaults(defineProps<Props>(), {
    calorieEntries: () => [],
  });

  const emit = defineEmits<{
    (e: 'editEntry', id: number): void
    (e: 'deleteEntry', id: number): void
  }>();
</script>