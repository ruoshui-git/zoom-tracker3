<script lang="ts">
  import InsufficientPrivilege from './InsufficientPrivilege.svelte';
  import { onMount } from 'svelte';
  import Loading from './Loading.svelte';
  import {
    initializeTrackerData,
    isInitializingAppData,
    trackerData,
    userRole,
  } from '../../stores/zoom';

  import zoomSdk from '@zoom/appssdk';

  // import Accordion, { Panel, Header } from '@smui-extra/accordion';

  // import Tab, { Label } from '@smui/tab';
  // import TabBar from '@smui/tab-bar';
  // import Button from '@smui/button';
  // import Paper, { Content } from '@smui/paper';
  import TrackerDataDisplay from '../common/TrackerDataDisplay.svelte';
  import GetRoster from './GetRoster.svelte';
  import { handleEndRecord } from '../common/utils';

  let initDone = false;

  type mainClientConnectStatus =
    | '未连接'
    | '正在尝试连接'
    | '连接成功'
    | '连接失败';
  let connectStatus: mainClientConnectStatus = '未连接';

  async function connectMainClient() {
    connectStatus = '正在尝试连接';
    let res = await zoomSdk.connect();
    if (res.message === 'Success') {
      connectStatus = '连接成功';
    } else {
      connectStatus = '连接失败';
    }
  }

  onMount(async () => {
    console.log('mounting Meeting');
    if ($trackerData) {
      // TODO: ask the user whether to start a new record or continue with the previous
      await handleEndRecord();
    }
    await initializeTrackerData();
    initDone = true;
    connectMainClient();
    
  });

  // let active = 'Home';
</script>

<p>
  Zoom客户端连接：{connectStatus}
</p>
{#if connectStatus === '连接失败' || connectStatus === '未连接'}
  <button on:click={connectMainClient}
    >再次尝试连接 Main Client（Zoom客户端）</button
  >
{/if}

{#if $userRole === 'host' || $userRole === 'coHost'}
  <!-- Note: the `tab` property is required! -->
  <!-- <TabBar tabs={['人员名单', '进出记录']} let:tab bind:active>
    <Tab {tab}>
      <Label>{tab}</Label>
    </Tab>
  </TabBar>

  {#if active === '人员名单'}
    <Paper variant="unelevated">
      <Content><ParticipantList /></Content>
    </Paper>
  {:else if active === '进出记录'}
    <Paper variant="unelevated">
      <Content>
        <EntranceHistory />
      </Content>
    </Paper>
  {/if} -->
  {#if initDone}
    <GetRoster />
    <TrackerDataDisplay trackerData={$trackerData} />
  {:else}
    <p>正在初始化数据</p>
  {/if}
{:else if $userRole === ''}
  <Loading />
{:else}
  <InsufficientPrivilege />
{/if}
