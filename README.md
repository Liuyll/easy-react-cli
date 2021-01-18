# easy-react-cli ssr

## features

+ server/client热更新
+ 快速切换至CSR渲染
+ 支持`typescript`
+ 简单的数据`preload`
+ 配置化路由

## analysis

### 热更新
+ 客户端

    对于客户端的热更新不必多言，利用`dev-server`做HMR即可
+ 服务端

    对于服务端的热更新有点巧妙，我们把`dev-server`的生产文件持久化到`output`位置，并且读取`dev-server`产生的`update.js`进行热更新。