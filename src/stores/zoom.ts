import { writable, type Readable, type Writable, derived } from 'svelte/store';
import { type OnParticipantChangeEvent } from '@zoom/appssdk';
import { DateTime } from 'luxon';
import ZoomUser from '../lib/zoomUser';

export interface EntranceHistoryItem {
  timestamp: DateTime;
  status: 'join' | 'leave';
  user: ZoomUser;
}

export const entranceEvents: Writable<OnParticipantChangeEvent[]> = writable(
  []
);

export const entranceHistory: Readable<EntranceHistoryItem[]> = derived(
  entranceEvents,
  (events) => {
    return events.flatMap((e) =>
      e.participants.map((participant) => {
        return {
          timestamp: DateTime.fromSeconds(e.timestamp).toLocal(),
          status: participant.status,
          user: new ZoomUser(
            participant.participantUUID,
            participant.screenName,
            participant.role
          ),
        };
      })
    );
  }
);

export const userRole: Writable<string> = writable('');
