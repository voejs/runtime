import axios from 'axios';
const instance = axios.create({
  // baseURL,
  headers: {
    'X-Custom-Header': 'voe.u51-inc.com'.toUpperCase()
  },
  validateStatus(status) {
    return status >= 200 && status < 300;
  }
});

instance.interceptors.response.use(response => response.data);


export default app => {
  return {
    a: 1,
    ajax: instance,
    get b() {
      return 2
    }
  }
}