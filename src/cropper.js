//空白图片
let blankImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

//预加载元素
let preLoadElement;

//ie浏览器版本
let ieVersion = Number(document.documentMode);

//是否正在拖拽
let isDragging = false;

//判断是否为ie8
let isIE8 = ieVersion < 9;

//定义移动方向
let configDirection = {
  'n':  { top: true, height: -1 }, //上
  'w':  { left: true, width: -1 }, //左
  'e':  { width: 1 }, //右
  's':  { height: 1 }, //下
  'nw': { left: true, top: true, width: -1, height: -1 }, //左下
  'ne': { top: true, width: 1, height: -1 }, //
  'sw': { left: true, width: -1, height: 1 },
  'se': { width: 1, height: 1 }
};

/**
 * @description 创建dom元素
 * @param config 添加对象及内部元素
 * @param refs 
 */
let createDOM = function(config, refs) {
  if (!config) return null;
  let dom, childElement;
  if (config.tag) {
    dom = document.createElement(config.tag);
    for (let prop in config) {
      if (config.hasOwnProperty(prop)) {
        if (prop === 'content' || prop === 'tag') continue;
        if (prop === 'key' && refs) {
          let key = config[prop];
          if (key) {
            refs[key] = dom;
          }
        }
        dom[prop] = config[prop];
      }
    }
    let content = config.content;
    if (content instanceof Array) {
      for (let i = 0, j = content.length; i < j; i++) {
        let child = content[i];
        childElement = createDOM(child, refs);
        dom.appendChild(childElement);
      }
    } else if (typeof content === 'string') {
      childElement = document.createTextNode(content);
      dom.appendChild(childElement);
    }
  }
  return dom;
};


/**
 * @description 拖拽方法
 */

/**
 * @description 为元素绑定on事件
 * @param element 指定元素
 * @param event 事件名称（mouseon...）
 * @param fn 绑定事件
 */
let bindEvent = function(element, event, fn) {
  //attachEvent为ie特有
  if (element.attachEvent) {
    element.attachEvent('on' + event, fn);
  } else {
    element.addEventListener(event, fn, false);
  }
};

/**
 * @description 为元素解除绑定on事件
 * @param element 指定元素
 * @param event 事件名称（mouseon...）
 * @param fn 绑定事件
 */
let unbindEvent = function(element, event, fn) {
  //attachEvent为ie特有
  if (element.detachEvent) {
    element.detachEvent('on' + event, fn);
  } else {
    element.removeEventListener(event, fn);
  }
};


/**
 * @description 校正ie8浏览器钟x.y位置
 * @param event 事件对象
 */
let adjustEvent = function(event) {
  let scrollTop = Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0);
  let scrollLeft = Math.max(window.scrollX || 0, document.documentElement.scrollLeft || 0);

  event.target = event.srcElement;
  event.pageX = scrollLeft + event.clientX;
  event.pageY = scrollTop + event.clientY;
};

/**
 * @description 拖拽事件
 * @param {} element  元素
 * @param {*} options 元素属性
 */
let draggable = function(element, options) {
  let moveFn = function(event) {
    if (isIE8) {
      adjustEvent(event);
    }
    if (options.drag) {
      options.drag(event);
    }
  };
  let upFn = function(event) {
    if (isIE8) {
      adjustEvent(event);
    }
    unbindEvent(document, 'mousemove', moveFn);
    unbindEvent(document, 'mouseup', upFn);
    document.onselectstart = null;
    document.ondragstart = null;

    isDragging = false;

    if (options.end) {
      options.end(event);
    }
  };
  bindEvent(element, 'mousedown', function(event) {
    if (isIE8) {
      adjustEvent(event);
    }
    if (isDragging) return;
    document.onselectstart = function() { return false; };
    document.ondragstart = function() { return false; };

    bindEvent(document, 'mousemove', moveFn);
    bindEvent(document, 'mouseup', upFn);
    isDragging = true;

    if (options.start) {
      options.start(event);
    }
  });
};

/**
 * @description 获取元素相对父元素的位置
 * @param {dom} element 元素对象
 */
let getPosition = function (element) {
  let selfRect = element.getBoundingClientRect();
  let parentRect = element.offsetParent.getBoundingClientRect();

  return {
    left: selfRect.left - parentRect.left,
    top: selfRect.top - parentRect.top
  };
};

