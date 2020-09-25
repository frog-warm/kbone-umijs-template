/**
 * 配置参考：https://wechat-miniprogram.github.io/kbone/docs/config/
 */
const path = require('path');

module.exports = {
  origin: 'http://blog.tuzuyong.net',
  entry: '/index',
  router: {
    home: ['/home', 'index'],
    service: ['/service'],
    my: ['/my'],
  },
  redirect: {
    notFound: 'index',
    accessDenied: 'index',
  },
  generate: {
    autoBuildNpm: 'npm',
  },
  app: {
    navigationBarTitleText: '我是标题',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
  },
  appExtraConfig: {
    sitemapLocation: 'sitemap.json',
  },
  global: {
    loadingView: path.join(__dirname, '../src/loading-view'),
    loadingViewName: 'loading',
  },
  pages: {
    my: {
      extra: {
        navigationBarBackgroundColor: '#fe4b4b',
        navigationBarTitleText: '我的',
        navigationBarTextStyle: 'white',
      },
    },
  },
  optimization: {
    domSubTreeLevel: 10,

    elementMultiplexing: true,
    textMultiplexing: true,
    commentMultiplexing: true,
    domExtendMultiplexing: true,

    styleValueReduce: 5000,
    attrValueReduce: 5000,
  },
  projectConfig: {
    projectname: 'kbone-umijs-template',
    appid: 'xx',
  },
};
