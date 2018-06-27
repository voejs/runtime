<template>
  <div class="content"><slot></slot></div>
</template>

<script>
  export default {
    name: "page-content"
  }
</script>

<style scoped>
  .content{
    padding: 20px;
  }
</style>