let Resizer = function(options) {
  for (let prop in options) {
    if (options.hasOwnProperty(prop)) this[prop] = options[prop];
  }
};

Resizer.prototype.doOnStateChange = function(state) {
};

Resizer.prototype.makeDraggable = function(dom) {
  let self = this;
  let dragState = {};
  let containment;

  draggable(dom, {
    start: function (event) {
      let parentNode = dom.parentNode;
      containment = {
        left: 0,
        top: 0,
        width: parentNode.clientWidth,
        height: parentNode.clientHeight,
        right: parentNode.clientWidth,
        bottom: parentNode.clientHeight
      };

      dragState.startLeft = event.clientX;
      dragState.startTop = event.clientY;

      let position = getPosition(dom);

      dragState.resizerStartLeft = position.left;
      dragState.resizerStartTop = position.top;
      dragState.resizerStartWidth = dom.offsetWidth;
      dragState.resizerStartHeight = dom.offsetHeight;
    },
    drag: function (event) {
      let offsetLeft = event.clientX - dragState.startLeft;
      let offsetTop = event.clientY - dragState.startTop;

      let left = dragState.resizerStartLeft + offsetLeft;
      let top = dragState.resizerStartTop + offsetTop;

      if (left < containment.left) {
        left = containment.left;
      }

      if (top < containment.top) {
        top = containment.top;
      }

      if (left + dragState.resizerStartWidth > containment.right) {
        left = containment.right - dragState.resizerStartWidth;
      }

      if (top + dragState.resizerStartHeight > containment.bottom) {
        top = containment.bottom - dragState.resizerStartHeight;
      }

      dom.style.left = left + 'px';
      dom.style.top = top + 'px';

      self.doOnStateChange();
    },
    end: function () {
      dragState = {};
      if (self.doOnDragEnd) {
        self.doOnDragEnd();
      }
    }
  });
};

Resizer.prototype.bindResizeEvent = function(dom) {
  let self = this;
  let resizeState = {};
  let aspectRatio = self.aspectRatio;

  if (typeof aspectRatio !== 'number') {
    aspectRatio = undefined;
  }

  let makeResizable = function (bar) {
    let type = bar.className.split(' ')[0];
    let transformMap = configDirection[type.substr(4)];

    let containment;

    draggable(bar, {
      start: function (event) {
        let parentNode = dom.parentNode;
        containment = {
          left: 0,
          top: 0,
          width: parentNode.clientWidth,
          height: parentNode.clientHeight,
          right: parentNode.clientWidth,
          bottom: parentNode.clientHeight
        };

        resizeState.startWidth = dom.clientWidth;
        resizeState.startHeight = dom.clientHeight;
        resizeState.startLeft = event.clientX;
        resizeState.startTop = event.clientY;

        let position = getPosition(dom);
        resizeState.resizerStartLeft = position.left;
        resizeState.resizerStartTop = position.top;
      },
      drag: function (event) {
        let widthRatio = transformMap.width;
        let heightRatio = transformMap.height;

        let offsetLeft = event.clientX - resizeState.startLeft;
        let offsetTop = event.clientY - resizeState.startTop;

        let width, height, minWidth = 50, maxWidth = 10000, minHeight = 50, maxHeight = 10000;

        if (widthRatio !== undefined) {
          width = resizeState.startWidth + widthRatio * offsetLeft;
          if (width < minWidth) {
            width = minWidth;
          }

          if (maxWidth && width > maxWidth) {
            width = maxWidth;
          }
        }

        if (heightRatio !== undefined) {
          height = resizeState.startHeight + heightRatio * offsetTop;
          if (height < minHeight) {
            height = minHeight;
          }

          if (maxHeight && height > maxHeight) {
            height = maxHeight;
          }
        }

        if (aspectRatio !== undefined) {
          if (type === 'ord-n' || type === 'ord-s') {
            width = height * aspectRatio;
          } else if (type === 'ord-w' || type === 'ord-e') {
            height = width / aspectRatio;
          } else {
            if (width / height < aspectRatio) {
              height = width / aspectRatio;
            } else {
              width = height * aspectRatio;
            }
          }
        }

        let position = {
          left: resizeState.resizerStartLeft,
          top: resizeState.resizerStartTop
        };

        if (transformMap.left !== undefined) {
          position.left = resizeState.resizerStartLeft + (width - resizeState.startWidth) * widthRatio;
        }

        if (transformMap.top !== undefined) {
          position.top = resizeState.resizerStartTop + (height - resizeState.startHeight) * heightRatio;
        }

        //=== containment start

        if (width + position.left > containment.right) {
          width = containment.right - position.left;
        }

        if (position.left < containment.left) {
          width -= containment.left - position.left;
          position.left = containment.left;
        }

        if (height + position.top > containment.bottom) {
          height = containment.bottom - position.top;
        }

        if (position.top < containment.top) {
          height -= containment.top - position.top;
          position.top = containment.top;
        }

        //=== containment end

        if (aspectRatio !== undefined) {
          if (width / height < aspectRatio) {
            height = width / aspectRatio;
          } else {
            width = height * aspectRatio;
          }
        }

        if (transformMap.left !== undefined) {
          position.left = resizeState.resizerStartLeft + (width - resizeState.startWidth) * widthRatio;
        }

        if (transformMap.top !== undefined) {
          position.top = resizeState.resizerStartTop + (height - resizeState.startHeight) * heightRatio;
        }

        dom.style.width = width + 'px';
        dom.style.height = height + 'px';

        if (position.left !== undefined) {
          dom.style.left = position.left + 'px';
        }

        if (position.top !== undefined) {
          dom.style.top = position.top + 'px';
        }

        self.doOnStateChange();
      },
      end: function () {
        if (self.doOnDragEnd) {
          self.doOnDragEnd();
        }
      }
    });
  };

  let bars = dom.querySelectorAll('.resize-bar');
  let handles = dom.querySelectorAll('.resize-handle');

  let i, j;

  for (i = 0, j = bars.length; i < j; i++) {
    makeResizable(bars[i]);
  }

  for (i = 0, j = handles.length; i < j; i++) {
    makeResizable(handles[i]);
  }
};

