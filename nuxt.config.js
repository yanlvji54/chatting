export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'chatting-secret',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { hid: 'description', name: 'description', content: '' }, { name: 'format-detection', content: 'telephone=no' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['ant-design-vue/dist/antd.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/antd-ui'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  serverMiddleware: [
    // 解析 application/json
    { path: '/api', handler: require('body-parser').json() },
    // 解析 application/x-www-form-urlencoded
    { path: '/api', handler: require('body-parser').urlencoded({ extended: true }) },
    { path: '/api', handler: '~/api/index.js' }, // 自定义 API 路由
    { path: '/api/user', handler: '~/api/user.js' }, // 自定义 User 路由
    { path: '/api/record', handler: '~/api/record.js' }, // 自定义 record 路由
    { path: '/api/download', handler: '~/api/download.js' } // 自定义 download 路由
  ],

  server: {
    port: 3001, // Change this to your desired port number
    host: '0.0.0.0' // Default: localhost
  }  
}
