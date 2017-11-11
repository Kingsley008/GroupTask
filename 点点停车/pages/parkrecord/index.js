// pages/parkrecord/index.js
Page({

  /**
   * 页面的初始数据
   * 需要分页，需要调用下拉刷新，默认从后台拉取20条
   */
  data: {
    parkRecord:[
      {
       date:'2017年11月10日',
       duration:'2:0:0',
       parkName:'酷联停车场',
       parkNumber:'17177105',
       payment:'60.00'
      },
      {
        date: '2017年11月12日',
        duration: '3:0:0',
        parkName: '酷联停车场',
        parkNumber: '17177105',
        payment: '80.00'
      },
      {
        date: '2017年11月12日',
        duration: '3:0:0',
        parkName: '酷联停车场',
        parkNumber: '17177105',
        payment: '80.00'
      },
      {
        date: '2017年11月12日',
        duration: '3:0:0',
        parkName: '酷联停车场',
        parkNumber: '17177105',
        payment: '80.00'
      },
      {
        date: '2017年11月12日',
        duration: '3:0:0',
        parkName: '酷联停车场',
        parkNumber: '17177105',
        payment: '80.00'
      },
      {
        date: '2017年11月12日',
        duration: '3:0:0',
        parkName: '酷联停车场',
        parkNumber: '17177105',
        payment: '80.00'
      },
      {
        date: '2017年11月12日',
        duration: '3:0:0',
        parkName: '酷联停车场',
        parkNumber: '17177105',
        payment: '80.00'
      },
      {
        date: '2017年11月12日',
        duration: '3:0:0',
        parkName: '酷联停车场',
        parkNumber: '17177105',
        payment: '80.00'
      },
      {
        date: '2017年11月12日',
        duration: '3:0:0',
        parkName: '酷联停车场',
        parkNumber: '17177105',
        payment: '80.00'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 请求后台数据 
      
      // wx.request({
      //   url: '',
      //   method:'GET',
      //   data:{page:1}
      //   success:(res)=>{
      //     this.setData({
      //       parkRecord:res.data.parkRecord
      //     })
      //   }
      // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})