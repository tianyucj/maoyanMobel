// pages/chooseSeat/chooseSeat.js
Page({
  data:{
    nowDate:"",//保存当前日期
    theChain:{},//选择的影院信息
    nowChip:{},//当前选择的排片信息
    nowChipMsg:{},//保存的影厅基本信息，包括座位和名称
    seats:[],//从影厅信息中取出的座位，将字符串转换为数组
    chooseSeat:[],//用户当前选择的座位号
    rowNum:[],//影厅的排号
    trueSeats:[]//当前用户选中的显示在页面上的座位号
  },
  onLoad:function(options){
    let theChain = wx.getStorageSync('theChain');
    let nowChip = wx.getStorageSync('nowChip');
    let onlineFilm = wx.getStorageSync('onlineFilm');
    this.setData({
      theChain:theChain,
      nowChip:nowChip    
    })
    // 取出对应影院对应影厅的信息
    let voidHall = theChain.voidHall;
    let rowNum = [];
    let num = 0;
    for(let i = 0; i < voidHall.length; i++){
      if(nowChip.voidHall === voidHall[i].hallName){
        // 取出了在院线管理中当前影厅的座位
        let seats = JSON.parse(voidHall[i].seat);
        // 取出院线匹配集合中对应排片，判断是否有座位信息，如果有就判断是否和院线管理中的座位信息一致，如果不一致就使用院线匹配中的座位，如果没有就使用院线管理中的座位渲染
        wx.request({
          url: 'http://localhost:3000/onlineFilmData/find',
          data: {_id:onlineFilm._id},
          method: 'post', 
          success: function(res){
            console.log("选座界面渲染时查询出来的院线匹配信息：",res.data);
            // success
            // 存放从院线匹配中取出的座位
            let onlineSeat = [];
            let allChip = res.data.chipArrangement;
            for(let i = 0; i < allChip.length; i++){
              if(allChip[i].theChainName == nowChip.theChainName && allChip[i].voidHall == nowChip.voidHall && allChip[i].showTime == nowChip.showTime){
                if(allChip[i].seat){
                  onlineSeat = allChip[i].seat;
                  this.setData({
                    seats:onlineSeat
                  })
                }else{
                  this.setData({
                    seats:seats
                  })
                }
              }
            }
            console.log("设置排号前的座位",this.data.seats);
            // 判断座位数组中有没有空排，有空排就不让座位排号显示
            for(let x = 0 ; x < this.data.seats.length ; x++){
              for(let y = 0; y < this.data.seats[x].length; y++){
                if(this.data.seats[x][y] != 0){
                  num++;
                  rowNum.push(num);
                  break;
                }else if(this.data.seats[x][this.data.seats[x].length-1] == 0){
                  rowNum.push(0);
                  break;
                }
              }
            }
            this.setData({
              rowNum:rowNum
            }) 
            console.log("座位号：",this.data.rowNum);
          }.bind(this)
        })
        this.setData({
          nowChipMsg:voidHall[i]
        })
        break;
      }
    }
    // 获取当前时间
    let nowDate = new Date();
    let mounth = nowDate.getMonth()+1;
    let date = nowDate.getDate();
    this.setData({
      nowDate:mounth+"月"+date+"日"
    })
  },
  change:function(e){
    // 取出点击的座位id，然后解析为影厅座位二维数组的下标，找到改下标的对应数字，如果为1则表示为未选中的，若为2表示已经选中即要取消选中，将选中的座位id放到一个数组中保存
    let id = e.currentTarget.dataset.id;
    let idArr = id.split("_");
    let seats = this.data.seats;
    let chooseSeat = this.data.chooseSeat;
    // 判断用户选中的时显示的第几行第几个座位
    let row = 1;
    let col = parseInt(idArr[2])+1;
    let trueSeats = this.data.trueSeats;
    
      for(let i = 0 ; i < idArr[1]; i++){
        for(let j = 0 ; j < seats[idArr[1]].length; j++){
          if(seats[i][j] != 0){
            console.log("row",row);
            row++;
            break;
          }else if(seats[i][seats[i].length-1] == 0){
            break;
          }
        }
      }
      if(seats[idArr[1]][idArr[2]] == 1){
        if(chooseSeat.length < 4){
          seats[idArr[1]][idArr[2]] = 2;
          chooseSeat.push(id);
          trueSeats.push({row:row,col:col});
        }else{
          // 如果超过选中四个座位就弹出提示
          wx.showToast({
            title: '一次最多选择4个座位',
            icon: 'success',
            duration: 2000
          });
        }
      }else{
        seats[idArr[1]][idArr[2]] = 1;
        var index = chooseSeat.indexOf(id);
        chooseSeat.splice(index,1);
        trueSeats.splice(index,1);  
      }
      console.log("选中的座位号：",row,";",col);
      this.setData({
        seats:seats,
        chooseSeat:chooseSeat,
        trueSeats:trueSeats
      })
      console.log(chooseSeat);
  },
  buyTicks:function(){
    // 当前登录的用户信息
    let userPhone = wx.getStorageSync('userPhone');
    // 当前选择的影片信息
    let onlineFilm = wx.getStorageSync('onlineFilm');
    // 当前选择的排片信息
    let nowChip = this.data.nowChip;
    // 用户当前选择的座位号
    let seatsNum = this.data.chooseSeat;
    // 当前影厅的座位
    let seats = this.data.seats;
    // 当前选择的影院信息
    let theChain = this.data.theChain;
    // 订单金额
    let orderAmount = parseInt(nowChip.ticketPrice) * seatsNum.length;
    // 把购买的真实座位号存入storage在订单管理中使用
    let nowChipName = nowChip.voidHall;
    let trueSeats = this.data.trueSeats;
    for(let i = 0; i < trueSeats.length ; i++){
      trueSeats[i] = trueSeats[i].row+"排"+trueSeats[i].col+"座";
    }
    // 当前用户的订单信息
    let userOrder = {
      filmId:onlineFilm._id,
      userPhone:userPhone,
      filmName:onlineFilm.chName,
      chineName:theChain.chainName,
      address:theChain.place,
      hallName:nowChip.voidHall,
      showTime:nowChip.showTime,
      ticketPrice:orderAmount,
      seat:trueSeats,
      tickets:seatsNum.length
    };
    // 将订单信息加入订单集合
    wx.request({
      url: 'http://localhost:3000/orderData/add',
      data: userOrder,
      method: 'POST', 
      success: function(res){
        // success
        // 将选座下单后的现在的座位状态进行修改，将已经购买后的座位状态改为3
        for(let i = 0 ; i < seatsNum.length; i++){
          let indexArr = seatsNum[i].split("_");
          console.log("indexArr",indexArr);
          seats[indexArr[1]][indexArr[2]] = 3;
        }
        // 将改变后的座位状态加入到在线影片的对应排片数据中，以后每次渲染座位时都去对比院线集合中的座位信息是否和院线匹配中对应这个座位信息一致，如果不一样，则渲染院线匹配中的这个座位信息
        wx.request({
          url: 'http://localhost:3000/onlineFilmData/find',
          data: {_id:onlineFilm._id},
          method: 'GET', 
          success: function(res){
            console.log("当前选择的电影",res.data);
            let allChip = res.data.chipArrangement;
            for(let i = 0; i < allChip.length; i++){
              if(allChip[i].theChainName == nowChip.theChainName && allChip[i].voidHall == nowChip.voidHall && allChip[i].showTime == nowChip.showTime){
                allChip[i].seat = seats;
                break;
              }
            }
            wx.request({
              url: 'http://localhost:3000/onlineFilmData/update',
              data: {_id:onlineFilm._id,chipArrangement:allChip},
              method: 'post',
              success: function(res){
                // success
              }
            })
          }
        })
        // 成功后弹出提示
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        });
        // 提示消失后返回到选择影厅的界面
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000);
      }
    })
  }
})