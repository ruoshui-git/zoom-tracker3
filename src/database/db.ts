import Dexie, { type Table } from 'dexie';
import type { TrackerAppData } from '../stores/zoom';

export class MySubClassedDexie extends Dexie {
  // 'rosterRecords' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  trackerDataTb!: Table<TrackerAppData>;

  constructor() {
    super('trackerDatabase');
    this.version(2).stores({
      trackerDataTb:
        '++id, startTimeStr, endTimeStr, [id+startTimeStr+endTimeStr]', // Primary key and indexed props
      rosterRecords: null,
    });
  }
}

export const db = new MySubClassedDexie();
