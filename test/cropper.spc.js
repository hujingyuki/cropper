import {
  mount
} from '@vue/test-utils'
import Component from '../src/index'

describe('cropper 测试', () => {
  const wrapper = mount(Component, {
    propsData: {
      Setting: {} //什么都不传
    }
  })

  it('检查不给组件传递值时初始化数据是否正确', () => {

    //组件是否存在
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.contains(".imageCropper")).toBe(true);
    //按钮是否存在
    expect(wrapper.contains(".btn-choose")).toBe(true);
    //图片预览框是否存在
    expect(wrapper.contains(".preview-container")).toBe(true);
    //图片操作框是否存在
    expect(wrapper.contains(".target")).toBe(true);
    //图片剪裁后实时预览框是否存在
    expect(wrapper.contains(".large-wrapper")).toBe(true);

    //初始化数据是否正确
    expect(wrapper.props().Setting).toEqual({});
    expect(wrapper.vm.backgroundUrl).toBe('');
    expect(wrapper.vm.width).toBe(336);
    expect(wrapper.vm.height).toBe(400);
    expect(wrapper.vm.target.w).toBe(168);
    expect(wrapper.vm.target.h).toBe(200);
    expect(wrapper.vm.target.visible).toBe(true);
    expect(wrapper.vm.cutPos.w).toBe(0);
    expect(wrapper.vm.cutPos.h).toBe(0);
    expect(wrapper.vm.cutPos.x).toBe(0);
    expect(wrapper.vm.cutPos.y).toBe(0);
    expect(wrapper.vm.btnStyle).toEqual({});
  })

  //组件需要重新挂载
  const wrapper2 = mount(Component, {
    propsData: {
      Setting: {
        backgroundUrl: "/img/example.png",
        //图片容器的宽度
        width: 100,
        //图片容器的高度
        height: 150,
        //预览框的大小及可见性
        target: {
          w: 100, // 宽度
          h: 100, // 高度
          visible: false //是否显示
        },
        //剪裁框位置
        cutPos: {
          w: 50, // 宽度
          h: 50, // 高度
          x: 10, //相对父级左边距离 大于0有效
          y: 10 //相对父级顶部距离 大于0有效
        },
        // 按钮样式
        btnStyle: {
          background: 'yellow'
        }
      }
    }
  })

  it('检查给组件传递值时渲染数据是否正确', () => {
    //组件是否存在
    expect(wrapper2.exists()).toBe(true);
    expect(wrapper2.contains(".imageCropper")).toBe(true);
    //按钮是否存在
    expect(wrapper2.contains(".btn-choose")).toBe(true);
    //图片预览框是否存在
    expect(wrapper2.contains(".preview-container")).toBe(true);
    //图片操作框是否存在
    expect(wrapper2.contains(".target")).toBe(true);
    //图片剪裁后实时预览框是否存在
    expect(wrapper2.contains(".large-wrapper")).toBe(false);
    //检测图片资源加载
    expect(wrapper2.html()).toContain('src="/img/example.png"');

    //初始化数据是否正确
    expect(wrapper2.props().Setting.backgroundUrl).toBe("/img/example.png");
    expect(wrapper2.props().Setting.width).toBe(100);
    expect(wrapper2.props().Setting.height).toBe(150);
    expect(wrapper2.props().Setting.target.w).toBe(100);
    expect(wrapper2.props().Setting.target.h).toBe(100);
    expect(wrapper2.props().Setting.target.visible).toBe(false);
    expect(wrapper2.props().Setting.cutPos.w).toBe(50);
    expect(wrapper2.props().Setting.cutPos.h).toBe(50);
    expect(wrapper2.props().Setting.cutPos.x).toBe(10);
    expect(wrapper2.props().Setting.cutPos.y).toBe(10);
    expect(wrapper2.props().Setting.btnStyle).toEqual({"background": "yellow"});

    expect(wrapper2.vm.backgroundUrl).toBe("/img/example.png");
    expect(wrapper2.vm.width).toBe(100);
    expect(wrapper2.vm.height).toBe(150);
    expect(wrapper2.vm.target.w).toBe(100);
    expect(wrapper2.vm.target.h).toBe(100);
    expect(wrapper2.vm.target.visible).toBe(false);
    expect(wrapper2.vm.cutPos.w).toBe(50);
    expect(wrapper2.vm.cutPos.h).toBe(50);
    expect(wrapper2.vm.cutPos.x).toBe(10);
    expect(wrapper2.vm.cutPos.y).toBe(10);
    expect(wrapper2.vm.btnStyle).toEqual({"background": "yellow"});

    
  })
})
