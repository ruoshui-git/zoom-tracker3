import { get } from 'svelte/store';
import { trackerData } from '../../stores/zoom';
import { DateTime } from 'luxon';
import { db } from '../../database/db';

export async function handleEndRecord() {
  console.debug('Ending a Record');
  const d = get(trackerData);
  if (d) {
    const now = DateTime.now();
    d.endTime = now;
    d.endTimeStr = now.toISO()?.toString();
    await db.trackerDataTb.add(d);
    trackerData.set(null);
  }
}
