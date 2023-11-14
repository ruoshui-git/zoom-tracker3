<script lang="ts">
  import type { RosterRecord } from '../../stores/zoom';
  export let roster: RosterRecord;
</script>

<p>时间：{roster.timestamp.toISO()?.toString().replace('T', '  ')}</p>
<ol>
  {#each roster.participants as p}
    <li>{p.screenName}</li>
  {/each}
</ol>