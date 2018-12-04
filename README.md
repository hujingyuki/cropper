> 组件开发及调试

组件开发不希望在工程中过多依赖开发服务，所以目前我们采用 vue 官方 cli 进行开发调试，如果已经安装了最新脚手架，我们可以直接运行:

<pre>
> cd test-component
> npm install
> vue serve src/test-component.vue --open`
</pre>

如果本地没有安装最新 vue cli，可以全局安装后再试。

<pre>
> npm install @vue/cli -g
</pre>

服务启动成功，浏览器打开后显示当前我们开发的组件。

> 组件单元测试

目前组件单元测试引入 vue 官方提供 test-utils 工具进行测试，并基于 jest 运行测试脚本。
组件开发完成，我们需要在 test 目录下编写单元测试脚本，关于 vue 组件单元测试，建议大家自主学习官方提供文档，运行测试脚本：

<pre>
> npm run test
</pre>

输出相关测试执行结果。

> 组件打包构建

目前我们完成了组件开发及单元测试，现在我们需要将组件进行构建，你可能会很好奇，为什么我们不能直接分享`.vue`文件呢？当然可以，但是这样你可能会让那些想直接通过 js 引用的人无法使用，所以我们需要打包构建，这里为了配置简单及打包文件大小等原因，我们选择了`rollup`，目前配置了三种格式，分别是`es`、`iife`、`umd`，运行打包脚本:

<pre>
> npm run build
</pre>

查看 dist 目录，输出三种格式文件，默认 npm 包指向 umd 文件引用。

- test-component.esm.js
- test-component.min.js
- test-component.umd.js

> 组件提交及发布

组件暂时直接发布到 npm，整个提交及审核后续会有详细机制，暂不提交到 git，同时因公司现有 npm 组件仓库存在相关问题，经过沟通后决定先使用现有自己搭建 npm 仓库，添加及切换到 npm 私服。

<pre>
> npm install nrm -g
> nrm add fly http://172.31.10.36:8090
> nrm use fly
> npm publish
</pre>

打开现有组件私服`http://npm.flyui.cn/`，可以查看到已经发布的组件，若要在项目中使用，直接通过 npm install 方式安装即可。
