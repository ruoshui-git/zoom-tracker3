import { writable, type Writable } from 'svelte/store';
// import { persist, createLocalStorage, type PersistentStore } from "@macfja/svelte-persistent-store";
import { persisted } from 'svelte-persisted-store';
import { type OnActiveSpeakerChangeEvent } from '@zoom/appssdk';
import { DateTime } from 'luxon';
import ZoomUser from '../lib/zoomUser';
import zoomSdk from '@zoom/appssdk';

export interface EntranceHistoryItem {
  // timestamp: DateTime;
  timestamp: string;
  status: 'join' | 'leave' | 'joined-before';
  user: ZoomUser;
}

// export const entranceEvents: Writable<OnParticipantChangeEvent[]> = writable(
//   []
// );

// export const participantsJoinedBefore: Writable<EntranceHistoryItem[]> =
//   writable([]);

// export const entranceHistory: Writable<EntranceHistoryItem[]> = writable([]);
// derived(
//   entranceEvents,
//   (events) => {
//     return [
//       ...get(participantsJoinedBefore),
//       ...events.flatMap((e) =>
//         e.participants.map((participant) => {
//           return {
//             timestamp: DateTime.fromSeconds(e.timestamp).toLocal(),
//             status: participant.status,
//             user: new ZoomUser(
//               participant.participantUUID,
//               participant.screenName,
//               participant.role
//             ),
//           };
//         })
//       ),
//     ];
//   }
// );

export const userRole: Writable<string> = writable('');

export interface RosterRecord {
  // timestamp: DateTime;
  timestamp: string;
  participants: RosterItem[];
}

export interface RosterItem {
  location: 'meeting' | 'waiting-room';
  participant: ZoomUser;
}

export interface ITrackerAppData {
  id?: number;
  startTime: string;
  // endTime?: DateTime;
  endTime?: string;
  entranceHistory: EntranceHistoryItem[];
  rosterRecords: RosterRecord[];
  activeSpeakerTimeline: ActiveSpeakerTimeline;
}

// export class TrackerAppData implements ITrackerAppData {
//   id?: number;
//   startTime: string;
//   // endTime?: DateTime;
//   endTime?: string;
//   entranceHistory: EntranceHistoryItem[];
//   rosterRecords: RosterRecord[];
//   activeSpeakerTimeline: ActiveSpeakerTimeline;

//   constructor(opts: {
//     id?: number;
//     startTime: string;
//     // endTime?: DateTime,
//     endTime?: string;
//     entranceHistory: EntranceHistoryItem[];
//     rosterRecords: RosterRecord[];
//     activeSpeakerTimeline: ActiveSpeakerTimeline;
//   }) {
//     this.id = opts.id;
//     this.startTime = opts.startTime;
//     this.endTime = opts.endTime;
//     this.entranceHistory = opts.entranceHistory;
//     this.rosterRecords = opts.rosterRecords;
//     this.activeSpeakerTimeline = opts.activeSpeakerTimeline;
//   }
// }

export interface ActiveSpeakerTimeline {
  timeline: OnActiveSpeakerChangeEvent[];
}

// export const trackerData: PersistentStore<TrackerAppData | undefined> = persist(writable(), createLocalStorage(), 'tracker-app-data');
export const trackerData: Writable<ITrackerAppData | null> = persisted(
  'tracker-app-data',
  null
);

export const isInitializingAppData: Writable<boolean> = writable(false);
/**
 * Reset app data to initial value
 */
export async function initializeTrackerData() {
  console.debug('initializing tracker data');
  isInitializingAppData.set(true);

  trackerData.set({
    // startTime: DateTime.now(),
    startTime: DateTime.now().toLocal().toISO()!,
    // Set initial value to participants joined before,
    entranceHistory: (await zoomSdk.getMeetingParticipants()).participants.map(
      (p) => {
        return {
          timestamp: DateTime.now().toISO()!,
          status: 'joined-before',
          user: new ZoomUser(p.participantUUID, p.screenName, p.role),
        };
      }
    ),
    rosterRecords: [],
    activeSpeakerTimeline: { timeline: [] },
  });

  // participantsJoinedBefore.set((
  //   await zoomSdk.getMeetingParticipants()
  // ).participants.map((p) => {
  //   return {
  //     timestamp: DateTime.now(),
  //     status: 'joined-before',
  //     user: new ZoomUser(p.participantUUID, p.screenName, p.role),
  //   };
  // }))

  zoomSdk.onParticipantChange((pChangeEvent) => {
    trackerData.update((d) => {
      if (d) {
        const newEntranceHistory = [
          ...d.entranceHistory,
          ...pChangeEvent.participants.map((participant) => {
            return {
              timestamp: DateTime.fromSeconds(pChangeEvent.timestamp)
                .toLocal()
                .toISO()!,
              status: participant.status,
              user: new ZoomUser(
                participant.participantUUID,
                participant.screenName,
                participant.role
              ),
            };
          }),
        ];
        d.entranceHistory = newEntranceHistory;
        return d;
      } else {
        return null;
      }
    });
  });

  // zoomSdk.onParticipantChange(
  //   (pChangeEvent) => entranceEvents.update((entranceE => [...entranceE, pChangeEvent]))
  // );

  zoomSdk.onActiveSpeakerChange((event) => {
    trackerData.update((d) => {
      d?.activeSpeakerTimeline.timeline.push(event);
      return d;
    });
  });

  console.debug('initialization done');
  isInitializingAppData.set(false);
}
