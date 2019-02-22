![](./image/logo.png)

<p text-align="center">
    <img alt="GitHub release" src="https://img.shields.io/badge/version-1.0.3-brightgreen.svg?style=for-the-badge"/>
    <img alt="vue" src ="https://img.shields.io/badge/vue-2.5.16-blue.svg?style=for-the-badge"/>
</p>


> A component which can cuts image and previews the effect at the same time
>
> 可拖拽预览的图片剪裁插件



### 一、使用示例

![](./image/demo.gif)

### 二、组件功能



> 组件功能特点：
>
> * 可在本地选择图片上传前进行裁剪
>
> * 可配置背景图片路径
>
> * 可通过拖拽虚线框实现图片的剪裁操作，虚线框能实时显示拖拽过程
>
> * 拖拽结束后会像父组件传递一个cutImg的事件并带回base64格式的剪裁后的图片路径
>
> * 按钮样式可自定义
>
> * 图片操作框（下图左侧）、图片预览框（下图右侧）大小可配置
>
> * 预览框可配置可见性（默认可见）
>
> * 图片拖拽框（图中虚线框）可定义起始位置及大小（默认为位置图片中心，大小为预览框大小）
>
>   <!--PS：拖拽框起始比例如果和预览框不一致，拖拽后仍以预览框比例为主（需注意如果预览框不可见时，重新定义拖拽框的大小需要将预览框大小一同调节）-->



### 三、组件参数及事件

**参数**

| 参数           | 说明                                                         | 类型    | 默认值 |
| -------------- | ------------------------------------------------------------ | ------- | ------ |
| Setting        | 配置对象(以下参数均为Setting的属性值)                        | Object  |        |
| backgroundUrl  | 剪裁框的背景图片，也可做回显用                               | String  | null   |
| width          | 剪裁区域外框的宽度                                           | Number  | 300    |
| height         | 剪裁区域外框的高度                                           | Number  | 400    |
| target         | 预览框对象                                                   | Object  |        |
| target.w       | 预览框宽度                                                   | Number  | 150    |
| target.h       | 预览框高度                                                   | Number  | 200    |
| target.visible | 预览框是否可见                                               | Boolean | true   |
| cutPos         | 剪裁虚线框对象                                               | Object  |        |
| cutPos.w       | 剪裁虚线框宽度                                               | Number  | 0      |
| cutPos.h       | 剪裁虚线框高度                                               | Number  | 0      |
| cutPos.x       | 剪裁虚线框横向偏移量，大于0有效                              | Number  | 0      |
| cutPos.y       | 剪裁虚线框纵向偏移量，大于0有效                              | Number  | 0      |
| btnStyle       | 按钮样式                                                     | Object  | {}     |
| limitSize      | 限制图片大小，单位M(IE9会弹出ActiveXObject设置提示)，默认不限制 | Number  | 0      |
| format         | 限制图片格式字符串数组，如['.png','jpg']，默认不限制         | Array   | []     |

**方法**

**cutImg(data)**: 返回剪裁后的图片对象

| 属性     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| data     | 返回数据对象                                                 |
| data.pos | 剪裁后的位置信息对象，形如：{left:0,top:0,width:100,height:100} |
| data.url | 剪裁后生成的Base64编码，可直接用于图片展示                   |



### 四、使用方法

```vue
<template>
	<cropper :Setting=setting @cutImg=getCutUrl></cropper>
<!--组件接收一个传入参数Setting（不传时均采取默认值），传出一个事件cutImg携带裁剪后的图片信息包括剪裁位置信息以及路径（base64位）-->
</template>
<script>
  import cropper from '@edu/app-cropper/src/index';
  export default {
    components: {cropper};
    methods:{
      getCutUrl(data) {
        console.log('getCutUrl', data);
      }
    }
    data(){
      return {
        setting:{
          //背景图片的路径
          backgroundUrl: "",
          //图片操作区域宽度
          width: 336,
          //图片操作区域高度
          height: 400,
          //预览框的大小及可见性
          target: {
            w: 168, // 宽度
            h: 200, // 高度
            visible: true //是否显示
          },
          //拖拽框位置
          cutPos: {
            w: 0, // 宽度
            h: 0, // 高度
            x: 0, //相对父级左边距离 大于0有效
            y: 0 //相对父级顶部距离 大于0有效
          }, // 拖拽框的范围为照片的边界，如果xy过大超出边界后，以边界值为准
          // 按钮样式
          btnStyle: {}，
          limitSize: 0, //限制图片大小
          format:[] //限制图片格式
         }
      }
    }
  }
</script>

```



### 五、版本更新日志

**日志**

| Version | Description                                                  |
| ------- | ------------------------------------------------------------ |
| 1.0.0   | 可拖拽预览的图片剪裁插件                                     |
| 1.0.1   | 优化代码                                                     |
| 1.0.2   | 1、增加剪裁位置信息；2、支持限制图片大小；3、支持限制图片格式 |

