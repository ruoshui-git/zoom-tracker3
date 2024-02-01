<script lang="ts">
  import type { RosterRecord } from '../../stores/zoom';
  export let roster: RosterRecord;
</script>

<p>时间：{roster.timestamp}</p>

<table>
  <thead>
    <tr>
      <th scope="col">序号</th>
      <th scope="col">地点</th>
      <th scope="col">姓名</th>
    </tr>
  </thead>
  <tbody>
    {#each roster.participants as item, i}
      <tr>
        <td>{i + 1}</td>
        <td>{item.location === 'meeting' ? 'Zoom房间' : '等候室'}</td>
        <td>{item.participant.screenName}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table,
  th,
  td {
    border: 1px solid;
    padding: 5px;
  }
</style>
