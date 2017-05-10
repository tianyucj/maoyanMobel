// pages/cinema/cinema.js
Page({
  data:{
    cinema:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: 'http://localhost:3000/theChainData/find',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        this.setData({
          cinema:res.data
        })
      }.bind(this)
    })
  },
  chooseCinema:function(e){
    wx.navigateTo({
      url: '../selectionHall/selectionHall'
    })
    // 将当前选中电影对应排片中选中的影院信息保存到storage中
    wx.setStorage({
      key: 'theChain',
      data: this.data.cinema[e.currentTarget.id]
    })
  }
})