<template>
  <page-content>
    <animations ref="anim" v-if="!douban.playing">
      <h1 class="center" ref="title">{{douban.hot.billboard.name}}</h1>
      <p class="center" ref="desc">{{douban.hot.billboard.comment}}</p>
      <div class="hot">
        <Row :gutter="50">
          <Col v-for="(item, index) in douban.hot.songs" class="item" :span="4" :key="item.song_id" ref="song">
            <div class="pic" :style="{ backgroundImage:'url(' + item.album_500_500 + ')' }">
              <flex class="layer" align="left" valign="middle" overflow="hide" v-redirect="'/douban/play/' + item.song_id">
                <flex class="play" align="center" valign="middle"><Icon type="play"></Icon></flex>
                <flex class="text" :span="1">{{item.title}}</flex>
              </flex>
            </div>
          </Col>
        </Row>
      </div>
    </animations>
    <div v-else>
      dasfaf
    </div>
  </page-content>
</template>

<script>
  export default {
    name: "douban",
    computed: {
      douban() {
        return this.$store.state.douban;
      },
    },
    mounted() {
      this.$refs.anim.enter([
        [
          {
            el: this.$refs.title,
            callout: 'transition',
            name: 'slide',
            direction: 'left',
            size: true,
            fixed: true,
          },
          {
            el: this.$refs.desc,
            callout: 'callout',
            name: 'flash'
          }
        ],
        {
          el: this.$refs.song,
          callout: 'transition',
          name: 'slide',
          direction: 'up',
          size: true,
          fixed: true,
          gutter: 6,
          stagger: 80
        }
      ]);
    }
  }
</script>

<style lang="less" scoped>
  .center{
    text-align: center;
  }
  p.center{
    margin: 30px 0;
  }
  .hot {
    padding: 0px 30px;
    .item{
      opacity:0;
      margin-bottom: 50px;
    }
    .pic{
      background-color: #fff;
      border-radius:3px;
      background-size: cover;
      height: 300px;
      position: relative;
      box-shadow: 0px 10px 30px rgba(0,0,0,.5);
      .layer{
        cursor: pointer;
        position: absolute;
        left: 0;
        bottom:0;
        background: rgba(0,0,0,.5);
        color:#fff;
        width: 100%;
        border-radius: 0 0 3px 3px;
        padding: 10px 15px 10px 5px;
        transition:all .3s ease;
        .play{
          width: 20px;
          height: 20px;
        }
        &:hover{
          background: rgba(0,173,239,.5);
        }
      }
    }
  }
</style>