// pages/cinema/cinema.js
Page({
  data:{
    cinema:[],
    onlineFilm:{},
    filmId:""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      filmId:options.filmId
    })
    wx.request({
      url: 'http://localhost:3000/onlineFilmData/find',
      data:{filmId:options.filmId},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        this.setData({
          onlineFilm:res.data[0]
        })
        // success
        let cinema = [];
        let chipArr = [];
        let cinemaArr = [];
        let cinemaName = new Set();
         chipArr = res.data[0].chipArrangement || [];
        for(let i = 0 ; i < chipArr.length ; i++){
          cinemaName.add(chipArr[i].theChainName);
        }
        for(let key of cinemaName){
          wx.request({
            url: 'http://localhost:3000/theChainData/find',
            data: {chainName:key,findType:"exact"},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function(res){
              // success
              cinemaArr.push(res.data[0]);
              this.setData({
                cinema:cinemaArr
              })
            }.bind(this)
          })
        }
      }.bind(this)
    })
  },
  chooseHall:function(e){
    let cinemaData = this.data.cinema[e.currentTarget.id]
    wx.navigateTo({
      url: '../selectionHall/selectionHall?_id='+cinemaData._id
    })
    // 将当前选中电影对应的在院线匹配集合中的数据保存到storage中，便于后期下单和渲染使用
    wx.setStorage({
      key: 'onlineFilm',
      data: this.data.onlineFilm
    })
    // 将当前选中电影对应排片中选中的影院信息保存到storage中
    wx.setStorage({
      key: 'theChain',
      data: this.data.cinema[e.currentTarget.id]
    })
  }
})