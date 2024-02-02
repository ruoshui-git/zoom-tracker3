<script lang="ts">
  import { liveQuery } from 'dexie';
  import { db } from '../../database/db';
  import TrackerDataDisplay from '../common/TrackerDataDisplay.svelte';

  export let params: {
    id: number;
  };

  $: dbRecord = liveQuery(async () => {
    // Here primary key is a number. If not converted to Number, it will always return undefined.
    const d = await db.trackerDataTb.get(Number(params.id));
    return d;
  });
</script>

<h3>前期记录详情 `ID = {params.id}`</h3>
<!-- {#await $dbRecord}
  <p>正在获取数据</p>
{:then data}
  <TrackerDataDisplay trackerData={data[params.id-1]} />
{:catch e}
  <p>错误：{JSON.stringify(e)}</p>
{/await} -->
{#if $dbRecord}
  <TrackerDataDisplay trackerData={$dbRecord} />
{:else}
  <p>正在获取记录</p>
{/if}