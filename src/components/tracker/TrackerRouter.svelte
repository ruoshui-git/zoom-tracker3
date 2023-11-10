<script lang="ts">
    import Router, { link } from 'svelte-spa-router';

    import zoomSdk from '@zoom/appssdk';

    import EntranceHistory from './EntranceHistory.svelte';
    import InsufficientPrivilege from './InsufficientPrivilege.svelte';
    import ParticipantList from './ParticipantList.svelte';
    import { onMount } from 'svelte';
    import Loading from './Loading.svelte';
    import { userRole } from '../../stores/zoom';

    import Accordion, { Panel, Header } from '@smui-extra/accordion';

    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import Button from '@smui/button';
    import Paper, { Content } from '@smui/paper';

    let active = 'Home';
</script>

{#if $userRole === 'host' || $userRole === 'coHost'}
    <TabBar tabs={['人员名单', '进出记录']} let:tab bind:active>
        <!-- Note: the `tab` property is required! -->
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
    {/if}
    
{:else if $userRole === ''}
    <Loading />
{:else}
    <InsufficientPrivilege />
{/if}
