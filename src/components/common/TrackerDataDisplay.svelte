<script lang="ts">
  import { onMount } from 'svelte';
  import type { ITrackerAppData } from '../../stores/zoom';
  import EntranceHistoryDisplay from './EntranceHistoryDisplay.svelte';
  import RosterRecordsDisplay from './RosterRecordsDisplay.svelte';
  import SpeakerTimelineDisplay from './SpeakerTimelineDisplay.svelte';
  import { DateTime } from 'luxon';

  export let trackerData: ITrackerAppData | undefined;

  $: console.debug(trackerData);

  onMount(() => {
    console.log(
      'mounting TrackerDataDisplay',
      'displaying: ' + JSON.stringify(trackerData)
    );
  });

  let startTime: DateTime | undefined, endTime: DateTime | undefined;

  $: if (trackerData) {
    startTime = DateTime.fromISO(trackerData.startTime);
    if (trackerData.endTime)
      endTime = DateTime.fromISO(trackerData.endTime);
  }
</script>

<main>
  <h2>软件记录数据</h2>
  {#if trackerData}
    <p>开始时间：{startTime?.toLocal().toISO()?.toString() ?? '无开始时间'}</p>
    <p>
      结束时间：{endTime?.toLocal().toISO()?.toString() ?? '暂未结束'}
    </p>
    <!-- 
    <nav>
      <a href="">人员列表</a>
      <a href="">进出记录</a>
      <a href="">开麦时间线</a>
    </nav> 
  -->

    <hr />
    <RosterRecordsDisplay rosters={trackerData.rosterRecords} />
    <hr />
    <EntranceHistoryDisplay entranceHistory={trackerData.entranceHistory} />
    <hr />
    <SpeakerTimelineDisplay timeline={trackerData.activeSpeakerTimeline} />
  {:else}
    <p>暂无数据。</p>
  {/if}
</main>

<style>
  main {
    padding: 10px;
    text-align: center;
  }
</style>