Resizer.prototype.render = function(container) {
  let self = this;

  let dom = createDOM({
    tag: 'div',
    className: 'resizer',
    content: [
      { tag: 'div', className: 'ord-n resize-bar' },
      { tag: 'div', className: 'ord-s resize-bar' },
      { tag: 'div', className: 'ord-w resize-bar' },
      { tag: 'div', className: 'ord-e resize-bar' },
      { tag: 'div', className: 'ord-nw resize-handle' },
      { tag: 'div', className: 'ord-n resize-handle' },
      { tag: 'div', className: 'ord-ne resize-handle' },
      { tag: 'div', className: 'ord-w resize-handle' },
      { tag: 'div', className: 'ord-e resize-handle' },
      { tag: 'div', className: 'ord-sw resize-handle' },
      { tag: 'div', className: 'ord-s resize-handle' },
      { tag: 'div', className: 'ord-se resize-handle' }
    ]
  });

  self.dom = dom;

  self.bindResizeEvent(dom);
  self.makeDraggable(dom);

  if (container) {
    container.appendChild(dom);
  }

  return dom;
};

/**
 * @description 获取图片大小
 * @param {*} src 图片路径
 * @param {*} callback 回调函数
 */
let getImageSize = function(src, callback) {
  if (ieVersion < 10) {
    if (!preLoadElement) {
      preLoadElement = document.createElement('div');
      preLoadElement.style.position = 'absolute';
      preLoadElement.style.width = '1px';
      preLoadElement.style.height = '1px';
      preLoadElement.style.left = '-9999px';
      preLoadElement.style.top = '-9999px';
      //filter 用于定于元素(通常是 <img>)的可视效果。
      preLoadElement.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=image)';
      document.body.insertBefore(preLoadElement, document.body.firstChild);
    }

    preLoadElement.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;

    let size = {
      width: preLoadElement.offsetWidth,
      height: preLoadElement.offsetHeight
    };

    if (typeof callback === 'function') {
      callback(size);
    }
  } else {
    let image = new Image();
    image.onload = function() {
      let size = {
        width: image.width,
        height: image.height
      };
      if (typeof callback === 'function') {
        callback(size);
      }
    };
    image.src = src;
  }
};

/**
 * @description 创建对象
 * @param {*} options 配置选项
 */
let Cropper = function(options) {
  //实例化对象
  let cropper = this;
  if (!(this instanceof Cropper)) {
    cropper = new Cropper();
  }
  
  //对象属性拷贝
  for (let prop in options) {
    if (options.hasOwnProperty(prop)) cropper[prop] = options[prop];
  }

  if (cropper.element) {
    cropper.render(cropper.element);
  }

  //默认宽高比为1
  if (!cropper.aspectRatio) {
    cropper.aspectRatio = 1;
  } 

  return cropper;
};

