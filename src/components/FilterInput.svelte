<script lang="ts">
  export let filterName: string;
</script>

<label>
  输入姓名或拼音以筛选名单 <br />
  <input type="text" bind:value={filterName} />
</label>
<br />

<!-- <Textfield
    variant="outlined"
    bind:value={filterName}
    label="输入姓名或拼音以筛选名单"
>
    <Icon class="material-icons" slot="leadingIcon">person</Icon>
</Textfield> -->
