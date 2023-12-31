<script lang="ts">
  import zoomSdk from '@zoom/appssdk';
  import { DateTime } from 'luxon';

  import DataTable, {
    Body,
    Cell,
    Head,
    Label,
    Row,
    SortValue,
  } from '@smui/data-table';
  import IconButton from '@smui/icon-button';
  import ZoomUser, { filterUsersByName } from '../../../lib/zoomUser';
  import FilterInput from '../../FilterInput.svelte';
  import { onMount } from 'svelte';
  import { db, type RosterRecord } from '../../../database/db';
  import { liveQuery } from 'dexie';

  let error: string;
  let currentRoster: RosterRecord | undefined;
  $: lastRoster = liveQuery(() => db.rosterRecords.orderBy('id').last());

  onMount(() => {
    console.log('mounting');
    console.log()
    if ($lastRoster) {
      currentRoster = $lastRoster;
      handleSort();
    }
  });

  const getParticipants = async () => {
    try {
      const record = (await zoomSdk.getMeetingParticipants()).participants.map(
        (res) => {
          return new ZoomUser(res.participantUUID, res.screenName, res.role);
        }
      );
      const time = DateTime.now();
      const newRoster = {
        timestamp: time,
        id: time.toLocal().toString(),
        participants: record,
      };
      currentRoster = newRoster;
      handleSort();
      await db.rosterRecords.add(newRoster);
      error = '';
    } catch (e: any) {
      error = JSON.stringify(e);
      if (e.code === '10047') {
        error =
          '需要 Host 或 Co-Host 权限才能使用此功能。获得权限后请刷新重试。';
      }
    }
  };

  function handleSort() {
    currentRoster?.participants.sort((a, b) => {
      const [aVal, bVal] = [a[sort], b[sort]][
        sortDirection === 'ascending' ? 'slice' : 'reverse'
      ]();
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal, 'zh-CN');
      }
      return Number(aVal) - Number(bVal);
    });
  }

  let sort: keyof ZoomUser = 'screenName';
  let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';
  let filterName: string = '';

  $: filteredParticipants = currentRoster
    ? filterUsersByName(currentRoster.participants, filterName)
    : [];
</script>

<button on:click={getParticipants}> 获取名单 </button>

{#if error}
  <p class="error">错误：{error}</p>
{:else if currentRoster}
  <br />
  <br />

  <FilterInput bind:filterName />

  <p>最后更新: {currentRoster.timestamp.toLocal().toString()}</p>
  <p>注：名单中不包括等候室 (Waiting Room) 人员</p>

  <DataTable
    sortable
    bind:sort
    bind:sortDirection
    on:SMUIDataTable:sorted={handleSort}
    table$aria-label="User list"
    style="width: 100%;"
  >
    <Head>
      <Row>
        <Cell numeric sortable={false} columnId="order">
          <!-- For numeric columns, icon comes first. -->
          <!-- <IconButton class="material-icons">arrow_upward</IconButton> -->
          <Label>序号</Label>
        </Cell>
        <Cell columnId="screenName" style="width: 100%;">
          <Label>Zoom名称</Label>
          <!-- For non-numeric columns, icon comes second. -->
          <IconButton class="material-icons">arrow_upward</IconButton>
        </Cell>
      </Row>
    </Head>
    <Body>
      {#each filteredParticipants as p, i (p.participantUUID)}
        <Row>
          <Cell numeric>{i + 1}</Cell>
          <Cell>{p.screenName}</Cell>
        </Row>
      {/each}
    </Body>
  </DataTable>
{/if}

<style>
  .error {
    color: red;
  }
</style>
