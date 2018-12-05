<template>
  <div class="imageCropper">
    <div class="btn-choose"
         :style="btnStyle">
      <input type="file"
             name="avatar"
             id="file-input"
             class="file-input"
             accept="image/*">
      选择文件
    </div>
    <div class="preview-container">
      <div class="image-container target"
           id="cropper-target"
           :style="{ width: width +'px', height: height + 'px'}">
        <img :src=backgroundUrl
             class="noavatar"
             id="target-img">
      </div>
      <div class="large-wrapper"
           v-if="target.visible">
        <div class="image-container large"
             :style="{ width: target.w +'px', height: target.h + 'px'}"
             id="preview-large">
          <img :src=backgroundUrl
               class="noavatar">
        </div>
      </div>
      <canvas id="cropper-canvas"
              :width="target.w"
              :height="target.h"></canvas>
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
        return {
          //背景图片的路径
          backgroundUrl: {
            type: String,
            default: ''
          },
          //图片容器的宽度
          width: {
            type: Number,
            default: 336
          },
          //图片容器的高度
          height: {
            type: Number,
            default: 400
          },
          //预览框的大小及可见性
          target: {
            type: Object,
            default: function() {
              return {
                w: 168, // 宽度
                h: 200, // 高度
                visible: 1 //是否显示
              };
            }
          },
          // 按钮样式
          btnStyle: {
            type: Object,
            default: function() {
              return {};
            }
          }
        }
      }
    }
  },
  mounted: function() {
    let _this = this;
    let canvas = document.getElementById("cropper-canvas");
    let ctx = canvas.getContext("2d");
    let img = document.getElementById("target-img");
    // 是否需要加载预览框
    let priviews = _this.target.visible
      ? [document.getElementById("preview-large")]
      : [];
    let cropper = new Cropper({
      //放置图片的操作区域
      element: document.getElementById("cropper-target"),
      //预览图片的区域
      previews: priviews,
      //宽高比
      aspectRatio: _this.target.w / _this.target.h,
      //初始化拖拽框的宽度
      width: _this.target.w,
      //初始化拖拽框的高度
      height: _this.target.h,
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
          _this.target.w,
          _this.target.h
        );
        var newImg = canvas.toDataURL();
        _this.$emit('cutImg', newImg);
      }
    });
    //选择文件后的操作
    var input = document.getElementById("file-input");
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
  }
};
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

#cropper-canvas {
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
