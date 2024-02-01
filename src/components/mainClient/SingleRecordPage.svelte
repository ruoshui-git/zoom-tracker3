<script lang="ts">
  import { liveQuery } from 'dexie';
  import { db } from '../../database/db';
  import TrackerDataDisplay from '../common/TrackerDataDisplay.svelte';
  import { onMount } from 'svelte';
  import { trackerData } from '../../stores/zoom';
  // import { params } from "svelte-spa-router";

  export let params: {
    id: number;
  };

  // function updateQuery(id: number) {
  //   // console.log('updating id to: ', id);
  //   return liveQuery(async () => {
  //     // return db.trackerDataTb.get(params.id);
  //     console.log(`params.id is ${id}`);
  //     return await db.trackerDataTb.get(id);
  //   });
  // }

  // $: dbRecord = updateQuery(params.id);

  $: console.log(params);
  $: console.log($dbRecord);
  console.log(db);

  const dbIndexes = liveQuery(async () => {
    // return await db.trackerDataTb.toCollection().keys();
    return await db.trackerDataTb.orderBy('[id+startTime+endTime]').keys();
  });
  $: dbRecord = liveQuery(async () => {
    // return db.trackerDataTb.get(params.id);
    console.log(`params.id is ${params.id}`);
    // return await db.trackerDataTb.where('id').equals(params.id).toArray();
    return await db.trackerDataTb.toArray();
  });

  onMount(() => {
    console.log(`SingleRecordPage loaded!`);
  });
</script>

<h3>前期记录详情</h3>
<p>ID: {params.id}</p>
<!-- {#await $dbRecord}
  <p>正在获取数据</p>
{:then data}
  <TrackerDataDisplay trackerData={data[params.id-1]} />
{:catch e}
  <p>错误：{JSON.stringify(e)}</p>
{/await} -->
{#if $dbRecord}
  <TrackerDataDisplay trackerData={$dbRecord[params.id - 1]} />
{:else}
  <p>无记录</p>
{/if}
<!-- 
<p>{$dbIndexes}</p>
<p>{$dbRecord}</p> -->
