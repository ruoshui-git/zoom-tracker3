<script lang="ts">
  import Router from 'svelte-spa-router';
  import SingleRecordDisplay from './SingleRecordPage.svelte';
  import { liveQuery } from 'dexie';
  import { db } from '../../database/db';
  import TrackerDataDisplay from '../common/TrackerDataDisplay.svelte';

  const routes = {
    '/:id': SingleRecordDisplay,
  };

</script>

<Router prefix={'/client/records'} {routes} />

