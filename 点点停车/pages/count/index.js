// pages/billing/index.js

Page({
  data: {
    hours: 0,
    minuters: 0,
    seconds: 0,
    billing: "本次停车耗时",
  },
  // 页面加载
  onLoad: function (options) {
    console.log(options)
    this.setData({
      hours:options.h,
      minuters:options.m,
      seconds:options.s,
      payment:options.payment,
      parkNumber:options.parkNumber,
    })
  },
  // TODO 结束停车 使用微信支付
  wxPay: function () {
    this.payoff()
   
  },

  // TODO 通知后台 并跳转到现金支付的页面
  cashPay: function () {
    wx.showLoading({
      title: '请等待',
    })
    wx.request({
      url: 'https://www.easy-mock.com/mock/59f4490be75317333e4f4ef2/example/getParkingInfo',
      success:(res)=>{
        wx.hideLoading()
        // TODO 要对回调的值进行验证
        wx.redirectTo({
          url: '../cash/index',
        })
      }
    })
  },

  // 异常反馈 接口预留
  issueFeedback:function(){

  },

  // 调用微信接口  -- 开始 --
  payoff: function (e) {
    var that = this;
    wx.login({
      success: function (res) {
        that.getOpenId(res.code, this.data.parkNumber);
      }
    });

  },

  //获取openid 将当前的车位号传给后台计算金额
  getOpenId: function (code, parkNumber) {
    var that = this;
    wx.request({
      url: 'https://www.see-source.com/weixinpay/GetOpenId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'code': code, 'parkNumber': parkNumber },
      success: function (res) {
        var openId = res.data.openid;
        that.xiadan(openId);
      }
    })
  },
  //下单
  xiadan: function (openId) {
    var that = this;
    wx.request({
      url: 'https://www.see-source.com/weixinpay/xiadan',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'openid': openId },
      success: function (res) {
        var prepay_id = res.data.prepay_id;
        console.log("统一下单返回 prepay_id:" + prepay_id);
        that.sign(prepay_id);
      }
    })
  },

  //签名
  sign: function (prepay_id) {
    var that = this;
    wx.request({
      url: 'https://www.see-source.com/weixinpay/sign',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'repay_id': prepay_id },
      success: function (res) {
        that.requestPayment(res.data);

      }
    })
  },

  // 申请支付
  requestPayment: function (obj) {
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
        // 支付成功 
        wx.redirectTo({
          url: '../scanresult/index?parkNumber=' + parkNumuber,
          success: function (res) {
            wx.showToast({
              title: '您已经付费成功',
              duration: 1000
            })
          }
        })

      },
      'fail': function (res) {
        // 支付失败 

      }
    })
  }
})