<script lang="ts">
  import zoomSdk from '@zoom/appssdk';
  import ZoomUser, { WaitingRoomUser } from '../../lib/zoomUser';
  import { DateTime } from 'luxon';
  import { trackerData, type RosterItem } from '../../stores/zoom';

  let error: string = '';

  const getParticipants = async () => {
    try {
      console.log('Getting Roster Records');
      let usersInMeeting: RosterItem[] = (
        await zoomSdk.getMeetingParticipants()
      ).participants.map((res) => {
        return {
          participant: new ZoomUser(
            res.participantUUID,
            res.screenName,
            res.role
          ),
          location: 'meeting',
        };
      });

      const usersInWaitingRoom: RosterItem[] = (
        await zoomSdk.getWaitingRoomParticipants()
      ).participants.map((res) => {
        return {
          location: 'waiting-room',
          participant: new WaitingRoomUser(
            res.participantUUID,
            res.screenName,
            res.role
          ),
        };
      });

      if ($trackerData) {
        const d = $trackerData;
        $trackerData.rosterRecords = [
          ...$trackerData.rosterRecords,
          {
            timestamp: DateTime.now(),
            participants: [...usersInWaitingRoom, ...usersInMeeting],
          },
        ];
      }
      console.log($trackerData);
      error = '';
    } catch (e: any) {
      error = JSON.stringify(e);
      if (e.code === '10047') {
        error =
          '需要 Host 或 Co-Host 权限才能使用此功能。获得权限后请刷新重试。' +
          '\n' +
          error;
      }
    }
  };
</script>

<button type="button" on:click={getParticipants}>获取名单</button>

{#if error}
  <p class="red">错误：{error}</p>
{/if}

<style>
  .red {
    color: red;
  }
</style>
