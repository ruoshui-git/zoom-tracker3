import Dexie, { type Table } from 'dexie';

import { type ITrackerAppData } from '../stores/zoom';

if (process.env.NODE_ENV !== 'production') {
  Dexie.debug = true;
}

export class MySubClassedDexie extends Dexie {
  // 'rosterRecords' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  trackerDataTb!: Table<ITrackerAppData>;

  constructor() {
    super('trackerDatabase');
    this.version(3).stores({
      trackerDataTb: '++id, startTime, endTime, [id+startTime+endTime]', // Primary key and indexed props
      rosterRecords: null,
    });
    // this.trackerDataTb.mapToClass(TrackerAppData);
  }
}

// export const Tson = new Typeson().register({
//   TrackerAppData,
//   ZoomUser,
// });

export const db = new MySubClassedDexie();
