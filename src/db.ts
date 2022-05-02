import { Dexie, Table } from 'dexie';
import { DateTime } from 'luxon';

// TODO: Create real class
export interface ICalorieEntry {
  id?: number;
  amount: number;
  title: string;
  happenedAt: Date;
}

export class DataBase extends Dexie {
  calorieEntries!: Table<ICalorieEntry>;

  constructor() {
    super('calories.watch');

    this.version(1).stores({
      calorieEntries: '++id, amount, title, happenedAt',
    });
  }
}

export const db = new DataBase();