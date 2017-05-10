// pages/regist/phoneNum.js
Page({
  data:{
    isValidate:false,
    phone:"",
    item:{
      isRender:false,
      errorMsg:"电话号码输入有误",
      labelTxt:"手机号：",
      placeholder:"请输入手机号码",
      nowStapeP:"nowStape",
      isPwd:false,
      ifRender:true
    }
  },
   //事件处理函数
  submitReg: function() {
    if(this.data.isValidate){
      wx.navigateTo({
        url: '../identifyCode/identifyCode?phone='+this.data.phone
      })
    }
  },
  identify: function(e){
    console.log(e);
    if(/^[1]{1,1}[0-9]{10,10}$/.test(e.detail.value)){
      wx.request({
        url: 'http://localhost:3000/maoyanUsers/find',
        data: {userPhone:e.detail.value},
        method: 'GET', 
        success: function(res){
          console.log(res);
          // success
          var item = this.data.item;
          if(res.data.length == 0){
            item.isRender = false;
            this.setData({
              isValidate:true,
              phone:e.detail.value
            });
          }else{
            item.isRender = true;
            item.errorMsg = "重名";
          }
          this.setData({
            item:item
          })
        }.bind(this)
      })     
    }else{
      var item = this.data.item;
      item.isRender = true;
      item.errorMsg = "电话号码输入有误";
      this.setData({
        item:item
      })
    }
  }
})