<template>
  <Dropdown>
    <flex class="header-avatar">
      <avatar :src="avatarUrl" size="small"></avatar>
      <span class="name">沈赟杰</span>
      <Icon type="arrow-down-b"></Icon>
    </flex>
    <DropdownMenu slot="list">
      <DropdownItem disabled><Icon type="person"></Icon> 个人中心</DropdownItem>
      <DropdownItem disabled><Icon type="settings"></Icon> 设置</DropdownItem>
      <DropdownItem><Icon type="bug"></Icon> 触发报错</DropdownItem>
      <DropdownItem divided><Icon type="power"></Icon> 退出登录</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
  export default {
    name: "header-user",
    props: {
      account: String
    },
    computed: {
      avatarUrl() {
        return this.account ? 'http://auth.u51-inc.com/avatar/' + this.account : null;
      }
    }
  }
</script>

<style lang="less" scoped>
  .header-avatar{
    cursor: pointer;
    .name{
      margin: 0 5px;
    }
  }
</style>