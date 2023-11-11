import {
  writable,
  type Readable,
  type Writable,
  derived,
  get,
} from 'svelte/store';
import { type OnParticipantChangeEvent } from '@zoom/appssdk';
import { DateTime } from 'luxon';
import ZoomUser from '../lib/zoomUser';

export interface EntranceHistoryItem {
  timestamp: DateTime;
  status: 'join' | 'leave' | 'joined-before';
  user: ZoomUser;
}

export const entranceEvents: Writable<OnParticipantChangeEvent[]> = writable(
  []
);

export const participantsJoinedBefore: Writable<EntranceHistoryItem[]> =
  writable([]);

export const entranceHistory: Readable<EntranceHistoryItem[]> = derived(
  entranceEvents,
  (events) => {
    return [
      ...get(participantsJoinedBefore),
      ...events.flatMap((e) =>
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
      ),
    ];
  }
);

export const userRole: Writable<string> = writable('');

export interface ParticipantHistoryListItem {
  timestamp: DateTime;
  participants: ZoomUser[];
}

export const participantListHistory: Writable<ParticipantHistoryListItem[]> =
  writable([]);