/**
 * @description 设置拖拽框大小及位置
 */
Cropper.prototype.resetResizer = function() {
  //拖拽框
  let resizer = this.resizer;
  //外部框框
  let cropperRect = this.cropperRect;
  //宽高比
  let aspectRatio = this.aspectRatio;
  //宽高像素比不为数字时给一个默认值
  if (typeof aspectRatio !== 'number') {
    aspectRatio = 1;
  }

  //设定宽高,参数无效时默认值为100
  let width;
  if (this.width && typeof this.width == 'number'){
    width = this.width;
  } else {
    width = 100;
  }
  let height = width / aspectRatio;

  //设置拖拽框的大小
  let resizerDom = resizer.dom;
  resizerDom.style.width = width + 'px';
  resizerDom.style.height = height + 'px';
  
  //有父级元素时将拖拽框水平垂直居中
  if (cropperRect) {
    resizerDom.style.left = (cropperRect.width - width) / 2 + 'px';
    resizerDom.style.top = (cropperRect.height - height) / 2 + 'px';
  } else {
    resizerDom.style.left = resizerDom.style.top = '';
  }

  resizer.doOnStateChange();
  resizer.doOnDragEnd();
};

//设置父级元素的图片源
Cropper.prototype.setImage = function(src) {
  let element = this.element;
  let sourceImage = element.querySelector('img');
  let resizeImage = this.refs.image;

  let self = this;

  //图片为空时
  if (src === undefined || src === null) {
    resizeImage.src = sourceImage.src = blankImage;
    resizeImage.style.width = resizeImage.style.height = resizeImage.style.left = resizeImage.style.top = '';
    sourceImage.style.width = sourceImage.style.height = sourceImage.style.left = sourceImage.style.top = '';

    //更新预览视图
    self.updatePreview(blankImage);

    self.dom.style.display = 'none';
    self.resetResizer();

    self.dom.style.left = self.dom.style.top = '';
    self.dom.style.width = element.offsetWidth + 'px';
    self.dom.style.height = element.offsetHeight + 'px';

    self.croppedRect = {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    };

    self.onCroppedRectChange && self.onCroppedRectChange(self.croppedRect);

    return;
  }

  //获取图片大小后渲染预览图
  getImageSize(src, function(size) {  
    if (ieVersion < 10) {
      //ie9以下使用css渲染本地图片方式
      resizeImage.src = sourceImage.src = blankImage;
      resizeImage.style.filter = sourceImage.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)';
      sourceImage.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
      resizeImage.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
    } else {
      //其他浏览器直接复制src
      resizeImage.src = sourceImage.src = src;
    }

    self.imageSize = size;

    let elementWidth = element.offsetWidth;
    let elementHeight = element.offsetHeight;

    let dom = self.dom;

    let cropperRect = {};
    //图片大小等比缩放到父级容器的宽度之内
    if (size.width / size.height > elementWidth / elementHeight) {
      cropperRect.width = elementWidth;
      cropperRect.height = elementWidth * size.height / size.width;
      cropperRect.top = (elementHeight - cropperRect.height) / 2;
      cropperRect.left = 0;
    } else {
      cropperRect.height = elementHeight;
      cropperRect.width = elementHeight * size.width / size.height;
      cropperRect.top = 0;
      cropperRect.left = (elementWidth - cropperRect.width) / 2;
    }

    self.cropperRect = cropperRect;

    for (let style in cropperRect) {
      if (cropperRect.hasOwnProperty(style)) {
        dom.style[style] = sourceImage.style[style] = resizeImage.style[style] = cropperRect[style] + 'px';
      }
    }

    self.dom.style.display = '';
    self.resetResizer();
    self.updatePreview(src);
  });
};

//添加预览对象
Cropper.prototype.addPreview = function(preview) {
  let previews = this.previews;
  if (!previews) {
    previews = this.previews = [];
  }
  previews.push(preview);
};

