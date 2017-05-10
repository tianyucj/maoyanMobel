// pages/mine/mine.js
Page({
  data:{
    userPhone:"",
    isLogin:false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.getData();
  },
  onShow: function() {
    this.getData();
  },
  //getData
  getData: function() {
    let userPhone = wx.getStorageSync('userPhone');
    console.log("userName", userPhone);
    if (userPhone) {
      this.setData({
        userPhone: userPhone,
        isLogin: true
      })
    } else {
      this.setData({
        userPhone: "",
        isLogin: false
      })
    }
  },
  bindToMineOrder:function(){
    let userPhone = wx.getStorageSync('userPhone');
    console.log("userPhone",userPhone);
    if(userPhone){
      wx.navigateTo({
        url: '../mineOrder/mineOrder'
      })
    }else{
      wx.navigateTo({
        url: '../login/login'
      })
    }  
  },
  bindRemoveLog:function(){
    wx.removeStorage({
      key: 'userPhone',
      success: function (res) {
        console.log("1111111",res)
        wx.switchTab({
          url: '../film/film'
        })
      }
    })
  }
})