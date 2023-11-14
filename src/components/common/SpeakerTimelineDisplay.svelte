<!--
    Only meat to be a temporary solution.
-->
<script lang="ts">
  import { DateTime } from 'luxon';
  import type { ActiveSpeakerTimeline } from '../../stores/zoom';

  export let timeline: ActiveSpeakerTimeline;
</script>

<h3>开麦记录</h3>
<table>
  <tr>
    <th scope="col"> 时间 </th>
    <th scope="col">开麦人员</th>
  </tr>
  {#each timeline.timeline as event}
    <tr>
      <td
        >{DateTime.fromSeconds(event.timestamp)
          .toLocal()
          .toISO()
          ?.toString()
          .replace('T', '  ')}</td
      >
      <td>
        {event.users.map((u) => u.screenName).join(', ')}
      </td>
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
