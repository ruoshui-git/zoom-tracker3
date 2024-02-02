<!--
    Only meat to be a temporary solution.
-->
<script lang="ts">
  import { DateTime } from 'luxon';
  import type { ActiveSpeakerTimeline } from '../../stores/zoom';

  export let timeline: ActiveSpeakerTimeline;
</script>

<h3>开麦记录</h3>

<main>
  <table>
    <tr>
      <th scope="col"> 时间 </th>
      <th scope="col">开麦人员</th>
    </tr>
    {#each timeline.timeline as event}
      <tr>
        <td>{DateTime.fromSeconds(event.timestamp).toLocal().toISO()}</td>
        <td>
          {event.users.map((u) => u.screenName).join(', ')}
        </td>
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
