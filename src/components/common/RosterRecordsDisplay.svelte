<script lang="ts">
  import Drawer, { AppContent, Content } from '@smui/drawer';
  import List, { Item, Text } from '@smui/list';
  import type { RosterRecord } from '../../stores/zoom';
  import RosterDisplay from './RosterDisplay.svelte';

  export let rosters: RosterRecord[];
  let currentIndex: number | undefined;
  let isFollowingLatestRoster = true;
  $: if (isFollowingLatestRoster) {
    if (rosters.length) {
      currentIndex = rosters.length - 1;
    }
  }
</script>

<h3>人员记录列表</h3>

<label>
  <input
    type="checkbox"
    name="is-following-latest-roster"
    id="is-following-latest-roster"
    bind:checked={isFollowingLatestRoster}
  /> 自动显示最后名单
</label>

<div class="drawer-container">
  <Drawer>
    <Content>
      <List>
        {#each rosters as roster, i}
          <Item
            on:click={(e) => {
              e.preventDefault();
              currentIndex = i;
            }}
          >
            <Text
              >{roster.timestamp.toISO()?.toString().replace('T', '  ')}</Text
            >
          </Item>
        {:else}
          <p>暂无人名记录。</p>
        {/each}
      </List>
    </Content>
  </Drawer>

  <AppContent class="app-content">
    <main class="main-content">
      {#if currentIndex !== undefined}
        <RosterDisplay roster={rosters[currentIndex]} />
      {:else if rosters.length !== 0}
        <p>暂未选择名单。</p>
      {/if}
    </main>
  </AppContent>
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
