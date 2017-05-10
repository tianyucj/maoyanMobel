// pages/login/login.js
Page({
  data:{
    userPhone:"",
    pwd:"",
    item:{
      msg:"",
      isShow:false
    }
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  subLogin:function(){
    wx.request({
      url: 'http://localhost:3000/maoyanUsers/find',
      data: {userPhone:this.data.userPhone,pwd:this.data.pwd,findType:"exact"},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        console.log(res.data);
        // success
       if(res.data.length > 0){
          wx.switchTab({
            url: '../film/film'
          })
          this.setData({
            item:{
              msg:"",
              isShow:false
            }
          })
          wx.setStorage({
            key:"userPhone",
            data:res.data[0].userPhone
          })
       }else{
          this.setData({
            item:{
              msg:"用户名或密码错误，请核对后重新输入！",
              isShow:true
            }
          })
       }
      }.bind(this)
    })
  },
  getUserPhone:function(e){
    this.setData({
      userPhone:e.detail.value
    })
  },
  getPwd:function(e){
    this.setData({
      pwd:e.detail.value
    })
  },
  bindToSign:function(){
    // 跳转到注册界面
    wx.navigateTo({
      url: '../regist/phoneNum'
    })
  },
  onShareAppMessage: function () {
    return {
      title: '分享给朋友',
      path: '/page/user?id=123'
    }
  }
})