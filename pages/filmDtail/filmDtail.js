// pages/filmDtail/filmDtail.js
Page({
  data:{
    tabFilmData:{},
    viewClass:"introduceTxt"
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.getStorage({
      key: 'filmData',
      success: function(res){
        // success
        this.setData({
          tabFilmData:res.data
        })
      }.bind(this)
    })
  },
  buyTicks:function(e){
    console.log("立即购票",e);
    // 立即购票按钮
    wx.navigateTo({
      url: '../chooseCinema/chooseCinema?filmId='+e.currentTarget
.id
    })
  },
  bindArrow:function(e){
    if(this.data.viewClass == "introduceTxt"){
      this.setData({
        viewClass:""
      })
    }else{
      this.setData({
        viewClass:"introduceTxt"
      })
    }
    console.log("viewClass",viewClass);
  }  
})