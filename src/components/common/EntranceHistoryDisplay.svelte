<script lang="ts">
  import { filterEntranceHistoryByName } from '../../lib/zoomUser';
  import type { EntranceHistoryItem } from '../../stores/zoom';
  import FilterInput from '../FilterInput.svelte';
  export let entranceHistory: EntranceHistoryItem[];

  let filterName = '';

  $: filteredHistory =
    entranceHistory === undefined || entranceHistory.length === 0
      ? []
      : filterEntranceHistoryByName(entranceHistory, filterName);
</script>

<h3>进出记录</h3>

<FilterInput bind:filterName />

<main>
  <table>
    <tr>
      <th scope="col">序号</th>
      <th scope="col">时间</th>
      <th scope="col">姓名</th>
      <th scope="col">状态</th>
    </tr>
    {#each filteredHistory as e, i}
      <tr>
        <th scope="row">{i + 1}</th>
        <td>{e.timestamp}</td>
        <td>{e.user.screenName}</td>
        <td
          >{e.status}</td
        >
      </tr>
    {/each}
  </table>
</main>

<style>
  table,
  th,
  td {
    border: 1px solid;
    padding: 5px;
  }

  main {
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    padding: 5px;
    resize: both;
    min-height: 50vh;
    max-height: 90vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow: auto;
    min-width: 50vh;
    max-width: 80vw;
    width: 75vw;
    height: 80vh;
  }
</style>
