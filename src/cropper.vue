<template>
  <div class="imageCropper">
    <p class="p-btn">
      <button class="btn-upload">Select</button>
      <input type="file"
             name="avatar"
             id="file-input"
             class="file-input"
             accept="image/*">
      Support formats: JPG, JEPG, PNG
    </p>
    <div class="preview-container">
      <div class="image-container target"
           id="cropper-target">
        <img src=""
             class="noavatar"
             id="target-img">
      </div>
      <div class="large-wrapper">
        <div class="image-container large"
             id="preview-large">
          <img src=""
               class="noavatar">
        </div>
        <p>预览</p>
      </div>
    </div>
    <canvas id="cropper-canvas"
            width="168"
            height="200"></canvas>
  </div>
</template>

<script>
import Cropper from './cropper.js';
export default {
  mounted: () => {
    let canvas = document.getElementById("cropper-canvas");

    let ctx = canvas.getContext("2d");
    var img = document.getElementById("target-img");

    let cropper = new Cropper({
      element: document.getElementById("cropper-target"),
      previews: [document.getElementById("preview-large")],
      onCroppedRectChange: function(rect) {
        console.log("rect", rect);
        ctx.drawImage(
          img,
          rect.left,
          rect.top,
          rect.width,
          rect.height,
          0,
          0,
          165,
          200
        );
        let newImg = canvas.toDataURL();
        console.log("newImg", newImg);
      }
    });
    let input = document.getElementById("file-input");
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

.p-btn {
  padding-top: 22px;
  line-height: 40px;
  font-size: 14px;
  position: relative;
  color: #666;
  margin-bottom: 30px;
  overflow: hidden;
}

.btn-upload {
  width: 120px;
  padding: 12px 20px;
  font-size: 14px;
  border: 1px solid #1e89e0;
  background-color: transparent;
  color: #1e89e0;
  margin-right: 20px;
}

.file-input {
  position: absolute;
  font-size: 480px;
  top: 22px;
  left: -30px;
  height: 42px;
  width: 150px;
  opacity: 0;
  cursor: pointer;
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
  height: 320px;
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
  width: 330px;
  height: 400px;
  margin-right: 30px;
}

.image-container.target img {
  width: 330px;
  height: 400px;
}

.image-container.large {
  width: 165px;
  height: 200px;
}

.image-container.large img {
  width: 165px;
  height: 200px;
}

.image-container.large .noavatar {
  background-position: -320px 0;
}

.image-container.medium {
  width: 48px;
  height: 48px;
}

.image-container.medium img {
  width: 48px;
  height: 48px;
}

.image-container.medium .noavatar {
  background-position: -324px -210px;
}

.image-container.small {
  width: 20px;
  height: 20px;
  margin-top: 30px;
}

.image-container.small img {
  width: 20px;
  height: 20px;
}

.image-container.small .noavatar {
  background-position: -373px -210px;
}
</style>
