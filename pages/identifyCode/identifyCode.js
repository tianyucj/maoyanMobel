// pages/identifyCode/identifyCode.js
Page({
  data: {
    phone: "",
    isValidate: false,
    item:{
      isRender:false,
      errorMsg:"验证码输入有误",
      labelTxt:"验证码：",
      placeholder:"请输入六位验证码",
      nowStapeC:"nowStape",
      isPwd:false
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.data.phone = options.phone;
    console.log(options);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //事件处理函数
  submitReg: function () {
    if (this.data.isValidate) {
      wx.navigateTo({
        url: '../setPassword/setPassword?phone='+this.data.phone
      })
    }
  },
  identify: function (e) {
    var item = this.data.item;
    if (/^[0-9]{6}$/.test(e.detail.value)) {
      this.setData({
        isValidate: true
      });
      item.isRender = false;
    }else{
      item.isRender = true;
    }
    this.setData({
      item:item
    })
  }

})