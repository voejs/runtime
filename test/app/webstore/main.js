import { ChildVuex } from 'super-vuex';
const child = new ChildVuex('main');
export default child;
child.setState({
  nav: [
    {
      icon: 'speedometer',
      name: '监控大盘',
      link: '/'
    },
    {
      icon: 'bowtie',
      name: '豆瓣热门电影',
      link: '/douban'
    },
    {
      icon: 'social-html5',
      name: '常用动画集合',
      child: [
        {
          icon: 'wifi',
          name: '列表推移',
          link: '/animate/list'
        }
      ]
    }
  ]
});