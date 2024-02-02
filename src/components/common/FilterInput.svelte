<script lang="ts">
  export let filterName: string;
</script>

<div>
  <label>
    输入姓名或拼音以筛选名单
    <input type="text" bind:value={filterName} />
  </label>
</div>

<style>
  div {
    margin: 2em 0;
  }
</style>