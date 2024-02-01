<script lang="ts">
  export let filterName: string;
</script>

<label>
  输入姓名或拼音以筛选名单
  <input type="text" bind:value={filterName}/>
</label>
