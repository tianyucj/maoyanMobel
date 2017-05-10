// pages/mineOrder/mineOrder.js
Page({
  data:{
    userOrder:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    let userPhone = wx.getStorageSync('userPhone');
    let onlineFilm = wx.getStorageSync('onlineFilm');
    wx.request({
      url: 'http://localhost:3000/orderData/find',
      data: {userPhone:userPhone},
      method: 'GET', 
      success: function(res){
        // success
        console.log(res.data);
        // this.setData({
        //   userOrder:res.data
        // })
        let allOrder = res.data;
        // 取出对应订单电影的图片
        let order = [];
        for(let i = 0; i < allOrder.length; i++){
          wx.request({
            url: 'http://localhost:3000/onlineFilmData/find',
            data: {_id:allOrder[i].filmId},
            method: 'GET',
            success: function(res){
              console.log("id查询出来的订单电影信息",res.data);
              // success
             allOrder[i].images = res.data.homeImg;
             order.push(allOrder[i]);
             this.setData({
                  userOrder:order
              })
            }.bind(this)
          })
        }
        console.log(this.data.userOrder);
        
      }.bind(this)
    })
  }
})