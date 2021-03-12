# easy-react-cli ssr

## features

+ server/client热更新
+ 快速切换至CSR渲染
+ 支持`typescript`
+ 简单的数据`preload`
+ 配置化路由

## 使用
```
npm run dev:ssr
```

此时：
+ `localhost:9000`为客户端渲染
+ `localhost:8080`为服务端渲染

### config
+ `mode`: 生产或开发模式
+ `devPort`: 开发模式客户端渲染端口
+ `injectScripts`: `webpack dev`打包出来的客户端渲染文件，不修改`webpack`配置情况下不需要改动
+ `injectCss`: 同上
+ `useLayout`: 是否使用自定义`layout`
+ `buildOptions`: 构建配置
+ `useStreamResponse`: 是否使用流式渲染
## analysis

### 热更新
+ 客户端

    对于客户端的热更新不必多言，利用`dev-server`做HMR即可
+ 服务端

    对于服务端的热更新有点巧妙，我们把`dev-server`的生产文件持久化到`output`位置，并且读取`dev-server`产生的`update.js`进行热更新。