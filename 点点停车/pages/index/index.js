//index.js
//获取应用实例
const userInfo = {};
let nextId = 0;
const app = getApp()

// 存储用户信息 并生成第三方session
const getSessionid = (page)=> {
        // 启动授权程序
        App({
          onLaunch: function () {
            let self = this;
            wx.login({
              success: function (res) {
                var code = res.code;
                if (code) {
                  console.log('获取用户登录凭证：' + code);
                  wx.getUserInfo({
                    withCredentials:true,
                    success:function(res){
                      //TODO 传送到后端记录 客户信息  code 作为ID 唯一标识
                      console.log('success') 
                      page.setData({userInfo:res.userInfo})
                      wx.setStorage({
                        key: 'userInfo',
                        data: {
                          userInfo:{
                            avatarUrl: res.userInfo.avatarUrl,
                            nickName: res.userInfo.nickName
                          },
                          bType: "warn", // 按钮类型
                          actionText: "", // 按钮文字提示
                        },
                      })
                    
                      // --------- 发送凭证 + 用户信息  ------------------
                      wx.request({
                        url: 'https://dev.movebroad.cn/v2/dashboard',
                        data: { code: code, userInfo: res.userInfo },
                        method: 'GET', // 改 POST
                        success: function (res) {
                          // 演示数据
                          res.data.sessionid = 'test'
                          wx.setStorage({
                            key: 'user',
                            data: res.data.sessionid,
                          })
                        }
                      })
                    }
                  })

                  // ------------------------------------
                } else {
                  console.log('获取用户登录态失败：' + res.errMsg);
                  wx.reLaunch({url:'/pages/index/index'})
                }
              }
            });
          }
        })
}

