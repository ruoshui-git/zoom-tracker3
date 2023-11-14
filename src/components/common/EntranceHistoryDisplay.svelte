<script lang="ts">
  import { DateTime } from 'luxon';
  import type { EntranceHistoryItem } from '../../stores/zoom';
  export let entranceHistory: EntranceHistoryItem[];
</script>

<h3>进出记录</h3>
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
      <td>{e.timestamp.toLocal().toISO()?.toString().replace('T', '  ')}</td>
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

<style>
  table,
  th,
  td {
    border: 1px solid;
    padding: 5px;
  }
</style>