//渲染
Cropper.prototype.render = function(container) {
  let resizer = new Resizer({ aspectRatio: this.aspectRatio });
  let refs = {};
  //创建遮罩层
  let dom = createDOM({
    tag: 'div',
    className: 'cropper',
    content: [{
      tag: 'div',
      className: 'mask'
    }]
  }, refs);

  let resizerDom = resizer.render(dom);

  let img = createDOM({
    tag: 'div',
    className: 'wrapper',
    content: [{
      tag: 'img',
      key: 'image',
      src: blankImage
    }]
  }, refs);

  let self = this;
  self.refs = refs;
  //拖拽时更新预览图片
  resizer.doOnStateChange = function() {
    let left = parseInt(resizerDom.style.left, 10) || 0;
    let top = parseInt(resizerDom.style.top, 10) || 0;

    let image = refs.image;

    image.style.left = -left + 'px';
    image.style.top = -top + 'px';

    self.updatePreview();
  };

  resizer.doOnDragEnd = function() {
    let left = parseInt(resizerDom.style.left, 10) || 0;
    let top = parseInt(resizerDom.style.top, 10) || 0;
    let resizerWidth = resizerDom.offsetWidth;
    let resizerHeight = resizerDom.offsetHeight;

    let imageSize = self.imageSize;
    let cropperRect = self.cropperRect;
    //预览部分进行等比缩放
    if (cropperRect) {
      let scale = cropperRect.width / imageSize.width;

      self.croppedRect = {
        width: Math.floor(resizerWidth / scale),
        height: Math.floor(resizerHeight / scale),
        left: Math.floor(left / scale),
        top: Math.floor(top / scale)
      };

      self.onCroppedRectChange && self.onCroppedRectChange(self.croppedRect);
    }
  };
  self.resizer = resizer;
  self.dom = dom;

  resizerDom.insertBefore(img, resizerDom.firstChild);

  container.appendChild(dom);

  self.dom.style.display = 'none';
};

//更新预览图片
Cropper.prototype.updatePreview = function(src) {
  let imageSize = this.imageSize;
  let cropperRect = this.cropperRect;
  if (!imageSize || !cropperRect) return;

  let previews = this.previews || [];

  let resizerDom = this.resizer.dom;
  let resizerLeft = parseInt(resizerDom.style.left, 10) || 0;
  let resizerTop = parseInt(resizerDom.style.top, 10) || 0;

  let resizerWidth = resizerDom.offsetWidth;
  let resizerHeight = resizerDom.offsetHeight;

  for (let i = 0, j = previews.length; i < j; i++) {
    let previewElement = previews[i];
    let previewImage = previewElement.querySelector('img');
    let previewWrapper = previewElement.querySelector('div');

    if (!previewImage) continue;

    if (src === blankImage) {
      previewImage.style.width = previewImage.style.height = previewImage.style.left = previewImage.style.top = '';
      previewImage.src = blankImage;
    } else {
      if (ieVersion < 10) {
        if (src) {
          previewImage.src = blankImage;
          previewImage.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)';
          previewImage.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
          previewImage.style.width = cropperRect.width + 'px';
          previewImage.style.height = cropperRect.height + 'px';
        }
      } else if (src) {
        previewImage.src = src;
      }

      let elementWidth = previewElement.offsetWidth;
      let elementHeight = previewElement.offsetHeight;

      let scale = elementWidth / resizerWidth;

      if (previewWrapper) {
        let elementRatio = elementWidth / elementHeight;
        let resizerRatio = resizerWidth / resizerHeight;

        if (elementRatio < resizerRatio) {
          previewWrapper.style.width = elementWidth + 'px';
          previewWrapper.style.height = resizerHeight * elementWidth / resizerWidth + 'px';
          previewWrapper.style.top = (elementHeight - previewWrapper.clientHeight) / 2 + 'px';
          previewWrapper.style.left = '';
        } else {
          let visibleWidth = resizerWidth * elementHeight / resizerHeight;
          scale = visibleWidth / resizerWidth;
          previewWrapper.style.height = elementHeight + 'px';
          previewWrapper.style.width = visibleWidth + 'px';
          previewWrapper.style.left = (elementWidth - previewWrapper.clientWidth) / 2 + 'px';
          previewWrapper.style.top = '';
        }
      }

      previewImage.style.width = scale * cropperRect.width + 'px';
      previewImage.style.height = scale * cropperRect.height + 'px';
      previewImage.style.left = -resizerLeft * scale + 'px';
      previewImage.style.top = -resizerTop * scale + 'px';
    }
  }
};

export default Cropper;