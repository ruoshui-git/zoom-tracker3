<script lang="ts">
  import DataTable, {
    Head,
    Body,
    Row,
    Cell,
    Label,
    SortValue,
  } from '@smui/data-table';

  import { entranceHistory } from '../../../stores/zoom';
  import { filterEntranceHistoryByName } from '../../../lib/zoomUser';
  import FilterInput from '../../FilterInput.svelte';


  let filterName = '';

  $: filteredHistory = filterEntranceHistoryByName(
    $entranceHistory,
    filterName
  );
</script>

<FilterInput bind:filterName />

<DataTable>
  <Head>
    <Row>
      <Cell columnId="order">序号</Cell>
      <Cell columnId="time">时间</Cell>
      <Cell columnId="name">Zoom名称</Cell>
      <Cell columnId="status">状态</Cell>
    </Row>
  </Head>
  <Body>
    {#each filteredHistory as entry, i}
      <Row>
        <Cell>{i + 1}</Cell>
        <Cell>{entry.timestamp.toISOTime()}</Cell>
        <Cell>{entry.user.screenName}</Cell>
        <Cell
          >{entry.status === 'join'
            ? '进入'
            : entry.status === 'joined-before'
            ? '已进入'
            : '离开'}</Cell
        >
      </Row>
    {/each}
  </Body>
</DataTable>
