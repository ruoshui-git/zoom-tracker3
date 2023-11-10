<script lang="ts">
  export let filterName: string;
</script>

<label>
  输入姓名或拼音以筛选名单
  <input type="text" name="filter" id="filter" bind:value={filterName} />
</label>

<!-- <Textfield
    variant="outlined"
    bind:value={filterName}
    label="输入姓名或拼音以筛选名单"
>
    <Icon class="material-icons" slot="leadingIcon">person</Icon>
</Textfield> -->
