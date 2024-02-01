<script lang="ts">
  import Router from 'svelte-spa-router';
  import SingleRecordDisplay from './SingleRecordPage.svelte';

  const routes = {
    '/:id': SingleRecordDisplay,
  };

</script>

<Router prefix={'/client/records'} {routes} />

