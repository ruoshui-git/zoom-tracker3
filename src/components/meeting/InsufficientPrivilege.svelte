<script lang="ts">
  import zoomSdk from '@zoom/appssdk';

  zoomSdk.onMyUserContextChange((e) => {
    if (e.role === 'host' || e.role === 'coHost') {
      window.location.reload();
    }
  });
  // setTimeout(() => {
  //     window.location.reload();
  // }, 1000);
</script>

<h2 class="error">
  需要 Host 或 Co-Host
  权限才能使用此功能。获得权限后请刷新重试。（权限更改时，此页面会自动刷新）
</h2>

<style>
  .error {
    color: red;
  }
</style>
