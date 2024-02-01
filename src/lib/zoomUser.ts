import pinyin from 'tiny-pinyin';
import type { EntranceHistoryItem, RosterItem } from '../stores/zoom';

/**
 * Represents a Zoom Meeting participant.
 */
export default class ZoomUser {
  participantUUID: string;
  screenName: string;
  screenNamePinyin: string;
  role: string;

  constructor(participantUUID: string, screenName: string, role: string) {
    this.participantUUID = participantUUID;
    this.screenName = screenName;
    this.role = role;
    this.screenNamePinyin = pinyin.convertToPinyin(screenName, '', true);
  }

  /**
   * Checks whether current user's name matches the given string.
   * @param name String to filter against
   * @returns `true` if current user's name or pinyin contains the query string
   */
  matchesName(name: string): boolean {
    const lowerName = name.trim().toLowerCase();
    return (
      this.screenName.toLocaleLowerCase().includes(lowerName) ||
      this.screenNamePinyin.includes(lowerName)
    );
  }
}

/**
 * Filter an array of ZoomUser's based on a given string (name or pinyin)
 * @param users
 * @param filterName Can be either the name itself or the Pinyin representation
 * @returns filtered array of ZoomUser's
 */
export function filterUsersByName(
  users: RosterItem[],
  filterName: string
): RosterItem[] {
  const name = filterName.trim();
  if (name) {
    return users.filter((p) => {
      return p.participant.matchesName(name);
    });
  } else {
    return users;
  }
}

export function filterEntranceHistoryByName(
  history: EntranceHistoryItem[],
  filterName: string
): EntranceHistoryItem[] {
  const name = filterName.trim();
  if (name) {
    return history.filter((e) => {
      return e.user.matchesName(name);
    });
  } else {
    return history;
  }
}

export class WaitingRoomUser extends ZoomUser {
  static counter = 0;

  constructor(participantUUID?: string, screenName?: string, role?: string) {
    const label = `等候室用户 #${WaitingRoomUser.counter++}`;
    super(
      participantUUID ? participantUUID : label,
      screenName ? screenName : label,
      role ? role : label
    );
  }
}
