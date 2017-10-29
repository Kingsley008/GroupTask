//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    scale: 15, // 缩放级别，默认18，数值在0~18之间
    latitude: 0, // 纬度 给个默认值
    longitude: 0, // 经度 给个默认值
  },
  //options : 页面跳转带来的参数 -- 计时参数
  
  onLoad:function(options){
    // 1.获取定时器，用于判断是否已经在计费
    this.timer = options.timer;

    wx.getLocation({
      //得到当前用户的经纬度 
      type:"gcj02", 
      success: (res) => {
        // 重置状态
      console.log(res);
      this.setData({
        longitude: res.longitude,
        latitude: res.latitude
      })  
      },
    })

    // 3.设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: '/images/location.png', // 东南西北 
            position: {
              left: 20, 
              top: res.windowHeight - 80, 
              width: 50,
              height: 50
            },
            clickable: true
          },
          {
            id: 2,
            iconPath: '/images/use.png', //立即停车标志
            position: {
              left: res.windowWidth / 2 - 45,
              top: res.windowHeight - 100,
              width: 90,
              height: 90
            },
            clickable: true
          },
          {
            id: 3,
            iconPath: '/images/warn.png', // 报修标志
            position: {
              left: res.windowWidth - 70,
              top: res.windowHeight - 80,
              width: 50,
              height: 50
            },
            clickable: true
          },
          // {
          //   id: 5,
          //   iconPath: '/images/avatar.png', // 用户
          //   position: {
          //     left: res.windowWidth - 68,
          //     top: res.windowHeight - 155,
          //     width: 45,
          //     height: 45
          //   },
          //   clickable: true
          //}
          ],
          markers:[
            {
              id:0,
              longitude: this.data.longitude,
              latitude: this.data.latitude,
              iconPath:'/images/empty.png'
            }
          ]
        })
      }
    })

    // 4.请求服务器，显示附近的单车，用marker标记
    wx.request({
      url: 'https://www.easy-mock.com/mock/59f4490be75317333e4f4ef2/example/position',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res) => {
        //TODO 过滤出两个marker不同的状态
        // 1. Markers = [] 后台数据组织
        // 2. 判断 后台数据：status 状态选择标记的图片路径
        console.log(res.data);
        const positionArr = res.data.position;
        const markers = []
        positionArr.forEach((v,i)=>{
            let iconPath = "";
            if(v.status){
              iconPath = "/images/empty.png"
            } else {
              iconPath = "/images/full.png"
            }
              let marker = {
                id: v.id,
                latitude:v.offset_Y,
                longitude:v.offset_X, 
                title: v.parkName,
                iconPath: iconPath,
              }
            markers.push(marker);

      })
    
        this.setData({
          markers: markers
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },

  // 页面显示
  onShow: function () {
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("diandianMap") // 地图组件的id
    this.movetoPosition() //移动到当前用户的坐标点
  },

  // 地图标记点击事件，连接用户位置和点击的单车位置
  bindmarkertap: function (e) {
    let _markers = this.data.markers;
    let markerId = e.markerId;
    let currMaker = _markers[markerId-1];
    let self = this;
    this.setData({
      //指导路线
      polyline: [{
        points: [{
          longitude: self.data.longitude,
          latitude: self.data.latitude
        }, {
          longitude: currMaker.longitude,
          latitude: currMaker.latitude
        }],
        color: "#FF0000DD",
        width: 1,
        dottedLine: true
      }],
      scale: 18
    })
    
  },

  // 地图控件点击事件 
  bindcontroltap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: this.movetoPosition();
        break;
      // 点击立即用车，判断当前是否正在计费
      case 2: if (this.timer === "" || this.timer === undefined) {
        // 没有在计费就扫码 二维码上要有停车位的号码
        wx.scanCode({
          success: (res) => {
            let parkNumuber = JSON.parse(res.result).parkNumber;
            console.log(parkNumuber);
            // 正在获取二维码上的场地信息： 商业版可以直接用微信扫描二维码 跳转到小程序目录 
            wx.showLoading({
              title: '正在获取停车场地信息',
              mask: true
            })
            // 从res中得到parkNumber 向后台发送信息
            wx.request({
              url:'https://www.easy-mock.com/mock/59f4490be75317333e4f4ef2/example/user',
              data: {},
              method: 'GET',
              success: function (res) {
                console.log(res)
                // 停车信息回调 成功 隐藏loading
                wx.hideLoading();
                // 5秒后跳转到 计时收费的页面
                wx.redirectTo({
                  url: '../scanresult/index?parkNumber='+parkNumuber,
                  success: function (res) {
                    wx.showToast({
                      title: '您已经停车成功',
                      duration: 1000
                    })
                  }
                })
              }
            })
          }
        })
        // 当前已经在计费就回退到计费页
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
        break;
      // 点击手动输入停车号码控件，跳转到报障页
      case 3: wx.navigateTo({
        url: '../input/index'
      });
        break;
      // 点击头像控件，跳转到个人中心
      // case 5: wx.navigateTo({
      //   url: '../my/index'
      // });
      //   break;
      default: break;
    }
  },
  movetoPosition() {
    this.mapCtx.moveToLocation()
  }

 
})
