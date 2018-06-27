<template>
  <ul class="nav-list">
    <li v-for="(parent, parentIndex) in $store.state.main.nav" :key="parentIndex">
      <Tooltip :content="parent.name" placement="right" v-if="!parent.child">
        <Icon :type="parent.icon" class="icon" v-redirect="parent.link"></Icon>
      </Tooltip>
      <div class="item" v-else>
        <Icon :type="parent.icon" class="icon"></Icon>
        <div class="detail">
          <div class="name">{{parent.name}}</div>
          <ul v-if="parent.child">
            <li v-for="(item, itemIndex) in parent.child" :key="itemIndex" v-redirect="item.link">
              <Icon :type="item.icon" v-if="item.icon"></Icon>
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "page-nav"
  }
</script>

<style lang="less">
  @import "../lib/style";
  ul.nav-list{
    list-style: none;
    padding: 0;
    margin: 0;
    display: block;
    height: 100%;
    & > li{
      font-size: 20px;
      position: relative;
      color:#fff;
      text-align: center;
      line-height: 50px;
      height: 50px;
      cursor: pointer;
      .icon{
        display: block;
        height: 50px;
        line-height: 50px;
        width: 100%;
        text-align: center;
      }
      & > .item{
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
      }
      .detail{
        display: none;
        min-width: 200px;
        text-align: left;
        position: absolute;
        top: 0;
        left:60px;
        background-color: #fff;
        font-size: 12px;
        box-shadow: 4px 4px 1px rgba(0,0,0,.05);
        .name{
          height: 50px;
          line-height: 50px;
          padding: 0px 20px;
          background-color: @side-color-hover;
          font-weight: bold;
        }
        & > ul{
          list-style: none;
          padding: 0;
          margin: 0;
          color: #333;
          li{
            height: 40px;
            line-height: 40px;
            padding: 0px 20px;
            border-bottom: 1px solid #f9f9f9;
            transition: all .3s ease;
            i{
              display: inline-block;
              width: 15px;
            }
            &:hover{
              background-color: #f9f9f9;
            }
          }
        }
      }
      &:hover{
        background-color: @side-color-hover;
        .detail{
          display: block;
        }
      }
    }
  }
</style>