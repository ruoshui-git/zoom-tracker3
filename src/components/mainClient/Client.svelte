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
  import Router, { link, params } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';

  import RecordsRouter from './RecordsRouter.svelte';

  let hasMeetingConnected = false;
  let startDateFilterText = DateTime.now().toLocal().toFormat('yyyy-LL');

  $: dbIndexes = liveQuery(async () => {
    // return await db.trackerDataTb.toCollection().keys();
    return await db.trackerDataTb
      .orderBy('[id+startTime+endTime]')
      .reverse()
      .filter((d) => d.startTime.startsWith(startDateFilterText))
      .keys();
  });

  $: console.log(`dbindexes from Client.svelte: ${$dbIndexes}`);

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

<div class="date-filter">
  <label>
    输入开始日期以筛选记录 <br />
    <input type="text" bind:value={startDateFilterText} />
  </label>
</div>

{#if $dbIndexes && $dbIndexes.join('')}
  <table>
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">开始时间</th>
        <th scope="col">结束时间</th>
      </tr>
    </thead>
    <tbody>
      {#each $dbIndexes as [id, startTime, endTime]}
        <tr>
          <td><a href={`/client/records/${id}`} use:link use:active>{id}</a></td
          >
          <td
            ><a href={`/client/records/${id}`} use:link use:active
              >{startTime}</a
            ></td
          >
          <td
            ><a href={`/client/records/${id}`} use:link use:active>{endTime}</a
            ></td
          >
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>无记录</p>
{/if}

<!-- {#if $dbRecord}
  <TrackerDataDisplay trackerData={$dbRecord} />
{/if} -->

<RecordsRouter />

<style>
  table,
  th,
  td {
    border: 1px solid;
    padding: 5px;
  }

  .date-filter {
    display: block;
    margin: 1% 0;
  }

  /* Style for "active" links; need to mark this :global because the router adds the class directly */
  :global(a.active) {
    color: red;
  }
</style>
