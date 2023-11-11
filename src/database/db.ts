import Dexie, { type Table } from 'dexie';
import type { DateTime } from 'luxon';
import type ZoomUser from '../lib/zoomUser';

export interface RosterRecord {
  id: string;
  timestamp: DateTime;
  participants: ZoomUser[];
}

export class MySubClassedDexie extends Dexie {
  // 'rosterRecords' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  rosterRecords!: Table<RosterRecord>;

  constructor() {
    super('trackerDatabase');
    this.version(1).stores({
      rosterRecords: 'id', // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
