// pages/input/input.js
Page({

  data: {
    isSubmit:false,
    input:"",
  },

  bindblur(ev){
    this.setData({
        input: ev.detail
    })
    
  },

  formSubmit(ev){
    var self = this;
    const value = ev.detail.value
    const input = value.parkNumber
    self.setData({parkNumber:input})

    if (isNaN(value.parkNumber) || value.parkNumber == ""  ){
      wx.showToast({
        title: '请输入正确的数字',
      })
      return;
    }

    this.setData({
      isSubmit:true,
    })

    // 跳转到收费确认页面 

    wx.showLoading({
      title: '正在获取信息',
      mask: true
    })
    // 先使用伪数据进行业务流程
    wx.request({
      url: 'https://dev.movebroad.cn/v2/dashboard',
      data: { parkNumber: this.data.parkNumber },
      method: 'GET',
      success: (res) => {
        wx.hideLoading()
        // TODO 判断用户输入的车牌号是否存在 
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

  },
})