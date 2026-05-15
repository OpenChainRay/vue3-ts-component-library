examples 组件代码测试例子
src 组件代码
## 如何增加组件
1 在src下添加组件代码
2 在src/index.js中注册组件
3 在examples 文件夹下测试组件
## 编译过程

1. 使用 npm

```bash

# install dependencies
npm i

# serve with hot reload at localhost:5700
npm run dev

# build for production with minification
npm run build
#打包
npm pack 

然后上传到局域网nexus上 http://nexus.dev.ant2world.com/
登录密码 

```


2.如何发布到npm上

npm run build
npm publish

```
发包后 使用此命令更新新包
npm cache clean --force