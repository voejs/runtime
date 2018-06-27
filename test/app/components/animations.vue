<template>
  <div><slot></slot></div>
</template>

<script>
  import 'velocity-animate/velocity';
  import 'velocity-animate/velocity.ui';
  
  export default {
    name: "animations",
    data() {
      return {
        queue: []
      }
    },
    mounted() {
      this.enter();
    },
    beforeDestroy() {
      console.log('beforeDestroy')
      this.singleLeave(this.queue.length - 1);
    },
    methods: {
      enter(song) {
        this.queue = song;
        this.singleEnter(0);
      },
      enterAnimateName(callout, name, direction, size, fixed) {
        const result = [name];
        switch (direction) {
          case 'up': result.push('Up'); break;
          case 'down': result.push('Down'); break;
          case 'left': result.push('Left'); break;
          case 'right': result.push('Right'); break;
        }
        if (size) {
          result.push('Big');
        }
        if (fixed) {
          result.push('In');
        }
        return callout ? callout + '.' + result.join('') : result.join('');
      },
      leaveAnimateName(callout, name, direction, size, fixed) {
        const result = [name];
        switch (direction) {
          case 'up': result.push('Down'); break;
          case 'down': result.push('Up'); break;
          case 'left': result.push('Right'); break;
          case 'right': result.push('Left'); break;
        }
        if (size) {
          result.push('Big');
        }
        if (fixed) {
          result.push('Out');
        }
        return callout ? callout + '.' + result.join('') : result.join('');
      },
      async singleEnter(i) {
        if (this.queue[i] === undefined) return;
        const item = Array.isArray(this.queue[i]) ? this.queue[i] : [this.queue[i]];
        await Promise.all(item.map(it => {
          const { el, callout, name, direction, size, fixed, stagger, gutter } = it;
          const animateName = this.enterAnimateName(callout, name, direction, size, fixed);
          if (!el) return;
          if (Array.isArray(el)) {
            return Promise.all(el.map((ele, index) => {
              const delay = Math.floor(index / (gutter || 1)) * (stagger || 0);
              return Velocity(ele.$el ? ele.$el : ele, animateName, { delay });
            }));
          } else {
            return Velocity(el, animateName);
          }
        }));
        await this.singleEnter(i + 1);
      },
      async singleLeave(i) {
        if (this.queue[i] === undefined) return;
        const item = Array.isArray(this.queue[i]) ? this.queue[i] : [this.queue[i]];
        await Promise.all(item.map(it => {
          const { el, callout, name, direction, size, fixed, stagger, gutter } = it;
          const animateName = this.leaveAnimateName(callout, name, direction, size, fixed);
          if (!el) return;
          if (Array.isArray(el)) {
            return Promise.all(el.map((ele, index) => {
              const delay = Math.floor((el.length - index - 1) / (gutter || 1)) * (stagger || 0);
              return Velocity(ele.$el ? ele.$el : ele, animateName, { delay });
            }));
          } else {
            return Velocity(el, animateName);
          }
        }));
        await this.singleLeave(i - 1);
      }
    }
  }
</script>