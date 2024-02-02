<script lang="ts">
  import type { EntranceHistoryItem } from '../../stores/zoom';
  export let entranceHistory: EntranceHistoryItem[];
</script>

<h3>进出记录</h3>
<main>
  <table>
    <tr>
      <th scope="col">序号</th>
      <th scope="col">时间</th>
      <th scope="col">姓名</th>
      <th scope="col">状态</th>
    </tr>
    {#each entranceHistory as e, i}
      <tr>
        <th scope="row">{i + 1}</th>
        <td>{e.timestamp}</td>
        <td>{e.user.screenName}</td>
        <td
          >{e.status === 'join'
            ? '进入'
            : e.status === 'joined-before'
            ? '已进入'
            : '离开'}</td
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
    overflow: auto;
    min-width: fit-content;
    max-width: 80vw;
    width: 75vw;
    height: 80vh;
  }
</style>