Page({
  data: {
    scale: 15, // 缩放级别，默认18，数值在0~18之间
    latitude: 0, // 纬度 给个默认值
    longitude: 0, // 经度 给个默认值
    userInfo:{},
  },
  //options : 页面跳转带来的参数 -- 计时参数
  
  onLoad:function(options){
    // 判断当前用户是否合法 
    let self = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
      
      if(res.data == null){
        wx.showToast({
          title: '请授权登录',
        })
        // 申请授权并记录当前用户信息 TODO 再次调用失效
        console.log(self.data.userInfo)
        getSessionid(self)
      }
      console.log(res.data);
      self.setData({userInfo: res.data.userInfo})
      },
      fail:function() { 
        wx.showToast({
          title: '请授权登录',
        })
        getSessionid(self)
        // 启动授权程序
        console.log(self.data.userInfo)
      }
    })

    // 获取定时器，用于判断是否已经在计费
    // this.timer = options.timer;

    wx.getLocation({
      //得到当前用户的经纬度 
      type:"gcj02", 
      success: (res) => {
        // 重置状态
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
            iconPath: '/images/use1.png', //立即停车标志
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
            iconPath: '/images/warn1.png', // 手动输入
            position: {
              left: res.windowWidth - 70,
              top: res.windowHeight - 80,
              width: 50,
              height: 50
            },
            clickable: true
          },
          {
            id: 4,
            iconPath: '/images/reset.png', // 刷新
            position: {
              left: res.windowWidth - 240,
              top: res.windowHeight - 90,
              width: 20,
              height: 20
            },
            clickable: true
          },
          {
            id: 5,
            iconPath: '/images/avatar.png',
            position: {
              left: res.windowWidth - 68,
              top: res.windowHeight - 165,
              width: 45,
              height: 45
            },
            clickable: true
          }
          ],
          markers:[

          ],

        })
      }
    })

    // 4.请求服务器，显示附近的单车，用marker标记
    wx.request({
      url: 'https://dev.movebroad.cn/v2/dashboard',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res) => {
        // TODO 过滤出两个marker不同的状态
        // 1. Markers = [] 后台数据组织
        // 2. 判断 后台数据：status 状态选择标记的图片路径
        console.log(res.data.data);
        const positionArr = res.data.data;
        const markers = []
        positionArr.forEach((v,i)=>{
            let iconPath = "";
            if(v.status){
              iconPath = "/images/full.png"
            } else {
              iconPath = "/images/empty.png"
            }
              let marker = {
                id: nextId++,
                latitude:v.offset_y,
                longitude:v.offset_x, 
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
    // wx.navigateTo({
    //   url: '../my/index'
    // });
  },

  reset:function() {
      this.onLoad()
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
    let currMarker = _markers[markerId];
    let self = this;
    self.setData({
      scale:18,
      longitude:currMarker.longitude,
      latitude:currMarker.latitude
    })
    console.log(this.data.markers)
    // this.setData({
    //   //指导路线
    //   polyline: [{
    //     points: [{
    //       longitude: self.data.longitude,
    //       latitude: self.data.latitude
    //     }, {
    //       longitude: currMaker.longitude,
    //       latitude: currMaker.latitude
    //     }],
    //     color: "#FF0000DD",
    //     width: 1,
    //     dottedLine: true
    //   }],
    //   scale: 18
    // })
    
  },
  validate(v){

  },
  // 地图控件点击事件 
  bindcontroltap: function (e) {
    let self = this;
    console.log(self)
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: this.movetoPosition();
        break;
      // 点击立即用车，判断当前是否正在计费
      case 2: if (this.timer === "" || this.timer === undefined) {
        // 没有在计费就扫码 二维码上要有停车位的号码
        if (!this.data.userInfo.nickName) {
          wx.showToast({
            title: '请授权登录',
          })
          return
        }
        wx.scanCode({
          success: (res) => {
            let parkNumuber = JSON.parse(res.result).parkNumber;
            self.setData({parkNumber: parkNumuber})
            // 正在获取二维码上的场地信息： TODO 商业版可以直接用微信扫描二维码 跳转到小程序目录 
            wx.showLoading({
              title: '正在获取信息',
              mask: true
            })
            // 先使用伪数据进行业务流程 上线
            wx.request({
              url:'https://dev.movebroad.cn/v2/dashboard',
              data:{parkNumber: this.data.parkNumber},
              method:'GET',
              success:(res)=>{
                  wx.hideLoading()
                  res.data.hour = 1
                  res.data.minutes = 30
                  res.data.second = 20
                  res.data.parkNumber = 1234
                  res.data.payment = 80 
                  wx.redirectTo({
                    url: `../count/index?h=${res.data.hour}&m=${res.data.minutes}&s=${res.data.second}&payment=${res.data.payment}&parkNumber=${self.data.parkNumber}`,
                  })
              }
            })
          }
        })
      
      }
        break;
      // 点击手动输入停车号码
      case 3: {
        self.validate(this.data.userInfo.nickName,()=>{
          wx.navigateTo({
            url: '../input/input'
          });
        })
    
        break;
      }
      // 点击刷新控件
      case 4:{
        this.reset();
        break;
      }
      // 点击头像控件，跳转到个人中心
      case 5:{
        wx.navigateTo({
          url: '../my/index',
          data: this.data.userInfo
        });
        self.validate(this.data.userInfo.nickName,()=>{
          wx.navigateTo({
            url: '../my/index',
            data: this.data.userInfo
          });
        })
      } 
      break;
      default: break;
    }
  },
  movetoPosition() {
    this.mapCtx.moveToLocation()
  },

  validate(v,callback) {
    if (!v) {

      wx.showModal({
        title: '注意',
        content: '需要授权登录才能使用本功能',
      })

      wx.login({
        success:function (res){ 
        let code = res.code
        // TODO 逻辑错误 授权只能被调用一次
        wx.getUserInfo({ 
          success:function (res){ 
          // 当用户授权成功的时候，保存用户的登录信息 

          }, 
          fail:function(res){
          // 用户点了“拒绝” 

          } 
      })
    }
    })

    }else{
      callback();
    }

}
})
