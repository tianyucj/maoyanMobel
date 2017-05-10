// pages/setPassword/setPassword.js
Page({
  data:{
    phone:"",
    pwd:"",
    isValidate:false,
    item:{
      isRender:false,
      errorMsg:"密码输入有误",
      labelTxt:"密码：",
      placeholder:"请输入密码",
      nowStapePwd:"nowStape",
      isPwd:true
    }
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.data.phone = options.phone;
  },
  identify:function(e){
    var item = this.data.item;
    if(/^\w{6,}$/.test(e.detail.value)){
      this.setData({
        pwd:e.detail.value,
        isValidate:true
      });
      item.isRender = false;
    }else{
      item.isRender = true;
      console.log(item); 
    }
     this.setData({
        item:item
      }); 
  },
  submitReg:function(){
    if(this.data.isValidate){
      wx.request({
        url: 'http://localhost:3000/maoyanUsers/add',
        data: {userPhone:this.data.phone,pwd:this.data.pwd},
        method: 'GET', 
        success: function(res){
          // success
          wx.switchTab({
            url:"../film/film"
          })
          wx.setStorage({
            key: 'userPhone',
            data: this.data.phone
          })
        }.bind(this)
      })
    }
  }
})