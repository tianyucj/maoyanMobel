// pages/film/film.js
Page({
  data:{
    hotFilmData:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      method:"post",
      url:"http://localhost:3000/filmData/find",
      success:function(res){
        console.log("图片路径：",res.data);
        this.setData({
            hotFilmData:res.data
        })
      }.bind(this)
    })
  },
  bindBuyTicketsTap: function(e) {
    console.log(e);
    let hotFilmData = this.data.hotFilmData[e.currentTarget.id];
    // 跳转到tab页使用switchTab,非tab页使用navigateTo
    wx.navigateTo({
      url: '../chooseCinema/chooseCinema?filmId='+hotFilmData._id
    })
    // 将当前点击的电影信息保存到storage中便于在详情页面渲染
    wx.setStorage({
      key: 'filmData',
      data: hotFilmData
    })
  },
  filmDtails:function(e){
    let hotFilmData = this.data.hotFilmData[e.currentTarget.id];
    // 点击电影名字跳转到该部电影的详情页面
    wx.navigateTo({
      url: '../filmDtail/filmDtail'
    })
    // 将当前点击的电影信息保存到storage中便于在详情页面渲染
    wx.setStorage({
      key: 'filmData',
      data: hotFilmData
    })
  },
  onShareAppMessage: function () {
    return {
      title: '分享给朋友',
      path: '/page/user?id=123'
    }
  }
})