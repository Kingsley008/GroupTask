const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


class wxPay  {
  // 调用微信接口  -- 开始 --
  payoff(e) {
    var that = this;
    wx.login({
      success: function (res) {
        that.getOpenId(res.code, this.data.parkNumber);
      }
    });

  }
  //获取openid 将当前的车位号传给后台计算金额
  getOpenId(code, parkNumber) {
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
  }
  //下单
xiadan(openId) {
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
  }

  //签名
  sign(prepay_id) {
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
  }
  //申请支付
  requestPayment(obj) {
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
}

module.exports = {
  formatTime: formatTime,
  wxPay:wxPay
}
