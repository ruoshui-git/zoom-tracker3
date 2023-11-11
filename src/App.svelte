<script lang="ts">
  import zoomSdk from '@zoom/appssdk';

  import Router, { push, replace } from 'svelte-spa-router';

  import { onMount } from 'svelte';
  import ParticipantList from './components/tracker/ParticipantList.svelte';
  import {
    entranceEvents,
    userRole,
    participantsJoinedBefore,
  } from './stores/zoom';
  import TrackerRouter from './components/tracker/TrackerRouter.svelte';
  import Install from './components/Install.svelte';
  import Client from './components/Client.svelte';
  import { get } from 'svelte/store';
  import ZoomUser from './lib/zoomUser';
  import { DateTime } from 'luxon';

  let context: string;
  let isZoom = false;
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
        ],
      });

      isZoom = true;

      context = configResponse.runningContext;
      console.debug('Zoom JS SDK Configuration', configResponse);

      isMainClient = context === 'inMainClient';

      /* 
      {
  "timestamp": 1614831950,
  "participants": [
    {
      "status": "join",
      "screenName": "xxxxx",
      "participantUUID": "xxxxxxx"
      "role": "attendee"
    }
  ]
}
      */
      $participantsJoinedBefore = (
        await zoomSdk.getMeetingParticipants()
      ).participants.map((p) => {
        return {
          timestamp: DateTime.now(),
          status: 'joined-before',
          user: new ZoomUser(p.participantUUID, p.screenName, p.role),
        };
      });

      zoomSdk.onParticipantChange(
        (e) => ($entranceEvents = [...$entranceEvents, e])
      );

      if (isMainClient) {
        replace('/client');
      } else if (isZoom) {
        replace('/tracker');
      }

      const userContextRes = await zoomSdk.getUserContext();
      userRole.set(userContextRes.role);
      console.log(get(userRole));
    } catch (e) {
      console.error(e);
    }
  });

  $: console.log(`Context: ${context}`);

  const routes = {
    '/tracker/': TrackerRouter,
    '/tracker/*': TrackerRouter,
    '/client/': Client,
    '/*': Install,
  };
  // import TodoList from '../components/Todo/List.vue';
  // import { computed } from 'vue';
</script>

<main>
  <h1>Zoom考勤 V3</h1>

  <Router {routes} />
</main>
