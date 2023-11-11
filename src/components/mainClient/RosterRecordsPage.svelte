<script lang="ts">
  import Drawer, { AppContent, Content } from '@smui/drawer';
  import List, { Item, Text } from '@smui/list';
  import { liveQuery, type IndexableTypePart } from 'dexie';
  import { db } from '../../database/db';

  let clicked = 'nothing yet';

  $: allRosterTimestamps = liveQuery(() =>
    db.rosterRecords.orderBy('id').primaryKeys()
  );

  let currentTimestamp: IndexableTypePart | undefined;

  $: currentRoster = liveQuery(() => db.rosterRecords.get(currentTimestamp));

  $: console.log(currentTimestamp);
  $: console.log(currentRoster);
</script>

<div class="drawer-container">
  {#if $allRosterTimestamps}
    <Drawer>
      <Content>
        <List>
          {#each $allRosterTimestamps as timestamp}
            <Item
              on:click={(e) => {
                e.preventDefault();
                currentTimestamp = timestamp;
              }}
            >
              <Text>{timestamp.toString()}</Text>
            </Item>
          {:else}
            <p>暂无人名记录。</p>
          {/each}
        </List>
      </Content>
    </Drawer>

    <AppContent class="app-content">
      <main class="main-content">
        {#if currentTimestamp}
          {#await $currentRoster}
            <p>正在获取名单</p>
          {:then roster}
            {#if roster}
              <p>时间：{currentTimestamp}</p>
              <ol>
                {#each roster.participants as p}
                  <li>{p.screenName}</li>
                {/each}
              </ol>
            {:else}
              <p>无法获取名单。</p>
            {/if}
          {:catch e}
            <p>获取名单失败。</p>
            <p>错误：{JSON.stringify(e)}</p>
          {/await}
        {/if}
      </main>
    </AppContent>
  {/if}
</div>

<style>
  /* These classes are only needed because the
      drawer is in a container on the page. */
  .drawer-container {
    position: relative;
    display: flex;
    height: 350px;
    max-width: 600px;
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    overflow: hidden;
    z-index: 0;
  }

  * :global(.app-content) {
    flex: auto;
    overflow: auto;
    position: relative;
    flex-grow: 1;
  }

  .main-content {
    overflow: auto;
    padding: 16px;
    height: 100%;
    box-sizing: border-box;
  }
</style>
