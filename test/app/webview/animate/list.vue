<template>
  <page-content>
    <Row class="page" :gutter="20">
      <animations name="transition.slideUpBig" appear :gutter="4" :delay="80">
        <Col v-for="(item, index) in source" :key="index" :span="6" v-bind:data-index="index" class="wrap">
          <div class="item">{{item.msg}}</div>
        </Col>
      </animations>
    </Row>
  </page-content>
</template>

<script>
  import 'velocity-animate/velocity';
  import 'velocity-animate/velocity.ui';
  export default {
    name: "animate-list",
    props: {
      source: Array
    }
  }
</script>

<style lang="less" scoped>
.page{
  .wrap{
    margin-bottom: 20px;
    opacity: 0;
  }
  .item{
    background-color: #fff;
    padding: 20px;
  }
}
</style>