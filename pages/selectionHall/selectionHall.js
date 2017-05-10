// pages/selectionHall/selectionHall.js
Page({
  data:{
    theChain:{},
    onlineFilmData:{},
    chipData:[],
    chipAllData:[],
    nowDate:""
  },
  onLoad:function(options){
    console.log(options);
    // 判断是否有院线匹配集合的id传入，如果有说明是从chooseCinema页面跳转过来，否则为cinema这个tab页跳转过来的
    let theChain = wx.getStorageSync('theChain');
    if(options._id){
      // 取出存在storage中的选中影片和影院信息
      let onlineFilm = wx.getStorageSync('onlineFilm');
      // 筛选出影院对应的选中电影的排片数据
      let chipData = onlineFilm.chipArrangement;
      let nowChip = [];
      for(let i = 0; i < chipData.length ; i++){
        if(chipData[i].theChainName == theChain.chainName){
          nowChip.push(chipData[i])
        }
      }
      this.setData({
        onlineFilmData:onlineFilm,
        theChain:theChain,
        chipData:nowChip
      })
    }else{
      wx.request({
        url: 'http://localhost:3000/onlineFilmData/find',
        method: 'GET', 
        success: function(res){
          // 存放取出影院对应的所有电影的排片，这个数组中是对象，对象中包含在这个影院有排片的电影名和在各个影厅排片的数组
          let chipAllData = [];
          // success
          // 循环查出的所有在线影片
          for(let i = 0 ; i < res.data.length ; i++){
            // 存储在这个影片对应影院的影厅数据
            let chipData = [];
            // 存储影厅数组和电影名称
            let chainObj = {};
            // 判断这部电影是否有排片
            if(res.data[i].chipArrangement){
              // 循环排片信息，判断是否有所选择的影院的排片
              for(let j = 0; j < res.data[i].chipArrangement.length ; j++){
                if(res.data[i].chipArrangement[j].theChainName === theChain.chainName){
                  res.data[i].chipArrangement[j].chName = res.data[i].chName;
                  res.data[i].chipArrangement[j].duration = res.data[i].duration;
                  chipData.push(res.data[i].chipArrangement[j]);
                  chainObj = {
                    chName:res.data[i].chName,
                    duration:res.data[i].duration,
                    _id:res.data[i]._id,
                    chipData:chipData
                  }
                }
              }
              // 主要为了控制不让空的对象传进来，避免在渲染数据时有空数据渲染到页面
              if(chipData.length > 0 ){
                chipAllData.push(chainObj);
              }
            }
          }
          this.setData({
            chipAllData:chipAllData,
            theChain:theChain,
          })
        }.bind(this)
      })
    } 
    // 获取当前时间
    let nowDate = new Date();
    let mounth = nowDate.getMonth()+1;
    let date = nowDate.getDate();
    this.setData({
      nowDate:mounth+"月"+date+"日"
    })
    // 动态修改页面title的值
      wx.setNavigationBarTitle({
        title: theChain.chainName
      })
  },
  chooseSeat:function(e){
    console.log("点击选座按钮",e);
    let userPhone = wx.getStorageSync('userPhone');
    console.log("userPhone",userPhone);
    if(userPhone){
      wx.navigateTo({
        url: '../chooseSeat/chooseSeat'
      })
      if(this.data.chipData.length > 0){
        let tabHall = this.data.chipData[e.currentTarget.id];
        wx.setStorage({
          key:'nowChip',
          data: tabHall
        })
      }else if(this.data.chipAllData.length > 0){
        let btnId = e.currentTarget.id;
        let indexArr = btnId.split("_");
        let selectedMsg = this.data.chipAllData[parseInt(indexArr[0])];
        console.log("selectedMsg11111111",selectedMsg);
        wx.setStorage({
          key:'nowChip',
          data: selectedMsg.chipData[parseInt(indexArr[1])]
        })
        wx.setStorage({
          key:'onlineFilm',
          data: selectedMsg
        })
      }
    }else{
      wx.navigateTo({
        url: '../login/login'
      })
    }
  } 
})