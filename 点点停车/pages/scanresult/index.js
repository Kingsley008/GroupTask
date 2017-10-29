// pages/scanresult/index.js
Page({
  data: {
    time: 9
  },
  // 页面加载
  onLoad: function (options) {
    console.log(options)
    this.setData({
      parkNumber: options.parkNumber
    })
    // 设置初始计时秒数
    let time = 9;
    // 开始定时器
    this.timer = setInterval(() => {
      this.setData({
        time: --time
      });
      // 读完秒后携带停车场号码跳转到计费页
      if (time < 0) {
        clearInterval(this.timer)
        wx.redirectTo({
          url: '../count/index?parkNumber=' + options.parkNumber
        })
      }
    }, 1000)
  },

  // 点击去首页报障
  moveToWarn: function () {
    clearInterval(this.timer)
    wx.redirectTo({
      url: '../index/index'
    })
  }
})