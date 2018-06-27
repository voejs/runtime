<template>
  <page-content>
    <h1>dafa - {{abc}} <button @click="up">++</button></h1>
  </page-content>
</template>

<script>
  export default {
    name: "test",
    props: {
      abc: String
    },
    methods: {
      up() {
        this.$store.test.commit('test.text', 'dskajfhdsihfsadhkfhaskhfka');
      }
    }
  }
</script>

<style scoped>

</style>