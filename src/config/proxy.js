export default {
  mock: {
    // mock 接口地址
    host: 'localhost:3000',
    // mock cdn 路径
    cdn: '',
  },
  development: {
    // 开发环境接口请求
    // host: 'https://tjxt-dev.itheima.net/api',
    host: 'http://118.31.106.4:10010',
    // 开发环境 cdn 路径
    cdn: '',
  },
  test: {
    // 测试环境接口地址
    host: 'http://118.31.106.4:10010',
    // 测试环境 cdn 路径
    cdn: '',
  },
  product: {
    // 正式环境接口地址
    host: 'http://118.31.106.4:10010',
    // 正式环境 cdn 路径
    cdn: '',
  },
};
