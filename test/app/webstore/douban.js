import { ChildVuex } from 'super-vuex';
const child = new ChildVuex('douban');
export default child;
child.setState({
  hot: {
    songs: [],
    billboard: {}
  },
  playing: false
});