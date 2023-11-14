<script lang="ts">
  import zoomSdk from '@zoom/appssdk';
  import { DateTime } from 'luxon';
  import { db } from '../../database/db';
  import { trackerData } from '../../stores/zoom';
  import RosterRecordsDisplay from '../common/RosterRecordsDisplay.svelte';
  import TrackerDataDisplay from '../common/TrackerDataDisplay.svelte';
  import { handleEndRecord } from '../common/utils';
  import { liveQuery } from 'dexie';
  import { onMount } from 'svelte';

  let hasMeetingConnected = false;

  const dbIndexes = liveQuery(() => {
    return db.trackerDataTb.orderBy('[id+startTimeStr+endTimeStr]').keys();
  });

  $: console.log($dbIndexes);

  let connectionStatus = '';

  onMount(async () => {
    console.log('App in client');
    zoomSdk.onConnect(() => {
      hasMeetingConnected = true;
      setTimeout(() => {
        connectionStatus = '';
      }, 5000);
    });
    zoomSdk.onMeeting(() => {
      handleEndRecord();
    });
  });
</script>

<p>
  会议连接状态：{hasMeetingConnected}
</p>
{#if connectionStatus}
  <p>{connectionStatus}</p>
{/if}

{#if $trackerData}
  {#if hasMeetingConnected}
    <hr />
    <h2>会议正在进行中</h2>
    <TrackerDataDisplay trackerData={$trackerData} />
  {:else}
    <p>会议结束后未结束记录</p>
    <button on:click={handleEndRecord}>点此结束记录</button>
  {/if}
{:else}
  <p>暂无正在进展的记录</p>
{/if}

<hr />
<h2>前期记录</h2>
{#if $dbIndexes && $dbIndexes.join('')}
  {#each $dbIndexes as index}
    <a href={index.toString()}>{JSON.stringify(index)}</a>
  {/each}
{:else}
  <p>暂无前期记录</p>
{/if}
