<script lang="ts">
  import zoomSdk from '@zoom/appssdk';

  import Router, { push, replace } from 'svelte-spa-router';

  import { onMount } from 'svelte';
  import { userRole } from './stores/zoom';
  import Meeting from './components/meeting/Meeting.svelte';
  import Install from './components/Install.svelte';
  import Client from './components/mainClient/Client.svelte';

  let context: string;
  let isZoom: boolean | undefined = undefined;
  let isMainClient: boolean;

  onMount(async () => {
    try {
      const configResponse = await zoomSdk.config({
        size: { width: 480, height: 360 },
        capabilities: [
          'getMeetingUUID',
          'getMeetingParticipants',
          'onParticipantChange',
          'getUserContext',
          'onActiveSpeakerChange',
          'onConnect',
          'onMeeting',
          'openUrl',
        ],
      });

      isZoom = true;

      context = configResponse.runningContext;
      console.debug('Zoom JS SDK Configuration', configResponse);

      isMainClient = context === 'inMainClient';
      if (isMainClient) {
        replace('/client');
      } else if (isZoom) {
        const userContextRes = await zoomSdk.getUserContext();
        userRole.set(userContextRes.role);

        replace('/tracker');
      }
    } catch (e) {
      isZoom = false;
      console.error(e);
    }
  });

  $: console.log(`Context: ${context}`);

  const routes = {
    '/tracker/': Meeting,
    '/tracker/*': Meeting,
    '/client/': Client,
    '/client/*': Client,
    '/*': Install,
  };
</script>

<main>
  <h1>Zoom考勤 V3</h1>

  {#if isZoom !== undefined}
    <Router {routes} />
  {:else}
    <p>正在获取环境信息。请稍等……</p>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 10px;
  }
</style>
