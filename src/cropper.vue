<template>
  <div class="imageCropper">
    <div class="btn-choose"
         :style="btnStyle">
      <input type="file"
             name="avatar"
             ref="fileInput"
             class="file-input"
             accept="image/*">
      选择文件
    </div>
    <div class="preview-container">
      <div class="image-container target"
           ref="cropperTarget"
           :style="{ width: width +'px', height: height + 'px'}">
        <img :src=backgroundUrl
             class="noavatar"
             ref="targetImg">
      </div>
      <div class="large-wrapper"
           v-if="target.visible">
        <div class="image-container large"
             :style="{ width: target.w +'px', height: target.h + 'px'}"
             ref="previewLarge">
          <img :src=backgroundUrl
               class="noavatar">
        </div>
      </div>
      <canvas ref="cropperCanvas" class="cropper-canvas"
              :width="cutPos.w ? cutPos.w : target.w"
              :height="cutPos.h ? cutPos.h: target.h"></canvas>
    </div>
  </div>
</template>

<script>
import Cropper from "./cropper.js";
export default {
  props: {
    //配置项
    Setting: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  created: function() {
    //对数据做预处理
    this.updateDom();
  },
  mounted: function() {
    let _this = this;
    let canvas = _this.$refs.cropperCanvas;
    let ctx = canvas ? canvas.getContext("2d") : '';
    let img = _this.$refs.targetImg;
    // 是否需要加载预览框
    let priviews = _this.target.visible
      ? [_this.$refs.previewLarge]
      : [];
    let aspectRatio = _this.target.w / _this.target.h;
    //裁剪框配置了宽度则采用配置宽度，否则采用预览框宽度
    let cutW = _this.cutPos.w ? _this.cutPos.w : _this.target.w;
    //裁剪框配置了高度则采用配置高度，否则采用预览框高度
    let cutH = _this.cutPos.h ? _this.cutPos.h : _this.target.h;
    let cropper = new Cropper({
      //放置图片的操作区域
      element: _this.$refs.cropperTarget,
      //预览图片的区域
      previews: priviews,
      //宽高比
      aspectRatio: aspectRatio,
      //初始化裁剪框的宽度
      width: cutW,
      //初始化裁剪框的高度
      height: cutH,
      //裁剪框横向位置
      x: _this.cutPos.x,
      //裁剪框纵向位置
      y: _this.cutPos.y,
      //拖拽及移动回调事件
      onCroppedRectChange: function(rect) {
        ctx.drawImage(
          img,
          rect.left,
          rect.top,
          rect.width,
          rect.height,
          0,
          0,
          cutW,
          cutH
        ); 
        _this.$emit("cutImg", canvas.toDataURL());
      }
    });
    //选择文件后的操作
    let input = _this.$refs.fileInput;
    input.onchange = function() {
      if (typeof FileReader !== "undefined") {
        var reader = new FileReader();
        reader.onload = function(event) {
          cropper.setImage(event.target.result);
        };
        if (input.files && input.files[0]) {
          reader.readAsDataURL(input.files[0]);
        }
      } else {
        // IE10-
        input.select();
        input.blur();
        var src = document.selection.createRange().text;
        cropper.setImage(src);
      }
    };
  },
  methods: {
    /**
     * @description 属性拷贝
     * @param from 来源
     * @param to 去向
     * @param props 属性
     */
    copyProps(from, to, props) {
      if (typeof from[props] == "object") {
        if( props == "btnStyle") {
          to[props] = from[props];
          return;
        }
        for (let child in from[props]) {
          this.copyProps(from[props], to[props], child);
        }
      } else {
        if ((from[props] || props == "visible") && typeof from[props] == typeof to[props]) {
          to[props] = from[props];
        }
      }
    },
    /**
     * @description 监听组件传值操作，更新dom
     */
    updateDom() {
      let _this = this;
      for (let props in _this.Setting) {
        _this.copyProps(_this.Setting, _this, props);
      }
    }
  },
  data() {
    return {
      //背景图片的路径
      backgroundUrl: "",
      //图片容器的宽度
      width: 336,
      //图片容器的高度
      height: 400,
      //预览框的大小及可见性
      target: {
        w: 168, // 宽度
        h: 200, // 高度
        visible: true //是否显示
      },
      //剪裁框位置
      cutPos: {
        w: 0, // 宽度
        h: 0, // 高度
        x: 0, //相对父级左边距离 大于0有效
        y: 0 //相对父级顶部距离 大于0有效
      },
      // 按钮样式
      btnStyle: {}
    };
  }
}

</script>
<style scoped>
.imageCropper {
  text-align: left;
}

.btn-choose {
  width: 120px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border: 1px solid #1d9ffd;
  background-color: #1d9ffd;
  color: #fff;
  margin: 20px 20px 30px 0;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.file-input {
  position: absolute;
  top: -1px;
  left: 0;
  height: 42px;
  width: 120px;
  opacity: 0;
  cursor: pointer;
  font-size: 0;
}

.preview-container {
  overflow: hidden;
  color: #999;
  margin-bottom: 20px;
}

.preview-container .noavatar {
  background-color: #efeeef;
}

.preview-container > div {
  float: left;
}

.large-wrapper {
  border-left: 1px solid #eee;
  padding-left: 30px;
  margin-right: 30px;
}

.image-container {
  position: relative;
  overflow: hidden;
  border: 1px solid #bbb;
  margin-bottom: 5px;
}

.image-container > img {
  position: absolute;
}

.image-container.target {
  width: 100%;
  height: 100%;
  margin-right: 30px;
}

.image-container.target img,
.image-container.large img {
  width: 100%;
  height: 100%;
}

/* .image-container.large .noavatar {
  background-position: -320px 0;
} */

.cropper-canvas {
  display: none;
}
</style>

<style>
.resizer {
  position: absolute;
  box-sizing: border-box;
  border: 1px dashed #1d9ffd;
  background-color: transparent;
  cursor: move;
}

.resizer .resize-handle {
  position: absolute;
  background-color: #1d9ffd;
  opacity: 0.5;
  filter: alpha(opacity=50);
  font-size: 1px;
  height: 6px;
  width: 6px;
}

.resizer .resize-handle.ord-n {
  cursor: n-resize;
  left: 50%;
  margin-left: -3px;
  margin-top: -3px;
  top: 0;
}

.resizer .resize-handle.ord-s {
  cursor: s-resize;
  bottom: 0;
  left: 50%;
  margin-bottom: -3px;
  margin-left: -3px;
}

.resizer .resize-handle.ord-e {
  cursor: e-resize;
  margin-right: -3px;
  margin-top: -3px;
  right: 0;
  top: 50%;
}

.resizer .resize-handle.ord-w {
  cursor: w-resize;
  left: 0;
  margin-left: -3px;
  margin-top: -3px;
  top: 50%;
}

.resizer .resize-handle.ord-nw {
  cursor: nw-resize;
  left: 0;
  margin-left: -3px;
  margin-top: -3px;
  top: 0;
}

.resizer .resize-handle.ord-ne {
  cursor: ne-resize;
  margin-right: -3px;
  margin-top: -3px;
  right: 0;
  top: 0;
}

.resizer .resize-handle.ord-se {
  cursor: se-resize;
  bottom: 0;
  margin-bottom: -3px;
  margin-right: -3px;
  right: 0;
}

.resizer .resize-handle.ord-sw {
  cursor: sw-resize;
  bottom: 0;
  left: 0;
  margin-bottom: -3px;
  margin-left: -3px;
}

.resizer .resize-bar.ord-n,
.resizer .resize-bar.ord-s {
  position: absolute;
  height: 6px;
  width: 100%;
}

.resizer .resize-bar.ord-e,
.resizer .resize-bar.ord-w {
  position: absolute;
  height: 100%;
  width: 6px;
}

.resizer .resize-bar.ord-n {
  cursor: n-resize;
  margin-top: -3px;
}

.resizer .resize-bar.ord-s {
  cursor: s-resize;
  bottom: 0;
  margin-bottom: -3px;
}

.resizer .resize-bar.ord-e {
  cursor: e-resize;
  margin-right: -3px;
  right: 0;
}

.resizer .resize-bar.ord-w {
  cursor: w-resize;
  margin-left: -3px;
}

.resizer .inner-rect {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  opacity: 0;
  filter: alpha(opacity=0);
}

.cropper {
  position: absolute;
  box-sizing: border-box;
}

.cropper .mask {
  width: 100%;
  height: 100%;
  opacity: 0.4;
  filter: alpha(opacity=40);
  display: block;
  background-color: black;
}

.cropper .resizer .wrapper {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.cropper .resizer .wrapper img {
  position: absolute;
  -webkit-user-select: none;
  -webkit-user-drag: none;
}
</style>
