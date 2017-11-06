// pages/scanresult/index.js
Page({

  // 页面加载
  onLoad: function (options) {
    console.log(options)
    this.setData({
      parkNumber: options.parkNumber
    })

  },

})